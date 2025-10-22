from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from deepface import DeepFace
import logging
import base64
from io import BytesIO
from PIL import Image

# Importar suas funções existentes
from utils.cryptography_embendding import cryptography_embedding, decrypt_embedding
from db.connection import connection_db
from db.setup import check_table_exists
from db.emedding_dao import insert_embedding, get_embeddings_by_user
from config.settings import MAIN_LOG

app = Flask(__name__)
CORS(app)  # Permitir requisições do React Native

logging.basicConfig(
    filename=MAIN_LOG,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def calculate_similarity(embedding1, embedding2):
    """Calcula similaridade entre duas embeddings usando distância euclidiana"""
    distance = np.linalg.norm(embedding1 - embedding2)
    # Converter distância em porcentagem de similaridade
    similarity = max(0, 100 - (distance * 10))
    return similarity

@app.route('/api/register', methods=['POST'])
def register():
    """
    Endpoint para registrar novo usuário com reconhecimento facial
    Recebe: { "username": "nome", "image": "base64_string" }
    """
    try:
        data = request.get_json()
        username = data.get('username')
        image_base64 = data.get('image')
        
        if not username or not image_base64:
            return jsonify({
                'success': False,
                'message': 'Username e imagem são obrigatórios'
            }), 400
        
        # Decodificar imagem base64
        image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
        image = Image.open(BytesIO(image_data))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Gerar embedding
        result = DeepFace.represent(frame, model_name='Facenet', enforce_detection=True)
        
        if not result:
            return jsonify({
                'success': False,
                'message': 'Nenhum rosto detectado na imagem'
            }), 400
        
        embedding = np.array(result[0]["embedding"])
        
        # Criptografar embedding
        embedding_encrypted = cryptography_embedding(embedding)
        
        if embedding_encrypted is None:
            return jsonify({
                'success': False,
                'message': 'Erro ao criptografar embedding'
            }), 500
        
        # Conectar ao banco e inserir
        conn = connection_db()
        if conn is None:
            return jsonify({
                'success': False,
                'message': 'Erro ao conectar ao banco de dados'
            }), 500
        
        check_table_exists(conn)
        insert_embedding(conn, username, embedding_encrypted, metadata="Mobile App")
        conn.close()
        
        logging.info(f"✅ Usuário {username} registrado com sucesso")
        
        return jsonify({
            'success': True,
            'message': f'Usuário {username} registrado com sucesso!',
            'username': username
        }), 201
        
    except Exception as e:
        logging.error(f"❌ Erro no registro: {e}")
        return jsonify({
            'success': False,
            'message': f'Erro ao processar registro: {str(e)}'
        }), 500


@app.route('/api/login', methods=['POST'])
def login():
    """
    Endpoint para login com reconhecimento facial
    Recebe: { "username": "nome", "image": "base64_string" }
    """
    try:
        data = request.get_json()
        username = data.get('username')
        image_base64 = data.get('image')
        
        if not username or not image_base64:
            return jsonify({
                'success': False,
                'message': 'Username e imagem são obrigatórios'
            }), 400
        
        # Decodificar imagem
        image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
        image = Image.open(BytesIO(image_data))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Gerar embedding da imagem recebida
        result = DeepFace.represent(frame, model_name='Facenet', enforce_detection=True)
        
        if not result:
            return jsonify({
                'success': False,
                'message': 'Nenhum rosto detectado na imagem'
            }), 400
        
        current_embedding = np.array(result[0]["embedding"])
        
        # Buscar embedding do usuário no banco
        conn = connection_db()
        if conn is None:
            return jsonify({
                'success': False,
                'message': 'Erro ao conectar ao banco de dados'
            }), 500
        
        user_data = get_embeddings_by_user(conn, username)
        conn.close()
        
        if not user_data:
            return jsonify({
                'success': False,
                'message': 'Usuário não encontrado'
            }), 404
        
        # Descriptografar embedding salva
        _, embedding_encrypted, _ = user_data[0]
        saved_embedding = decrypt_embedding(embedding_encrypted)
        
        if saved_embedding is None:
            return jsonify({
                'success': False,
                'message': 'Erro ao processar dados do usuário'
            }), 500
        
        # Calcular similaridade
        similarity = calculate_similarity(current_embedding, saved_embedding)
        
        # Threshold de 70% de similaridade
        if similarity >= 70:
            logging.info(f"✅ Login bem-sucedido para {username} - Similaridade: {similarity:.2f}%")
            return jsonify({
                'success': True,
                'message': 'Login realizado com sucesso!',
                'username': username,
                'similarity': round(similarity, 2)
            }), 200
        else:
            logging.warning(f"⚠️ Falha no login para {username} - Similaridade: {similarity:.2f}%")
            return jsonify({
                'success': False,
                'message': 'Rosto não corresponde ao cadastrado',
                'similarity': round(similarity, 2)
            }), 401
        
    except Exception as e:
        logging.error(f"❌ Erro no login: {e}")
        return jsonify({
            'success': False,
            'message': f'Erro ao processar login: {str(e)}'
        }), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint para verificar se a API está online"""
    return jsonify({
        'status': 'online',
        'message': 'API funcionando corretamente'
    }), 200


if __name__ == '__main__':
    # Rodar em todas as interfaces na porta 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
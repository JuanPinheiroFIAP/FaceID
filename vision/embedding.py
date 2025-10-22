import cv2
import numpy as np
from deepface import DeepFace
import logging
from config.settings import EMBADDING_LOG_FILE

logging.basicConfig(
    filename=EMBADDING_LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def embedding(save_image_path="captured_face.jpg"):
    """
    Captura da webcam, gera embedding e salva imagem do rosto detectado.
    Retorna um np.ndarray da embedding.
    """
    cap = cv2.VideoCapture(0)
    embedding = None

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        try:
            result = DeepFace.represent(frame, model_name='Facenet', enforce_detection=True)
            if result:
                embedding = np.array(result[0]["embedding"])
                logging.info("✅ Embedding gerado com sucesso!")

                cv2.imwrite(save_image_path, frame)
                logging.info(f"📷 Imagem do rosto salva em {save_image_path}")

                return embedding

        except Exception as e:
            logging.error(f"❌ Erro ao gerar a embedding: {e}")
            break

        cv2.imshow("Aguardando face...", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

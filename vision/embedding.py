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


def embedding():
    # Inicializa captura da webcam
    cap = cv2.VideoCapture(0)
    embedding = None

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        try:
            # DeepFace detecta a face e gera embedding automaticamente
            result = DeepFace.represent(frame, model_name='Facenet', enforce_detection=True)
            if result:
                embedding = np.array(result[0]["embedding"])
                logging.info("Embedding gerado com sucesso!")
                return embedding

        except Exception as e:
            logging.error("Erro ao gerar a embedding!")
            break

        # Mostra a webcam enquanto espera
        cv2.imshow("Aguardando face...", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
import torch
import torch.nn as nn
import timm
import json
from pathlib import Path
from PIL import Image
import io
from torchvision import transforms

ARTIFACTS_DIR = Path(__file__).parent / "artifacts"
MODEL_PATH    = ARTIFACTS_DIR / "best_model.pth"
CLASSES_PATH  = ARTIFACTS_DIR / "classes.json"

IMG_SIZE   = 300
MODEL_NAME = "efficientnet_b3"

# Transformasi sesuai training (ImageNet normalization)
INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])


class InsectClassifier:
    def __init__(self):
        self.device = torch.device("cpu")  # Force CPU untuk deployment lokal
        self.model  = None
        self.classes = []
        self._load()

    def _load(self):
        # Load daftar kelas
        if not CLASSES_PATH.exists():
            raise FileNotFoundError(
                f"File classes.json tidak ditemukan di {CLASSES_PATH}. "
                "Pastikan sudah menyalin file dari Kaggle."
            )
        with open(CLASSES_PATH, "r") as f:
            self.classes = json.load(f)

        num_classes = len(self.classes)

        # Buat arsitektur model (sama persis saat training)
        self.model = timm.create_model(
            MODEL_NAME,
            pretrained=False,
            num_classes=num_classes
        )

        # Load weights
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"File best_model.pth tidak ditemukan di {MODEL_PATH}. "
                "Pastikan sudah menyalin file dari Kaggle."
            )

        state = torch.load(MODEL_PATH, map_location=self.device)

        # Handle jika disimpan dalam format dict checkpoint
        if isinstance(state, dict) and "model_state_dict" in state:
            state = state["model_state_dict"]

        self.model.load_state_dict(state)
        self.model.to(self.device)
        self.model.eval()

        print(f"[ML] Model loaded: {MODEL_NAME} | {num_classes} kelas")

    def predict(self, image_bytes: bytes, top_k: int = 3) -> dict:
        """
        Menerima raw bytes gambar, mengembalikan dict hasil prediksi.
        """
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = INFERENCE_TRANSFORM(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probs  = torch.softmax(logits, dim=1)[0]

        top_probs, top_idxs = torch.topk(probs, k=top_k)

        results = []
        for prob, idx in zip(top_probs.tolist(), top_idxs.tolist()):
            results.append({
                "label": self.classes[idx],
                "confidence": round(prob * 100, 2)
            })

        return {
            "prediction": results[0]["label"],
            "confidence": results[0]["confidence"],
            "top_k": results
        }


# Singleton instance
_classifier = None

def get_classifier() -> InsectClassifier:
    global _classifier
    if _classifier is None:
        _classifier = InsectClassifier()
    return _classifier

"""
Jalankan script ini SEKALI untuk membuat classes.json dari folder dataset.

Usage:
  python generate_classes.py --train_dir /path/to/dataset/train

Output: backend/artifacts/classes.json
"""

import json
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--train_dir",
        default="/kaggle/input/datasets/baxtiyorbotiraliyev/insects/dataset/train",
        help="Path ke folder train dataset"
    )
    args = parser.parse_args()

    train_dir = Path(args.train_dir)
    if not train_dir.exists():
        print(f"ERROR: Folder tidak ditemukan: {train_dir}")
        return

    classes = sorted([d.name for d in train_dir.iterdir() if d.is_dir()])
    print(f"Ditemukan {len(classes)} kelas.")
    print(f"10 kelas pertama: {classes[:10]}")

    out_path = Path(__file__).parent / "artifacts" / "classes.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(out_path, "w") as f:
        json.dump(classes, f, indent=2)

    print(f"classes.json disimpan ke: {out_path}")

if __name__ == "__main__":
    main()

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


PROMPT_TEMPLATE = """
Kamu adalah seorang entomologis (ahli serangga) yang berpengalaman.
Serangga yang teridentifikasi dari gambar adalah: **{insect_name}** (confidence: {confidence}%)

Berikan informasi lengkap dan akurat dalam format berikut (gunakan Markdown):

## Nama Umum
[Nama umum serangga dalam Bahasa Indonesia dan Inggris]

## Nama Ilmiah
[Nama ilmiah / taksonomi lengkap: Kingdom, Phylum, Class, Order, Family, Genus, Species]

## Deskripsi
[Deskripsi singkat tentang serangga ini, ciri fisik utamanya]

## Habitat
[Di mana serangga ini biasa ditemukan? Wilayah geografis, lingkungan hidup]

## Peran Ekologis
[Apa peran serangga ini di ekosistem? Apakah hama, predator, pollinator, dll?]

## Fun Facts 🐛
[3 fakta menarik dan unik tentang serangga ini yang mungkin tidak banyak diketahui orang]

Jawab dalam Bahasa Indonesia yang informatif dan menarik.
"""


def get_insect_insights(insect_name: str, confidence: float) -> dict:
    if not GEMINI_API_KEY:
        return {
            "success": False,
            "content": None,
            "error": "GEMINI_API_KEY tidak dikonfigurasi."
        }

    prompt = PROMPT_TEMPLATE.format(
        insect_name=insect_name,
        confidence=confidence
    )

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                max_output_tokens=8192,
            )
        )

        response = model.generate_content(prompt)

        return {
            "success": True,
            "content": response.text,
            "error": None
        }

    except Exception as e:
        return {
            "success": False,
            "content": None,
            "error": f"Gemini API tidak tersedia: {str(e)}"
        }
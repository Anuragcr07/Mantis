import pdfplumber
import os

def extract_and_chunk(pdf_path: str, product_id: str, chunk_size: int = 400) -> list:
    """
    Extracts text from PDF and splits into chunks.
    Returns list of { text, metadata } dicts ready for chroma_service.index_chunks()
    """
    chunks = []
    current_words = []
    current_len = 0
    current_page = 1

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if not text:
                continue

            words = text.split()
            for word in words:
                current_words.append(word)
                current_len += len(word) + 1

                if current_len >= chunk_size:
                    chunks.append({
                        "text": " ".join(current_words),
                        "metadata": {
                            "product_id": product_id,
                            "page": page_num,
                            "source_type": "pdf",
                            "filename": os.path.basename(pdf_path)
                        }
                    })
                    current_words = []
                    current_len = 0
                    current_page = page_num

        # leftover words
        if current_words:
            chunks.append({
                "text": " ".join(current_words),
                "metadata": {
                    "product_id": product_id,
                    "page": current_page,
                    "source_type": "pdf",
                    "filename": os.path.basename(pdf_path)
                }
            })

    return chunks

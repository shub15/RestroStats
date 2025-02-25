import easyocr

reader = easyocr.Reader(['en'])  # Load English OCR model

def extract_text_easyocr(image_path):
    """Extract text from image using EasyOCR"""
    result = reader.readtext(image_path, detail=0)
    return result

image_path = "db.png"
text_data = extract_text_easyocr(image_path)
print(text_data)

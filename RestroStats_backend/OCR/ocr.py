import cv2
import pytesseract

# Set Tesseract OCR path (Windows users)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_image(image_path):
    # Read the image
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply thresholding to preprocess handwriting
    thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Extract text using Tesseract
    text = pytesseract.image_to_string(thresh, config='--psm 6')  # PSM 6 works best for blocks of text
    
    return text

# Example usage
image_path = "plain-text.png"
extracted_text = extract_text_from_image(image_path)
print("Extracted Text:\n", extracted_text)
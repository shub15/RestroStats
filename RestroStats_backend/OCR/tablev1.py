import cv2
import pytesseract
import numpy as np
import pandas as pd
from spellchecker import SpellChecker  # For autocorrect

# Install: pip install pyspellchecker

# Set Tesseract Path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

spell = SpellChecker()  # Initialize Spell Checker

def preprocess_image(image_path):
    """Preprocess image: Grayscale, remove noise, increase contrast"""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Remove noise using GaussianBlur
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Adaptive Thresholding to enhance text
    thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)
    
    # Deskew (Correct rotation)
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    
    (h, w) = thresh.shape[:2]
    center = (w // 2, h // 2)
    rot_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    deskewed = cv2.warpAffine(thresh, rot_matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return img, deskewed

def detect_table_cells(thresh):
    """Detect table cells using contours"""
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cell_boxes = []
    
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 30 and h > 20:  # Ignore small noise
            cell_boxes.append((x, y, w, h))
    
    # Sort by position (top to bottom, left to right)
    cell_boxes = sorted(cell_boxes, key=lambda b: (b[1], b[0]))
    
    return cell_boxes

def correct_text(text):
    """Auto-correct text using NLP spellchecker"""
    words = text.split()
    corrected_words = [spell.correction(word) if word.isalpha() else word for word in words]
    return " ".join(corrected_words)

def extract_text_from_cells(image, cell_boxes):
    """Extract text from each table cell"""
    extracted_data = []
    
    for (x, y, w, h) in cell_boxes:
        cell_img = image[y:y+h, x:x+w]
        
        # Convert to grayscale and apply thresholding
        cell_gray = cv2.cvtColor(cell_img, cv2.COLOR_BGR2GRAY)
        cell_thresh = cv2.threshold(cell_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # OCR with Tesseract (Using PSM mode for tables)
        text = pytesseract.image_to_string(cell_thresh, config="--psm 6").strip()
        
        # Apply text correction
        text = correct_text(text)
        
        extracted_data.append(text)
    
    return extracted_data

def convert_to_dataframe(cell_boxes, extracted_data):
    """Convert extracted data into structured Pandas DataFrame"""
    num_columns = len(set(x for x, y, w, h in cell_boxes))  # Estimate column count
    rows = [extracted_data[i:i+num_columns] for i in range(0, len(extracted_data), num_columns)]
    
    df = pd.DataFrame(rows)
    return df

# Run the pipeline
image_path = "images1.png"

original_img, thresh_img = preprocess_image(image_path)
cell_boxes = detect_table_cells(thresh_img)
extracted_data = extract_text_from_cells(original_img, cell_boxes)
table_df = convert_to_dataframe(cell_boxes, extracted_data)

print(table_df)
table_df.to_csv("extracted_table.csv", index=False)

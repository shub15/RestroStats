import cv2
import pytesseract
import numpy as np
import pandas as pd

# Set Tesseract OCR path (Windows users may need this)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image_path):
    """ Preprocess the image: Convert to grayscale, apply thresholding """
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)
    
    # Invert colors (tables are usually black text on white background)
    thresh = cv2.bitwise_not(thresh)
    
    return img, thresh

def detect_table_cells(thresh):
    """ Detect table structure using OpenCV contours """
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    cell_boxes = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 30 and h > 20:  # Filter small noise
            cell_boxes.append((x, y, w, h))
    
    # Sort boxes by position (top to bottom, left to right)
    cell_boxes = sorted(cell_boxes, key=lambda b: (b[1], b[0]))
    
    return cell_boxes

def extract_text_from_cells(image, cell_boxes):
    """ Extract text from each detected cell using OCR """
    extracted_data = []
    
    for (x, y, w, h) in cell_boxes:
        cell_img = image[y:y+h, x:x+w]
        
        # Preprocess cell for better OCR accuracy
        cell_gray = cv2.cvtColor(cell_img, cv2.COLOR_BGR2GRAY)
        cell_thresh = cv2.threshold(cell_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Extract text
        text = pytesseract.image_to_string(cell_thresh, config='--psm 6').strip()
        extracted_data.append(text)
    
    return extracted_data

def convert_to_dataframe(cell_boxes, extracted_data):
    """ Convert the extracted data into a structured Pandas DataFrame """
    num_columns = len(set(x for x, y, w, h in cell_boxes))  # Estimate columns count
    rows = [extracted_data[i:i+num_columns] for i in range(0, len(extracted_data), num_columns)]
    
    df = pd.DataFrame(rows)
    return df

# Main execution
image_path = "db.png"  # Change this to your table image path

# Step 1: Preprocess image
original_img, thresh_img = preprocess_image(image_path)

# Step 2: Detect table cells
cell_boxes = detect_table_cells(thresh_img)

# Step 3: Extract text from detected cells
extracted_data = extract_text_from_cells(original_img, cell_boxes)

# Step 4: Convert extracted text into a structured DataFrame
table_df = convert_to_dataframe(cell_boxes, extracted_data)

# Display the extracted table
print(table_df)

# Save as CSV
table_df.to_csv("extracted_table.csv", index=False)

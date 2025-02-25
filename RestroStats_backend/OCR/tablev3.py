import easyocr
import pandas as pd

reader = easyocr.Reader(['en'])

def extract_text_easyocr(image_path):
    """Extract text from image using EasyOCR"""
    result = reader.readtext(image_path, detail=0)
    return result

def save_to_csv(text_data, output_file="output.csv"):
    """Save extracted text to CSV file"""
    df = pd.DataFrame({"Extracted_Text": text_data})
    
    # Save to CSV
    df.to_csv(output_file, index=False)
    print(f"✅ Data saved to {output_file}")

image_path = "db.png"

# Extract text
text_data = extract_text_easyocr(image_path)

# Save to CSV
save_to_csv(text_data, "extracted_text.csv")

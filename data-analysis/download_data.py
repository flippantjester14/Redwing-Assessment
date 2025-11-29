import requests
import os

DATA_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/00352/Online%20Retail.xlsx"
OUTPUT_PATH = os.path.join("data", "Online_Retail.xlsx")

def download_file(url, filepath):
    print(f"Downloading from {url}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Download complete: {filepath}")
    except Exception as e:
        print(f"Error downloading file: {e}")

if __name__ == "__main__":
    if not os.path.exists("data"):
        os.makedirs("data")
    download_file(DATA_URL, OUTPUT_PATH)

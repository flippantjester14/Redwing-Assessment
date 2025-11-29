import pandas as pd
import os

DATA_PATH = os.path.join("data", "Online_Retail.xlsx")

def explore_data():
    if not os.path.exists(DATA_PATH):
        print(f"Data file not found at {DATA_PATH}")
        return

    print("Loading dataset...")
    try:
        df = pd.read_excel(DATA_PATH)
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return

    print("\n--- Dataset Info ---")
    print(df.info())

    print("\n--- First 5 Rows ---")
    print(df.head())

    print("\n--- Missing Values ---")
    print(df.isnull().sum())

    print("\n--- Summary Statistics ---")
    print(df.describe())

    print("\n--- Negative Quantities (Potential Returns/Errors) ---")
    neg_qty = df[df['Quantity'] < 0]
    print(f"Count: {len(neg_qty)}")
    print(neg_qty.head())

    print("\n--- Unit Price < 0 ---")
    neg_price = df[df['UnitPrice'] < 0]
    print(f"Count: {len(neg_price)}")

if __name__ == "__main__":
    explore_data()

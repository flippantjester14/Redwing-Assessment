import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Setup
DATA_PATH = os.path.join("data", "Online_Retail.xlsx")
OUTPUT_DIR = "output"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def analyze():
    print("Loading data...")
    try:
        df = pd.read_excel(DATA_PATH)
    except FileNotFoundError:
        print("Data file not found. Please run download_data.py first.")
        return

    # --- Data Cleaning ---
    print("Cleaning data...")
    # Remove rows with missing CustomerID (optional, but good for customer analysis)
    df_clean = df.dropna(subset=['CustomerID'])
    
    # Remove cancelled orders (InvoiceNo starts with 'C')
    df_clean = df_clean[~df_clean['InvoiceNo'].astype(str).str.startswith('C')]
    
    # Remove negative/zero quantities and prices
    df_clean = df_clean[(df_clean['Quantity'] > 0) & (df_clean['UnitPrice'] > 0)]
    
    # Create TotalPrice column
    df_clean['TotalPrice'] = df_clean['Quantity'] * df_clean['UnitPrice']
    
    # Convert InvoiceDate to datetime
    df_clean['InvoiceDate'] = pd.to_datetime(df_clean['InvoiceDate'])
    
    print(f"Data cleaned. Rows: {len(df_clean)}")

    # --- Analysis & Visualization ---

    # 1. Popular Product Categories (using Description as proxy)
    print("Analyzing popular products...")
    top_products = df_clean.groupby('Description')['Quantity'].sum().sort_values(ascending=False).head(10)
    
    plt.figure(figsize=(12, 6))
    sns.barplot(x=top_products.values, y=top_products.index, palette='viridis')
    plt.title('Top 10 Popular Products by Quantity')
    plt.xlabel('Total Quantity Sold')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'top_products.png'))
    plt.close()

    # 2. Seasonal Trends
    print("Analyzing seasonal trends...")
    df_clean['MonthYear'] = df_clean['InvoiceDate'].dt.to_period('M')
    monthly_sales = df_clean.groupby('MonthYear')['TotalPrice'].sum()
    
    plt.figure(figsize=(12, 6))
    monthly_sales.plot(kind='line', marker='o')
    plt.title('Monthly Sales Trend')
    plt.xlabel('Month')
    plt.ylabel('Total Revenue')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'seasonal_trend.png'))
    plt.close()

    # 3. Correlation: Quantity vs UnitPrice
    print("Analyzing correlation...")
    # Sample data to avoid overplotting
    sample_df = df_clean.sample(n=min(10000, len(df_clean)), random_state=42)
    
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=sample_df, x='UnitPrice', y='Quantity', alpha=0.5)
    plt.title('Quantity vs Unit Price (Sampled)')
    plt.xscale('log')
    plt.yscale('log')
    plt.xlabel('Unit Price (Log Scale)')
    plt.ylabel('Quantity (Log Scale)')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'correlation.png'))
    plt.close()

    # 4. Demographic Differences (Country)
    print("Analyzing demographics...")
    country_sales = df_clean.groupby('Country')['TotalPrice'].sum().sort_values(ascending=False).head(10)
    
    plt.figure(figsize=(12, 6))
    sns.barplot(x=country_sales.values, y=country_sales.index, palette='magma')
    plt.title('Top 10 Countries by Revenue')
    plt.xlabel('Total Revenue')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'country_sales.png'))
    plt.close()

    print("Analysis complete. Visualizations saved to 'output/' directory.")

if __name__ == "__main__":
    analyze()

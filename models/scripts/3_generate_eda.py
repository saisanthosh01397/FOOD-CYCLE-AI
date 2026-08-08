import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

PROC_DIR = "../../datasets/processed"
EDA_DIR = "../../docs/eda"
os.makedirs(EDA_DIR, exist_ok=True)

def eda_food_waste():
    print("Generating EDA for Daily Food Waste...")
    df = pd.read_csv(os.path.join(PROC_DIR, "daily_food_waste_clean.csv"))
    
    # 1. Distribution of Food Wasted
    plt.figure(figsize=(10, 6))
    sns.histplot(df['food_wasted_kg'], bins=50, kde=True, color='red')
    plt.title("Distribution of Daily Food Waste (kg)")
    plt.xlabel("Food Wasted (kg)")
    plt.ylabel("Frequency")
    plt.savefig(os.path.join(EDA_DIR, "waste_distribution.png"))
    plt.close()
    
    # 2. Waste by Meal Type
    plt.figure(figsize=(8, 5))
    sns.boxplot(x='meal_type', y='food_wasted_kg', data=df)
    plt.title("Food Waste by Meal Type")
    plt.savefig(os.path.join(EDA_DIR, "waste_by_meal.png"))
    plt.close()

def eda_recovery():
    print("Generating EDA for Recovery Data...")
    df = pd.read_csv(os.path.join(PROC_DIR, "recovery_data_clean.csv"))
    
    # 1. Distribution of Recovery Methods
    plt.figure(figsize=(8, 5))
    sns.countplot(x='recommended_method', data=df, order=df['recommended_method'].value_counts().index)
    plt.title("Recommended Recovery Methods")
    plt.savefig(os.path.join(EDA_DIR, "recovery_methods.png"))
    plt.close()
    
    # 2. Correlation Heatmap
    plt.figure(figsize=(10, 8))
    # Select original numeric columns for correlation (before scaling makes them less readable, though scaling doesn't change correlation much)
    # Wait, the data is scaled in processed. Let's just correlate what's there.
    numeric_cols = ['weight', 'moisture', 'freshness', 'contamination_level', 'organic_percentage', 'nitrogen', 'phosphorus', 'potassium']
    corr = df[numeric_cols].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title("Feature Correlation Heatmap")
    plt.savefig(os.path.join(EDA_DIR, "correlation_heatmap.png"))
    plt.close()

def generate_report():
    report = """# Exploratory Data Analysis (EDA) Report

## 1. Daily Food Waste Analysis
- **waste_distribution.png**: Visualizes the overall distribution of food waste in kg per meal. It helps identify the standard variance and extreme outlier days.
- **waste_by_meal.png**: A boxplot comparing waste across Breakfast, Lunch, and Dinner. This identifies which meal type contributes the most to overall waste.

## 2. Recovery Data Analysis
- **recovery_methods.png**: Shows the class balance of the recommended recovery methods (Compost, Biogas, Animal Feed, Donation).
- **correlation_heatmap.png**: Highlights relationships between chemical properties (moisture, organic_percentage) and resulting NPK yields, helping guide model feature selection.
"""
    with open(os.path.join(EDA_DIR, "eda_summary.md"), "w") as f:
        f.write(report)
    print("EDA Report generated.")

if __name__ == "__main__":
    eda_food_waste()
    eda_recovery()
    generate_report()

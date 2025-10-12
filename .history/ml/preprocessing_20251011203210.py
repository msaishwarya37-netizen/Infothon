import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib

class DataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_columns = None
        
    def load_data(self, file_path):
        """Load and basic clean of phishing dataset"""
        df = pd.read_csv(file_path)
        print(f"Dataset shape: {df.shape}")
        return df
    
    def preprocess(self, df):
        """Preprocess the phishing dataset"""
        # Handle missing values
        df = df.fillna(0)
        
        # Encode target variable
        df['status'] = self.label_encoder.fit_transform(
            df['status'].map({'phishing': 1, 'legitimate': 0})
        )
        
        # Separate features and target
        X = df.drop(['status'], axis=1)
        y = df['status']
        
        # Remove non-numeric columns for simplicity
        numeric_columns = X.select_dtypes(include=[np.number]).columns
        X = X[numeric_columns]
        self.feature_columns = numeric_columns.tolist()
        
        return X, y
    
    def split_data(self, X, y, test_size=0.2, random_state=42):
        """Split data into train and test sets"""
        return train_test_split(X, y, test_size=test_size, random_state=random_state)
    
    def fit_scaler(self, X_train):
        """Fit scaler on training data"""
        self.scaler.fit(X_train)
    
    def transform_features(self, X):
        """Transform features using fitted scaler"""
        return self.scaler.transform(X)
    
    def save_preprocessor(self, file_path):
        """Save preprocessor objects"""
        joblib.dump({
            'scaler': self.scaler,
            'label_encoder': self.label_encoder,
            'feature_columns': self.feature_columns
        }, file_path)

def main():
    preprocessor = DataPreprocessor()
    df = preprocessor.load_data('data/dataset_phishing.csv')
    X, y = preprocessor.preprocess(df)
    print(f"Processed features: {X.shape}, target: {y.shape}")
    print(f"Feature columns: {len(preprocessor.feature_columns)}")

if __name__ == "__main__":
    main()
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from xgboost import XGBClassifier
import joblib
import json
from preprocessing import DataPreprocessor

class ModelTrainer:
    def __init__(self):
        self.models = {
            'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'logistic_regression': LogisticRegression(random_state=42, max_iter=1000),
            'xgboost': XGBClassifier(random_state=42, eval_metric='logloss')
        }
        self.best_model = None
        self.best_score = 0
        
    def train_models(self, X_train, X_test, y_train, y_test):
        """Train multiple models and compare performance"""
        results = {}
        
        for name, model in self.models.items():
            print(f"Training {name}...")
            model.fit(X_train, y_train)
            
            # Predictions
            y_pred = model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            results[name] = {
                'model': model,
                'accuracy': accuracy,
                'classification_report': classification_report(y_test, y_pred, output_dict=True)
            }
            
            print(f"{name} Accuracy: {accuracy:.4f}")
            
            # Update best model
            if accuracy > self.best_score:
                self.best_score = accuracy
                self.best_model = model
        
        return results
    
    def save_model(self, model, file_path):
        """Save trained model"""
        joblib.dump(model, file_path)
        print(f"Model saved to {file_path}")
    
    def save_results(self, results, file_path):
        """Save training results"""
        # Convert results to JSON serializable format
        serializable_results = {}
        for name, result in results.items():
            serializable_results[name] = {
                'accuracy': result['accuracy'],
                'classification_report': result['classification_report']
            }
        
        with open(file_path, 'w') as f:
            json.dump(serializable_results, f, indent=2)

def main():
    # Initialize preprocessor
    preprocessor = DataPreprocessor()
    
    # Load and preprocess data
    df = preprocessor.load_data('data/dataset_phishing.csv')
    X, y = preprocessor.preprocess(df)
    
    # Split data
    X_train, X_test, y_train, y_test = preprocessor.split_data(X, y)
    
    # Scale features
    preprocessor.fit_scaler(X_train)
    X_train_scaled = preprocessor.transform_features(X_train)
    X_test_scaled = preprocessor.transform_features(X_test)
    
    # Train models
    trainer = ModelTrainer()
    results = trainer.train_models(X_train_scaled, X_test_scaled, y_train, y_test)
    
    # Save best model and preprocessor
    trainer.save_model(trainer.best_model, 'models/trained_model.joblib')
    preprocessor.save_preprocessor('models/preprocessor.joblib')
    
    # Save feature columns
    joblib.dump(preprocessor.feature_columns, 'models/feature_columns.joblib')
    
    # Save results
    trainer.save_results(results, 'experiments/model_comparison.json')
    
    print(f"Best model: {type(trainer.best_model).__name__} with accuracy: {trainer.best_score:.4f}")

if __name__ == "__main__":
    main()
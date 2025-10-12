#!/bin/bash

echo "Starting Phishing Detection Backend..."

# Check if virtual environment exists
if [ ! -d "backend_venv" ]; then
    echo "Virtual environment not found. Please run init.sh first."
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source backend_venv/bin/activate

# Check if model files exist
model_path="../ml/models/trained_model.joblib"
if [ ! -f "$model_path" ]; then
    echo "Trained model not found. Please train the model first."
    echo "Run: cd ../ml && python train.py"
    deactivate
    exit 1
fi

# Start the FastAPI server
echo "Starting FastAPI server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Deactivate virtual environment when done
deactivate
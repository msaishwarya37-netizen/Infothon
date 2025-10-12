#!/bin/bash

echo "Training ML Model..."

# Check if dataset exists
dataset_path="ml/data/dataset_phishing.csv"
if [ ! -f "$dataset_path" ]; then
    echo "Dataset not found at $dataset_path"
    echo "Please add your phishing dataset CSV file to this location."
    exit 1
fi

# Activate ML virtual environment
echo "Activating ML virtual environment..."
source ml_venv/bin/activate

# Train the model
echo "Starting model training..."
cd ml
python train.py
cd ..

# Deactivate virtual environment
deactivate

echo "Model training completed!"
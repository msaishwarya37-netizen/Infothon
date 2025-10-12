#!/bin/bash

echo "Initializing Phishing Detection MVP..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js"
    exit 1
fi

echo "Found $(python3 --version)"
echo "Found $(node --version)"

# Create virtual environment for ML
echo "Setting up Python virtual environments..."
python3 -m venv ml_venv
source ml_venv/bin/activate
pip install -r ml/requirements_ml.txt
deactivate

python3 -m venv backend_venv
source backend_venv/bin/activate
pip install -r backend/requirements.txt
deactivate

# Install frontend dependencies
echo "Installing frontend dependencies..."

# Chrome Extension
cd frontend/chrome-extension
npm install
cd ../..

# Web Demo
cd frontend/web-demo
npm install
cd ../..

echo "Initialization completed successfully!"
echo ""
echo "Next steps:"
echo "1. Add your dataset to: ml/data/dataset_phishing.csv"
echo "2. Train the ML model: ./scripts/train_model.sh"
echo "3. Start the backend: ./backend/start.sh"
echo "4. Start the web demo: cd frontend/web-demo && npm run dev"
echo "5. Build the extension: ./scripts/build.sh"
# PowerShell script to train the ML model

Write-Host "Training ML Model..." -ForegroundColor Green

# Check if dataset exists
$datasetPath = "ml\data\dataset_phishing.csv"
if (-not (Test-Path $datasetPath)) {
    Write-Host "Dataset not found at $datasetPath" -ForegroundColor Red
    Write-Host "Please add your phishing dataset CSV file to this location." -ForegroundColor Yellow
    exit 1
}

# Activate ML virtual environment
Write-Host "Activating ML virtual environment..." -ForegroundColor Yellow
.\ml_venv\Scripts\Activate.ps1

# Train the model
Write-Host "Starting model training..." -ForegroundColor Yellow
Set-Location ml
python train.py
Set-Location ..

# Deactivate virtual environment
deactivate

Write-Host "Model training completed!" -ForegroundColor Green
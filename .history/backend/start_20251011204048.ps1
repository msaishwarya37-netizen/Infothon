# PowerShell script to start the backend

Write-Host "Starting Phishing Detection Backend..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path "backend_venv")) {
    Write-Host "Virtual environment not found. Please run init.ps1 first." -ForegroundColor Red
    exit 1
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\backend_venv\Scripts\Activate.ps1

# Check if model files exist
$modelPath = "..\ml\models\trained_model.joblib"
if (-not (Test-Path $modelPath)) {
    Write-Host "Trained model not found. Please train the model first." -ForegroundColor Red
    Write-Host "Run: cd ..\ml && python train.py" -ForegroundColor Yellow
    deactivate
    exit 1
}

# Start the FastAPI server
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Deactivate virtual environment when done
deactivate
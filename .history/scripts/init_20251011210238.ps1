# PowerShell initialization script
Write-Host "Initializing Phishing Detection MVP..." -ForegroundColor Green

# Check if Python is installed
$pythonVersion = python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python is not installed. Please install Python 3.8+ from python.org" -ForegroundColor Red
    exit 1
}
Write-Host "Found $pythonVersion" -ForegroundColor Green

# Check if Node.js is installed
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Node.js is not installed. Please install Node.js from nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "Found $nodeVersion" -ForegroundColor Green

# Create virtual environment for ML
Write-Host "Setting up Python virtual environment..." -ForegroundColor Yellow
python -m venv ml_venv
.\ml_venv\Scripts\Activate.ps1

# Install ML requirements
Write-Host "Installing ML dependencies..." -ForegroundColor Yellow
pip install -r ml\requirements_ml.txt

# Install backend requirements
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r backend\requirements.txt

# Deactivate ML venv
deactivate

# Create virtual environment for backend
python -m venv backend_venv
.\backend_venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
deactivate

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow

# Chrome Extension
Set-Location frontend\chrome-extension
npm install
Set-Location ..\..

# Web Demo
Set-Location frontend\web-demo
npm install
Set-Location ..\..

Write-Host "Initialization completed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Add your dataset to: ml\data\dataset_phishing.csv" -ForegroundColor White
Write-Host "2. Train the ML model: .\scripts\train_model.ps1" -ForegroundColor White
Write-Host "3. Start the backend: .\backend\start.ps1" -ForegroundColor White
Write-Host "4. Start the web demo: cd frontend\web-demo && npm run dev" -ForegroundColor White
Write-Host "5. Build the extension: .\scripts\build.ps1" -ForegroundColor White
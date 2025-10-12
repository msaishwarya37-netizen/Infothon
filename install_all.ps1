# Complete installation script
Write-Host "Installing ALL dependencies for Phishing Detection MVP..." -ForegroundColor Green

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$pythonVersion = python --version
$nodeVersion = node --version

if ($LASTEXITCODE -ne 0) {
    Write-Host "Python not found. Please install Python 3.8+ from python.org" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Node.js not found. Please install Node.js from nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "Found: $pythonVersion" -ForegroundColor Green
Write-Host "Found: $nodeVersion" -ForegroundColor Green

# Create virtual environments
Write-Host "Creating Python virtual environments..." -ForegroundColor Yellow
python -m venv ml_venv
python -m venv backend_venv

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow

# ML dependencies
.\ml_venv\Scripts\Activate.ps1
pip install pandas numpy scikit-learn xgboost joblib jupyter matplotlib seaborn
deactivate

# Backend dependencies
.\backend_venv\Scripts\Activate.ps1
pip install fastapi uvicorn pydantic sqlalchemy python-multipart
deactivate

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow

# Chrome Extension
cd frontend\chrome-extension
npm install
cd ..\..

# Web Demo
cd frontend\web-demo
npm install
cd ..\..

Write-Host "🎉 All dependencies installed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create sample dataset: cd ml && python create_sample.py" -ForegroundColor White
Write-Host "2. Train model: .\scripts\train_model.ps1" -ForegroundColor White
Write-Host "3. Start backend: .\backend\start.ps1" -ForegroundColor White
Write-Host "4. Start web demo: cd frontend\web-demo && npm run dev" -ForegroundColor White
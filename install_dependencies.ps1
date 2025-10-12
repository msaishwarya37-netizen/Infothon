# Complete dependency installation script
Write-Host "Installing Phishing Detection MVP Dependencies..." -ForegroundColor Green

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "Found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "Python not found. Please install Python 3.8+ from python.org" -ForegroundColor Red
    exit 1
}

# Install Python packages globally (skip virtual environments)
Write-Host "Installing Python packages..." -ForegroundColor Yellow

# Core ML packages
pip install pandas==2.0.3
pip install numpy==1.24.3
pip install scikit-learn==1.3.0
pip install xgboost==1.7.6
pip install joblib==1.3.2

# Visualization
pip install matplotlib==3.7.2
pip install seaborn==0.12.2
pip install jupyter==1.0.0

# Backend packages
pip install fastapi==0.104.1
pip install uvicorn==0.24.0
pip install pydantic==2.5.0
pip install sqlalchemy==2.0.23
pip install python-multipart==0.0.6

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow

# Chrome Extension
cd frontend\chrome-extension
npm install
if ($LASTEXITCODE -ne 0) {
    npm install --legacy-peer-deps
}
cd ..\..

# Web Demo
cd frontend\web-demo
npm install
if ($LASTEXITCODE -ne 0) {
    npm install --legacy-peer-deps
}
cd ..\..

Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create sample data: cd ml && python create_sample.py" -ForegroundColor White
Write-Host "2. Train model: cd ml && python train.py" -ForegroundColor White
Write-Host "3. Start backend: cd backend && python -m uvicorn app.main:app --reload --port 8000" -ForegroundColor White
Write-Host "4. Start web demo: cd frontend\web-demo && npm run dev" -ForegroundColor White
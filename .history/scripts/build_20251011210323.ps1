# Build script for PowerShell

Write-Host "Building Phishing Detection MVP..." -ForegroundColor Green

# Build Chrome Extension
Write-Host "Building Chrome Extension..." -ForegroundColor Yellow
Set-Location frontend\chrome-extension
npm run build
Set-Location ..\..

Write-Host "Build completed!" -ForegroundColor Green
Write-Host "`nTo load the Chrome extension:" -ForegroundColor Yellow
Write-Host "1. Open Chrome and go to chrome://extensions/" -ForegroundColor White
Write-Host "2. Enable 'Developer mode'" -ForegroundColor White
Write-Host "3. Click 'Load unpacked' and select: frontend\chrome-extension\dist" -ForegroundColor White
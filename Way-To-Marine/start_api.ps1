# Fish Prediction API Startup Script
Write-Host "🐟 Starting Fish Prediction API..." -ForegroundColor Green
Write-Host "📡 API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 Documentation at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🛑 To stop: Press Ctrl+C or close this window" -ForegroundColor Yellow
Write-Host "=" -repeat 50 -ForegroundColor Gray

try {
    # Change to the correct directory
    Set-Location "C:\Users\a30ku\way-to-marine"
    
    # Start the API
    python start_api.py
}
catch {
    Write-Host "❌ Error starting API: $_" -ForegroundColor Red
    Write-Host "Make sure Python and required packages are installed" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
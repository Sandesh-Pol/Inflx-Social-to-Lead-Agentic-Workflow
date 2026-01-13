# AutoStream Backend - Run Server
# Save this as run_server.ps1

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 69) -ForegroundColor Cyan
Write-Host "  AutoStream AI Assistant - Starting Server" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 69) -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "`n❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "   Please create .env file with your GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "   Example: Copy .env.example to .env and add your API key`n" -ForegroundColor Yellow
    exit 1
}

# Check if GEMINI_API_KEY is set
$envContent = Get-Content ".env" -Raw
if ($envContent -match "GEMINI_API_KEY=\s*$") {
    Write-Host "`n⚠️  Warning: GEMINI_API_KEY is empty in .env file!" -ForegroundColor Yellow
    Write-Host "   The server will start but API calls will fail." -ForegroundColor Yellow
    Write-Host "   Get your key from: https://makersuite.google.com/app/apikey`n" -ForegroundColor Cyan
}

Write-Host "`n🚀 Starting FastAPI server...`n" -ForegroundColor Green

# Run the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


# IT Ticket Software - Startup Script

$root = $PSScriptRoot

$python = Join-Path $root ".venv\Scripts\python.exe"

if (-not (Test-Path $python)) {
    Write-Host "ERROR: Python virtual environment not found." -ForegroundColor Red
    Write-Host "Create it with: py -m venv .venv"
    exit 1
}

if (-not (Test-Path "$root\frontend\node_modules")) {
    Write-Host "Frontend dependencies missing. Run npm install." -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting IT Ticket Software..." -ForegroundColor Cyan

# Start FastAPI backend
Start-Process powershell.exe -WorkingDirectory "$root\backend" -ArgumentList @(
    "-NoExit",
    "-Command",
    "& '$python' -m uvicorn app.main:app --reload"
)

# Start React frontend
Start-Process powershell.exe -WorkingDirectory "$root\frontend" -ArgumentList @(
    "-NoExit",
    "-Command",
    "npm run dev"
)

Write-Host ""
Write-Host "Backend:  http://127.0.0.1:8000"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Both servers launched in separate windows." -ForegroundColor Green

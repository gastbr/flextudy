# Requiere PowerShell 5.1 o superior
Write-Host "=== Gestor Docker - FastAPI + PostgreSQL ===" -ForegroundColor Yellow

function Show-Menu {
    param (
        [string]$Title = 'Menu Principal'
    )
    Clear-Host
    Write-Host "===== $Title =====" -ForegroundColor Yellow
    Write-Host "1. Construir y levantar contenedores (docker-compose up)" -ForegroundColor Green
    Write-Host "2. Ejecutar migraciones (alembic upgrade head)" -ForegroundColor Green
    Write-Host "3. Iniciar solo PostgreSQL" -ForegroundColor Green
    Write-Host "4. Ver logs del backend" -ForegroundColor Green
    Write-Host "5. Detener y eliminar contenedores" -ForegroundColor Red
    Write-Host "6. Salir" -ForegroundColor Red
}

function Build-And-Up {
    Write-Host "Construyendo y levantando contenedores..." -ForegroundColor Yellow
    docker-compose up -d --build
    Write-Host "¡Contenedores en ejecución!" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar..."
}

function Run-Migrations {
    Write-Host "Ejecutando migraciones..." -ForegroundColor Yellow
    docker-compose exec backend alembic upgrade head
    Write-Host "¡Migraciones aplicadas!" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar..."
}

function Start-Db-Only {
    Write-Host "Iniciando solo PostgreSQL..." -ForegroundColor Yellow
    docker-compose up -d db
    Write-Host "¡PostgreSQL listo!" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar..."
}

function View-Logs {
    Write-Host "Mostrando logs del backend..." -ForegroundColor Yellow
    docker-compose logs -f backend
}

function Down-Containers {
    Write-Host "Deteniendo y eliminando contenedores..." -ForegroundColor Red
    docker-compose down
    Write-Host "¡Contenedores eliminados!" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar..."
}

# Menú principal
do {
    Show-Menu
    $choice = Read-Host "Selecciona una opción (1-6)"
    switch ($choice) {
        '1' { Build-And-Up }
        '2' { Run-Migrations }
        '3' { Start-Db-Only }
        '4' { View-Logs }
        '5' { Down-Containers }
        '6' { Write-Host "Saliendo..." -ForegroundColor Yellow; exit }
        default { Write-Host "Opción no válida. Intenta nuevamente." -ForegroundColor Red; Start-Sleep -Seconds 2 }
    }
} while ($choice -ne '6')
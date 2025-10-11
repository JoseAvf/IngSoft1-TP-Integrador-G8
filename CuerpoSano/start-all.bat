@echo off
title 🚀 Iniciando CuerpoSano - Backend + Frontend
echo ===============================================
echo    Iniciando el proyecto CuerpoSano...
echo ===============================================
echo.

REM 1) Verificar que Node.js esté instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Descargalo desde https://nodejs.org/
    pause
    exit /b
)

REM 2) Verificar que http-server esté instalado (para servir el frontend)
where http-server >nul 2>nul
if errorlevel 1 (
    echo 🌐 Instalando http-server globalmente...
    npm install -g http-server
)

REM 3) Iniciar el backend (ASP.NET Core) en una ventana nueva
echo ▶ Iniciando backend...
start "Backend CuerpoSano" cmd /k "cd backend\CuerpoSano.WebApi && dotnet run --urls "https://localhost:7238;http://localhost:5238"
"

REM Esperar unos segundos para que el backend se levante
timeout /t 5 /nobreak >nul

REM 4) Iniciar el frontend
echo ▶ Iniciando frontend en http://localhost:8080 ...
cd frontend
start npx http-server -p 8080
cd ..

REM 5) Abrir el navegador automáticamente en la página de miembros
timeout /t 3 /nobreak >nul
echo 🌐 Abriendo navegador...
start http://localhost:8080/pages/members.html

start https://localhost:7238/swagger

REM 6) Mostrar mensaje de conclusión
echo ✅ Todo listo. Backend y Frontend en ejecución.
pause

@echo off
echo Iniciando servidor local en http://localhost:8080...
cd /d "%~dp0"
npx http-server -p 8080
pause
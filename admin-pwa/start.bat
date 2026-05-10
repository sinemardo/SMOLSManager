@echo off
echo ==========================================
echo SMOLSManager - Inicio Rapido
echo ==========================================
echo.
echo Iniciando servidores...
echo.
echo Backend: http://localhost:3000
echo Frontend PWA: http://localhost:5173
echo Documentacion API: http://localhost:3000/api-docs
echo.
echo Para detener: Ctrl+C en cada ventana
echo ==========================================

start "SMOLSManager Backend" cmd /k "cd backend && npm run dev"
start "SMOLSManager PWA" cmd /k "cd admin-pwa && npm run dev"

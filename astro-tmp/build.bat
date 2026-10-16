@echo off
chcp 65001 >nul
echo ========================================
echo   ProTrays Astro 构建脚本
echo ========================================
echo.

echo [1/3] 清理旧的 dist 目录...
if exist dist rmdir /S /Q dist
echo     完成
echo.

echo [2/3] 执行 npm run build...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ 构建失败！请检查上方报错信息。
    pause
    exit /b %errorlevel%
)
echo.
echo [3/3] 构建完成，启动本地预览...
echo.
echo ========================================
echo   预览地址: http://localhost:4321/
echo   按 Ctrl+C 停止预览
echo ========================================
echo.
call npm run preview

pause
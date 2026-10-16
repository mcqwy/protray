@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   生成多语言页面入口文件
echo ========================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$langs = @('zh','es','th','vi');" ^
  "foreach ($lang in $langs) {" ^
  "  $dir = 'src\pages\' + $lang;" ^
  "  New-Item -ItemType Directory -Force -Path $dir | Out-Null;" ^
  "  $idx = '---' + [Environment]::NewLine + 'import HomePage from ''../../components/HomePage.astro'';' + [Environment]::NewLine + '---' + [Environment]::NewLine + '<HomePage lang=''' + $lang + ''' basePath=''/protray/' + $lang + ''' />' + [Environment]::NewLine;" ^
  "  [IO.File]::WriteAllText((Resolve-Path $dir).Path + '\index.astro', $idx, [Text.UTF8Encoding]::new($false));" ^
  "  $abt = '---' + [Environment]::NewLine + 'import AboutPage from ''../../components/AboutPage.astro'';' + [Environment]::NewLine + '---' + [Environment]::NewLine + '<AboutPage lang=''' + $lang + ''' basePath=''/protray/' + $lang + ''' />' + [Environment]::NewLine;" ^
  "  [IO.File]::WriteAllText((Resolve-Path $dir).Path + '\about.astro', $abt, [Text.UTF8Encoding]::new($false));" ^
  "  $mat = '---' + [Environment]::NewLine + 'import MaterialPage from ''../../components/MaterialPage.astro'';' + [Environment]::NewLine + 'import materials from ''../../data/materials.json'';' + [Environment]::NewLine + [Environment]::NewLine + 'export function getStaticPaths() {' + [Environment]::NewLine + '  return materials.map((m) => ({ params: { material: m.slug }, props: { material: m } }));' + [Environment]::NewLine + '}' + [Environment]::NewLine + [Environment]::NewLine + 'const { material } = Astro.props;' + [Environment]::NewLine + '---' + [Environment]::NewLine + '<MaterialPage lang=''' + $lang + ''' basePath=''/protray/' + $lang + ''' material={material} />' + [Environment]::NewLine;" ^
  "  [IO.File]::WriteAllText((Resolve-Path $dir).Path + '\[material].astro', $mat, [Text.UTF8Encoding]::new($false));" ^
  "  Write-Host '  OK: ' + $dir;" ^
  "}"

echo.
echo 完成！已生成 zh / es / th / vi 页面入口。
echo.
pause
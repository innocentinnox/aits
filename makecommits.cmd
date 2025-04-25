@echo off
REM === Create 30 fake commits (no code changes) ===
setlocal enabledelayedexpansion

echo Creating 30 empty commits on branch: matsiko...
git checkout Matsiko || exit /b 1

for /l %%i in (1, 1, 30) do (
    git commit --allow-empty -m "Test commit %%i - !time!"
    echo Added commit %%i/30
)

echo Done. Pushing to GitHub...
git push origin Matsiko

echo.
echo === To UNDO these commits ===
echo 1. Reset locally:   git reset --hard HEAD~30
echo 2. Force push:      git push --force origin matsiko
endlocal
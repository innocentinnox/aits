@echo off
setlocal enabledelayedexpansion

for /l %%i in (0, 1, 29) do (
    :: Get date in exact format: "YYYY-MM-DDTHH:MM:SS-07:00"
    for /f "usebackq" %%d in (`powershell "(Get-Date).AddDays(-30 + %%i).ToString('yyyy-MM-ddTHH:mm:ss-07:00')"`) do (
        set "GIT_DATE=%%d"
    )
    
    :: Set Git environment variables
    set "GIT_AUTHOR_DATE=!GIT_DATE!"
    set "GIT_COMMITTER_DATE=!GIT_DATE!"
    
    :: Make empty commit
    git commit --allow-empty -m "Historical commit [!GIT_DATE!]"
    
    echo Added commit for !GIT_DATE! (%%i+1/30)
)

git push origin Matsiko

echo.
echo === To undo ===
echo git reset --hard HEAD~30
echo git push --force origin Matsiko
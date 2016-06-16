@echo off
set baseDir=%localappdata%\SpotifySaveHotkey
set nodePath=%baseDir%\node
set startPath=%baseDir%\start.js


start /MIN /WAIT "" "%nodePath%" "%startPath%" uninstall

if exist "%appdata%\Microsoft\Windows\Start Menu\Programs\SpotifySaveHotkey" (

rmdir /S /Q "%appdata%\Microsoft\Windows\Start Menu\Programs\SpotifySaveHotkey"

)

cd ..
rmdir /S /Q %baseDir%

echo SpotifySaveHotkey has been uninstalled!
pause
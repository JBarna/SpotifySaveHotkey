@echo off

color 4F
echo.
echo SpotifySaveHotkey!
echo _______________
echo.

set baseDir=%localappdata%\SpotifySaveHotkey

if not exist %baseDir% (
MKDIR %baseDir%
)

echo Copying Files...
echo ________________
echo.
set fileName=dljava.js
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=dlapp.js
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=linker.vbs
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=uninstall.bat
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=w_icon.ico
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=entry.js
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=w_unzip.vbs
echo f | xcopy /y %fileName% %baseDir%\%fileName%

set fileName=license.txt
echo f | xcopy /y %fileName% %baseDir%\%fileName%

reg Query "HKLM\Hardware\Description\System\CentralProcessor\0" | find /i "x86" > NUL && set OS=32bit || set OS=64bit

set fileName=n_%OS%.exe
echo f | xcopy /y %fileName% %baseDir%\node.exe
set nodeFilePath=%baseDir%\node.exe

cd "%baseDir%"

where java >nul 2>nul
if %errorlevel%==1 (
echo.
echo ______________________
echo.
echo Java is not installed. 
echo Downloading Java
echo.
echo _______________________
start /WAIT /MIN "" node dljava.js javainstaller.exe %OS%
start /WAIT javainstaller
)

where java >nul 2>nul
if %errorlevel%==1 (
echo.
echo _______________________________________________
echo.
echo ERROR! Still could not find Java.
echo Please re-run this installation of SpotifySaveHotkey 
echo and fully install Java.
echo _______________________________________________
exit 1
)

echo ______________________________________
echo.
echo Downloading SpotifySaveHotkey
echo ______________________________________
echo.

REM start /MIN /WAIT "" node entry.js install

echo ______________________________________
echo.
echo Creating start menu items
echo ______________________________________
echo.

if exist "%appdata%\Microsoft\Windows\Start Menu\Programs" (

    if NOT exist "%appdata%\Microsoft\Windows\Start Menu\Programs\SpotifySaveHotkey" (
        mkdir "%appdata%\Microsoft\Windows\Start Menu\Programs\SpotifySaveHotkey"
        
        cscript //B linker.vbs "%appdata%\Microsoft\Windows\Start Menu\Programs\SpotifySaveHotkey\SpotifySaveHotkey.lnk" "%nodeFilePath%" "%baseDir%\entry.js" "%baseDir%\w_icon.ico"


        cscript //B linker.vbs "%appdata%\Microsoft\Windows\Start Menu\Programs\SpotifySaveHotkey\uninstall.lnk" "%baseDir%\uninstall.bat" argfiller "%baseDir%\w_icon.ico"

       
        
    )
)
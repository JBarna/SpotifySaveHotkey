' Windows Unzip functionality
' First argument is zip file, second is output directory
Set ArgObj = WScript.Arguments

If (Wscript.Arguments.Count > 1) Then
 var1 = ArgObj(0)
 var2 = ArgObj(1)
Else
 var1 = ""
End if


 WScript.Echo ( "Extracting file " & var1)

Set objShell = CreateObject( "Shell.Application" )
Set objSource = objShell.NameSpace(var1).Items()
Set objTarget = objShell.NameSpace(var2)
intOptions = 256
objTarget.CopyHere objSource, intOptions

 WScript.Echo ( "Extracted." )

@echo off
echo Allowing Node.js through Windows Firewall...
echo.
netsh advfirewall firewall add rule name="Node.js Development Server" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
echo.
echo Firewall rule added successfully!
echo.
echo Your local IP address:
ipconfig | findstr IPv4
echo.
echo Now restart your dev server with: npm run dev
echo Access from other devices using: http://YOUR_LOCAL_IP:3000
pause

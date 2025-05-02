@echo off
echo Setting up Git repository...

cd /d "%~dp0"

set GIT="C:\Program Files\Git\bin\git.exe"

echo Configuring git...
%GIT% config --local user.name "Your Name"
%GIT% config --local user.email "your-email@example.com"

echo Committing files...
%GIT% commit -m "Initial commit"

echo Adding remote repository...
%GIT% remote add origin https://github.com/zahid2021/jammer-frontend.git

echo Pushing to remote repository...
%GIT% push -u origin master

echo Done!
pause 
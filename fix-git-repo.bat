@echo off
echo Fixing Git repository...

cd /d "%~dp0"

set GIT="C:\Program Files\Git\bin\git.exe"

echo Configuring git...
%GIT% config --local user.name "Your Name"
%GIT% config --local user.email "your-email@example.com"

echo Checking git status...
%GIT% status

echo Committing files...
%GIT% commit --allow-empty -m "Initial commit"

echo Setting remote origin (will ignore if already exists)...
%GIT% remote remove origin
%GIT% remote add origin https://github.com/zahid2021/jammer-frontend.git

echo Current branch:
%GIT% branch

echo Pushing to remote repository...
%GIT% push -u origin master

echo Done!
pause 
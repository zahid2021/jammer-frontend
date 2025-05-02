@echo off
echo Setting up Git repository...

set GIT="C:\Program Files\Git\bin\git.exe"

rem Configure Git (you can edit these values)
%GIT% config --local user.name "Your Name"
%GIT% config --local user.email "your-email@example.com"

rem Commit all files
%GIT% commit -m "Initial commit"

rem Add the remote repository
%GIT% remote add origin https://github.com/zahid2021/jammer-frontend.git

rem Push to GitHub
%GIT% push -u origin master

echo Git setup complete!
pause 
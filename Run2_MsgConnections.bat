@echo off
cd linkedin-automate

REM Check if cd command was successful
if %errorlevel% neq 0 (
    echo Failed to change directory to 'linkedin-automate'. Please make sure the directory exists.
    exit /b
)

REM Run the npm script
npm run scenario2.js


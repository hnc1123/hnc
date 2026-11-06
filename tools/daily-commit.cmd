@echo off
rem 留白 WHITE SPACE · 每日自动提交入口（供计划任务或启动文件夹调用）
powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0daily-commit.ps1"

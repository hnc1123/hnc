# ============================================================
# 留白 WHITE SPACE · 每日自动提交
# 有改动就 commit + push；没有改动就跳过，不造空提交
# 用法：powershell -NoProfile -ExecutionPolicy Bypass -File tools\daily-commit.ps1
# ============================================================

$ErrorActionPreference = "Continue"

$repo = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $repo ".tools\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("daily-" + (Get-Date -Format "yyyy-MM-dd") + ".log")

function Write-Log([string]$message) {
  $line = (Get-Date -Format "HH:mm:ss") + "  " + $message
  Add-Content -Path $logFile -Value $line -Encoding UTF8
  Write-Output $line
}

Set-Location $repo

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Log "错误：$repo 不是 git 仓库"
  exit 1
}

$status = git status --porcelain
$changed = @($status | Where-Object { $_ -ne "" }).Count

# 先看看有没有本地提交还没推上去
$aheadText = (git rev-list --count "origin/main..main" 2>$null)
$ahead = 0
if ($aheadText) { [int]::TryParse($aheadText.Trim(), [ref]$ahead) | Out-Null }

if ($changed -eq 0 -and $ahead -eq 0) {
  Write-Log "没有改动，跳过（不产生空提交）"
  exit 0
}

if ($changed -gt 0) {
  Write-Log "检测到 $changed 处改动，开始提交"
  git add -A
  $msg = "chore: 自动同步 " + (Get-Date -Format "MM-dd HH:mm")
  git commit -q -m $msg
  if ($LASTEXITCODE -ne 0) {
    Write-Log "提交失败，退出（工作区保留原样）"
    exit 1
  }
  Write-Log "已提交：$msg"
}

Write-Log "推送到 origin/main ..."
$pushOut = git push origin main 2>&1
$pushOut | ForEach-Object { Write-Log ("  " + $_) }
if ($LASTEXITCODE -eq 0) {
  Write-Log "推送成功"
  exit 0
} else {
  Write-Log "推送失败（可能是网络或凭据问题），本地提交已保留，下次会再试"
  exit 1
}

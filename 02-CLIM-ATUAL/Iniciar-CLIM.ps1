[CmdletBinding()]
param(
  [ValidateRange(1024, 65535)]
  [int]$Port = 4310
)

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$configPath = Join-Path (Split-Path -Parent $projectRoot) 'laboratorio-sigclin\legacy-root\config.xml'
$serverFile = Join-Path $projectRoot '.output\server\index.mjs'

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Não encontrei a configuração local do SIGClin em: $configPath"
}

if (-not (Test-Path -LiteralPath $serverFile)) {
  Write-Host 'Preparando a interface CLIM...' -ForegroundColor Yellow
  & corepack pnpm build
  if ($LASTEXITCODE -ne 0) {
    throw 'Não foi possível gerar a interface CLIM.'
  }
}

[xml]$config = Get-Content -LiteralPath $configPath
$server = $config.config.server
$database = $config.config.database
$username = $config.config.user
$password = $config.config.password

if ([string]::IsNullOrWhiteSpace($server) -or [string]::IsNullOrWhiteSpace($database) -or [string]::IsNullOrWhiteSpace($username)) {
  throw 'A configuração local do SIGClin não possui os dados mínimos do banco.'
}

$encodedUser = [uri]::EscapeDataString($username)
$encodedPassword = [uri]::EscapeDataString($password)
$env:SIGCLIN_DATABASE_URL = "postgresql://$encodedUser`:$encodedPassword@$server`:5432/$database"
$env:SIGCLIN_DATABASE_SSL = 'false'
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = "$Port"

Write-Host "CLIM disponível apenas neste computador: http://127.0.0.1:$Port" -ForegroundColor Green
& node $serverFile

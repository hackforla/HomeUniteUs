# PowerShell script

# Function to source environment variables from a file (since PowerShell doesn't have a direct equivalent)
function Import-EnvFile {
    param (
        [string]$FilePath
    )
    
    if (Test-Path $FilePath) {
        Get-Content $FilePath | ForEach-Object {
            $parts = $_ -split '='
            if ($parts.Length -eq 2) {
                $name = $parts[0].Trim()
                $value = $parts[1].Trim()
                Set-Item -Path Env:$name -Value $value
            }
        }
    }
}

# Check if .env file exists and is readable
if (Test-Path .env -and (Get-Item .env).IsReadOnly -eq $false) {
    dotenv list --format export > envfile
    Import-EnvFile "envfile"
    Remove-Item -Force envfile
}

# Alembic migration
alembic upgrade head

# Check if the script was called with 'prod' as an argument
if ($args[0] -eq "prod") {
    fastapi run app/main.py --port 8000
} else {
    # Setup moto server and export Cognito environment variables
    python startup_scripts/setup_moto_server.py > envfile
    Import-EnvFile "envfile"
    Remove-Item -Force envfile

    # Create test users in moto server and postgres
    python startup_scripts/create_groups_users.py

    fastapi dev
}

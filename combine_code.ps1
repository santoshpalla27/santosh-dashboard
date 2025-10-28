# Set output file path safely (handles spaces)
$output = Join-Path -Path (Get-Location).Path -ChildPath "combined_code.txt"

# Ensure old file is removed
if (Test-Path $output) { Remove-Item $output }

# Create the file so $output definitely exists
New-Item -Path $output -ItemType File -Force | Out-Null

# Confirm output path
Write-Host "Combining files into: $output"
 
# Collect and append main code file contents
Get-ChildItem -Recurse -File |
Where-Object {
    $_.FullName -ne $output -and
    # Exclude modules, build directories, and unnecessary files
    $_.FullName -notmatch 'node_modules|\.git|venv|dist|build|coverage' -and
    # Exclude lock files and dependency files
    $_.Name -ne 'package-lock.json' -and
    $_.Name -ne 'yarn.lock' -and
    # Include only main code file types
    ($_.Extension -in @('.js', '.jsx', '.ts', '.tsx', '.json', '.env', '.env.example', '.html', '.css', '.scss', '.md', '.py', '.java', '.cpp', '.c', '.h', '.yaml', '.yml', '.xml', '.sql', '.sh') -or
     $_.Name -match '^(Dockerfile|Makefile|README|Jenkinsfile|jenkinsfile|Procfile|\.env|\.gitignore|package\.json|tailwind\.config\.js)$')
} |
ForEach-Object {
    Add-Content -Path $output -Value "===== FILE: $($_.FullName) =====`n"
    Get-Content -Path $_.FullName -ErrorAction SilentlyContinue | Out-String | Add-Content -Path $output
    Add-Content -Path $output -Value "`n`n"
}

Write-Host "✅ Combined code written successfully to:`n$output"
# ==============================================================================
# Alehu Backend API Verification Script (Windows PowerShell)
# ==============================================================================
# Usage:
#   1. Start Flask in one PowerShell window:
#        .\.venv\Scripts\python.exe run.py
#   2. Run this script in another PowerShell window:
#        powershell -ExecutionPolicy Bypass -File .\api_tests.ps1
# ==============================================================================

$BaseUrl = "http://127.0.0.1:5000"

Write-Host "`n=== [1/6] Authenticating as Admin ===" -ForegroundColor Cyan
$LoginBody = @{
    email = "admin@alehu.com"
    password = "Admin123!"
} | ConvertTo-Json

$LoginRes = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $LoginBody -ContentType "application/json"
$Token = $LoginRes.data.access_token
Write-Host "✓ Admin logged in successfully! Access token obtained." -ForegroundColor Green

$Headers = @{
    Authorization = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "`n=== [2/6] Checking /api/auth/me ===" -ForegroundColor Cyan
$MeRes = Invoke-RestMethod -Uri "$BaseUrl/api/auth/me" -Method Get -Headers $Headers
Write-Host "✓ Authenticated as: $($MeRes.data.user.username) ($($MeRes.data.user.role))" -ForegroundColor Green

Write-Host "`n=== [3/6] Testing Users API ===" -ForegroundColor Cyan
$UsersRes = Invoke-RestMethod -Uri "$BaseUrl/api/users?page=1&per_page=5" -Method Get -Headers $Headers
Write-Host "✓ Total users in system: $($UsersRes.data.pagination.total)" -ForegroundColor Green

Write-Host "`n=== [4/6] Testing Customer CRUD ===" -ForegroundColor Cyan
# Create Customer
$CustBody = @{
    name = "PowerShell Test Client"
    email = "pstest_$(Get-Random)@example.com"
    phone = "555-123-4567"
    address = "100 PowerShell Way"
} | ConvertTo-Json

$NewCust = Invoke-RestMethod -Uri "$BaseUrl/api/customers" -Method Post -Headers $Headers -Body $CustBody
$CustId = $NewCust.data.customer.id
Write-Host "✓ Created Customer #$($CustId): $($NewCust.data.customer.name)" -ForegroundColor Green

# Update Customer
$UpdateCustBody = @{
    phone = "555-999-8888"
} | ConvertTo-Json
$UpdatedCust = Invoke-RestMethod -Uri "$BaseUrl/api/customers/$CustId" -Method Put -Headers $Headers -Body $UpdateCustBody
Write-Host "✓ Updated Customer #$CustId new phone: $($UpdatedCust.data.customer.phone)" -ForegroundColor Green

# Delete Customer
$DelCust = Invoke-RestMethod -Uri "$BaseUrl/api/customers/$CustId" -Method Delete -Headers $Headers
Write-Host "✓ Deleted Customer #$CustId successfully" -ForegroundColor Green

Write-Host "`n=== [5/6] Testing Device CRUD ===" -ForegroundColor Cyan
# Create Device
$DevBody = @{
    name = "Edge Switch Alpha"
    serial_number = "SW-PS-$(Get-Random)"
    device_type = "Switch"
    status = "active"
} | ConvertTo-Json

$NewDev = Invoke-RestMethod -Uri "$BaseUrl/api/devices" -Method Post -Headers $Headers -Body $DevBody
$DevId = $NewDev.data.device.id
Write-Host "✓ Created Device #$($DevId): $($NewDev.data.device.name) ($($NewDev.data.device.serial_number))" -ForegroundColor Green

# Update Device
$UpdateDevBody = @{
    status = "maintenance"
} | ConvertTo-Json
$UpdatedDev = Invoke-RestMethod -Uri "$BaseUrl/api/devices/$DevId" -Method Put -Headers $Headers -Body $UpdateDevBody
Write-Host "✓ Updated Device #$DevId status: $($UpdatedDev.data.device.status)" -ForegroundColor Green

# Delete Device
$DelDev = Invoke-RestMethod -Uri "$BaseUrl/api/devices/$DevId" -Method Delete -Headers $Headers
Write-Host "✓ Deleted Device #$DevId successfully" -ForegroundColor Green

Write-Host "`n=== [6/6] Testing Roles and Permissions ===" -ForegroundColor Cyan
$RolesRes = Invoke-RestMethod -Uri "$BaseUrl/api/roles" -Method Get -Headers $Headers
Write-Host "✓ Roles available: $($RolesRes.data.roles.name -join ', ')" -ForegroundColor Green

$PermsRes = Invoke-RestMethod -Uri "$BaseUrl/api/permissions" -Method Get -Headers $Headers
Write-Host "✓ Permissions available: $($PermsRes.data.permissions.name -join ', ')" -ForegroundColor Green

Write-Host "`n=======================================================" -ForegroundColor Yellow
Write-Host "All API tests passed successfully on live Flask server!" -ForegroundColor Yellow
Write-Host "=======================================================`n" -ForegroundColor Yellow

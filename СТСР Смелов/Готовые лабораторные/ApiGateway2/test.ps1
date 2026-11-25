# test.ps1
$gateway = "http://localhost:5000/lb"
$methods = @("GET", "POST", "PUT", "DELETE")
$counts = @{}

# Инициализация счетчиков
foreach ($method in $methods) { $counts[$method] = @{} }

foreach ($method in $methods) {
    Write-Host "Отправка 50 запросов $method..." -ForegroundColor Cyan
    for ($i = 1; $i -le 50; $i++) {
        $response = Invoke-RestMethod -Uri $gateway -Method $method
        $nick = $response.Nick
        if (-not $counts[$method].ContainsKey($nick)) {
            $counts[$method][$nick] = 0
        }
        $counts[$method][$nick]++
    }
}

Write-Host "`n--- Результаты ---" -ForegroundColor Green
foreach ($method in $methods) {
    Write-Host "Метод: $method"
    foreach ($nick in $counts[$method].Keys | Sort-Object) {
        Write-Host "  Сервер $nick : $($counts[$method][$nick]) запросов"
    }
}
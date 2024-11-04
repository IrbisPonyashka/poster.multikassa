<?php

$accessId = 'd674ce5d-72ce-44b8-8456-bb7820e8379a';
$secretKey = 'Nzk0YjJjMWM2MjhkZGVjMThjMzFmZTA0NGIwOTM1ZWFhNmUxOTk5ZmIwOGEwYjU1ZjIxNjc5YjgzMjQ1N2VmYg';

$method = 'GET';
$uri = '/BumsTaskApiV01/Task/list.api';
$baseUrl = 'https://mp20055600.megaplan.ru';
$host = 'mp20055600.megaplan.ru';

$ContentType = ''; // Оставляем пустым, если нет тела запроса (например, для GET)
$ContentMD5 = '';  // Тоже пустой, так как тело запроса отсутствует
$Date = date(DateTime::RFC2822);  // Дата в формате RFC 2822

// Формируем строку для подписи
$stringToSign = $method . "\n" .
    $ContentMD5 . "\n" .
    $ContentType . "\n" .
    $Date . "\n" .
    $host . $uri;

// Создаем HMAC-подпись
$encrypted = hash_hmac('sha1', $stringToSign, $secretKey, false);

$signature = base64_encode($encrypted);

// echo '<pre>'; print_r($encrypted); echo '</pre>';

// Заголовки для запроса
$headers = [
    "Date: $Date",
    "Authorization: $accessId:$signature"
];

// Инициализируем cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . $uri);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Выполняем запрос и получаем ответ
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Обработка ошибок
if (curl_errno($ch)) {
    echo 'Ошибка cURL: ' . curl_error($ch);
} else {
    echo "HTTP Code: $httpCode\n";
    echo "Response: $response\n";
}

curl_close($ch);

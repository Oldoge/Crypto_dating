<?php
$dsn = 'mysql:host=127.0.0.1;dbname=crypto_dating;charset=utf8mb4';
$user = 'root';
$pass = '';
try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    echo "Connected to MySQL.\n";
    $stmt = $pdo->query('SHOW TABLES LIKE "predictions"');
    $hasTable = $stmt->fetch();
    echo $hasTable ? "predictions table found.\n" : "predictions table NOT found.\n";
    if ($hasTable) {
        $stmt = $pdo->query('SHOW COLUMNS FROM predictions');
        foreach ($stmt as $row) {
            echo $row['Field'] . ':' . $row['Type'] . "\n";
        }
    }
} catch (Throwable $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
    exit(1);
}

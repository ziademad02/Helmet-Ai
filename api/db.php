<?php

$server   = "localhost";
$user     = "root";
$password = "";
$database = "smart_helmet_db";

$conn = new mysqli($server, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>

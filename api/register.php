<?php

session_start();
require "db.php";

$username    = $_POST["username"];
$password    = $_POST["password"];
$confirm     = $_POST["confirm"];
$full_name   = $_POST["full_name"];
$national_id = $_POST["national_id"];
$age         = $_POST["age"];
$job_title   = $_POST["job_title"];
$phone       = $_POST["phone"];

if ($password != $confirm) {
    header("Location: ../index.html?error=mismatch#register");
    exit;
}

$check = $conn->query("SELECT user_id FROM users WHERE username = '$username'");
if ($check->num_rows > 0) {
    header("Location: ../index.html?error=taken#register");
    exit;
}

$ok1 = $conn->query("INSERT INTO workers (national_id, full_name, age, job_title, phone)
                     VALUES ('$national_id', '$full_name', '$age', '$job_title', '$phone')");
$worker_id = $conn->insert_id;
$ok2 = $conn->query("INSERT INTO users (username, password, worker_id)
                     VALUES ('$username', '$password', $worker_id)");

if ($ok1 && $ok2) {
    header("Location: ../index.html?ok=1#register");
} else {
    header("Location: ../index.html?error=failed#register");
}
exit;
?>

<?php

session_start();
require "db.php";

$username = $_POST["username"];
$password = $_POST["password"];

$sql = "SELECT u.user_id, u.username, w.worker_id, w.full_name, w.job_title
        FROM users u
        JOIN workers w ON u.worker_id = w.worker_id
        WHERE u.username = '$username' AND u.password = '$password'";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $_SESSION["user"] = $result->fetch_assoc();
    header("Location: ../index.html#profile");
} else {
    header("Location: ../index.html?error=1#login");
}

exit;
?>

<?php

session_start();
require "db.php";
header("Content-Type: application/json");

if (!isset($_SESSION["user"])) {
    echo json_encode(["ok" => false, "error" => "not_logged_in"]);
    exit;
}

$user      = $_SESSION["user"];
$worker_id = $user["worker_id"];

$worker = $conn->query("SELECT * FROM workers WHERE worker_id = $worker_id")->fetch_assoc();
$helmet = $conn->query("SELECT * FROM helmets WHERE worker_id = $worker_id LIMIT 1")->fetch_assoc();

$readings = [];
$alerts   = [];
if ($helmet) {
    $hid = $helmet["helmet_id"];

    $r = $conn->query("SELECT * FROM sensor_readings WHERE helmet_id = '$hid' ORDER BY recorded_at DESC LIMIT 5");
    while ($row = $r->fetch_assoc()) { $readings[] = $row; }

    $a = $conn->query("SELECT * FROM alerts WHERE helmet_id = '$hid' AND acknowledged = 0 ORDER BY created_at DESC");
    while ($row = $a->fetch_assoc()) { $alerts[] = $row; }
}

echo json_encode([
    "ok"       => true,
    "user"     => $user,
    "worker"   => $worker,
    "helmet"   => $helmet,
    "readings" => $readings,
    "alerts"   => $alerts,
]);
?>

<?php

session_start();
require "db.php";
header("Content-Type: application/json");

if (!isset($_SESSION["user"])) {
    echo json_encode(["ok" => false, "error" => "not_logged_in"]);
    exit;
}

// View preference cookie (M2 — cookies)
if (isset($_GET["view"])) {
    setcookie("view", $_GET["view"], time() + (7 * 24 * 60 * 60), "/");
    $view = $_GET["view"];
} else {
    $view = $_COOKIE["view"] ?? "all";
}

$where = "";
if ($view == "active")      { $where = "WHERE h.status = 'active'"; }
elseif ($view == "offline") { $where = "WHERE h.status != 'active'"; }

$sql = "SELECT h.helmet_id, h.model, h.status, h.firmware_version, w.full_name AS worker_name
        FROM helmets h
        LEFT JOIN workers w ON h.worker_id = w.worker_id
        $where
        ORDER BY h.helmet_id";

$helmets = [];
$res = $conn->query($sql);
while ($row = $res->fetch_assoc()) {
    $hid = $row["helmet_id"];

    $b = $conn->query("SELECT battery_v, recorded_at FROM sensor_readings WHERE helmet_id = '$hid' ORDER BY recorded_at DESC LIMIT 1")->fetch_assoc();
    $row["battery_v"] = $b ? $b["battery_v"]   : null;
    $row["last_seen"] = $b ? $b["recorded_at"] : null;

    $c = $conn->query("SELECT COUNT(*) AS n FROM alerts WHERE helmet_id = '$hid' AND acknowledged = 0")->fetch_assoc();
    $row["pending"] = (int) $c["n"];

    $helmets[] = $row;
}

$stats = $conn->query("SELECT
    (SELECT COUNT(*) FROM workers)                                AS workers,
    (SELECT COUNT(*) FROM helmets)                                AS helmets,
    (SELECT COUNT(*) FROM helmets WHERE status='active')          AS active,
    (SELECT COUNT(*) FROM alerts  WHERE acknowledged = 0)         AS open_alerts,
    (SELECT COUNT(*) FROM sensor_readings)                        AS readings")->fetch_assoc();

echo json_encode([
    "ok"      => true,
    "view"    => $view,
    "stats"   => $stats,
    "helmets" => $helmets,
]);
?>

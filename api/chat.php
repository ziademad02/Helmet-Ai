<?php
// chat.php — server-side proxy to the Groq LLM API.
// Accepts a JSON body { model, messages } and returns Groq's JSON response.
// The API key must be supplied via the GROQ_API_KEY environment variable.

header("Content-Type: application/json");

$apiKey = getenv("GROQ_API_KEY");
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(["error" => "GROQ_API_KEY not set on the server"]);
    exit;
}

$body = file_get_contents("php://input");

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST,           true);
curl_setopt($ch, CURLOPT_POSTFIELDS,     $body);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json",
]);

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

echo $response;
?>

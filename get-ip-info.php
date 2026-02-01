<?php
// Set CORS headers to allow requests from your domain
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Your API key is safe on the server - users can't see this
$apiKey = 'wmi_3d2bfaa2c6eb4c7475bb77a50c52c73303ad370c27c97e45';

// Get visitor's IP
$visitorIP = $_SERVER['REMOTE_ADDR'];

// If behind proxy/cloudflare
if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $visitorIP = $_SERVER['HTTP_CF_CONNECTING_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $visitorIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
}

// Call the API
$url = "https://api.whatismyip.com/ip-address-lookup.php?key={$apiKey}&input={$visitorIP}&output=json";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Return the response
if ($httpCode == 200) {
    echo $response;
} else {
    // Fallback to ipapi.co if API fails
    $fallback = file_get_contents('https://ipapi.co/json/');
    echo $fallback;
}
?>

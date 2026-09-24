<?php
/**
 * POST /api/subscribe.php
 * Body (JSON): { email, website (honeypot) }
 * Subscribers are appended to subscribers.csv in the private storage folder.
 */
require __DIR__ . '/lib.php';

$data = read_post_json();

if (clean($data['website'] ?? '', 200) !== '') {
    respond(200, ['ok' => true, 'message' => 'Thank you for subscribing!']);
}

$email = strtolower(clean($data['email'] ?? '', 150));
if (!valid_email($email)) {
    fail(422, 'Please enter a valid email address.', ['email' => 'Please enter a valid email address.']);
}

if (!rate_limit_ok('subscribe')) {
    fail(429, 'Too many attempts. Please try again later.');
}

$file = storage_dir() . '/subscribers.csv';
$exists = false;
if (is_file($file)) {
    $fh = fopen($file, 'r');
    if ($fh) {
        while (($row = fgetcsv($fh)) !== false) {
            if (isset($row[1]) && strtolower(ltrim($row[1], "'")) === $email) {
                $exists = true;
                break;
            }
        }
        fclose($fh);
    }
}

if (!$exists) {
    // Guard against CSV/formula injection when the file is opened in Excel.
    $safe = preg_match('/^[=+\-@]/', $email) ? "'" . $email : $email;
    $line = date('c') . ',' . '"' . str_replace('"', '""', $safe) . '"';
    if (!append_line('subscribers.csv', $line)) {
        fail(500, 'Sorry, we could not save your subscription right now. Please try again later.');
    }
}

respond(200, ['ok' => true, 'message' => 'Thank you for subscribing! We will keep you posted.']);

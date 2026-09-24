<?php
/**
 * POST /api/contact.php
 * Body (JSON): { type, name, email, phone, message, website (honeypot), elapsed (ms) }
 */
require __DIR__ . '/lib.php';

$data = read_post_json();
$c = cfg();

// Bots: filled honeypot or submitted impossibly fast. Pretend success so they don't adapt.
$elapsed = isset($data['elapsed']) ? (int) $data['elapsed'] : 0;
if (clean($data['website'] ?? '', 200) !== '' || $elapsed < (int) $c['min_fill_ms']) {
    respond(200, ['ok' => true, 'message' => 'Thank you! Your message has been received.']);
}

$types = [
    'general' => 'General enquiry',
    'volunteer' => 'Volunteer',
    'partnership' => 'Partnership / sponsorship',
    'donation' => 'Donation support',
    'media' => 'Media & press',
];

$type = clean($data['type'] ?? 'general', 20);
$name = clean($data['name'] ?? '', 100);
$email = clean($data['email'] ?? '', 150);
$phone = clean($data['phone'] ?? '', 30);
$message = clean($data['message'] ?? '', 4000);

$errors = [];
if (!isset($types[$type])) {
    $type = 'general';
}
if (str_len($name) < 2) {
    $errors['name'] = 'Please tell us your name.';
}
if (!valid_email($email)) {
    $errors['email'] = 'Please enter a valid email address.';
}
if ($phone !== '' && !preg_match('/^[0-9+()\-.\s]{6,30}$/', $phone)) {
    $errors['phone'] = 'Please enter a valid phone number, or leave it blank.';
}
if (str_len($message) < 10) {
    $errors['message'] = 'Please write a short message (at least 10 characters).';
}
if ($errors) {
    fail(422, 'Please check the highlighted fields.', $errors);
}

if (!rate_limit_ok('contact')) {
    fail(429, 'You have sent several messages recently. Please try again later, or call us directly.');
}

$record = [
    'received_at' => date('c'),
    'ip' => client_ip(),
    'type' => $type,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'message' => $message,
];
$saved = append_line('messages.jsonl', json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

$subject = '[Website] ' . $types[$type] . ' from ' . one_line($name);
$body = "New message from the {$c['site_name']} website\n"
    . "------------------------------------------------\n"
    . "Type:    {$types[$type]}\n"
    . "Name:    {$name}\n"
    . "Email:   {$email}\n"
    . 'Phone:   ' . ($phone !== '' ? $phone : '-') . "\n"
    . "Sent:    {$record['received_at']}\n\n"
    . $message . "\n\n"
    . "------------------------------------------------\n"
    . "Reply directly to this email to respond to {$name}.\n";

$to = implode(', ', array_map('one_line', (array) $c['notify_to']));
$mailed = send_mail($to, $subject, $body, $name, $email);

if (!$mailed) {
    // The message may still be in storage, but nobody was notified, so be honest with the visitor.
    fail(500, 'Sorry, we could not deliver your message right now. Please email us at ' . $c['public_email'] . ' or call us.');
}
if (!$saved) {
    error_log('[ilead] could not write messages.jsonl (email was sent)');
}

respond(200, ['ok' => true, 'message' => 'Your message has been sent. We will get back to you as soon as we can.']);

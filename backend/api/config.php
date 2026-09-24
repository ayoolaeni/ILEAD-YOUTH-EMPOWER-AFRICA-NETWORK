<?php
/**
 * iLead website API settings.
 *
 * Edit the values below, or create `config.local.php` next to this file that returns
 * an array with only the keys you want to override (it is never overwritten by updates).
 */
$config = [
    // Where contact-form messages are emailed. Add or remove addresses freely.
    'notify_to' => [
        'info@ileadyouthempowerafrica.com.ng',
        'Ileadyouthempowerafricanetwork@gmail.com',
    ],

    // Must be an address on YOUR domain (create it in cPanel > Email Accounts if it doesn't exist),
    // otherwise many mail servers will treat the message as spam.
    'mail_from' => 'no-reply@ileadyouthempowerafrica.com.ng',
    'site_name' => 'iLead Youth Empower Africa Network',
    'public_email' => 'info@ileadyouthempowerafrica.com.ng',

    // Anti-spam
    'rate_limit_max' => 5,        // submissions allowed per IP...
    'rate_limit_window' => 3600,  // ...within this many seconds
    'min_fill_ms' => 2500,        // forms submitted faster than this are treated as bots

    // Local development only: set the environment variable ILEAD_DEV=1 to skip real email sending.
    'dev' => getenv('ILEAD_DEV') === '1',
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $override = include $local;
    if (is_array($override)) {
        $config = array_merge($config, $override);
    }
}

return $config;

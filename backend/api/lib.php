<?php
/**
 * Shared helpers for the iLead API endpoints. Compatible with PHP 7.4+.
 */

function cfg()
{
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/config.php';
    }
    return $config;
}

/** Sends a JSON response and stops. */
function respond($status, array $payload)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail($status, $message, array $errors = [])
{
    respond($status, ['ok' => false, 'message' => $message, 'errors' => (object) $errors]);
}

/** Common guard: POST only, same-origin, valid small JSON body. Returns the decoded body. */
function read_post_json()
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        fail(405, 'Method not allowed.');
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    // The proxy used in local development rewrites the Host header, so only enforce this on the live site.
    if ($origin !== '' && !cfg()['dev']) {
        $host = parse_url($origin, PHP_URL_HOST);
        $port = parse_url($origin, PHP_URL_PORT);
        $originHost = strtolower($host . ($port ? ':' . $port : ''));
        $serverHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
        $strip = function ($h) {
            return preg_replace('/^www\./', '', $h);
        };
        if ($strip($originHost) !== $strip($serverHost)) {
            fail(403, 'Request not allowed.');
        }
    }

    $raw = file_get_contents('php://input', false, null, 0, 20001);
    if ($raw === false || $raw === '' || strlen($raw) > 20000) {
        fail(400, 'Invalid request.');
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail(400, 'Invalid request.');
    }
    return $data;
}

function str_len($s)
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

/** Trim, drop control characters (also blocks email header injection), cap length. */
function clean($value, $max)
{
    if (!is_string($value)) {
        return '';
    }
    $stripped = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    if ($stripped === null) { // invalid UTF-8
        return '';
    }
    $value = trim($stripped);
    if (str_len($value) > $max) {
        $value = function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
    }
    return $value;
}

/** Single-line version (no CR/LF) for anything that goes in a mail header. */
function one_line($value)
{
    return trim(preg_replace('/[\r\n]+/', ' ', $value));
}

function valid_email($email)
{
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL) && strlen($email) <= 150;
}

function client_ip()
{
    // REMOTE_ADDR cannot be spoofed by the visitor; proxies (e.g. Cloudflare) are read only if present.
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP']) && filter_var($_SERVER['HTTP_CF_CONNECTING_IP'], FILTER_VALIDATE_IP)) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Private storage folder. Prefers a folder OUTSIDE the public web root (one level above
 * public_html) and falls back to api/storage, which is blocked by its own .htaccess.
 */
function storage_dir()
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    $candidates = [];
    if (!cfg()['dev'] && !empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidates[] = dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) . '/ilead-data';
    }
    $candidates[] = __DIR__ . '/storage';

    foreach ($candidates as $candidate) {
        if (!is_dir($candidate)) {
            @mkdir($candidate, 0750, true);
        }
        if (is_dir($candidate) && is_writable($candidate)) {
            $htaccess = $candidate . '/.htaccess';
            if (!is_file($htaccess)) {
                @file_put_contents($htaccess, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
            }
            return $dir = $candidate;
        }
    }
    fail(500, 'The server is not configured to store messages. Please contact us directly.');
}

/** Appends one line to a private file, with locking. */
function append_line($file, $line)
{
    $path = storage_dir() . '/' . $file;
    return @file_put_contents($path, $line . "\n", FILE_APPEND | LOCK_EX) !== false;
}

/** Allows at most N hits per IP per window. Returns false when the limit is exceeded. */
function rate_limit_ok($bucket)
{
    $max = (int) cfg()['rate_limit_max'];
    $window = (int) cfg()['rate_limit_window'];
    $dir = storage_dir() . '/ratelimit';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $file = $dir . '/' . $bucket . '-' . sha1(client_ip()) . '.json';
    $now = time();

    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return true; // never block real people because of a file-system problem
    }
    flock($fh, LOCK_EX);
    $hits = json_decode(stream_get_contents($fh), true);
    $hits = is_array($hits) ? array_values(array_filter($hits, function ($t) use ($now, $window) {
        return $t > $now - $window;
    })) : [];

    $allowed = count($hits) < $max;
    if ($allowed) {
        $hits[] = $now;
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($hits));
    }
    flock($fh, LOCK_UN);
    fclose($fh);
    return $allowed;
}

/** Sends a plain-text email. Returns true on success. */
function send_mail($to, $subject, $body, $replyToName = '', $replyToEmail = '')
{
    $c = cfg();
    if ($c['dev']) {
        error_log("[ILEAD_DEV] mail skipped: {$subject}");
        return true;
    }
    $fromName = one_line($c['site_name']) . ' Website';
    $encode = function ($s) {
        return '=?UTF-8?B?' . base64_encode($s) . '?=';
    };
    $headers = [
        'From: ' . $encode($fromName) . ' <' . $c['mail_from'] . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: iLead-Website',
    ];
    if ($replyToEmail !== '' && valid_email($replyToEmail)) {
        $headers[] = 'Reply-To: ' . $encode(one_line($replyToName)) . ' <' . $replyToEmail . '>';
    }
    $params = stripos(PHP_OS, 'WIN') === 0 ? '' : '-f' . $c['mail_from'];
    $ok = $params !== ''
        ? @mail($to, $encode($subject), $body, implode("\r\n", $headers), $params)
        : @mail($to, $encode($subject), $body, implode("\r\n", $headers));
    if (!$ok) {
        error_log('[ilead] mail() failed for subject: ' . $subject);
    }
    return $ok;
}

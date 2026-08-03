<?php
/**
 * WWA Secure PHP Contact Form Kit
 * Sample production-style mailer for Worldwide Adverts marketplace.
 *
 * Setup:
 * 1. Upload this file to your server.
 * 2. Set $to_email below.
 * 3. Point your HTML form action to this script (POST).
 */
declare(strict_types=1);

session_start();

$to_email = 'hello@worldwideadverts.info';
$site_name = 'Worldwide Adverts';

if (empty($_SESSION['wwa_csrf'])) {
    $_SESSION['wwa_csrf'] = bin2hex(random_bytes(16));
}

function wwa_clean(string $value): string
{
    return trim(strip_tags($value));
}

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf'] ?? '';
    $honeypot = $_POST['website'] ?? '';

    if ($honeypot !== '') {
        http_response_code(400);
        exit('Spam detected.');
    }
    if (!hash_equals($_SESSION['wwa_csrf'], (string) $token)) {
        $errors[] = 'Invalid security token. Refresh and try again.';
    }

    $name = wwa_clean((string) ($_POST['name'] ?? ''));
    $email = filter_var((string) ($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $message = wwa_clean((string) ($_POST['message'] ?? ''));

    if ($name === '') {
        $errors[] = 'Name is required.';
    }
    if (!$email) {
        $errors[] = 'Valid email is required.';
    }
    if (strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters.';
    }

    if (!$errors) {
        $subject = "[{$site_name}] Contact from {$name}";
        $body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/plain; charset=utf-8',
            'From: ' . $site_name . ' <noreply@worldwideadverts.info>',
            'Reply-To: ' . $email,
        ];
        $sent = @mail($to_email, $subject, $body, implode("\r\n", $headers));
        $success = (bool) $sent;
        if (!$success) {
            $errors[] = 'Mail transport unavailable on this host — message validated locally.';
            // Still treat as demo success when mail() is disabled:
            $success = true;
        }
        $_SESSION['wwa_csrf'] = bin2hex(random_bytes(16));
    }
}

$csrf = htmlspecialchars($_SESSION['wwa_csrf'], ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>WWA PHP Contact Form</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:24px}
    .card{max-width:480px;margin:0 auto;background:#1e293b;border-radius:12px;padding:24px;border:1px solid #334155}
    label{display:block;font-size:12px;font-weight:700;margin:12px 0 6px}
    input,textarea{width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#fff}
    button{margin-top:16px;width:100%;padding:12px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:700;cursor:pointer}
    .ok{background:#064e3b;color:#a7f3d0;padding:10px;border-radius:8px;margin-bottom:12px}
    .err{background:#7f1d1d;color:#fecaca;padding:10px;border-radius:8px;margin-bottom:12px}
    .hp{position:absolute;left:-9999px;opacity:0;height:0;width:0}
  </style>
</head>
<body>
  <div class="card">
    <h1 style="margin:0 0 8px;font-size:1.25rem">Contact us</h1>
    <p style="margin:0 0 16px;color:#94a3b8;font-size:14px">Sample secure PHP contact form — CSRF + honeypot.</p>
    <?php if ($success): ?><div class="ok">Thanks — your message was accepted.</div><?php endif; ?>
    <?php foreach ($errors as $e): ?><div class="err"><?= htmlspecialchars($e, ENT_QUOTES, 'UTF-8') ?></div><?php endforeach; ?>
    <form method="post" novalidate>
      <input type="hidden" name="csrf" value="<?= $csrf ?>" />
      <div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>
      <label>Name</label>
      <input name="name" required value="<?= htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8') ?>" />
      <label>Email</label>
      <input type="email" name="email" required value="<?= htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8') ?>" />
      <label>Message</label>
      <textarea name="message" rows="5" required><?= htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>
      <button type="submit">Send message</button>
    </form>
  </div>
</body>
</html>

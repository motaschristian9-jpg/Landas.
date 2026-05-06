<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #ffffff;
            padding-bottom: 40px;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            color: #1e293b;
        }
        .header {
            padding: 40px 0 20px;
            text-align: center;
        }
        .logo-box {
            width: 64px;
            height: 64px;
            background-color: #10b981;
            border-radius: 16px;
            display: inline-block;
            margin-bottom: 20px;
            vertical-align: middle;
        }
        .logo-inner {
            width: 32px;
            height: 32px;
            background-color: #ffffff;
            border-radius: 8px;
            margin: 16px auto;
        }
        .content {
            padding: 20px 40px;
            text-align: center;
        }
        h1 {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #0f172a;
            margin-bottom: 8px;
            margin-top: 0;
        }
        .subtitle {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: #94a3b8;
            margin-bottom: 32px;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #64748b;
            margin-bottom: 32px;
        }
        .button-container {
            margin-bottom: 32px;
        }
        .button {
            background-color: #10b981;
            color: #ffffff !important;
            padding: 18px 36px;
            text-decoration: none;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            display: inline-block;
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: #cbd5e1;
        }
        .divider {
            height: 1px;
            background-color: #f1f5f9;
            margin: 40px 0;
        }
        .help-text {
            font-size: 12px;
            color: #94a3b8;
        }
        .url-link {
            word-break: break-all;
            color: #10b981;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <div class="logo-box">
                        <div class="logo-inner"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h1>Reset Your Path<span style="color: #10b981;">.</span></h1>
                    <div class="subtitle">Landas Productivity Systems</div>
                    <p>
                        We received a request to reset your password. No worries—everyone loses their way sometimes. Click the button below to get back on track.
                    </p>
                    <div class="button-container">
                        <a href="{{ $url }}" class="button">Set New Password</a>
                    </div>
                    <p class="help-text">
                        If you didn't request a password reset, you can safely ignore this email. This link will expire in {{ $count }} minutes.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <div class="divider"></div>
                    &copy; {{ date('Y') }} Landas Productivity Systems
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

export const otpTemplate = (userData) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
          .container {
            max-width: 400px;
            margin: 40px auto;
            padding: 24px;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            font-family: Arial, sans-serif;
          }
          .otp {
            font-size: 2em;
            color: #2e6c80;
            letter-spacing: 2px;
            margin: 16px 0;
            font-weight: bold;
            text-align: center;
          }
          .footer {
            font-size: 0.9em;
            color: #888;
            margin-top: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello, ${userData.username}!</h2>
          <p>Use the following One-Time Password (OTP) to complete your verification:</p>
          <div class="otp">${userData.otp}</div>
          <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
          <div class="footer">
            If you did not request this, please ignore this email.
          </div>
        </div>
      </body>
    </html>
  `;
}

export const welcomeTemplate = (userData) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Welcome to E-Commerce!</title>
        <style>
          .container {
            max-width: 400px;
            margin: 40px auto;
            padding: 24px;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            font-family: Arial, sans-serif;
          }
          .header {
            font-size: 1.5em;
            color: #2e6c80;
            margin-bottom: 16px;
            text-align: center;
          }
          .content {
            font-size: 1em;
            color: #333;
            margin-bottom: 24px;
            text-align: center;
          }
          .footer {
            font-size: 0.9em;
            color: #888;
            margin-top: 24px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Welcome to E-Commerce, ${userData.username}!</div>
          <div class="content">
            We're excited to have you join our community.<br>
            Start exploring a wide range of products and enjoy a seamless shopping experience.<br>
            If you have any questions, feel free to reach out to our support team.
          </div>
          <div class="footer">
            Thank you for choosing E-Commerce.<br>
            Happy shopping!
          </div>
        </div>
      </body>
    </html>
  `;
}

export const resetPasswordTemplate = (userData) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
        <style>
          .container {
            max-width: 400px;
            margin: 40px auto;
            padding: 24px;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            font-family: Arial, sans-serif;
          }
          .header {
            font-size: 1.5em;
            color: #2e6c80;
            margin-bottom: 16px;
            text-align: center;
          }
          .content {
            font-size: 1em;
            color: #333;
            margin-bottom: 24px;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2e6c80;
            color: #fff !important;
            text-decoration: none;
            border-radius: 4px;
            font-size: 1em;
            margin: 16px 0;
            transition: background 0.2s;
          }
          .button:hover {
            background-color: #1d4d5c;
          }
          .footer {
            font-size: 0.9em;
            color: #888;
            margin-top: 24px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Reset Your Password</div>
          <div class="content">
            Hi ${userData.username},<br>
            We received a request to reset your password.<br>
            Click the button below to set a new password:
          </div>
          <div style="text-align: center;">
            <a href="${userData.resetLink}" class="button" target="_blank" rel="noopener noreferrer">Reset Password</a>
          </div>
          <div class="footer">
            If you did not request a password reset, you can safely ignore this email.
          </div>
        </div>
      </body>
    </html>
  `;
}
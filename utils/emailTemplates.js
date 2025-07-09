exports.resetPasswordTemplate = (resetUrl, username) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2>Password Reset Request</h2>
    <p>Hi ${username || "there"},</p>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thanks,<br/>The Blog Team</p>
  </div>
`;
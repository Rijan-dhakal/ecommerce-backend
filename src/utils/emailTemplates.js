
export const generateTemplate = (userData) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Welcome, ${userData.username}!</h2>
        <p>Just checking, haha ${userData.otp}</p>
      </body>
    </html>
  `;
}

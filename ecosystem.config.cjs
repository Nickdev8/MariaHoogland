module.exports = {
  apps: [
    {
      name: 'maria-hoogland',
      script: 'build/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        // --- IMPORTANT ---
        // Replace these placeholders with your actual credentials
        EMAIL_APP_USER: 'YOUR_EMAIL_USER@example.com',
        EMAIL_APP_PASSWORD: 'YOUR_EMAIL_PASSWORD',
        EMAIL_APP_TO_ADDRESS: 'RECIPIENT_EMAIL@example.com',
      },
    },
  ],
};
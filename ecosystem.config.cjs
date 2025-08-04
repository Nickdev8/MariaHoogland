module.exports = {
  apps: [
    {
      name: 'maria-hoogland',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/mariahoogland.nl/app',
      env_file: '.env',
      env:
      {
        NODE_ENV: 'production',
      },
      env_production: {
        PORT: '3001',
      },
    },
  ],
};
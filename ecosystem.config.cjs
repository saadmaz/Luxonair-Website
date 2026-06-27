module.exports = {
  apps: [
    {
      name: 'luxonair',
      script: './dist/server/server.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'luxonair',
      script: './.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

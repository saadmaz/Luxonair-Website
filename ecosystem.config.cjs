// Single fork instance — fine for current traffic. If load grows enough to need
// PM2 cluster mode (`exec_mode: 'cluster', instances: 'max'`), first re-check
// db/index.ts's mysql2 pool `connectionLimit` (currently 10): each cluster
// instance gets its own pool, so total connections = connectionLimit × instances,
// which must stay under the MySQL server's max_connections.
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

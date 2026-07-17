module.exports = {
  apps: [
    {
      name: "football-score-api",

      // Entry point
      script: "./src/server.js",

      // Working directory on your VPS
      cwd: "/home/hightower/projects/football-match-score-tracker/server",

      // Use Node.js
      interpreter: "node",

      // Environment
      env: {
        NODE_ENV: "production",
      },

      // Restart automatically if it crashes
      autorestart: true,

      // Wait 5 seconds before restarting
      restart_delay: 5000,

      // Restart if memory exceeds 300 MB
      max_memory_restart: "300M",

      // Enable file watching (disable on production)
      watch: false,
    },
  ],
};

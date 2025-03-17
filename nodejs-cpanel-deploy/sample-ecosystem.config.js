module.exports = {
  apps: [{
    name: "app-name",
    script: "dist/main.js", // Or dist/index.js, or whatever your entry point is
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}; 
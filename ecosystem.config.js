module.exports = {
  apps : [
      {
        name: "chat-app",
        "script": "./dist/server/index.js",
        "merge_logs": true,
        "node_args": "-r dotenv/config -r ./tsconfig-paths-bootstrap.js",
        env: {
          "NODE_ENV": "production",
        },
      },
  ]
}
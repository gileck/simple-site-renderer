module.exports = {
  server: {
    command: 'node dist/server.js',
    port: 3100,
    cdn: {
      "port": 3200,
      "dir": "dist/statics",
      "ssl": false
    }
  }
};

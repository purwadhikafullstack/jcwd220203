module.exports = {
  apps: [
    {
      name: "JCWD-2202-03", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8203,
      },
      time: true,
    },
  ],
};

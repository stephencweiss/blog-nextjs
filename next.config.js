/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const withTM = require("next-transpile-modules")(["unifed"]);
module.exports = withTM(nextConfig);

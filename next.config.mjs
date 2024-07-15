/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, context) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        if (config.plugins) {
          config.plugins.push(
            new context.webpack.IgnorePlugin({
              resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
            }),
          )
        }
        return config
      },
};

export default nextConfig;

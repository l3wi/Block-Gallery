module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        os: require.resolve("os-browserify")
      }
    }

    return config
  }
}

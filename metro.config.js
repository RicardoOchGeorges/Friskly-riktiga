const { getDefaultConfig } = require('@expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Add polyfills for Node standard libraries
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('readable-stream'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  url: require.resolve('url/'),
  fs: require.resolve('browserify-fs'),
  path: require.resolve('path-browserify'),
  crypto: require.resolve('crypto-browserify'),
  zlib: require.resolve('browserify-zlib'),
  assert: require.resolve('assert/'),
  buffer: require.resolve('buffer/'),
  util: require.resolve('util/'),
  process: require.resolve('process/browser'),
  events: require.resolve('events/'),
  timers: require.resolve('timers-browserify'),
  vm: require.resolve('vm-browserify'),
  net: require.resolve('stream-http'),
  tls: require.resolve('tls-browserify'),
  dns: require.resolve('dns.js'),
  dgram: require.resolve('dgram-browserify'),
}

// Blocklist ws module
config.resolver.blocklist = [
  /node_modules[\\/]ws[\\/]/,
]

module.exports = config

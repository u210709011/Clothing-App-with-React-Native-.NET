const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'cjs' to the list of source extensions
config.resolver.sourceExts.push('cjs');

// Disable package.json "exports" field resolution
config.resolver.unstable_enablePackageExports = false;

module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Soporte para SVG
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// 2. Bloqueo de carpetas web externas/internas
const currentBlockList = config.resolver.blockList || [];
config.resolver.blockList = [...currentBlockList, /.*\/web\/.*/];

module.exports = config;

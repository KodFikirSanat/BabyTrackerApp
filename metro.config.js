const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// JULES: Added configuration for react-native-svg-transformer
const svgConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
  },
};

const config = mergeConfig(getDefaultConfig(__dirname), svgConfig);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = config;

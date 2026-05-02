module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@mobile/lib': './lib',
            '@mobile/app': './app',
            '@mobile/assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // ← siempre al final
    ],
  };
};

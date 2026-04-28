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
            '@assets': './assets',
            '@hooks': './hooks',
            '@lib': './lib',
            '@components': './src/components',
            '@screens': './src/screens',
            '@theme': './src/theme',
            '@types': './src/types',
            '@context': './src/context',
          },
        },
      ],
      'react-native-reanimated/plugin', // ← siempre al final
    ],
  };
};

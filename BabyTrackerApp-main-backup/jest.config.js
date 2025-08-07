module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|@react-native-community)/)',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
};

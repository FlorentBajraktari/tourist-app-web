const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "react-native$": "react-native-web",
    "react-native/Libraries/Utilities/Platform": "react-native-web/dist/exports/Platform",
    "react-native/Libraries/Utilities/Appearance": "react-native-web/dist/exports/Appearance",
    "react-native/Libraries/Utilities/Dimensions": "react-native-web/dist/exports/Dimensions",
  };

  return config;
};

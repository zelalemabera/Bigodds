const { withProjectBuildGradle } = require("expo/config-plugins");

const NDK_VERSION = "27.0.12077973";

module.exports = function withNdkVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      const contents = config.modResults.contents;

      if (!contents.includes("ndkVersion")) {
        config.modResults.contents =
          contents +
          `\n\n// Big Odds: force NDK version required by react-native-worklets\next.ndkVersion = "${NDK_VERSION}"\n`;
      } else {
        config.modResults.contents = contents.replace(
          /ndkVersion\s*=\s*["'][^"']+["']/g,
          `ndkVersion = "${NDK_VERSION}"`,
        );
      }
    }

    return config;
  });
};

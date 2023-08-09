require('dotenv').config();
const scanner = require("sonarqube-scanner");
const { version, name } = require("./package.json");

function genSonarProjectName(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};


scanner(
  {
    serverUrl: process.env.SONAR_URL,
    token: process.env.SONAR_TOKEN,
    options: {
      "sonar.projectKey": `uricbonatti:${name}`,
      "sonar.projectName": genSonarProjectName(name),
      "sonar.projectVersion": version,
      "sonar.projectBaseDir": "./",
      "sonar.sources": "./src",
      "sonar.tests": "./tests",
      "sonar.language": "ts",
      "sonar.sourceEncoding": "UTF-8",
      "sonar.exclusions": [
        "./node_modules/**",
        'strykers.conf.js',
        'sonar.config.js',
        'src/config/*.ts',
        'src/utils/logger.ts',
        'src/app/server.ts',
        'src/telemetry/*.ts',
        'src/middlewares/metrics.ts'
      ].join(','), 
      "sonar.typescript.lcov.reportPaths": "./coverage/lcov.info",
    },
  },
  () => process.exit()
);

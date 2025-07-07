const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  moduleFileExtensions: ['ts', 'js'], // Allow TypeScript and JavaScript files
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  coverageDirectory: "../coverage",
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts','!src/index.ts'],
  coverageReporters: [
      "html",
      "text"
    ]
};
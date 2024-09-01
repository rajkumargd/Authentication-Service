module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    rootDir: '.',
    testMatch: ['**/tests/**/*.test.ts'],
  };
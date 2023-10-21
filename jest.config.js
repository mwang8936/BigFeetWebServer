module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ["**/**/*.test.ts"],
	verbose: true,
	forceExit: true,
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
	transform: {
	  '^.+\\.ts?$': 'ts-jest',
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
  };

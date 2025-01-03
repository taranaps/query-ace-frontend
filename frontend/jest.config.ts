
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});


const config: Config = {
  
  clearMocks: true,

  collectCoverage: true,

  
  coverageDirectory: "coverage",


  coverageProvider: 'v8',

  // Test environment (set to 'jsdom' for browser-like testing)
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1', 
  },


  
};

export default createJestConfig(config);
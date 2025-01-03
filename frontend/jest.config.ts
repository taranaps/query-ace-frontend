
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
    '^@/(.*)$': '<rootDir>/src/$1',
 
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

      
      
  
  
};

export default createJestConfig(config);
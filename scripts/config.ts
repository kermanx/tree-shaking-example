export interface TestCaseConfig {
  env: 'node' | 'browser';
}

export const testCases: Record<string, TestCaseConfig> = {
  'antd': { env: 'browser' },
  'd3': { env: 'browser' },
  'glob': { env: 'node' },
  'novnc': { env: 'browser' },
  'vuetify': { env: 'browser' },
  'js-yaml': { env: 'browser' },
  'react-icons': { env: 'browser' },
  'remeda': { env: 'browser' },
  'sentry': { env: 'browser' },
  'material-ui': { env: 'browser' },
  'lodash-es': { env: 'browser' },
  'rxjs': { env: 'browser' },
};

export function getTestCaseNames(): string[] {
  return Object.keys(testCases);
}

export function getTestCaseConfig(name: string): TestCaseConfig {
  const config = testCases[name];
  if (!config) {
    throw new Error(`Unknown test case: ${name}`);
  }
  return config;
}

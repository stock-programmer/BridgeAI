/**
 * Jest 配置文件
 * 配置单元测试环境
 */

export default {
  // 测试环境
  testEnvironment: 'node',

  // 测试文件匹配模式
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js',
    '**/__tests__/**/*.test.js'
  ],

  // 覆盖率收集
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // 排除服务器入口文件
    '!src/**/*.test.js',
    '!**/node_modules/**'
  ],

  // 覆盖率目录
  coverageDirectory: 'coverage',

  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // 模块路径映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // 测试超时时间
  testTimeout: 10000,

  // 清除 mock
  clearMocks: true,

  // 详细输出
  verbose: true,

  // 支持 ES Modules
  transform: {},

  // 全局设置
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};

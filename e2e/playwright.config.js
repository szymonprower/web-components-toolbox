// @ts-check
const { devices } = require('@playwright/test')

const config = {
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:2200',
    headless: true
  },
  projects: [
    /*{
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12']
      }
    },*/
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],
  snapshotDir: '../../../../../e2e/',
  outputDir: '../../../../../e2e/tests/'
}

module.exports = config
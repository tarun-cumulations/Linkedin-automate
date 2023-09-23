const dotenv = require('dotenv');
const winston = require('winston');
const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'application.log' })],
});

const driver = new Builder().forBrowser('chrome').build();

async function login() {
  try {
    await driver.get('https://in.linkedin.com/');
    logger.info('ON THE HOME SCREEN OF LINKEDIN');
  
    const usernameElement = await driver.wait(until.elementLocated(By.id('session_key')), 10000);
    await driver.executeScript(`arguments[0].value = "${process.env.LINKEDIN_USERNAME}";`, usernameElement);
  
    const passwordElement = await driver.wait(until.elementLocated(By.id('session_password')), 10000);
    await driver.executeScript(`arguments[0].value = "${process.env.LINKEDIN_PASSWORD}";`, passwordElement);
  
    const loginButton = await driver.wait(until.elementLocated(By.css("#main-content > section > div > div > form > div > button")), 10000);
    await loginButton.click();
  
    logger.info('Logged in successfully');
  } catch (err) {
    logger.error(`Login Error: ${err}`);
  }
}

async function checkNoResults() {
  try {
    const noResultsElement = await driver.findElements(By.xpath('/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div/section/h2'));
    if (noResultsElement.length > 0) {
      logger.info(`NO RESULTS WERE FOUND FOR SEARCH TITLE ${process.env.SEARCH_TITLE}`);
      return true;
    }
    return false;
  } catch (err) {
    logger.error(`Check No Results Error: ${err}`);
    return false;
  }
}

async function clickButtonsAndSendMessage() {
  try {
    // ...Your logic for clicking buttons and sending messages
  } catch (err) {
    logger.error(`Click and Message Error: ${err}`);
  }
}

async function main() {
  try {
    await login();
  
    await driver.get(`https://www.linkedin.com/search/results/people/?network=["F"]&origin=FACETED_SEARCH&sid=jiE&titleFreeText=${process.env.SEARCH_TITLE}`);
  
    const noResults = await checkNoResults();
    if (noResults) {
      throw new Error('No results found.');
    }
  
    await clickButtonsAndSendMessage();
  } catch (err) {
    logger.error(`Main Error: ${err}`);
  } finally {
    await driver.quit();
  }
}

main();

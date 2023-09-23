let dotenv=require('dotenv');

dotenv.config()

let webdriver = require("selenium-webdriver");
let By = webdriver.By;
let until = webdriver.until;

require("chromedriver");

let driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();

driver.get("https://in.linkedin.com/");

// let linkedin_username = "gopiraghu321@gmail.com";
// let linkedin_password = "Gopiashok123#";

let linkedin_username = process.env.LINKEDIN_USERNAME
let linkedin_password = process.env.LINKEDIN_PASSWORD


driver.wait(until.elementLocated(By.id("session_key")), 10000)
    .then(element => {
        return driver.executeScript(`arguments[0].value = "${linkedin_username}";`, element);
    })
    .then(() => {
        return driver.wait(until.elementLocated(By.id("session_password")), 10000);
    })
    .then(element => {
        return driver.executeScript(`arguments[0].value = "${linkedin_password}";`, element);
    })
    .then(() => {
        let complexSelector = "#main-content > section.section.min-h-\\[560px\\].flex-nowrap.pt-\\[40px\\].babybear\\:flex-col.babybear\\:min-h-\\[0\\].babybear\\:px-mobile-container-padding.babybear\\:pt-\\[24px\\] > div > div > form > div.flex.justify-between.sign-in-form__footer--full-width > button";
        return driver.wait(until.elementLocated(By.css(complexSelector)), 10000);
    })
    .then(button => {
        return button.click();
    })
    .then(()=>{
        driver.get("https://www.linkedin.com/search/results/people/?industry=%5B%2296%22%2C%221594%22%2C%226%22%5D&keywords=people&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&sid=WPt");
    }).then(()=>{
        // ... previous setup code

       // Full XPath for the "Connect" button
const fullXPath = '/html/body/div[4]/div[3]/div[2]/div/div[1]/main/div/div/div[3]/div/ul/li[3]/div/div/div[3]/div/button/span';

// Wait for the button to appear and click it
driver.wait(until.elementLocated(By.xpath(fullXPath)), 30000)
    .then(element => {
        return element.click();  // Click the button
    })
    .catch(err => {
        console.log("Error: ", err);
    });



    })
    .then(()=>{
        // add note


        // Full XPath for the button you want to click
const fullXPath = '/html/body/div[3]/div/div/div[3]/button[1]/span';

// Wait for the button to appear and then click it
driver.wait(until.elementLocated(By.xpath(fullXPath)), 30000)
    .then(element => {
        return element.click();  // Click the button
    })
    .catch(err => {
        console.log("Error: ", err);
    });

    }).then(()=>{
        // Full XPath for the textarea
// Full XPath for the textarea
const textareaXPath = '/html/body/div[3]/div/div/div[2]/div/textarea';

// Full XPath for the button to click after filling out the textarea
const buttonXPath = '/html/body/div[3]/div/div/div[3]/button[2]/span';

// Wait for the textarea, send the note, and then click the button
driver.wait(until.elementLocated(By.xpath(textareaXPath)), 30000)
    .then(element => {
        return element.sendKeys('Please connect');  // Send the note
    })
    .then(() => {
        return driver.wait(until.elementLocated(By.xpath(buttonXPath)), 30000);  // Wait for the button
    })
    .then(button => {
        return button.click();  // Click the button
    })
    .catch(err => {
        console.log("Error: ", err);
    });


    })
    .catch(err => {
        console.log("Error: ", err);
    });





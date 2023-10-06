const dotenv = require('dotenv');
dotenv.config();

const webdriver = require("selenium-webdriver");
const { elementTextMatches } = require('selenium-webdriver/lib/until');
const By = webdriver.By;
const until = webdriver.until;
require("chromedriver");

const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();

driver.get("https://in.linkedin.com/");

const linkedin_username = process.env.LINKEDIN_USERNAME;
const linkedin_password = process.env.LINKEDIN_PASSWORD;
const searchTitle = process.env.SEARCH_TITLE;

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
    .then(async () => {

        await driver.get(`https://www.linkedin.com/search/results/people/?industry=%5B%2296%22%2C%221594%22%2C%226%22%5D&keywords=${searchTitle}&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&sid=WPt`);
        
        for(let i=1;i<=process.env.NUM_OF_PAGES;i++){
            let firstName = ""
            for(let j=1;j<=10;j++){

                    await driver.sleep(5000);
                    let skipIteration = false;
                    // FIND ALL THE CONNECT BUTTONS
                    try{

                        let fullName = await driver.executeScript("return document.querySelector('.entity-result__title-text.t-16 a').textContent.trim();")

                        const match = fullName.match(/^(\w+)\s/);
                         firstName = match ? match[1] : "Connection";
                

                    const connectButtonXPath = "//button[span[text()='Connect']]";
                    let connectButton = await driver.wait(until.elementLocated(By.xpath(connectButtonXPath)), 30000);
                    await connectButton.click();
                    }catch(e){
                        j=11;
                        skipIteration = true;
                    }

                    if(skipIteration){
                        continue;
                    }
                    // CLICK ON ADD A NOTE BUTTON
                    await driver.sleep(4000);

                    const addButtonXPath = "//button[span[text()='Add a note']]";
                    let addButton = await driver.wait(until.elementLocated(By.xpath(addButtonXPath)), 30000);
                    await addButton.click();
                    
                    await driver.sleep(4000);

                    // FIND TEXTAREA AND ADD MESSAGE

                    const textareaXPath = "//textarea[@id='custom-message']";
                    let textarea = await driver.wait(until.elementLocated(By.xpath(textareaXPath)), 30000);
                    await textarea.sendKeys(`Hello ${firstName}\n${process.env.MESSAGE_TO_CONNECTION}`);
                        
                    // FIND SUBMIT AND CLICK
                    await driver.sleep(6000);
                    const sendButtonXPath = "//button[span[text()='Send']]";
                    let sendButton = await driver.wait(until.elementLocated(By.xpath(sendButtonXPath)), 30000);
                    await sendButton.click();
                    

            }
            console.log("Outsideeee "+i)

            const connectButtonXPath = "//button[@type='button'][span[text()='Next']]";
            let connectButton = await driver.wait(until.elementLocated(By.xpath(connectButtonXPath)), 30000);
            await connectButton.click();
        }
     }  
    )
    .then(async() => {
        
    })
.catch(err => {
    console.log("Error: ", err);
});

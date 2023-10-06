let dotenv = require('dotenv');
const winston = require('winston');
const { Builder, By, until } = require('selenium-webdriver');

dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'application.log' })
    ]
});

const linkedin_username = process.env.LINKEDIN_USERNAME;
const linkedin_password = process.env.LINKEDIN_PASSWORD;
const searchTitle = process.env.SEARCH_TITLE;

(async () => {
    let driver = await new Builder().forBrowser('chrome').build();

    logger.info("EXECUTING SCENARIO 2 - MESSAGE THE 1st CONNECTIONS");

    await driver.get("https://in.linkedin.com/");
    logger.info("ON THE HOME SCREEN OF LINKEDIN");
    console.log("Recahed till here 26")
    let element = await driver.wait(until.elementLocated(By.id('session_key')), 10000);
    await driver.executeScript(`arguments[0].value = "${linkedin_username}";`, element);

    element = await driver.wait(until.elementLocated(By.id('session_password')), 10000);
    await driver.executeScript(`arguments[0].value = "${linkedin_password}";`, element);
    console.log("Recahed till here 32")
    const complexSelector = "#main-content > section > div > div > form > div.flex.justify-between > button";
    let button = await driver.wait(until.elementLocated(By.css(complexSelector)), 10000);
    console.log("Recahed till here 26")
    logger.info("SUCCESSFULLY LOGGED IN");
    await button.click();
    let currentURL = await driver.getCurrentUrl();

    if(currentURL.includes("challenge")||currentURL.includes("cold-join")){

        console.log("SECURITY CHECK , PLEASE TRY AGAIN");
        logger.error("SECURITY CHECK , PLEASE TRY AGAIN");
        
        await driver.findElement(By.css('input[name="email-or-phone"]')).sendKeys(linkedin_username);

        await driver.findElement(By.css('input[name="password"]')).sendKeys(linkedin_password);

        await driver.findElement(By.id('join-form-submit')).click();

        
    }
  
    await driver.get(`https://www.linkedin.com/search/results/people/?network=["F"]&origin=FACETED_SEARCH&sid=jiE&titleFreeText=${searchTitle}`);
    console.log("Recahed till here 40")
    const noResultsXPath = '/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div/section/h2';
    let elements = await driver.findElements(By.xpath(noResultsXPath));

    if (elements.length > 0) {
        logger.info(`NO RESULTS WERE FOUND FOR SEARCH TITLE ${searchTitle}`);
        logger.info("EXITING");
        logger.info("Modify the search title in .env and try again :)");
        return;
    } else {
        let firstNames = []
        for(let i=1;i<=process.env.NUM_OF_PAGES;i++){

                logger.info(`First connections are found with searchTitle ${searchTitle}`);

                await driver.wait(until.elementLocated(By.className('entity-result')), 10000);
                let members = await driver.findElements(By.className('entity-result'));
                
                for (let member of members) {
                    let nameElem = await member.findElement(By.className('entity-result__title-text'));
                    let fullText = await nameElem.getText();
                    
                    // Use regex to find the first word in the string
                    let match = fullText.match(/(\w+)\s/);
                    let firstName = match ? match[1] : "Connection";
                    if(firstNames.includes(firstName)){
                        logger.info("Found "+firstName+" again");
                        continue;
                    }
                    console.log(`Found member with first name: ${firstName}`);
                    firstNames.push(firstName)
                    await driver.sleep(5000);
                    let messageButton = await member.findElement(By.xpath(".//button[@aria-label='Message ']"));
                    await messageButton.click();

                    await driver.wait(until.elementLocated(By.css("div[aria-label='Write a message…']")), 5000);

                    // Locate the contenteditable div using its aria-label and send the message
                    try {
                        let messageBox = await driver.findElement(By.css("div[aria-label='Write a message…']"));
                        await messageBox.sendKeys(`Hi ${firstName}\n${process.env.MESSAGE_TO_CONNECTION}`);
                    } catch (err) {
                        console.log("Could not find the message box:", err);
                    }
                    
                    await driver.sleep(5000);

                    try {
                        let sendButton = await driver.findElement(By.xpath("//button[text()='Send']"));
                        await sendButton.click();
                    } catch (err) {
                        console.log("Could not find the Send button:", err);
                    }

                    await driver.sleep(5000);

                    ;

                    await driver.executeScript(`
                            var xpath = "//button[.//text()[contains(., 'Close your conversation')]]";
                            var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            if (matchingElement) {
                                matchingElement.click();
                            } else {
                                console.log("Element not found");
                            }
                    `);
            }
            // console.log("Outsideeee "+i)
            const connectButtonXPath = "//button[@type='button'][span[text()='Next']]";
            let connectButton = await driver.wait(until.elementLocated(By.xpath(connectButtonXPath)), 30000);
            await connectButton.click();
        }
    }
})().catch(err => {
    console.log("Error: ", err);
});

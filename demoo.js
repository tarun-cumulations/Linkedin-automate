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
    logger.info("ON THE HOME SCREEN OF LINKED");

    let element = await driver.wait(until.elementLocated(By.id('session_key')), 10000);
    await driver.executeScript(`arguments[0].value = "${linkedin_username}";`, element);

    element = await driver.wait(until.elementLocated(By.id('session_password')), 10000);
    await driver.executeScript(`arguments[0].value = "${linkedin_password}";`, element);

    const complexSelector = "#main-content > section > div > div > form > div.flex.justify-between > button";
    let button = await driver.wait(until.elementLocated(By.css(complexSelector)), 10000);

    logger.info("SUCCESSFULLY LOGGED IN");
    await button.click();

    await driver.get(`https://www.linkedin.com/search/results/people/?network=["F"]&origin=FACETED_SEARCH&sid=jiE&titleFreeText=${searchTitle}`);

    const noResultsXPath = '/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div/section/h2';
    let elements = await driver.findElements(By.xpath(noResultsXPath));

    if (elements.length > 0) {
        logger.info(`NO RESULTS WERE FOUND FOR SEARCH TITLE ${searchTitle}`);
        logger.info("EXITING");
        logger.info("Modify the search title in .env and try again :)");
        return;
    } else {
        logger.info(`First connections are found with searchTitle ${searchTitle}`);

        await driver.wait(until.elementLocated(By.className('entity-result')), 10000);
        let members = await driver.findElements(By.className('entity-result'));

        for (let member of members) {
            let nameElem = await member.findElement(By.className('entity-result__title-text'));
            let fullText = await nameElem.getText();
            
            // Use regex to find the first word in the string
            let match = fullText.match(/(\w+)\s/);
            let firstName = match ? match[1] : "Connection";

            console.log(`Found member with first name: ${firstName}`);
            await driver.sleep(5000);
            // let messageButton = await member.findElement(By.xpath(".//button[@aria-label='Message ']"));
            // await messageButton.click();

            let messageButton = await member.findElement(By.xpath(".//button[@aria-label='Message ']"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", messageButton);
            await driver.sleep(1000);  // give it a second to scroll
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

            



        }
    }
})().catch(err => {
    console.log("Error: ", err);
});
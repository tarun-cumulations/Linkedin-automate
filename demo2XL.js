let dotenv = require('dotenv');
const winston = require('winston');
const { Builder, By, until } = require('selenium-webdriver');
const ExcelJS = require('exceljs'); 

dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'application.log' })
    ]
});

readExcel();

async function readExcel() {
    
    const workbook = new ExcelJS.Workbook();
    
    await workbook.xlsx.readFile('INPUT.xlsx');
    
    const worksheet = workbook.worksheets[0];
    
    const a2 = worksheet.getCell('A2').value;
    const b2 = worksheet.getCell('B2').value;
    const c2 = worksheet.getCell('C2').value;
    const d2 = worksheet.getCell('D2').value;
    const e2 = worksheet.getCell('E2').value;

    console.log(a2);
    console.log(b2);
    console.log(c2);
    console.log(d2);
    console.log(e2);  

    return { a2, b2, c2, d2, e2 };

  }
  

(async () => {

    const { a2, b2, c2, d2, e2 } = await readExcel();

    const linkedin_username = a2.text;
    const linkedin_password = b2;
    const searchTitle = c2;
    let numOfPages = d2;
    let messageToConnection = e2;


    let driver = await new Builder().forBrowser('chrome').build();

    logger.info("EXECUTING SCENARIO 2 - MESSAGE THE 1st CONNECTIONS");

    await driver.get("https://in.linkedin.com/");
    logger.info("ON THE HOME SCREEN OF LINKEDIN");

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
        let firstNames = []
        for(let i=1;i<=numOfPages;i++){

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
                        await messageBox.sendKeys(`Hi ${firstName}\n${messageToConnection}`);
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

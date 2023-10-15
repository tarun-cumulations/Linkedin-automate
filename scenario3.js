let dotenv = require('dotenv');
const winston = require('winston');
const { Builder, By, until , wait } = require('selenium-webdriver');

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
let savedSearchId = process.env.SAVED_SEARCH_ID;
let numOfPages = process.env.NUM_OF_PAGES;

let driver = new Builder().forBrowser('chrome').build();

async function salesNavigator() {
    

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

    // logged in , go to sales nav

    await driver.get("https://www.linkedin.com/sales?trk=d_flagship3_nav&");
    logger.info("CLICKED SAKES NAV");

    

    for(i=1;i<=numOfPages;i++){

        await driver.get(`${savedSearchId}&page=${i}`);

        
        await driver.sleep(5000);

        console.log("All goddd  56")

        const parentOl = await driver.findElement(By.css('ol.artdeco-list'));

        const lis = await parentOl.findElements(By.css('li.artdeco-list__item'));

        console.log("All goddd  62")

        for (const li of lis) {

            await driver.sleep(10000);

            const linkedinPremiumIcons = await li.findElements(By.css('li-icon[type="linkedin-premium-gold-icon"][size="small"]'));

            // console.log("linked status")

            // console.log(linkedinPremiumIcons)


            // const updatedLi = await driver.findElement(By.css(`li.artdeco-list__item[id="${li.getAttribute("id")}"]`));

            // const linkedinPremiumIcons = await updatedLi.findElements(By.css('li-icon[type="linkedin-premium-gold-icon"][size="small"]'));


            if (linkedinPremiumIcons.length > 0) {

                await driver.sleep(3000);
                console.log("NEW CONTAIN LOGO CHECK - EXIST");
                const messageButton = await li.findElement(By.css('ul.list-style-none.inline-flex > li:nth-child(2) > button'));

                // Click the second button
                await messageButton.click();

                const textToCheck = "Free"; 
                const creditsXpath= '//*[@id="message-overlay"]/section/div[2]/section/div[2]/div/span[2]';
                
                const containsFree = null;
                
                try{
                    containsFree = await checkSpanForText(driver, creditsXpath, textToCheck);
                }catch(e){
                    const closeButton = await driver.findElement(By.xpath('/html/body/div[8]/section/header/button[2]'));
                    await closeButton.click();
                    continue;
                }
                if (containsFree) {
                    // Perform some action when the span contains 'free'
                    // add message
                    //await driver.sleep(5000);
                
                    // Find the input element by its placeholder attribute
                    const placeholderText = "Subject (required)";
                    const textToAdd = process.env.SUBJECT_FOR_SALES;
                    
                    // Execute script to add text to the input field using keyboard events
                    await driver.executeScript(
                        (placeholder, text) => {
                            const inputElement = document.querySelector(`input[placeholder="${placeholder}"]`);
                            if (inputElement) {
                                // Focus on the input element
                                inputElement.focus();
                    
                                // Simulate keydown event
                                const keydownEvent = new KeyboardEvent('keydown', {
                                    key: 'a', // Replace with the key you want to simulate (e.g., 'a')
                                });
                                inputElement.dispatchEvent(keydownEvent);
                    
                                // Simulate keypress event
                                const keypressEvent = new KeyboardEvent('keypress', {
                                    key: 'a', // Replace with the key you want to simulate (e.g., 'a')
                                });
                                inputElement.dispatchEvent(keypressEvent);
                    
                                // Add text to the input field
                                inputElement.value = text;
                    
                                // Simulate keyup event
                                const keyupEvent = new KeyboardEvent('keyup', {
                                    key: 'a', // Replace with the key you want to simulate (e.g., 'a')
                                });
                                inputElement.dispatchEvent(keyupEvent);
                            }
                        },
                        placeholderText,
                        textToAdd
                    );
                    

                    //Locate the textarea element using the name attribute
                    const textArea = await driver.findElement(By.name('message'));

                    // message body
                    await textArea.sendKeys(`Hi\n${process.env.MESSAGE_BODY_FOR_SALES}`);

                    const buttonXPath = '/html/body/div[8]/section/div[2]/section/div[2]/form[1]/section/span[2]/button';
                    const buttonElement = await driver.findElement(By.xpath(buttonXPath));
                    await buttonElement.click();


                    // close
                        
                    const closeButton = await driver.findElement(By.xpath('/html/body/div[8]/section/header/button[2]'));
                    await closeButton.click();

                    
                } else {
                    // Perform a different action when the span does not contain 'free'
                    console.log("Credits required to perform, hence skipping")
                }
            } else {
                console.log("LINKEDIN GOLD LOGO DOES NOT EXIST");
               
            }

       
    
        }




    
}
}


async function checkForLinkedPremLogo() {
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
  
    const elements = await driver.findElements(By.css('li-icon[type="linkedin-premium-gold-icon"][size="small"]'));

    if (elements.length > 0) {
        console.log("LinkedIn premium icon is present on the page.");
        return true;
    } else {
        console.log("LinkedIn premium icon is not present on the page.");
        return false;
    }
}

async function checkSpanForText(driver, xpathExpression, textToCheck) {
    await driver.wait(until.elementLocated(By.xpath(xpathExpression)), 30000);
    
    const spanElement = await driver.findElement(By.xpath(xpathExpression));
    const elementText = await spanElement.getText();

    if (elementText.includes(textToCheck)) {
        console.log(`The span contains the text '${textToCheck}'.`);
        return true;
    } else {
        console.log(`The span does not contain the text '${textToCheck}'.`);
        return false;
    }
}


salesNavigator()
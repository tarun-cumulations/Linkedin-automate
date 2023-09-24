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
    .then(() => {

        // first page
        /*

        driver.get("https://www.linkedin.com/search/results/people/?industry=%5B%2296%22%2C%221594%22%2C%226%22%5D&keywords=people&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&sid=WPt");

        */

        //second page 

        driver.get("https://www.linkedin.com/search/results/people/?industry=%5B%2296%22%2C%221594%22%2C%226%22%5D&keywords=people&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&page=2&sid=%40KR");


    })
    .then(async() => {
    // Loop for clicking the "Connect" button and adding a note 5 times
    //process.env.NUMBER_OF_CONNECTIONS_TO_SEND
    
    const connectButtonXPath4 = `/html/body/div[4]/div[3]/div[2]/div/div[1]/main/div/div/div[1]/h2/div`;
    const connectButtonXPath5 = `/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[1]/h2/div`;
    let connectButtonElement4;
    let connectButtonElement5;
    let buttonText4;
    let buttonText5;
    let elementExists4; 
    let elementExists5; 
    try{
        // connectButtonElement4= await driver.findElement(By.xpath(connectButtonXPath4));
        // connectButtonElement5 = await driver.findElement(By.xpath(connectButtonXPath5));
        // buttonText4 = await connectButtonElement4.getText();
        // buttonText5 = await connectButtonElement5.getText();

        // Check if the element exists
        elementExists4 = await driver.findElements(By.xpath(connectButtonXPath4));
        elementExists5 = await driver.findElements(By.xpath(connectButtonXPath5));
        console.log("elementExists4 found is "+elementExists4)
        console.log("elementExists5 found is "+elementExists5)
    
    }catch(e){
        // do nothing
    }

    let value = 4;
    if(elementExists5.length > 0){
        value = 5;
    }
    console.log("value found is "+value)
    for (let i = 1; i <= 3; i++) {
        await driver.sleep(3000);
    for (let j = 1; j <= 10; j++) {

        await driver.sleep(5000);
        const connectButtonXPath = `/html/body/div[${value}]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li[${j}]/div/div/div[3]/div/button/span`;
        

        // const connectButtonElement = await driver.findElement(By.xpath(connectButtonXPath));
        // const buttonText = await connectButtonElement.getText();
     
        // console.log("text on button is:"+buttonText)
        // if(!buttonText=="Connect"){
        //     continue;
        // }
                                    
        // Wait for the "Connect" button to appear and click it
       driver.wait(until.elementLocated(By.xpath(connectButtonXPath)), 30000)
            .then(element => {
                return element.click();  // Click the button
            })
            .catch(err => {
                console.log("Error clicking 'Connect' button: ", err);
            })
            .then(() => {
                // Full XPath for the button to add a note
                const addNoteButtonXPath = '/html/body/div[3]/div/div/div[3]/button[1]/span';

                driver.wait(until.elementLocated(By.xpath(addNoteButtonXPath)), 30000)
                    .then(element => {
                        return element.click();  // Click the "Add Note" button
                    })
                    .catch(err => {
                        console.log("Error clicking 'Add Note' button: ", err);
                    })
                    .then(() => {
                        // Full XPath for the textarea
                        const textareaXPath = '/html/body/div[3]/div/div/div[2]/div/textarea';

                        // Full XPath for the button to click after filling out the textarea
                        const submitButtonXPath = '/html/body/div[3]/div/div/div[3]/button[2]/span';

                        driver.wait(until.elementLocated(By.xpath(textareaXPath)), 30000)
                            .then(async element => {
                                await driver.sleep(2000);
                                return element.sendKeys(process.env.MESSAGE_TO_CONNECTION);  // Send the note
                            })
                            .then(async() => {
                                await driver.sleep(2000);
                                return driver.wait(until.elementLocated(By.xpath(submitButtonXPath)), 30000);  // Wait for the button
                            })
                            .then(async button => {
                                
                                return button.click();  // Click the button to submit the note
                                
                            })
                            .catch(err => {
                                console.log("Error submitting note: ", err);
                            });
                    });
            });      
        }
        const clickNextPage = '/html/body/div[${value}]/div[3]/div[2]/div/div[1]/main/div/div/div[5]/div/div/button[2]/span';

        driver.wait(until.elementLocated(By.xpath(clickNextPage)), 30000)
            .then(async element => {
                await driver.sleep(1000);
                return button.click();  // Click the button to navigate to next page
        })
    }
})
.catch(err => {
console.log("Error: ", err);
});

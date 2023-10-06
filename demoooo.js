let dotenv=require('dotenv');
const winston = require('winston');
dotenv.config()

let webdriver = require("selenium-webdriver");
let By = webdriver.By;
let until = webdriver.until;

require("chromedriver");


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'application.log' })
    ]
});

let driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();


logger.info("EXCUTING SCENARIO 2 - MESSAGE THE 1st CONNECTIONS")


driver.get("https://in.linkedin.com/");
logger.info("ON THE HOME SCREEN OF LINKED")

let linkedin_username = process.env.LINKEDIN_USERNAME
let linkedin_password = process.env.LINKEDIN_PASSWORD
let searchTitle = process.env.SEARCH_TITLE;
let messageToConn = process.env.MESSAGE_TO_CONNECTION

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

        logger.info("SUCCESSFULLY LOGGED IN");
        return button.click();
        
    })
    .then(()=>{
        driver.get(`https://www.linkedin.com/search/results/people/?network=%5B%22F%22%5D&origin=FACETED_SEARCH&sid=jiE&titleFreeText=${searchTitle}`)
    }).then(()=>{

        // XPath for the element that indicates "no results"
        const noResultsXPath = '/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div/section/h2';

        // Check for the "no results" element
        driver.findElements(By.xpath(noResultsXPath))
            .then(elements => {
                if (elements.length > 0) {
                    logger.info(`NO RESULTS WERE FOUND FOR SEARCH TITLE${searchTitle}`)
                    logger.info("EXITING")
                    logger.info("Modify the search title in .env and try again :)")
                    throw new Error("No results found.");
                }else{
                    logger.info(`First connections are found with searchTitle ${searchTitle}`);

                    // XPath pattern that matches the buttons
                    const buttonsXPath = '/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li[1]/div/div/div[3]/div/div/button';
                    // XPath for the element containing the name
                    const nameXPath = '/html/body/div[5]/div[4]/aside/div[2]/div[1]/div/div[1]/div/div/section/div/button[1]/span';
                
                    // Find all buttons matching the XPath pattern
                    driver.findElements(By.xpath(buttonsXPath))
                        .then(buttons => {
                            // Sequentially click all buttons and then get the name
                            return buttons.reduce((acc, button) => {
                                return acc.then(() => button.click())  // Click the button
                                          .then(() => driver.sleep(5000))  // Optional sleep between clicks
                                          .then(() => driver.findElement(By.xpath(nameXPath)))  // Find the element containing the name
                                          .then(nameElement => nameElement.getText())  // Get the text of the name element
                                          .then(name => {

                                              let connectionName = name;
                                              let message = `Hello ${connectionName} \n${messageToConn}`
                                              logger.info(`Fetched name is: ${name}`);  
                                              logger.info(`CONSTRUCTED MESSAGE :`)

                                              // XPath for the element where you want to input the message
                                            const messageXPath = '/html/body/div[5]/div[4]/aside/div[2]/div[1]/div/form/div[2]/div/div[1]/div[1]/p';

                        
                                            // Wait for the element to appear and then input the message
                                            driver.wait(until.elementLocated(By.xpath(messageXPath)), 10000)
                                                .then(element => {
                                                    return element.sendKeys(message);  // Input the message
                                                }).then(()=>{
                                                    // click send
                                                    
                                                   // Class name for the 'Send' button
                                                    const sendButtonClass = 'msg-form__send-button';

                                                    // Wait for the button to appear
                                                    driver.wait(until.elementLocated(By.className(sendButtonClass)), 10000)
                                                        .then(button => {
                                                            return driver.sleep(2000)  // Wait for an extra 2 seconds to make sure the button is clickable
                                                                    .then(() => button.click());  // Then click the 'Send' button
                                                        })
                                                        .catch(err => {
                                                            logger.error(`Error: ${err}`);
                                                        });

                                                

                                                })
                                                .catch(err => {
                                                    logger.error(`Error: ${err}`);
                                                });


                                          })
                                          .catch(err => {
                                              logger.error(`Error in loop: ${err}`);
                                          });
                            }, Promise.resolve());
                        })
                        .catch(err => {
                            logger.error(`Error: ${err}`);
                        });

                }
            })
            .catch(err => {
                console.log("Error: ", err);
            });

    })
    .catch(err => {
        console.log("Error: ", err);
    });





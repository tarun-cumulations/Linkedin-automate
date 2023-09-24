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

const linkedin_username = "tarun.t@cumulations.com";
const linkedin_password = "blacy728";

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
        driver.get("https://www.linkedin.com/search/results/people/?industry=%5B%2296%22%2C%221594%22%2C%226%22%5D&keywords=people&network=%5B%22S%22%2C%22O%22%5D&origin=FACETED_SEARCH&sid=WPt");
    })
    .then(() => {
    // Loop for clicking the "Connect" button and adding a note 5 times
    for (let i = 1; i <= 5; i++) {
        const connectButtonXPath = `/html/body/div[4]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li[${i}]/div/div/div[3]/div/button/span`;
                                    
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
                            .then(element => {
                                return element.sendKeys('Please connect');  // Send the note
                            })
                            .then(() => {
                                return driver.wait(until.elementLocated(By.xpath(submitButtonXPath)), 30000);  // Wait for the button
                            })
                            .then(button => {
                                return button.click();  // Click the button to submit the note
                            })
                            .catch(err => {
                                console.log("Error submitting note: ", err);
                            });
                    });
            });
    }

})
.catch(err => {
console.log("Error: ", err);
});

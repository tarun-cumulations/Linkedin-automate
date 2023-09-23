let webdriver = require("selenium-webdriver");
let By = webdriver.By;
let until = webdriver.until;

require("chromedriver");

let driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();

driver.get("https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit");



// driver.wait(until.elementLocated(By.id("session_key")), 10000)
//     .then(element => {
//         return driver.executeScript(`arguments[0].value = "${linkedin_username}";`, element);
//     })
//     .then(() => {
//         return driver.wait(until.elementLocated(By.id("session_password")), 10000);
//     })
//     .then(element => {
//         return driver.executeScript(`arguments[0].value = "${linkedin_password}";`, element);
//     })
//     .then(() => {
//         let complexSelector = "#main-content > section.section.min-h-\\[560px\\].flex-nowrap.pt-\\[40px\\].babybear\\:flex-col.babybear\\:min-h-\\[0\\].babybear\\:px-mobile-container-padding.babybear\\:pt-\\[24px\\] > div > div > form > div.flex.justify-between.sign-in-form__footer--full-width > button";
//         return driver.wait(until.elementLocated(By.css(complexSelector)), 10000);
//     })
//     .then(button => {
//         return button.click();
//     })
//     .catch(err => {
//         console.log("Error: ", err);
//     });

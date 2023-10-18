const dotenv = require('dotenv');
dotenv.config();
const ExcelJS = require('exceljs'); 
const webdriver = require("selenium-webdriver");
const { elementTextMatches } = require('selenium-webdriver/lib/until');
const By = webdriver.By;
const until = webdriver.until;
require("chromedriver");

const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();

driver.get("https://in.linkedin.com/");

let linkedin_username;
let linkedin_password;
let searchTitle;
let numOfPages;
let messageToConnections;

readExcel();

async function readExcel() {
    
    const workbook = new ExcelJS.Workbook();
    
    await workbook.xlsx.readFile('INPUT1.xlsx');
    
    const worksheet = workbook.worksheets[0];
    
    const a2 = worksheet.getCell('A2').value;
    const b2 = worksheet.getCell('B2').value;
    const c2 = worksheet.getCell('C2').value;
    const d2 = worksheet.getCell('D2').value;
    const e2 = worksheet.getCell('E2').value;

   
    linkedin_username = a2.text;
    linkedin_password = b2;
    searchTitle = c2;
    numOfPages = d2;
    messageToConnections = e2;

    //return { a2, b2, c2, d2, e2 };

    console.log("From excel:");
    console.log(linkedin_username);
    console.log(linkedin_password);
    console.log(searchTitle);
    console.log(numOfPages);
    console.log(messageToConnections);

  }

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
        
        for(let i=1;i<=numOfPages;i++){
            let firstName = ""
            for(let j=1;j<=10;j++){

                    await driver.sleep(10000);
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
                    
                    await driver.sleep(6000);

                    // FIND TEXTAREA AND ADD MESSAGE

                    const textareaXPath = "//textarea[@id='custom-message']";
                    let textarea = await driver.wait(until.elementLocated(By.xpath(textareaXPath)), 30000);
                    await textarea.sendKeys(`Hello ${firstName}\n${messageToConnections}`);
                        
                    // FIND SUBMIT AND CLICK
                    await driver.sleep(8000);
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

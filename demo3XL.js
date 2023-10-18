let dotenv = require('dotenv');
const winston = require('winston');
const { Builder, By, until , wait } = require('selenium-webdriver');
const ExcelJS = require('exceljs'); 
dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'application.log' })
    ]
});

let linkedin_username;
let linkedin_password;
let savedSearchId;
let numOfPages;

//subject for sales
let textToAdd;
let messageBodyForSales;

readExcel();

async function readExcel() {
    
    const workbook = new ExcelJS.Workbook();
    
    await workbook.xlsx.readFile('INPUT3.xlsx');
    
    const worksheet = workbook.worksheets[0];
    
    const a2 = worksheet.getCell('A2').value;
    const b2 = worksheet.getCell('B2').value;
    const c2 = worksheet.getCell('C2').value;
    const d2 = worksheet.getCell('D2').value;
    const e2 = worksheet.getCell('E2').value;
    const f2 = worksheet.getCell('F2').value;

   
    linkedin_username = a2.text;
    linkedin_password = b2;
    savedSearchId = c2;
    numOfPages = d2;
    textToAdd = e2;
    messageBodyForSales = f2;

    //return { a2, b2, c2, d2, e2 };

    console.log("From excel:");
    console.log(linkedin_username);
    console.log(linkedin_password);
    console.log(savedSearchId);
    console.log(numOfPages);
    console.log(textToAdd);
    console.log(messageBodyForSales);

}

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

    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes("login")||currentUrl.includes("challenge")) {
        console.log("Current URL contains 'login':", currentUrl);

        await driver.sleep(10000)

        try{
        const xpath = '//*[@aria-label="Email or Phone"]'; // XPath for the input element

        const inputElement = await driver.findElement(By.xpath(xpath));
        await inputElement.sendKeys(linkedin_username);


        const passwordXPath = '//*[@aria-label="Password"]'; // XPath for the password input element

        const passwordElement = await driver.findElement(By.xpath(passwordXPath));
        await passwordElement.sendKeys(linkedin_password);


        const signInButton = await driver.findElement(By.css('button[aria-label="Sign in"]'));
        await signInButton.click();


       
        }catch(e){
            // directly to challenge case
        }finally{
            await driver.sleep(20000)
        }

    }

    await driver.get("https://www.linkedin.com/sales?trk=d_flagship3_nav&");
    logger.info("CLICKED SAKES NAV");

    

    for(i=2;i<=numOfPages;i++){

        await driver.get(`${savedSearchId}&page=${i}`);

        
        await driver.sleep(10000);
        const parentOl = await driver.findElement(By.css('ol.artdeco-list'));

        const lis = await parentOl.findElements(By.css('li.artdeco-list__item'));
        for (let j=1;j<=25;j++) {
            if(j%2==0){
                console.log("SCROLL")
                await driver.executeScript(`window.scrollTo(0, ${j*500});`); 
            }

            await driver.sleep(8000);
            const searchResultsContainer = await driver.findElement(By.id('search-results-container'));

            // Scroll the search results container by 500 pixels vertically
            await driver.executeScript('arguments[0].scrollTop += 500;', searchResultsContainer);

                await driver.sleep(5000);
                console.log("NEW CONTAIN LOGO CHECK - EXIST");
                

                const listMessageBtn = `/html/body/main/div[1]/div[2]/div[2]/div/ol/li[${j}]/div/div/div[2]/div[2]/ul/li[2]/button`;
                const buttonElement = await driver.findElement(By.xpath(listMessageBtn));
                await buttonElement.click();


                const textToCheck = "Free"; 
                const creditsXpath= '//*[@id="message-overlay"]/section/div[2]/section/div[2]/div/span[2]';
                
                let containsFree = null;
                
                try{
                    containsFree = await checkSpanForText(driver, creditsXpath, textToCheck);
                }catch(e){
                    const closeButton = await driver.findElement(By.xpath('/html/body/div[8]/section/header/button[2]'));
                    await closeButton.click();
                    continue;
                }
                if (containsFree) {
                    
                    console.log("CONTAINS FREEE")
                    // Find the input element by its placeholder attribute

                    const placeholderText = "Subject (required)";
                    const subjectInput = await driver.findElement(By.css(`input[placeholder="${placeholderText}"]`));

                    await driver.sleep(8000)

                    // Calculate the midpoint index
                    const midpoint = Math.floor(textToAdd.length / 2);
                    
                    // Split the string into two halves
                    const firstHalfSubject = textToAdd.substring(0, midpoint);
                    const secondHalfSubject = textToAdd.substring(midpoint);

                    // Add "hi" to the subject input
                    await subjectInput.sendKeys(firstHalfSubject);

                    //Locate the textarea element using the name attribute
                    const textArea = await driver.findElement(By.name('message'));

                    await driver.sleep(5000)
                    // message body
                    await textArea.sendKeys(`Hi\n${messageBodyForSales}`);

                    await subjectInput.sendKeys(secondHalfSubject);

                    const SendbuttonXPath = '/html/body/div[8]/section/div[2]/section/div[2]/form[1]/section/span[2]/button';
                    const SendbuttonElement = await driver.findElement(By.xpath(SendbuttonXPath));
                    await SendbuttonElement.click();

                    // close


                    await driver.sleep(4000)
                        
                    const closeButton = await driver.findElement(By.xpath('/html/body/div[8]/section/header/button[2]'));
                    await closeButton.click();

                    
                    await driver.sleep(5000)

                } else {
                    // Perform a different action when the span does not contain 'free'
                    console.log("Credits required to perform, hence skipping")
                    const closeButton = await driver.findElement(By.xpath('/html/body/div[8]/section/header/button[2]'));
                    await closeButton.click();

                    await driver.sleep(5000)
                }
        }  
    }
}


// async function checkForLinkedPremLogo() {
//     await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
  
//     const elements = await driver.findElements(By.css('li-icon[type="linkedin-premium-gold-icon"][size="small"]'));

//     if (elements.length > 0) {
//         console.log("LinkedIn premium icon is present on the page.");
//         return true;
//     } else {
//         console.log("LinkedIn premium icon is not present on the page.");
//         return false;
//     }
// }

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
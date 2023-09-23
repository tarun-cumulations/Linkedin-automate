
let webdriver = require("selenium-webdriver");
require("chromedriver");

let driver = new webdriver.Builder()
	.forBrowser("chrome").build();

driver.get("https://in.linkedin.com/");

driver.executeScript("document.querySelector('#session_password').value = 'your_password_here';");


// Optionally, trigger a click (though it's not usually required for input fields)






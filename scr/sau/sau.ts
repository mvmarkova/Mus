import {protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor';

var xl = require('../utility/readExl.js');

describe('Екран за контакти - това е ТестСуит', () => {
  
   let PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/contactUs.xlsx');

  var contactUsBtn!: ElementFinder;
  var header!: ElementFinder;
  var email!: ElementFinder;
  var name!: ElementFinder;
  var subject: ElementFinder;
  var yourMessege: ElementFinder;
  var tel: ElementFinder;
  var sendBtn!: ElementFinder;
  var notValidEmail!: ElementFinder;
  var responseOutput!: ElementFinder;
    var username!: ElementFinder; 
    var password!: ElementFinder;
    var loginBtn!: ElementFinder;
    var notValidEmailAndPassword!: ElementFinder; 
    var lockedUser!: ElementFinder;
    var passwordRequired!: ElementFinder;
    var usernameRequired!: ElementFinder;


  contactUsBtn=element(by.xpath("//span[@data-alt='Contact us'][contains(.,'Contact us')]")); // локатор за бутон contactUs
  header=element(by.xpath("//h2[contains(.,'Contact Us')]")); // заглавие на прозореца за контакт
  email=element(by.xpath("//input[contains(@type,'email')]")); // полето за e-mail
  name=element(by.xpath("//input[contains(@name,'your-name')]")); //полето за име
  subject=element(by.xpath("//input[@id='cf-4']"));//полето за заглавие
  yourMessege=element(by.xpath("//textarea[contains(@name,'your-message')]")); //текстовотополе за твоето съобщение
  tel=element(by.xpath("//input[contains(@type,'tel')]")); // полето за телефонен номер
  sendBtn=element(by.xpath("//input[contains(@type,'submit')]")); // полето за бутон send
  notValidEmail=element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // локаторът за The e-mail address entered is invalid.
  responseOutput=element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // field for One or more fields have an error. Please check and try again.
  username=element(by.xpath("//input[contains(@type,'text')]")); // полето за Username 
  password=element(by.xpath("//input[contains(@type,'password')]")); // полето за password
  loginBtn =element(by.xpath("//input[contains(@type,'submit')]")); //полето за бутон login
  lockedUser=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Sorry, this user has been locked out.')]")); //заглавие за Epic sadface: Sorry, this user has been locked out.
  passwordRequired=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Password is required')]")); //заглавие за Epic sadface: Password is required
  usernameRequired=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Username is required')]")); // заглавие за Epic sadface: Username is required
  notValidEmailAndPassword=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Username and password do not match any user in this service')]")); // заглавие на съобщението за грешен Epic sadface: Username and password do not match any user in this service

  var EK = protractor.ExpectedConditions;
  var timeForWait: number=5000;

  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);   // за асинхронна работа
    await browser.get('https://www.saucedemo.com/');
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.DEBUG,
    } as logging.Entry));
  });

  it('Test 1 - попълване коректни данни; ', async () => {    
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('standardd_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!'); 
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( notValidEmailAndPassword ), timeForWait, 'Expected heading "' + notValidEmailAndPassword + '", but is not!');
    expect(await notValidEmailAndPassword.getText()).toEqual('Epic sadface: Username and password do not match any user in this service');
    
  })

  it('Test 1 - попълване коректни данни; ', async () => {  
    await  browser.sleep(5000);    
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('standard_user');
    await browser.sleep(5000);
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('');
    await browser.wait(EK.visibilityOf( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!');
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( passwordRequired ), timeForWait, 'Expected heading "' + passwordRequired + '", but is not!');
    expect(await passwordRequired.getText()).toContain('Epic sadface: Password is required');
    await browser.sleep(5000);
  })

  it('Test 1 - попълване коректни данни; ', async () => {    
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('');
    await browser.wait(EK.visibilityOf( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!');    
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( usernameRequired ), timeForWait, 'Expected heading "' + usernameRequired + '", but is not!');
    expect(await usernameRequired.getText()).toEqual('Epic sadface: Username is required');
  })
  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('standard_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.visibilityOf( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!');
    await loginBtn.click();
    expect(await browser.getCurrentUrl()).toEqual("https://www.saucedemo.com/inventory.html");
  })

  it('Test 1 - попълване коректни данни; ', async () => {      
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('locked_out_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.visibilityOf( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!'); 
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( lockedUser ), timeForWait, 'Expected heading"' + lockedUser + '", but is not!');
    expect(await lockedUser.getText()).toEqual('Epic sadface: Sorry, this user has been locked out.');
  })

  it('Test 1 - попълване коректни данни; ', async () => {     
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('problem_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('secret_sauce');   
    await browser.wait(EK.visibilityOf( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!');
    await loginBtn.click();
  })

  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'Expected username "' + username + '", but is not!');
    await username.sendKeys('performance_glitch_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'Expected password "' + password + '", but is not!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'Expected login "' + loginBtn + '", but is not!');
    await loginBtn.click();
  })
})

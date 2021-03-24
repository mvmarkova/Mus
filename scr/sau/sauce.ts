import {protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor';
//import { OfficePage } from '../po/officePage.po';    //  2. добавяне на Page клас на този spec


var xl = require('../utility/readExl.js');

describe('Екран за контакти - това е ТестСуит', () => {
    
  

   let PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/sau.xlsx');
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
  notValidEmail=element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // локаторът за невалидно съобщение
  responseOutput=element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // разделът за грешки в полетата

  username=element(by.xpath("//input[contains(@type,'text')]")); // полето за Username 
  password=element(by.xpath("//input[contains(@type,'password')]")); // полето за password
  loginBtn =element(by.xpath("//input[contains(@type,'submit')]")); //полето за бутон login
  lockedUser=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Sorry, this user has been locked out.')]")); //заглавие за locked user 
  passwordRequired=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Password is required')]")); //заглавие за password required 
  usernameRequired=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Username is required')]")); // заглавие за username required 
  notValidEmailAndPassword=element(by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Username and password do not match any user in this service')]")); // заглавие на съобщението за грешен username и password 

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

  PossitiveAndNegativeTest.forEach(function (data: any) {
    
  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys(data.username);
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys(data.password);
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!');
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( notValidEmailAndPassword ), timeForWait, 'На екрана се очакваше да има e-mail "' + notValidEmailAndPassword + '", но го няма!');
    expect(await notValidEmailAndPassword.getText()).toEqual(data.notValidEmailAndPassword);
  })
})
  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('standardd_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( notValidEmailAndPassword ), timeForWait, 'На екрана се очакваше да има e-mail "' + notValidEmailAndPassword + '", но го няма!');
    expect(await notValidEmailAndPassword.getText()).toEqual('Epic sadface: Username and password do not match any user in this service');
  
  })

  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('standard_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( passwordRequired ), timeForWait, 'На екрана се очакваше да има e-mail "' + passwordRequired + '", но го няма!');
    expect(await passwordRequired.getText()).toEqual('Epic sadface: Password is required');
  })

  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')  
    await loginBtn.click();
    await browser.wait(EK.visibilityOf( usernameRequired ), timeForWait, 'На екрана се очакваше да има e-mail "' + usernameRequired + '", но го няма!');
    expect(await usernameRequired.getText()).toEqual('Epic sadface: Username is required');
  })

  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('standard_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')
    await loginBtn.click();
    expect(await browser.getCurrentUrl()).toEqual("https://www.saucedemo.com/inventory.html");

  })

  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('locked_out_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('secret_sauce');   
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!');
    await loginBtn.click();
    expect(await lockedUser.getText()).toEqual('Epic sadface: Sorry, this user has been locked out.');
  }) 

  it('Test 1 - попълване коректни данни; ', async () => {  
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('problem_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!');
    await loginBtn.click();
    expect(await browser.getCurrentUrl()).toEqual("https://www.saucedemo.com/inventory.html");
  })

  it('Test 1 - попълване коректни данни; ', async () => { 
    await browser.wait(EK.visibilityOf( username ), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!');
    await username.sendKeys('performance_glitch_user');
    await browser.wait(EK.visibilityOf( password ), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!');
    await password.sendKeys('secret_sauce');
    await browser.wait(EK.elementToBeClickable( loginBtn ), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!');
    await loginBtn.click();
    expect(await browser.getCurrentUrl()).toEqual("https://www.saucedemo.com/inventory.html");
  })
})
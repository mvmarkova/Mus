/**
 * Test data from excel 
 */
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

  contactUsBtn=element(by.xpath("//span[@data-alt='Contact us'][contains(.,'Contact us')]")); // локатор за бутон contactUs
  header=element(by.xpath("//h2[contains(.,'Contact Us')]")); // заглавие на прозореца за контакт
  email=element(by.xpath("//input[contains(@type,'email')]")); // полето за e-mail
  name=element(by.xpath("//input[contains(@name,'your-name')]")); //полето за име
  subject=element(by.xpath("//input[@id='cf-4']"));//полето за заглавие
  yourMessege=element(by.xpath("//textarea[contains(@name,'your-message')]")); // field for your-message
  tel=element(by.xpath("//input[contains(@type,'tel')]")); // field for tel
  sendBtn=element(by.xpath("//input[contains(@type,'submit')]")); // locator for button submite
  notValidEmail=element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // locator for The e-mail address entered is invalid.
  responseOutput=element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // locator for message One or more fields have an error. Please check and try again.

  var EK = protractor.ExpectedConditions;

  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);   // за асинхронна работа
    await browser.get('https://www.musala.com/');
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.DEBUG,
    } as logging.Entry));
  });

  PossitiveAndNegativeTest.forEach(function (data: any) {

    it('Test 1 - попълване коректни данни; ', async () => {  
      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'Expected heading "' + header + '", but is not!');       // за време изаква да се появи заглавието. 
      expect(await header.getText()).toEqual(data.header); 
      await browser.wait(EK.visibilityOf( email ), 5000, 'Expected email "' + email + '", but is not!');
      await email.sendKeys(data.email);
      await  browser.sleep(5000);  
      await browser.wait(EK.visibilityOf( name ), 5000, 'Expected name "' + name + '", but is not!');
      await name.sendKeys(data.name);
      await browser.sleep(5000);
      await browser.wait(EK.visibilityOf( subject ), 5000, 'Expected subject"' + subject + '", but is not!');
      await subject.sendKeys(data.subject);
      await browser.wait(EK.visibilityOf( yourMessege ), 5000, 'Expected message "' + yourMessege + '", but is not!');
      await yourMessege.sendKeys(data.yourMessege);
      await browser.wait(EK.visibilityOf( tel ), 5000, 'Expected tel "' + tel + '", but is not!');
      await tel.sendKeys(data.tel);
      await sendBtn.click();
 await browser.wait(EK.visibilityOf(notValidEmail  ), 10000, 'Expected message "' + notValidEmail + '", but is not!');
      await  browser.sleep(5000);  
      var aa = await notValidEmail.getText();
      expect(aa).toContain(data.notValidEmailMess);
  })
})










    

    it('Test 1 - попълване коректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'Expected heading "' + header + '", but is not!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, ' Expected email  "' + email + '", but is not!');

      await email.sendKeys('e-mail.abv.bg');
      await  browser.sleep(5000);  

      await browser.wait(EK.visibilityOf( name ), 5000, ' Expected name "' + name + '", but is not!');

      await name.sendKeys('875649');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( subject ), 5000, 'Expected subject "' + subject + '", but is not!');

      await subject.sendKeys('////////////');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( yourMessege ), 5000, 'Expected your message "' + yourMessege + '", but is not!');

      await yourMessege.sendKeys('');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( tel ), 5000, 'Expected tel "' + tel + '", but is not!');

      await tel.sendKeys('676767');
      await browser.sleep(5000);

  




    })

    it('Test 1 - попълване коректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'Expected heading "' + header + '", but is not!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, 'Expected  e-mail "' + email + '", but is not!');

      await email.sendKeys('e-mail.abv.bg');

      await  browser.sleep(5000);  
      await sendBtn.click();

      await  browser.sleep(5000);  
      expect(await notValidEmail.getText()).toEqual('The e-mail address entered is invalid.')

    })

    it('Test 1 - попълване коректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'Expected heading "' + header + '", but is not!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, 'Expected email "' + email + '", but is not!');

      await email.sendKeys('e-mail.abv.bg');

      await  browser.sleep(5000);  
      await sendBtn.click();

      await  browser.sleep(5000);  
      expect(await notValidEmail.getText()).toEqual('The e-mail address entered is invalid.');

      await  browser.sleep(5000);  
      expect(await responseOutput.getText()).toEqual('One or more fields have an error. Please check and try again.');
    })




})

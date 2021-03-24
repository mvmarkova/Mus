import {protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor';
//import { OfficePage } from '../po/officePage.po';    //  2. добавяне на Page клас на този spec

describe('Екран за контакти - това е ТестСуит', () => {

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
  yourMessege=element(by.xpath("//textarea[contains(@name,'your-message')]")); //текстовотополе за твоето съобщение
  tel=element(by.xpath("//input[contains(@type,'tel')]")); // полето за телефонен номер
  sendBtn=element(by.xpath("//input[contains(@type,'submit')]")); // полето за бутон send
  notValidEmail=element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // локаторът за невалидно съобщение
  responseOutput=element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // разделът за грешки в полетата

  var EK = protractor.ExpectedConditions;


  // captcha не се попълва, за да не се изпраща реален e-mail



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



    it('Test 1 - попълване коректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!');

      await email.sendKeys('e-mail@abv.bg');
      await  browser.sleep(5000);  

      await browser.wait(EK.visibilityOf( name ), 5000, 'На екрана се очакваше да има име "' + name + '", но го няма!');

      await name.sendKeys('Иван Иванов');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( subject ), 5000, 'На екрана се очакваше да има предмет"' + subject + '", но го няма!');

      await subject.sendKeys('Тема');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( yourMessege ), 5000, 'На екрана се очакваше да има съобщение "' + yourMessege + '", но го няма!');

      await yourMessege.sendKeys('Здравей MusalaSoft');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( tel ), 5000, 'На екрана се очакваше да има телефон "' + tel + '", но го няма!');

      await tel.sendKeys('032676767');
      await browser.sleep(5000);


    })

    it('Test 1 - попълване некоректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!');

      await email.sendKeys('e-mail.abv.bg');
      await  browser.sleep(5000);  

      await browser.wait(EK.visibilityOf( name ), 5000, 'На екрана се очакваше да има име "' + name + '", но го няма!');

      await name.sendKeys('875649');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( subject ), 5000, 'На екрана се очакваше да има предмет"' + subject + '", но го няма!');

      await subject.sendKeys('////////////');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( yourMessege ), 5000, 'На екрана се очакваше да има съобщение "' + yourMessege + '", но го няма!');

      await yourMessege.sendKeys('');
      await browser.sleep(5000);

      await browser.wait(EK.visibilityOf( tel ), 5000, 'На екрана се очакваше да има телефон "' + tel + '", но го няма!');

      await tel.sendKeys('аааааа');
      await browser.sleep(5000);


    })

    it('Test 1 - попълване коректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!');

      await email.sendKeys('e-mail.abv.bg');

      await  browser.sleep(5000);  
      await sendBtn.click();

      await  browser.sleep(5000);  
      expect(await notValidEmail.getText()).toEqual('The e-mail address entered is invalid.')

    })

    it('Test 1 - попълване коректни данни; ', async () => {  

      await  browser.sleep(5000);    
      await contactUsBtn.click();
      await browser.wait(EK.visibilityOf( header ), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!');       // за време изаква да се появи заглавието.
      expect(await header.getText()).toEqual('CONTACT US'); 

      await browser.wait(EK.visibilityOf( email ), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!');

      await email.sendKeys('e-mail.abv.bg');

      await  browser.sleep(5000);  
      await sendBtn.click();

      await  browser.sleep(5000);  
      expect(await notValidEmail.getText()).toEqual('The e-mail address entered is invalid.');

      await  browser.sleep(5000);  
      expect(await responseOutput.getText()).toEqual('One or more fields have an error. Please check and try again.');
    })




  })
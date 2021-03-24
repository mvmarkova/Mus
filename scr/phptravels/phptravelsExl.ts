// Test data from Excel file. 
import { protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor';

var xl = require('../utility/readExl.js'); // Library for reading excel file 

describe('Екран за контакти - това е ТестСуит', () => {

    let PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/phptravels.xlsx'); // declaration sheet from excel file 
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
  var destination!: ElementFinder;
  var destinationValue!: ElementFinder;
  var adultsDownBtn!: ElementFinder;
  var adultsUpBtn!: ElementFinder;
  var childDownBtn!: ElementFinder;
  var childUpBtn!: ElementFinder;
  var searchBtn!: ElementFinder;
  var destinationHeader!: ElementFinder;
  var checkInHeader!: ElementFinder;
  var checkIn!: ElementFinder;
  var checkOut!: ElementFinder; 
  var noMatchesFound!: ElementFinder; 
  var destinationIns!: ElementFinder; 

  contactUsBtn = element(by.xpath("//span[@data-alt='Contact us'][contains(.,'Contact us')]")); // локатор за бутон contactUs
  header = element(by.xpath("//h2[contains(.,'Contact Us')]")); // заглавие на прозореца за контакт
  email = element(by.xpath("//input[contains(@type,'email')]")); // полето за e-mail
  name = element(by.xpath("//input[contains(@name,'your-name')]")); //полето за име
  subject = element(by.xpath("//input[@id='cf-4']"));//полето за заглавие
  yourMessege = element(by.xpath("//textarea[contains(@name,'your-message')]")); //текстовотополе за твоето съобщение
  tel = element(by.xpath("//input[contains(@type,'tel')]")); // полето за телефонен номер
  sendBtn = element(by.xpath("//input[contains(@type,'submit')]")); // полето за бутон send
  notValidEmail = element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // локаторът за невалидно съобщение
  responseOutput = element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // разделът за грешки в полетата
  destinationHeader = element(by.xpath("//label[@class='fr'][contains(.,'Destination')]")); // етикет  на дестинация
  checkInHeader = element(by.xpath("//label[@class='fr'][contains(.,'Check in')]")); // етикет на check in 
  checkIn = element(by.xpath("//input[@id='checkin']"));
  checkOut= element(by.xpath("//input[contains(@name,'checkout')]")); 
  destination = element(by.xpath("(//span[@class='select2-chosen'][contains(.,'Search by Hotel or City Name')])[1]")); // локатор за полето дестинация 
  destinationValue = element(by.xpath("//div[@class='select2-result-label'][contains(.,'Alzer Hotel Istanbul, Istanbul')]"));
  adultsDownBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[1]")); // бутон -
  adultsUpBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[1]")); // бутон +
  childDownBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[2]")); // бутон -
  childUpBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[2]")); // бутон + 
  searchBtn = element(by.xpath("(//button[@type='submit'][contains(.,'Search')])[1]")); // локаторът за search 
  noMatchesFound = element(by.xpath("//li[@class='select2-no-results'][contains(.,'No matches found')]")); // съобщение за ненамерени 
  destinationIns = element(by.xpath("(//input[contains(@type,'text')])[44]")); 

  var EK = protractor.ExpectedConditions;
  var timeForWait: number=5000;

  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);   // за асинхронна работа
    await browser.get('https://www.phptravels.net/home');
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.DEBUG,
    } as logging.Entry));
  });

  PossitiveAndNegativeTest.forEach(function (data: any) {   // forEach reading data sheet 
    it('Test 1 - Резервация на хотел с коректни данни; ', async () => {
        await browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
        expect(await destinationHeader.getText()).toEqual(data.destinationHeader);    //colon destinationHeader 
        await browser.wait(EK.elementToBeClickable(destination), timeForWait, 'Expected button to be clicked "' + destination + '", but is not!');
        await destination.click();
        await browser.wait(EK.visibilityOf(destinationValue), timeForWait, 'На екрана се очакваше да се разлисти списъка с хотели "' + destinationValue + '", но го няма!');
        await destinationValue.click();
        await browser.wait(EK.visibilityOf(checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + checkInHeader + '", но го няма!');       // за време изаква да се появи заглавието.
       expect(await checkInHeader.getText()).toEqual(data.checkInHeader); //colon ckeckInHeader 
        await browser.wait(EK.visibilityOf(checkIn), timeForWait, 'На екрана се очакваше да има име "' + checkIn + '", но го няма!');
      await checkIn.click();
       await checkIn.clear();
      await checkIn.sendKeys(data.checkIn); // colon checkIn 
       await browser.wait(EK.elementToBeClickable( checkOut ), timeForWait, 'На екрана се очакваше да има предмет"' + checkOut + '", но го няма!');
      await checkOut.click();
      await checkOut.clear();
        await checkOut.sendKeys(data.checkOut);  // colon CheckOut 
        await browser.wait(EK.elementToBeClickable( adultsDownBtn ), timeForWait, 'На екрана се очакваше да има предмет"' + adultsDownBtn + '", но го няма!');
        await adultsDownBtn.click(); 
        await browser.wait(EK.elementToBeClickable( adultsUpBtn ), timeForWait, 'На екрана се очакваше да има предм"' + adultsUpBtn + '", но го няма!');
        await adultsUpBtn.click();
        await browser.wait(EK.elementToBeClickable( childDownBtn ), timeForWait, 'На екрана се очакваше да има предмет"' + childDownBtn + '", но го няма!');
         await childDownBtn.click();
         await browser.wait(EK.elementToBeClickable( childUpBtn ), timeForWait, 'На екрана се очакваше да има предмет"' + childUpBtn + '", но го няма!');
        await childUpBtn.click();
        await browser.wait(EK.elementToBeClickable( searchBtn ), timeForWait, 'На екрана се очакваше да има предмет"' + searchBtn + '", но го няма!');
        await searchBtn.click();
    expect(await browser.getCurrentUrl()).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
      }) 

    it('Test 1 - Резервация на хотел с некоректни данни; ', async () => {
      await browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
      expect(await destinationHeader.getText()).toEqual(data.destinationHeader); // colon destinationHeader
      await browser.wait(EK.visibilityOf(destination), timeForWait, 'На екрана се очакваше да има e-mail "' + destination + '", но го няма!');
      await destination.click();
      await browser.wait(EK.visibilityOf(destinationIns), timeForWait, 'На екрана се очакваше да има e-mail "' + destinationIns + '", но го няма!');
      await destinationIns.sendKeys(data.destinationIns); //  colon destinationIns
      await browser.wait(EK.visibilityOf(noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + noMatchesFound + '", но го няма!');
      expect(await noMatchesFound.getText()).toEqual(data.noMatchesFound); //colon noMatchesFound
    })
  })

  it('Test 1 - Резервация на хотел с некоректни данни; ', async () => {
    await browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
    expect(await destinationHeader.getText()).toEqual('DESTINATION');
  await browser.wait(EK.visibilityOf(destination), timeForWait, 'На екрана се очакваше да има e-mail "' + destination + '", но го няма!');
    await destination.click();
    await destinationIns.sendKeys('Podiv');
    await browser.wait(EK.visibilityOf(noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + noMatchesFound + '", но го няма!');
    expect(await noMatchesFound.getText()).toEqual('No matches found');
  })

  it('Test 1 - Резервация на хотел с коректни данни; ', async () => {
    await browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
    expect(await destinationHeader.getText()).toEqual('DESTINATION');
    await browser.wait(EK.visibilityOf(destination), timeForWait, 'На екрана се очакваше да има e-mail "' + destination + '", но го няма!');
    await destination.click();
    await browser.wait(EK.visibilityOf(destinationValue), timeForWait, 'На екрана се очакваше да се разлисти списъка с хотели "' + destinationValue + '", но го няма!');
    await destinationValue.click();
    await browser.wait(EK.visibilityOf(checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + checkInHeader + '", но го няма!');       // за време изаква да се появи заглавието.
    expect(await checkInHeader.getText()).toEqual('CHECK IN');
    await browser.wait(EK.visibilityOf(checkIn), timeForWait, 'На екрана се очакваше да има име "' + checkIn + '", но го няма!');
    await checkIn.click();
    await checkIn.clear();
    await checkIn.sendKeys("22/05/2021");
    await browser.wait(EK.visibilityOf(checkOut), timeForWait, 'На екрана се очакваше да има предмет"' + checkOut + '", но го няма!');
    await checkOut.click();
    await checkOut.clear();
    await checkOut.sendKeys('06/06/2021');
    await browser.wait(EK.elementToBeClickable(adultsDownBtn), timeForWait, 'На екрана се очакваше да има предмет"' + adultsDownBtn + '", но го няма!');
    await adultsDownBtn.click();
    await browser.wait(EK.elementToBeClickable(adultsUpBtn), timeForWait, 'На екрана се очакваше да има предмет"' + adultsUpBtn + '", но го няма!');
    await adultsUpBtn.click();
    await browser.wait(EK.elementToBeClickable(childDownBtn), timeForWait, 'На екрана се очакваше да има предмет"' + childDownBtn + '", но го няма!');
    await childDownBtn.click();
    await browser.wait(EK.elementToBeClickable(childUpBtn), timeForWait, 'На екрана се очакваше да има предмет"' + childUpBtn + '", но го няма!');
    await childUpBtn.click();
    await browser.wait(EK.elementToBeClickable(searchBtn), timeForWait, 'На екрана се очакваше да има предмет"' + searchBtn + '", но го няма!');
    await searchBtn.click();
    expect(await browser.getCurrentUrl()).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
  })

})
// Test data from Excel file. 
import { protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor';
import { Page } from '../pom/page';    //  2. добавяне на Page клас на този spec

var xl = require('../utility/readExl.js'); // Library for reading excel file 

describe('Екран за контакти - това е ТестСуит', () => {

    let myPage:  Page;  // variable type Page 
    myPage = new Page(); // create new instance of class Page 



    let PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/phptravels.xlsx'); // declaration sheet from excel file 

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
          await browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
          expect(await myPage.destinationHeader.getText()).toEqual(data.destinationHeader);    //colon destinationHeader 
          await myPage.destinationDDL();
          await browser.wait(EK.visibilityOf(myPage.checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.checkInHeader + '", но го няма!');       // за време изаква да се появи заглавието.
          expect(await myPage.checkInHeader.getText()).toEqual(data.checkInHeader); //colon ckeckInHeader 
          await myPage.checkInTxt(data.checkIn); // colon checkIn 
          await myPage.checkInTxt(data.checkOut);  // colon CheckOut 
          await myPage.adultsDownBtnClick();
          await myPage.adultsUpBtnClick();
          await myPage.childDownBtnClick();
          await myPage.childUpBtnClick();
          await myPage.searchBtnClick();
          expect(await browser.getCurrentUrl()).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
      })

    it('Test 1 - Резервация на хотел с некоректни данни; ', async () => {
      await browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
      expect(await myPage.destinationHeader.getText()).toEqual(data.destinationHeader); // colon destinationHeader
      await browser.wait(EK.visibilityOf(myPage.destination), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.destination + '", но го няма!');
      await myPage.destination.click();
      await browser.wait(EK.visibilityOf(myPage.destinationIns), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.destinationIns + '", но го няма!');
      await myPage.destinationIns.sendKeys(data.destinationIns); //  colon destinationIns
      await browser.wait(EK.visibilityOf(myPage.noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.noMatchesFound + '", но го няма!');
      expect(await myPage.noMatchesFound.getText()).toEqual(data.noMatchesFound); //colon noMatchesFound
    })
  })

  it('Test 1 - Резервация на хотел с некоректни данни; ', async () => {
    await browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
    expect(await myPage.destinationHeader.getText()).toEqual('DESTINATION');
    await browser.wait(EK.visibilityOf(myPage.destination), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.destination + '", но го няма!');
    await myPage.destination.click();
    await myPage.destinationIns.sendKeys('Podiv');
    await browser.wait(EK.visibilityOf(myPage.noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.noMatchesFound + '", но го няма!');
    expect(await myPage.noMatchesFound.getText()).toEqual('No matches found');
  })

  it('Test 1 - Резервация на хотел с коректни данни; ', async () => {
    await browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!');       // за време изаква да се появи заглавието.
    expect(await myPage.destinationHeader.getText()).toEqual('DESTINATION');
    await myPage.destinationDDL();
    await browser.wait(EK.visibilityOf(myPage.checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.checkInHeader + '", но го няма!');       // за време изаква да се появи заглавието.
    expect(await myPage.checkInHeader.getText()).toEqual('CHECK IN');
    await myPage.checkInTxt("22/05/2021");
    await myPage.checkOutTxt('06/06/2021');
    await myPage.adultsDownBtnClick();
    await myPage.adultsUpBtnClick();
    await myPage.childDownBtnClick();
    await myPage.childUpBtnClick();
    await myPage.searchBtnClick();
    expect(await browser.getCurrentUrl()).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
  })
})
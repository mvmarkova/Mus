/**
 * Page Class contains locators and methods (Page Object Model(POM))
 */
import {protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor';


export class Page {
// 
  contactUsBtn!: ElementFinder;

  header!: ElementFinder;
  email!: ElementFinder;
   name!: ElementFinder;
  subject!: ElementFinder;
  yourMessege!: ElementFinder;
   tel!: ElementFinder;
  sendBtn!: ElementFinder;
  notValidEmail!: ElementFinder;
  responseOutput!: ElementFinder;
  destination!: ElementFinder;
  destinationValue!: ElementFinder;
  adultsDownBtn!: ElementFinder;
   adultsUpBtn!: ElementFinder;
    childDownBtn!: ElementFinder;
 childUpBtn!: ElementFinder;
  searchBtn!: ElementFinder;
 destinationHeader!: ElementFinder;
   checkInHeader!: ElementFinder;
   checkIn!: ElementFinder;
   checkOut!: ElementFinder; 
   noMatchesFound!: ElementFinder; 
  destinationIns!: ElementFinder; 

  EK = protractor.ExpectedConditions;
   timeForWait: number=5000;

//Contructors contains only locators. 

  constructor() {

   
    this.contactUsBtn = element(by.xpath("//span[@data-alt='Contact us'][contains(.,'Contact us')]")); // локатор за бутон contactUs
    this.header = element(by.xpath("//h2[contains(.,'Contact Us')]")); // заглавие на прозореца за контакт
    this.email = element(by.xpath("//input[contains(@type,'email')]")); // полето за e-mail
    this.name = element(by.xpath("//input[contains(@name,'your-name')]")); //полето за име
    this.subject = element(by.xpath("//input[@id='cf-4']"));//полето за заглавие
    this.yourMessege = element(by.xpath("//textarea[contains(@name,'your-message')]")); //текстовотополе за твоето съобщение
    this.tel = element(by.xpath("//input[contains(@type,'tel')]")); // полето за  tel
    this.sendBtn = element(by.xpath("//input[contains(@type,'submit')]")); // полето за бутон send
    this.notValidEmail = element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // локаторът за The e-mail address entered is invalid.
    this.responseOutput = element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // field for One or more fields have an error. Please check and try again.
    this.destinationHeader = element(by.xpath("//label[@class='fr'][contains(.,'Destination')]")); // етикет  на дестинация
    this.checkInHeader = element(by.xpath("//label[@class='fr'][contains(.,'Check in')]")); // етикет на check in 
    this.checkIn = element(by.xpath("//input[@id='checkin']"));
    this.checkOut= element(by.xpath("//input[contains(@name,'checkout')]")); 
    this.destination = element(by.xpath("(//span[@class='select2-chosen'][contains(.,'Search by Hotel or City Name')])[1]")); // локатор за полето дестинация 
    this.destinationValue = element(by.xpath("//div[@class='select2-result-label'][contains(.,'Alzer Hotel Istanbul, Istanbul')]"));
    this.adultsDownBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[1]")); // бутон -
    this.adultsUpBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[1]")); // бутон +
    this.childDownBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[2]")); // бутон -
    this.childUpBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[2]")); // бутон + 
    this.searchBtn = element(by.xpath("(//button[@type='submit'][contains(.,'Search')])[1]")); // локаторът за search 
    this.noMatchesFound = element(by.xpath("//li[@class='select2-no-results'][contains(.,'No matches found')]")); // съобщение за No matches found
    this.destinationIns = element(by.xpath("(//input[contains(@type,'text')])[44]")); 
  

   }


   async searchBtnClick(){    //  преизползваемост в различните тест случай  
        await browser.wait(this.EK.elementToBeClickable( this.searchBtn ), this.timeForWait, 'На екрана се очакваше да има предмет"' + this.searchBtn + '", но го няма!');
        await this.searchBtn.click();
   }

    async adultsDownBtnClick(){ 
        await browser.wait(this.EK.elementToBeClickable( this.adultsDownBtn ), this.timeForWait, 'На екрана се очакваше да има предмет"' + this.adultsDownBtn + '", но го няма!');
        await this.adultsDownBtn.click();
    }

    async adultsUpBtnClick(){
        await browser.wait(this.EK.elementToBeClickable( this.adultsUpBtn ), this.timeForWait, 'На екрана се очакваше да има предм"' + this.adultsUpBtn + '", но го няма!');
        await this.adultsUpBtn.click();
    }

    async childUpBtnClick(){
        await browser.wait(this.EK.elementToBeClickable( this.childUpBtn ), this.timeForWait, 'На екрана се очакваше да има предмет"' + this.childUpBtn + '", но го няма!');
        await this.childUpBtn.click();
    }

    async childDownBtnClick(){
        await browser.wait(this.EK.elementToBeClickable( this.childDownBtn ), this.timeForWait, 'На екрана се очакваше да има предмет"' + this.childDownBtn + '", но го няма!');
        await this.childDownBtn.click();
    }

    async checkInTxt(d: any) {  // метода се използва от няколко текстови полета 

        await browser.wait(this.EK.visibilityOf(this.checkIn), this.timeForWait, 'На екрана се очакваше да има име "' + this.checkIn + '", но го няма!');
    await this.checkIn.click();
    await this.checkIn.clear();
    await this.checkIn.sendKeys(d);
    }

    async checkOutTxt(d: any) { 
        await browser.wait(this.EK.visibilityOf(this.checkOut), this.timeForWait, 'На екрана се очакваше да има предмет"' + this.checkOut + '", но го няма!');
    await this.checkOut.click();
    await this.checkOut.clear();
    await this.checkOut.sendKeys(d);

    }

    async destinationDDL() {
       await browser.wait(this.EK.elementToBeClickable(this.destination), this.timeForWait, 'Expected button clicked "' + this.destination + '", but is not!');
    await this.destination.click();
    await browser.wait(this.EK.visibilityOf(this.destinationValue), this.timeForWait, 'На екрана се очакваше да се разлисти списъка с хотели "' + this.destinationValue + '", но го няма!');
    await this.destinationValue.click();
    }

}

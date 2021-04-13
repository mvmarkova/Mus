/**
 * this is not POM. All in the one specs.
 * 
 * 
 */



import { protractor, browser, by, element, Key, logging, ElementFinder, ExpectedConditions as EC, WebElement, ElementArrayFinder } from 'protractor'; // add library for protractor 

/**
 * every description is suit for many 'it' - test cases 
 */

describe('Test of https://www.phptravels.net/home', () => {

// declaration of variable that use for locators
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
  var hotelHeading!: ElementFinder; 
//locators from html pages
  contactUsBtn = element(by.xpath("//span[@data-alt='Contact us'][contains(.,'Contact us')]")); // локатор за бутон contactUs 
  header = element(by.xpath("//h2[contains(.,'Contact Us')]")); // заглавие на прозореца за контакт
  email = element(by.xpath("//input[contains(@type,'email')]")); // полето за e-mail
  name = element(by.xpath("//input[contains(@name,'your-name')]")); //полето за име
  subject = element(by.xpath("//input[@id='cf-4']"));   // field for subject
  yourMessege = element(by.xpath("//textarea[contains(@name,'your-message')]")); // field for your-message
  tel = element(by.xpath("//input[contains(@type,'tel')]")); // field for tel
  sendBtn = element(by.xpath("//input[contains(@type,'submit')]")); // locator for button send
  notValidEmail = element(by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // field for The e-mail address entered is invalid.
  responseOutput = element(by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // field for One or more fields have an error. Please check and try again.
  destinationHeader = element(by.xpath("//label[@class='fr'][contains(.,'Destination')]")); // field for destination
  checkInHeader = element(by.xpath("//label[@class='fr'][contains(.,'Check in')]")); // 
  checkIn = element(by.xpath("//input[@id='checkin']"));// field for check in 
  checkOut= element(by.xpath("//input[contains(@name,'checkout')]")); //field for check out
  destination = element(by.xpath("(//span[@class='select2-chosen'][contains(.,'Search by Hotel or City Name')])[1]")); // locator for Search by Hotel or City Name
  destinationValue = element(by.xpath("//div[@class='select2-result-label'][contains(.,'Alzer Hotel Istanbul, Istanbul')]")); // locator for Alzer Hotel Istanbul 
  adultsDownBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[1]")); // button -
  adultsUpBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[1]")); // button +
  childDownBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[2]")); // button -
  childUpBtn = element(by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[2]")); // button + 
  searchBtn = element(by.xpath("(//button[@type='submit'][contains(.,'Search')])[1]")); // locator for button search
  noMatchesFound = element(by.xpath("//li[@class='select2-no-results'][contains(.,'No matches found')]")); // locator for No matches found 
  destinationIns = element(by.xpath("(//input[contains(@type,'text')])[44]")); // locator for destination
  hotelHeading = element(by.xpath("//span[@class='text-primary'][contains(.,'alzer-hotel-istanbuls')]")); // locator for alzer-hotel-istanbuls

  var EK = protractor.ExpectedConditions; 
   var timeForWait: number=5000; // time for expected conditional 

/**
 * method will get executed before executing an it block
 */
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);   // за асинхронна работа
    await browser.get('https://www.phptravels.net/home');
  });

  /**
   * applicable for all the it blocks present in a describe block
   */
  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.DEBUG,
    } as logging.Entry));
  });


  /**
   *  every "it" is test case
   */

  it('Test 1 - Резервация на хотел с некоректни данни; ', async () => {    //async /await - use in test of ajax pages  

    await browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'Expected headings"' + destinationHeader + '", but is not!');     // wait  expected conditional for chech of new window
    expect(await destinationHeader.getText()).toEqual('DESTINATION');
    await browser.wait(EK.elementToBeClickable(destination), timeForWait, 'Expected button to be clicked "' + destination + '", but is not!');
    await destination.click();
    await destinationIns.sendKeys('Podiv');
    await browser.wait(EK.visibilityOf(noMatchesFound), timeForWait, 'Expected response output"' + noMatchesFound + '", but is not!');
    expect(await noMatchesFound.getText()).toEqual('No matches found');

  })


  it('Test 2 - Резервация на хотел с коректни данни; ', async () => {
    await browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'Expected headings "' + destinationHeader + '", but is not!');       // за време изаква да се появи заглавието.
    expect(await destinationHeader.getText()).toEqual('DESTINATION');
    await browser.wait(EK.elementToBeClickable(destination), timeForWait, 'Expected button to be clicked "' + destination + '", but is not!');
    await destination.click();
    await browser.wait(EK.visibilityOf(destinationValue), timeForWait, 'Expected option to be clicked "' + destinationValue + '", but is not!');
    await destinationValue.click();
    await browser.wait(EK.elementToBeClickable(checkInHeader), timeForWait, 'Expected heading "' + checkInHeader + '", but is not!');       // за време изаква да се появи заглавието.
    expect(await checkInHeader.getText()).toEqual('CHECK IN');
    await browser.wait(EK.visibilityOf(checkIn), timeForWait, 'Expected check in date "' + checkIn + '", but in not!');
    await checkIn.click();
    await checkIn.clear();
    await checkIn.sendKeys("22/05/2021");
    await browser.sleep(5000);
    await browser.wait(EK.visibilityOf(checkOut), timeForWait, 'Expected check out date"' + checkOut + '", but is not!');
    await checkOut.click();
    await checkOut.clear();
    await checkOut.sendKeys('06/06/2021');
    await browser.wait(EK.elementToBeClickable(adultsDownBtn), timeForWait, 'Expected button to be clicked "' + adultsDownBtn + '", but is not!');
    await adultsDownBtn.click();
    await browser.wait(EK.elementToBeClickable(adultsUpBtn), timeForWait, 'Expected button to be clicked "' + adultsUpBtn + '", but is not!');
    await adultsUpBtn.click();
    await browser.wait(EK.elementToBeClickable(childDownBtn), timeForWait, 'Expected button to be clicked "' + childDownBtn + '", but is not!');
    await childDownBtn.click();
    await browser.wait(EK.elementToBeClickable(childUpBtn), timeForWait, ' Expected button to be clicked "' + childUpBtn + '", but is not!');
    await childUpBtn.click();
    await browser.wait(EK.elementToBeClickable(searchBtn), timeForWait, 'Expected button to be clicked"' + searchBtn + '", but is not!');
    await searchBtn.click();
    expect(await browser.getCurrentUrl()).toContain('phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/');
  })

})

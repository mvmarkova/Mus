"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// Test data from Excel file. 
var protractor_1 = require("protractor");
var xl = require('../utility/readExl.js'); // Library for reading excel file 
describe('Екран за контакти - това е ТестСуит', function () {
    var PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/phptravels.xlsx'); // declaration sheet from excel file 
    var contactUsBtn;
    var header;
    var email;
    var name;
    var subject;
    var yourMessege;
    var tel;
    var sendBtn;
    var notValidEmail;
    var responseOutput;
    var destination;
    var destinationValue;
    var adultsDownBtn;
    var adultsUpBtn;
    var childDownBtn;
    var childUpBtn;
    var searchBtn;
    var destinationHeader;
    var checkInHeader;
    var checkIn;
    var checkOut;
    var noMatchesFound;
    var destinationIns;
    contactUsBtn = protractor_1.element(protractor_1.by.xpath("//span[@data-alt='Contact us'][contains(.,'Contact us')]")); // локатор за бутон contactUs
    header = protractor_1.element(protractor_1.by.xpath("//h2[contains(.,'Contact Us')]")); // заглавие на прозореца за контакт
    email = protractor_1.element(protractor_1.by.xpath("//input[contains(@type,'email')]")); // полето за e-mail
    name = protractor_1.element(protractor_1.by.xpath("//input[contains(@name,'your-name')]")); //полето за име
    subject = protractor_1.element(protractor_1.by.xpath("//input[@id='cf-4']")); //полето за заглавие
    yourMessege = protractor_1.element(protractor_1.by.xpath("//textarea[contains(@name,'your-message')]")); //текстовотополе за твоето съобщение
    tel = protractor_1.element(protractor_1.by.xpath("//input[contains(@type,'tel')]")); // полето за телефонен номер
    sendBtn = protractor_1.element(protractor_1.by.xpath("//input[contains(@type,'submit')]")); // полето за бутон send
    notValidEmail = protractor_1.element(protractor_1.by.xpath("//span[@class='wpcf7-not-valid-tip'][contains(.,'The e-mail address entered is invalid.')]")); // локаторът за невалидно съобщение
    responseOutput = protractor_1.element(protractor_1.by.xpath("//div[@class='wpcf7-response-output'][contains(.,'One or more fields have an error. Please check and try again.')]")); // разделът за грешки в полетата
    destinationHeader = protractor_1.element(protractor_1.by.xpath("//label[@class='fr'][contains(.,'Destination')]")); // етикет  на дестинация
    checkInHeader = protractor_1.element(protractor_1.by.xpath("//label[@class='fr'][contains(.,'Check in')]")); // етикет на check in 
    checkIn = protractor_1.element(protractor_1.by.xpath("//input[@id='checkin']"));
    checkOut = protractor_1.element(protractor_1.by.xpath("//input[contains(@name,'checkout')]"));
    destination = protractor_1.element(protractor_1.by.xpath("(//span[@class='select2-chosen'][contains(.,'Search by Hotel or City Name')])[1]")); // локатор за полето дестинация 
    destinationValue = protractor_1.element(protractor_1.by.xpath("//div[@class='select2-result-label'][contains(.,'Alzer Hotel Istanbul, Istanbul')]"));
    adultsDownBtn = protractor_1.element(protractor_1.by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[1]")); // бутон -
    adultsUpBtn = protractor_1.element(protractor_1.by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[1]")); // бутон +
    childDownBtn = protractor_1.element(protractor_1.by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-down '][contains(.,'-')])[2]")); // бутон -
    childUpBtn = protractor_1.element(protractor_1.by.xpath("(//button[@class='btn btn-white bootstrap-touchspin-up '][contains(.,'+')])[2]")); // бутон + 
    searchBtn = protractor_1.element(protractor_1.by.xpath("(//button[@type='submit'][contains(.,'Search')])[1]")); // локаторът за search 
    noMatchesFound = protractor_1.element(protractor_1.by.xpath("//li[@class='select2-no-results'][contains(.,'No matches found')]")); // съобщение за ненамерени 
    destinationIns = protractor_1.element(protractor_1.by.xpath("(//input[contains(@type,'text')])[44]"));
    var EK = protractor_1.protractor.ExpectedConditions;
    var timeForWait = 5000;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.waitForAngularEnabled(false)];
                case 1:
                    _a.sent(); // за асинхронна работа
                    return [4 /*yield*/, protractor_1.browser.get('https://www.phptravels.net/home')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var logs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.manage().logs().get(protractor_1.logging.Type.BROWSER)];
                case 1:
                    logs = _a.sent();
                    expect(logs).not.toContain(jasmine.objectContaining({
                        level: protractor_1.logging.Level.DEBUG,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    PossitiveAndNegativeTest.forEach(function (data) {
        var _this = this;
        it('Test 1 - Резервация на хотел с коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!')];
                    case 1:
                        _d.sent(); // за време изаква да се появи заглавието.
                        _a = expect;
                        return [4 /*yield*/, destinationHeader.getText()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toEqual(data.destinationHeader); //colon destinationHeader 
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(destination), timeForWait, 'Expected button to be clicked "' + destination + '", but is not!')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, destination.click()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationValue), timeForWait, 'На екрана се очакваше да се разлисти списъка с хотели "' + destinationValue + '", но го няма!')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, destinationValue.click()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + checkInHeader + '", но го няма!')];
                    case 7:
                        _d.sent(); // за време изаква да се появи заглавието.
                        _b = expect;
                        return [4 /*yield*/, checkInHeader.getText()];
                    case 8:
                        _b.apply(void 0, [_d.sent()]).toEqual(data.checkInHeader); //colon ckeckInHeader 
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(checkIn), timeForWait, 'На екрана се очакваше да има име "' + checkIn + '", но го няма!')];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, checkIn.click()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, checkIn.clear()];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, checkIn.sendKeys(data.checkIn)];
                    case 12:
                        _d.sent(); // colon checkIn 
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(checkOut), timeForWait, 'На екрана се очакваше да има предмет"' + checkOut + '", но го няма!')];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, checkOut.click()];
                    case 14:
                        _d.sent();
                        return [4 /*yield*/, checkOut.clear()];
                    case 15:
                        _d.sent();
                        return [4 /*yield*/, checkOut.sendKeys(data.checkOut)];
                    case 16:
                        _d.sent(); // colon CheckOut 
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(adultsDownBtn), timeForWait, 'На екрана се очакваше да има предмет"' + adultsDownBtn + '", но го няма!')];
                    case 17:
                        _d.sent();
                        return [4 /*yield*/, adultsDownBtn.click()];
                    case 18:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(adultsUpBtn), timeForWait, 'На екрана се очакваше да има предм"' + adultsUpBtn + '", но го няма!')];
                    case 19:
                        _d.sent();
                        return [4 /*yield*/, adultsUpBtn.click()];
                    case 20:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(childDownBtn), timeForWait, 'На екрана се очакваше да има предмет"' + childDownBtn + '", но го няма!')];
                    case 21:
                        _d.sent();
                        return [4 /*yield*/, childDownBtn.click()];
                    case 22:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(childUpBtn), timeForWait, 'На екрана се очакваше да има предмет"' + childUpBtn + '", но го няма!')];
                    case 23:
                        _d.sent();
                        return [4 /*yield*/, childUpBtn.click()];
                    case 24:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(searchBtn), timeForWait, 'На екрана се очакваше да има предмет"' + searchBtn + '", но го няма!')];
                    case 25:
                        _d.sent();
                        return [4 /*yield*/, searchBtn.click()];
                    case 26:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 27:
                        _c.apply(void 0, [_d.sent()]).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Test 1 - Резервация на хотел с некоректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!')];
                    case 1:
                        _c.sent(); // за време изаква да се появи заглавието.
                        _a = expect;
                        return [4 /*yield*/, destinationHeader.getText()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(data.destinationHeader); // colon destinationHeader
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destination), timeForWait, 'На екрана се очакваше да има e-mail "' + destination + '", но го няма!')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, destination.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationIns), timeForWait, 'На екрана се очакваше да има e-mail "' + destinationIns + '", но го няма!')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, destinationIns.sendKeys(data.destinationIns)];
                    case 6:
                        _c.sent(); //  colon destinationIns
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + noMatchesFound + '", но го няма!')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, noMatchesFound.getText()];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toEqual(data.noMatchesFound); //colon noMatchesFound
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Test 1 - Резервация на хотел с некоректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!')];
                case 1:
                    _c.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, destinationHeader.getText()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual('DESTINATION');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destination), timeForWait, 'На екрана се очакваше да има e-mail "' + destination + '", но го няма!')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, destination.click()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, destinationIns.sendKeys('Podiv')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + noMatchesFound + '", но го няма!')];
                case 6:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, noMatchesFound.getText()];
                case 7:
                    _b.apply(void 0, [_c.sent()]).toEqual('No matches found');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - Резервация на хотел с коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + destinationHeader + '", но го няма!')];
                case 1:
                    _d.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, destinationHeader.getText()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toEqual('DESTINATION');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destination), timeForWait, 'На екрана се очакваше да има e-mail "' + destination + '", но го няма!')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, destination.click()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(destinationValue), timeForWait, 'На екрана се очакваше да се разлисти списъка с хотели "' + destinationValue + '", но го няма!')];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, destinationValue.click()];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + checkInHeader + '", но го няма!')];
                case 7:
                    _d.sent(); // за време изаква да се появи заглавието.
                    _b = expect;
                    return [4 /*yield*/, checkInHeader.getText()];
                case 8:
                    _b.apply(void 0, [_d.sent()]).toEqual('CHECK IN');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(checkIn), timeForWait, 'На екрана се очакваше да има име "' + checkIn + '", но го няма!')];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, checkIn.click()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, checkIn.clear()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, checkIn.sendKeys("22/05/2021")];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(checkOut), timeForWait, 'На екрана се очакваше да има предмет"' + checkOut + '", но го няма!')];
                case 13:
                    _d.sent();
                    return [4 /*yield*/, checkOut.click()];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, checkOut.clear()];
                case 15:
                    _d.sent();
                    return [4 /*yield*/, checkOut.sendKeys('06/06/2021')];
                case 16:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(adultsDownBtn), timeForWait, 'На екрана се очакваше да има предмет"' + adultsDownBtn + '", но го няма!')];
                case 17:
                    _d.sent();
                    return [4 /*yield*/, adultsDownBtn.click()];
                case 18:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(adultsUpBtn), timeForWait, 'На екрана се очакваше да има предмет"' + adultsUpBtn + '", но го няма!')];
                case 19:
                    _d.sent();
                    return [4 /*yield*/, adultsUpBtn.click()];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(childDownBtn), timeForWait, 'На екрана се очакваше да има предмет"' + childDownBtn + '", но го няма!')];
                case 21:
                    _d.sent();
                    return [4 /*yield*/, childDownBtn.click()];
                case 22:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(childUpBtn), timeForWait, 'На екрана се очакваше да има предмет"' + childUpBtn + '", но го няма!')];
                case 23:
                    _d.sent();
                    return [4 /*yield*/, childUpBtn.click()];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(searchBtn), timeForWait, 'На екрана се очакваше да има предмет"' + searchBtn + '", но го няма!')];
                case 25:
                    _d.sent();
                    return [4 /*yield*/, searchBtn.click()];
                case 26:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 27:
                    _c.apply(void 0, [_d.sent()]).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
                    return [2 /*return*/];
            }
        });
    }); });
});

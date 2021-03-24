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
var protractor_1 = require("protractor");
//import { OfficePage } from '../po/officePage.po';    //  2. добавяне на Page клас на този spec
describe('Екран за контакти - това е ТестСуит', function () {
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
    var EK = protractor_1.protractor.ExpectedConditions;
    // captcha не се попълва, за да не се изпраща реален e-mail
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.waitForAngularEnabled(false)];
                case 1:
                    _a.sent(); // за асинхронна работа
                    return [4 /*yield*/, protractor_1.browser.get('https://www.musala.com/')];
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
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contactUsBtn.click()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(header), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!')];
                case 3:
                    _b.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, header.getText()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toEqual('CONTACT US');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(email), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, email.sendKeys('e-mail@abv.bg')];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(name), 5000, 'На екрана се очакваше да има име "' + name + '", но го няма!')];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, name.sendKeys('Иван Иванов')];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(subject), 5000, 'На екрана се очакваше да има предмет"' + subject + '", но го няма!')];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, subject.sendKeys('Тема')];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(yourMessege), 5000, 'На екрана се очакваше да има съобщение "' + yourMessege + '", но го няма!')];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, yourMessege.sendKeys('Здравей MusalaSoft')];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(tel), 5000, 'На екрана се очакваше да има телефон "' + tel + '", но го няма!')];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, tel.sendKeys('032676767')];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 19:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване некоректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contactUsBtn.click()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(header), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!')];
                case 3:
                    _b.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, header.getText()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toEqual('CONTACT US');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(email), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, email.sendKeys('e-mail.abv.bg')];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(name), 5000, 'На екрана се очакваше да има име "' + name + '", но го няма!')];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, name.sendKeys('875649')];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(subject), 5000, 'На екрана се очакваше да има предмет"' + subject + '", но го няма!')];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, subject.sendKeys('////////////')];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(yourMessege), 5000, 'На екрана се очакваше да има съобщение "' + yourMessege + '", но го няма!')];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, yourMessege.sendKeys('')];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(tel), 5000, 'На екрана се очакваше да има телефон "' + tel + '", но го няма!')];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, tel.sendKeys('аааааа')];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 19:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, contactUsBtn.click()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(header), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!')];
                case 3:
                    _c.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, header.getText()];
                case 4:
                    _a.apply(void 0, [_c.sent()]).toEqual('CONTACT US');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(email), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, email.sendKeys('e-mail.abv.bg')];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, sendBtn.click()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 9:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, notValidEmail.getText()];
                case 10:
                    _b.apply(void 0, [_c.sent()]).toEqual('The e-mail address entered is invalid.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, contactUsBtn.click()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(header), 5000, 'На екрана се очакваше да има Заглавие "' + header + '", но го няма!')];
                case 3:
                    _d.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, header.getText()];
                case 4:
                    _a.apply(void 0, [_d.sent()]).toEqual('CONTACT US');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(email), 5000, 'На екрана се очакваше да има e-mail "' + email + '", но го няма!')];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, email.sendKeys('e-mail.abv.bg')];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, sendBtn.click()];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 9:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, notValidEmail.getText()];
                case 10:
                    _b.apply(void 0, [_d.sent()]).toEqual('The e-mail address entered is invalid.');
                    return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                case 11:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, responseOutput.getText()];
                case 12:
                    _c.apply(void 0, [_d.sent()]).toEqual('One or more fields have an error. Please check and try again.');
                    return [2 /*return*/];
            }
        });
    }); });
});

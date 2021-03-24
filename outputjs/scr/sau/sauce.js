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
var xl = require('../utility/readExl.js');
describe('Екран за контакти - това е ТестСуит', function () {
    var PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/sau.xlsx');
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
    var username;
    var password;
    var loginBtn;
    var notValidEmailAndPassword;
    var lockedUser;
    var passwordRequired;
    var usernameRequired;
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
    username = protractor_1.element(protractor_1.by.xpath("//input[contains(@type,'text')]")); // полето за Username 
    password = protractor_1.element(protractor_1.by.xpath("//input[contains(@type,'password')]")); // полето за password
    loginBtn = protractor_1.element(protractor_1.by.xpath("//input[contains(@type,'submit')]")); //полето за бутон login
    lockedUser = protractor_1.element(protractor_1.by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Sorry, this user has been locked out.')]")); //заглавие за locked user 
    passwordRequired = protractor_1.element(protractor_1.by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Password is required')]")); //заглавие за password required 
    usernameRequired = protractor_1.element(protractor_1.by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Username is required')]")); // заглавие за username required 
    notValidEmailAndPassword = protractor_1.element(protractor_1.by.xpath("//h3[@data-test='error'][contains(.,'Epic sadface: Username and password do not match any user in this service')]")); // заглавие на съобщението за грешен username и password 
    var EK = protractor_1.protractor.ExpectedConditions;
    var timeForWait = 5000;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.waitForAngularEnabled(false)];
                case 1:
                    _a.sent(); // за асинхронна работа
                    return [4 /*yield*/, protractor_1.browser.get('https://www.saucedemo.com/')];
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
        it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, username.sendKeys(data.username)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, password.sendKeys(data.password)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginBtn.click()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(notValidEmailAndPassword), timeForWait, 'На екрана се очакваше да има e-mail "' + notValidEmailAndPassword + '", но го няма!')];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, notValidEmailAndPassword.getText()];
                    case 8:
                        _a.apply(void 0, [_b.sent()]).toEqual(data.notValidEmailAndPassword);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('standardd_user')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('secret_sauce')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(notValidEmailAndPassword), timeForWait, 'На екрана се очакваше да има e-mail "' + notValidEmailAndPassword + '", но го няма!')];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, notValidEmailAndPassword.getText()];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toEqual('Epic sadface: Username and password do not match any user in this service');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('standard_user')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(passwordRequired), timeForWait, 'На екрана се очакваше да има e-mail "' + passwordRequired + '", но го няма!')];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, passwordRequired.getText()];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toEqual('Epic sadface: Password is required');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(usernameRequired), timeForWait, 'На екрана се очакваше да има e-mail "' + usernameRequired + '", но го няма!')];
                case 7:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, usernameRequired.getText()];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toEqual('Epic sadface: Username is required');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('standard_user')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('secret_sauce')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toEqual("https://www.saucedemo.com/inventory.html");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('locked_out_user')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('secret_sauce')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, lockedUser.getText()];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toEqual('Epic sadface: Sorry, this user has been locked out.');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('problem_user')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('secret_sauce')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toEqual("https://www.saucedemo.com/inventory.html");
                    return [2 /*return*/];
            }
        });
    }); });
    it('Test 1 - попълване коректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(username), timeForWait, 'На екрана се очакваше да има e-mail "' + username + '", но го няма!')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, username.sendKeys('performance_glitch_user')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(password), timeForWait, 'На екрана се очакваше да има e-mail "' + password + '", но го няма!')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, password.sendKeys('secret_sauce')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.elementToBeClickable(loginBtn), timeForWait, 'На екрана се очакваше да има e-mail "' + loginBtn + '", но го няма!')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginBtn.click()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toEqual("https://www.saucedemo.com/inventory.html");
                    return [2 /*return*/];
            }
        });
    }); });
});

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
var page_1 = require("../pom/page"); //  2. добавяне на Page клас на този spec
var xl = require('../utility/readExl.js'); // Library for reading excel file 
describe('Екран за контакти - това е ТестСуит', function () {
    var myPage; // variable type Page 
    myPage = new page_1.Page(); // create new instance of class Page 
    var PossitiveAndNegativeTest = xl.readFromExcel('PossitiveAndNegativeTest', './dataFiles/phptravels.xlsx'); // declaration sheet from excel file 
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
                    case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!')];
                    case 1:
                        _d.sent(); // за време изаква да се появи заглавието.
                        _a = expect;
                        return [4 /*yield*/, myPage.destinationHeader.getText()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).toEqual(data.destinationHeader); //colon destinationHeader 
                        return [4 /*yield*/, myPage.destinationDDL()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.checkInHeader + '", но го няма!')];
                    case 4:
                        _d.sent(); // за време изаква да се появи заглавието.
                        _b = expect;
                        return [4 /*yield*/, myPage.checkInHeader.getText()];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toEqual(data.checkInHeader); //colon ckeckInHeader 
                        return [4 /*yield*/, myPage.checkInTxt(data.checkIn)];
                    case 6:
                        _d.sent(); // colon checkIn 
                        return [4 /*yield*/, myPage.checkInTxt(data.checkOut)];
                    case 7:
                        _d.sent(); // colon CheckOut 
                        return [4 /*yield*/, myPage.adultsDownBtnClick()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, myPage.adultsUpBtnClick()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, myPage.childDownBtnClick()];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, myPage.childUpBtnClick()];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, myPage.searchBtnClick()];
                    case 12:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                    case 13:
                        _c.apply(void 0, [_d.sent()]).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Test 1 - Резервация на хотел с некоректни данни; ', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!')];
                    case 1:
                        _c.sent(); // за време изаква да се появи заглавието.
                        _a = expect;
                        return [4 /*yield*/, myPage.destinationHeader.getText()];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).toEqual(data.destinationHeader); // colon destinationHeader
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destination), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.destination + '", но го няма!')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, myPage.destination.click()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destinationIns), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.destinationIns + '", но го няма!')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, myPage.destinationIns.sendKeys(data.destinationIns)];
                    case 6:
                        _c.sent(); //  colon destinationIns
                        return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.noMatchesFound + '", но го няма!')];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, myPage.noMatchesFound.getText()];
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
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!')];
                case 1:
                    _c.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, myPage.destinationHeader.getText()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual('DESTINATION');
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destination), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.destination + '", но го няма!')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, myPage.destination.click()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, myPage.destinationIns.sendKeys('Podiv')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.noMatchesFound), timeForWait, 'На екрана се очакваше да има e-mail "' + myPage.noMatchesFound + '", но го няма!')];
                case 6:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, myPage.noMatchesFound.getText()];
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
                case 0: return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.destinationHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.destinationHeader + '", но го няма!')];
                case 1:
                    _d.sent(); // за време изаква да се появи заглавието.
                    _a = expect;
                    return [4 /*yield*/, myPage.destinationHeader.getText()];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toEqual('DESTINATION');
                    return [4 /*yield*/, myPage.destinationDDL()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, protractor_1.browser.wait(EK.visibilityOf(myPage.checkInHeader), timeForWait, 'На екрана се очакваше да има Заглавие "' + myPage.checkInHeader + '", но го няма!')];
                case 4:
                    _d.sent(); // за време изаква да се появи заглавието.
                    _b = expect;
                    return [4 /*yield*/, myPage.checkInHeader.getText()];
                case 5:
                    _b.apply(void 0, [_d.sent()]).toEqual('CHECK IN');
                    return [4 /*yield*/, myPage.checkInTxt("22/05/2021")];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, myPage.checkOutTxt('06/06/2021')];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, myPage.adultsDownBtnClick()];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, myPage.adultsUpBtnClick()];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, myPage.childDownBtnClick()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, myPage.childUpBtnClick()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, myPage.searchBtnClick()];
                case 12:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 13:
                    _c.apply(void 0, [_d.sent()]).toContain("phptravels.net/hotels/detail/istanbul/alzer-hotel-istanbuls/");
                    return [2 /*return*/];
            }
        });
    }); });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XLSX = require('xlsx');
var xlReader = /** @class */ (function () {
    function xlReader() {
    }
    xlReader.prototype.readFromExcel = function (sheetName, filePath) {
        var workbook = XLSX.readFile(filePath);
        var worksheet = workbook.Sheets[sheetName];
        //console.log(XLSX.utils.sheet_to_json(worksheet));
        return XLSX.utils.sheet_to_json(worksheet);
    };
    return xlReader;
}());
exports.xlReader = xlReader;
module.exports = new xlReader();

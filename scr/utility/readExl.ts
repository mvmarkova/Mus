var XLSX = require('xlsx');

export class xlReader {

    readFromExcel(sheetName: string | number, filePath: any){

        var workbook = XLSX.readFile(filePath);
        var worksheet = workbook.Sheets[sheetName];

        //console.log(XLSX.utils.sheet_to_json(worksheet));
        return XLSX.utils.sheet_to_json(worksheet);
    }


}
module.exports = new xlReader();
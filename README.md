Предпоставки 

За стартирането на тази програма се използват 

•	node.js. Може да го изтеглите от https://nodejs.org/en/. 
•	Jasmint.  Трябва да имате инсталиран https://jasmine.github.io/pages/getting_started.html.
•	Typescript Може да свалите от https://www.typescriptlang.org/download.
•	Protractor. Настройките може да видите на https://www.protractortest.org/#/.
•	WebDriverManager. За Protractor https://www.protractortest.org/#/.
•	Windows. 
 Проекта тества приложения. 
Структурата на проекта: 
Структурата на проекта е node_modules, datefiles, outputjs, report, scr, conf.ts, package-lock.json, package.json, tsconfig.json. 
Node_modules – съдържа библиотеки, които сме свалили. 
PhpTravels – съдържа тест случай за URL: https://www.phptravels.net .
1.	Phptravels.ts – Примера е за локатори и тест случай в един файл. 
2.	PhptravelsExl.ts – Примера е за локатори и тест случай в един файл. Данните са от excel файл в папка “datafiles”. 
3.	PhpTavelsNet – ПРимера е за локатори и тест случай в един файл. 
Pom: Папката е пример за Page Object Model. 
1.	Page.ts -   Page клас- съдържа локатори и методи. Методите са преизползвани в всеки IT. Методът checkInTxt() може да се използва в различни текстови полета. 
2.	Specs.ts - Тестови случай, които използват локатори и методи от Page клас. 
3.	SpecsExl.ts - Test cases use locators and methods from Page class. The example is for locator and test cases in one file. Test data in from excel file. Тест случай, които използват локатори и методи от Page class. Примера е за локатор и тест случай в един файл. Данните са от excel файл в папка „datafiles”. 
Sau:  Съдържа тест случай за URL: https://www.saucedemo.com/ .
1.	Sau – Примера е за локатори и тест случай в един файл. 
2.	Sauce – Примера съдържа локатори и тест случай в един файл. Данните са от excel файл. Ексел файл в папка „datafiles”. 
Specs: Съдържа тест случай за URL: https://www.musala.com/ . 
1.	contentUsExl –  Примера е за тест случай и локатори в един файл. Данните са от excel файл. Excel файл в папка „datafiles”. 
2.	Office.specs.ts - Примера е за тест случай и локатори в един файл. 
utility :  
1.	readExl –  Чете данни от excel файл. 
Report: Приложението използва protractor-beautiful-reporter за формиране на HTML репорт.
Conf.ts – Configuration file for tests. Конфигурационен файл за тестове. 
Package.json – Dependencies for the project. Зависимости за проекта.
Tsconfig.json – Typescript конфигурация. 

Prerequisites 
To run this program you need to have:
•	node.js. You can download node.js from https://nodejs.org/en/. 
•	Jasmine. You have to install jasmine https://jasmine.github.io/pages/getting_started.html.
•	Typescript. Download Typescript https://www.typescriptlang.org/download. 
•	Protractor. Set up Protractor https://www.protractortest.org/#/. 
•	WebDriver-Manager.  For Protractor https://www.protractortest.org/#/.
•	Windows. You need to have windows to run this program. 
This project is testing applications. 
Application  structure:
The project structure is node_modules, datafiles, outputjs, report, scr which contains phptravels, POM(Page Object Module), sau, specs, utility. 
Node_modules –folder contains libraries which we download. 
Phptravels- folder contentains test cases for URL: https://www.phptravels.net  
1.	phptravels.ts – The example is for locator and test cases in one file. 
2.	phptravelsExl, - The example is for locator and test cases in one file. Test data is from excel file. Excel file in “datafiles” folder. 
3.	phptravelsnet. - The example is for locator and test cases in one file.
Pom: Folder is example for Page Object Model. 
1.	Page.ts – Page class- contains locators and methods. Methods are reused in every ITs. The method checkInTxt() can be used in different text box.  
2.	Specs.ts – Test cases use locators and methods from Page class. 
3.	SpecsExl.ts - Test cases use locators and methods from Page class. The example is for locator and test cases in one file. Test data in from excel file.
Sau: Folder contains test cases for URL: https://www.saucedemo.com/ . 
1.	Sau – The example is for test cases and locators in one file.  
2.	Sauce - The example is for test cases and locators in one file. Test data is from excel file. Excel file in “datafiles” folder. 
Specs: Folder contains test cases for URL: https://www.musala.com 
1.	contentUsExl – The example is for test cases and locators in one file. Test data is from excel file. Excel file in “datafiles” folder. 
2.	Office.specs.ts – The Example is for test cases and locators in one file. 
utility :  
1.	readExl – Reading data from excel file.  
Report: Application use protractor-beautiful-reporter for format HTML report. 
Conf.ts – Configuration file for tests.
Package.json – Dependencies for the project. 
Tsconfig.json – Typescript configuration.


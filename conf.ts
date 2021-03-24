import { Config, browser } from "protractor"
var HtmlReporter = require('protractor-beautiful-reporter');

export let config: Config = {
    framework: "jasmine",

    // directConnect: true, - с true не се използва selenium server, работи по-бързо
    // с true настройките на seleniumAddress и seleniumServerJar се игнорират; 
    // с true работи само с chrome и firefox, с друг браузър дава грешка 


    seleniumAdress: 'http://localhost:4444/wd/hub',


    allScriptsTimeout: 10000,  // толкова milis ще чака да получи отговор, след това, ако не е получил отговор - fail

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 100000,   // всеки it може да се изпълнява толкова milis, след това фалира
        // Sets the amount of time to wait for an asynchronous script to finish execution before throwing an error:
       // allScriptsTimeout: 8000,  // толкова milis ще чака да получи отговор, след това, ако не е получил отговор - fail
        // print: function() {}
    },

  
    specs: [
        './scr/pom/specs.js',
        './scr/specs/office.specs.js',
        './scr/phptravels/phptravels.js',
        './scr/phpTravels/phptravelsExl.js',
        './scr/sau/sau.js',
        './scr/sau/sauce.js',
         './scr/specs/contactUsExl.specs.ts.js',
       './scr/pom/specsExl.js'
    ],
   // за chrome  
    capabilities: {
        browserName: 'chrome',
        platform: 'ANY',
        version: 'ANY',
        chromeOptions: {
            args: ["--start-maximized"],
            prefs: {
                download: {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': process.cwd() + '\\download'
                }
            }
        }

    },
    // за firefox
    // capabilities: {
    //     browserName: 'firefox',
    //    "acceptInsecureCerts": true,
    
  //  }
    
  //  },
    //Protractor-beautifull-report
    // onPrepare: function () { 

    //     // Add a screenshot reporter and store screenshots to `/tmp/screenshots`:
    //     jasmine.getEnv().addReporter(new HtmlReporter({
    //         baseDirectory: 'report/screenshots'
    //         , preserveDirectory: false   // за да изтрива папката в началото, т.е. да не се добавят резултати към преден репорт
    //         , docName: 'TestReport.html'  // име на файл за репорт, по подразбиране е report.html
    //         , docTitle: 'Test Automation Report'

    //     }).getJasmine2Reporter());
    //     var reporter = new HtmlReporter({
    //         baseDirectory: 'report/screenshots'
    //     });

    //     //========= 
    //     afterEach(function () {
       
    //         browser.waitForAngularEnabled(true);

    //         browser.switchTo().defaultContent();

    //         browser.manage().deleteAllCookies();
    //         browser.executeScript('window.sessionStorage.clear(); window.localStorage.clear();').then(
    //             undefined,
    //             function (err) {
    //             });
    //         browser.manage().timeouts().implicitlyWait(5000); 
    //     })

    // }
    onPrepare: async ()=>{

  
        jasmine.getEnv().addReporter(new HtmlReporter({   // Add a screenshot reporter and store screenshots to /tmp/screenshots:
            baseDirectory: 'report/screenshots'
            , preserveDirectory: true   // за да изтрива папката в началото, т.е. да не се добавят резултати към преден репорт
            , docName: 'report.html'  // име на файл за репорт, по подразбиране е report.html
            , docTitle: 'Test Automation reports'

        }).getJasmine2Reporter());
        var reporter = new HtmlReporter({
            baseDirectory: 'report/screenshots'
        });

        await browser.waitForAngularEnabled(false);
        await browser.manage().window().maximize();
        await browser.manage().timeouts().implicitlyWait(5000);

        afterEach(async function () {
            await browser.switchTo().defaultContent();

            await browser.manage().deleteAllCookies();


            await browser.manage().timeouts().implicitlyWait(5000); // I even rewrite implicit wait back to default value, in case i touched it in tests


        })
} 
}
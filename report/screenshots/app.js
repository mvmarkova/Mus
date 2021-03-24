var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "cbfb35b40bf986951bddbf27103f5c8a",
        "instanceId": 1528,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d2006f-0013-0056-0090-00c1005f007d.png",
        "timestamp": 1616513175531,
        "duration": 41277
    },
    {
        "description": "Test 1 - попълване некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "cbfb35b40bf986951bddbf27103f5c8a",
        "instanceId": 1528,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00650094-00d8-0019-0067-000200e900b9.png",
        "timestamp": 1616513217267,
        "duration": 32461
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "cbfb35b40bf986951bddbf27103f5c8a",
        "instanceId": 1528,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009900d3-007f-005d-00b0-0040000800ab.png",
        "timestamp": 1616513250172,
        "duration": 17555
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "cbfb35b40bf986951bddbf27103f5c8a",
        "instanceId": 1528,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dc008b-001c-0013-00ea-00b500de0075.png",
        "timestamp": 1616513268141,
        "duration": 21934
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00950027-00e4-0080-001c-004f0011001b.png",
        "timestamp": 1616590791091,
        "duration": 34592
    },
    {
        "description": "Test 1 - попълване некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003c00f8-0013-000b-001b-00d500190013.png",
        "timestamp": 1616590827056,
        "duration": 34459
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d80002-0053-0042-0063-00e7001400f9.png",
        "timestamp": 1616590862058,
        "duration": 17729
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0057006f-00d5-004c-00ee-0048006f00a5.png",
        "timestamp": 1616590880161,
        "duration": 22372
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008a0047-00d6-00e6-003c-00c300e800b7.png",
        "timestamp": 1616590902896,
        "duration": 7444
    },
    {
        "description": "Test 2 - Резервация на хотел с коректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006800f8-005c-000f-0028-0089005b00aa.png",
        "timestamp": 1616590911162,
        "duration": 12921
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b60031-0088-00a7-00f6-007e00330090.png",
        "timestamp": 1616590924561,
        "duration": 7300
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f90044-0017-00d6-00ab-005900cf00dc.png",
        "timestamp": 1616590932308,
        "duration": 5045
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ac00f6-0090-0003-003c-000c00d7001c.png",
        "timestamp": 1616590938172,
        "duration": 4605
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001900c6-002a-0089-006f-00c500bd00fc.png",
        "timestamp": 1616590943580,
        "duration": 6940
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004400d9-0087-002b-00d9-007d005200bc.png",
        "timestamp": 1616590950960,
        "duration": 1067
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00990019-0050-009b-00b2-00d700b90072.png",
        "timestamp": 1616590952375,
        "duration": 15797
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009e0022-00af-0000-00d9-008d00880026.png",
        "timestamp": 1616590968514,
        "duration": 634
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00750021-00ef-005e-00a0-006900650075.png",
        "timestamp": 1616590969508,
        "duration": 589
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004100ab-001d-001b-00db-005200ca009a.png",
        "timestamp": 1616590970624,
        "duration": 662
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009f00e3-006b-000d-00f5-00ed008f007f.png",
        "timestamp": 1616590971627,
        "duration": 530
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006c006c-00f6-00dd-00ac-006700df00de.png",
        "timestamp": 1616590972587,
        "duration": 5613
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0009001a-00ca-004e-000d-009a004c0032.png",
        "timestamp": 1616590978663,
        "duration": 668
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ae00b4-004e-0011-0060-00b20080004c.png",
        "timestamp": 1616590979762,
        "duration": 642
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e10079-008a-0070-0054-00330068001a.png",
        "timestamp": 1616590980753,
        "duration": 650
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003300d3-00fc-0085-0062-00d400810059.png",
        "timestamp": 1616590981737,
        "duration": 585
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00510082-00f8-008c-009d-004a00130023.png",
        "timestamp": 1616590982656,
        "duration": 561
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001b00cd-0003-0062-006a-002500ce0027.png",
        "timestamp": 1616590983729,
        "duration": 576
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": false,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": [
            "Expected 'https://www.saucedemo.com/inventory.html' to equal 'saucedemo.com/inventory.html'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Object.<anonymous> (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:327:51)\n    at step (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:32:23)\n    at Object.next (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:13:53)\n    at fulfilled (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:4:58)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:93:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f90065-00a5-00f3-00bb-00e4008300ba.png",
        "timestamp": 1616590984650,
        "duration": 550
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": false,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": [
            "Expected 'https://www.saucedemo.com/inventory.html' to equal 'saucedemo.com/inventory.html'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Object.<anonymous> (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:357:51)\n    at step (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:32:23)\n    at Object.next (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:13:53)\n    at fulfilled (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:4:58)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:93:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "00190003-00d4-0074-00c0-00c4008a0054.png",
        "timestamp": 1616590985620,
        "duration": 5612
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007a005c-0058-00c3-0044-00fb00630021.png",
        "timestamp": 1616590991680,
        "duration": 7646
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bb00fc-0029-002e-00fa-008400d7007e.png",
        "timestamp": 1616590999785,
        "duration": 6706
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005c0080-0031-00cc-002d-0026001e001f.png",
        "timestamp": 1616591007303,
        "duration": 4437
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005600ec-0022-00ad-00e0-00a000280091.png",
        "timestamp": 1616591012512,
        "duration": 7822
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e200ab-0001-00c1-0062-00cb008100d5.png",
        "timestamp": 1616591020797,
        "duration": 7370
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003e0036-002b-0051-00dc-008600840019.png",
        "timestamp": 1616591028620,
        "duration": 4455
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008600dd-0058-00e7-00de-004200e8005a.png",
        "timestamp": 1616591033870,
        "duration": 4533
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "18df9940760a489a4fe40f8203943437",
        "instanceId": 21324,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004900dc-006b-0056-00b5-006200e000b5.png",
        "timestamp": 1616591039184,
        "duration": 6817
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0015002a-002b-0038-00d8-0001006d00e9.png",
        "timestamp": 1616591129955,
        "duration": 10578
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fa000d-0042-0065-00ee-0027005f00ec.png",
        "timestamp": 1616591141045,
        "duration": 3945
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e90044-0058-00f9-00d1-006b006b00b7.png",
        "timestamp": 1616591145816,
        "duration": 4052
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007300c7-00dc-00a5-0050-0018009700bc.png",
        "timestamp": 1616591150672,
        "duration": 8322
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008500ef-001c-0084-008e-008e00f50003.png",
        "timestamp": 1616591159473,
        "duration": 35303
    },
    {
        "description": "Test 1 - попълване некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002600f2-009f-00d3-0016-002200280035.png",
        "timestamp": 1616591195376,
        "duration": 32394
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fe00c5-00b3-0086-000b-003900a70000.png",
        "timestamp": 1616591228180,
        "duration": 16839
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00040028-0037-00db-009a-0064004b001e.png",
        "timestamp": 1616591245407,
        "duration": 21878
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ca00fa-00c5-005e-0061-0074009f00be.png",
        "timestamp": 1616591267655,
        "duration": 4475
    },
    {
        "description": "Test 2 - Резервация на хотел с коректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b100d0-0041-0007-0083-001d001600b6.png",
        "timestamp": 1616591272945,
        "duration": 12969
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004000bb-0038-0070-00eb-007d008c00d7.png",
        "timestamp": 1616591286382,
        "duration": 7489
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003b001f-0028-0063-001d-00860036002d.png",
        "timestamp": 1616591294301,
        "duration": 4083
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005e002d-0041-00b3-0063-006600dd0005.png",
        "timestamp": 1616591299139,
        "duration": 4164
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00be0012-0008-00c4-0095-008c00410021.png",
        "timestamp": 1616591304088,
        "duration": 6762
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a2004d-0028-005f-0059-00d5004e000c.png",
        "timestamp": 1616591311308,
        "duration": 1068
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e800e1-00dc-0015-002b-0031003e0030.png",
        "timestamp": 1616591312728,
        "duration": 15874
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d3002f-0059-0094-0089-00c500320086.png",
        "timestamp": 1616591328956,
        "duration": 577
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": false,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": [
            "Expected 'https://www.saucedemo.com/inventory.html' to equal 'saucedemo.com/inventory.html'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Object.<anonymous> (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sau.js:239:51)\n    at step (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sau.js:32:23)\n    at Object.next (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sau.js:13:53)\n    at fulfilled (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sau.js:4:58)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:93:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "008f00cc-0026-0096-00db-00c8002700c2.png",
        "timestamp": 1616591329875,
        "duration": 585
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0001009c-0068-00be-006c-007b000f0088.png",
        "timestamp": 1616591330979,
        "duration": 647
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a6008f-00b6-0072-003a-00e7006400cf.png",
        "timestamp": 1616591332007,
        "duration": 508
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dd0082-00e5-00a9-0029-0065001900e4.png",
        "timestamp": 1616591332943,
        "duration": 5692
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006f000a-000b-00be-00e7-000500b5001d.png",
        "timestamp": 1616591339079,
        "duration": 623
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002b00c1-00de-00fc-004e-004100b30074.png",
        "timestamp": 1616591340053,
        "duration": 636
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004a0061-00bd-00b7-00f5-002300170045.png",
        "timestamp": 1616591341040,
        "duration": 648
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c80091-006e-0062-0029-005d0071007a.png",
        "timestamp": 1616591342043,
        "duration": 616
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": false,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": [
            "Expected 'https://www.saucedemo.com/inventory.html' to equal 'saucedemo.com/inventory.html'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Object.<anonymous> (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:267:51)\n    at step (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:32:23)\n    at Object.next (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:13:53)\n    at fulfilled (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:4:58)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:93:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "003f008b-00be-00cb-0021-005e00e00000.png",
        "timestamp": 1616591343012,
        "duration": 613
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bd0020-00a5-009b-0037-001300b3009f.png",
        "timestamp": 1616591344097,
        "duration": 561
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": false,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": [
            "Expected 'https://www.saucedemo.com/inventory.html' to equal 'saucedemo.com/inventory.html'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Object.<anonymous> (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:327:51)\n    at step (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:32:23)\n    at Object.next (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:13:53)\n    at fulfilled (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:4:58)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:93:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "007300b8-00ef-0090-0019-0043004b00dd.png",
        "timestamp": 1616591345025,
        "duration": 543
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": false,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": [
            "Expected 'https://www.saucedemo.com/inventory.html' to equal 'saucedemo.com/inventory.html'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Object.<anonymous> (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:357:51)\n    at step (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:32:23)\n    at Object.next (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:13:53)\n    at fulfilled (D:\\AT\\myProject\\Ultproject\\Ult\\outputjs\\scr\\sau\\sauce.js:4:58)\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:93:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "00c5006e-00bc-0098-00d6-000900cb007a.png",
        "timestamp": 1616591345985,
        "duration": 5592
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d800d7-0073-00d5-00fc-0025003e0013.png",
        "timestamp": 1616591352046,
        "duration": 7765
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005800e4-007a-0009-0049-000d008a0004.png",
        "timestamp": 1616591360245,
        "duration": 5226
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007800b5-00e5-0038-0032-003800dd00ce.png",
        "timestamp": 1616591366398,
        "duration": 4744
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "164db05bde74d142149d70775fbb9442",
        "instanceId": 20232,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fa0000-0079-0040-0065-006900c60083.png",
        "timestamp": 1616591371918,
        "duration": 8005
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ae007b-00b0-0069-00c9-006c002a0010.png",
        "timestamp": 1616591498450,
        "duration": 11536
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0022006d-00e1-0058-002b-0057006e003d.png",
        "timestamp": 1616591510470,
        "duration": 5684
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fb00a4-00ae-00d1-00d6-00f0003a007b.png",
        "timestamp": 1616591516998,
        "duration": 6097
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00190056-007d-002e-007f-0001007c0015.png",
        "timestamp": 1616591523955,
        "duration": 7887
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007a0084-00e4-00b1-00d6-008d00660096.png",
        "timestamp": 1616591532291,
        "duration": 33158
    },
    {
        "description": "Test 1 - попълване некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a0007e-000d-0015-0069-000500e300ed.png",
        "timestamp": 1616591565907,
        "duration": 32457
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002e0071-008c-00a6-009f-004e007a000c.png",
        "timestamp": 1616591598815,
        "duration": 17012
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006e007e-001f-00b9-00fc-008600b6003c.png",
        "timestamp": 1616591616234,
        "duration": 23249
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00100098-00a7-0053-007e-001b006e008f.png",
        "timestamp": 1616591639868,
        "duration": 4977
    },
    {
        "description": "Test 2 - Резервация на хотел с коректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009f005b-006e-003b-0041-00e10085003e.png",
        "timestamp": 1616591645660,
        "duration": 12682
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00cd00fe-0000-00fc-0081-00a200cf00f1.png",
        "timestamp": 1616591658816,
        "duration": 7710
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f9006a-0033-00f5-00b5-00ba009d0022.png",
        "timestamp": 1616591666981,
        "duration": 5055
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0073004e-005b-0015-00d1-00290055005f.png",
        "timestamp": 1616591672965,
        "duration": 4562
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00160052-00da-00fd-0030-00fd00ad00d3.png",
        "timestamp": 1616591678338,
        "duration": 8758
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0062004f-0072-0083-00cc-0098006e0042.png",
        "timestamp": 1616591687557,
        "duration": 902
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008300a7-00f4-00d2-0068-003800c30068.png",
        "timestamp": 1616591688830,
        "duration": 15787
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002e00a2-0086-008c-00d9-00360079002c.png",
        "timestamp": 1616591704967,
        "duration": 615
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ec0001-00aa-0015-00a6-00b800d40032.png",
        "timestamp": 1616591705964,
        "duration": 621
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d600f5-00a7-0014-000f-00b100b000b9.png",
        "timestamp": 1616591707071,
        "duration": 640
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00cb00a7-00b8-000d-0048-001c00c00063.png",
        "timestamp": 1616591708060,
        "duration": 646
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b7009d-00b7-00ff-0082-000d002400b1.png",
        "timestamp": 1616591709146,
        "duration": 5628
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00120044-0057-00a5-00c3-0058002f00de.png",
        "timestamp": 1616591715244,
        "duration": 584
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003f00df-0036-00b5-0094-000c00ce0048.png",
        "timestamp": 1616591716194,
        "duration": 625
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009300ca-007c-002a-0069-008e00f500c5.png",
        "timestamp": 1616591717161,
        "duration": 651
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000d00a3-002c-00b0-006e-006700c2008e.png",
        "timestamp": 1616591718181,
        "duration": 595
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ea0058-008b-0095-005c-0029004a00c7.png",
        "timestamp": 1616591719145,
        "duration": 601
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00130021-00dd-00d2-00d8-00a00062003e.png",
        "timestamp": 1616591720217,
        "duration": 573
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008100fe-0068-0088-0078-00ea005c0005.png",
        "timestamp": 1616591721116,
        "duration": 549
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00430060-00be-00cd-007a-008c00e8001f.png",
        "timestamp": 1616591722094,
        "duration": 5603
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00300057-0099-006a-0022-009800c400a8.png",
        "timestamp": 1616591728140,
        "duration": 7859
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bd0056-0088-008b-00a5-004600f60070.png",
        "timestamp": 1616591736447,
        "duration": 4904
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008b00d6-00df-00ba-0028-00f300070000.png",
        "timestamp": 1616591742163,
        "duration": 4849
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "611c590a53ce4c570e12ab503f3f81b5",
        "instanceId": 16960,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001f00fa-0070-007c-00a0-001500ed008c.png",
        "timestamp": 1616591747813,
        "duration": 6889
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001d00fa-0003-008a-00c1-0063008b00d4.png",
        "timestamp": 1616591840316,
        "duration": 16403
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002e00e9-00ff-005c-00bb-004300f70043.png",
        "timestamp": 1616591857620,
        "duration": 5831
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fa00c5-0035-000c-00ae-00e700b800b3.png",
        "timestamp": 1616591864284,
        "duration": 5093
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c500be-00fd-00a9-00da-003300f400f0.png",
        "timestamp": 1616591870197,
        "duration": 7310
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00de00b0-0064-00e8-0045-009e00e0002d.png",
        "timestamp": 1616591877970,
        "duration": 33368
    },
    {
        "description": "Test 1 - попълване некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00650094-00e6-0024-009a-000b0086002a.png",
        "timestamp": 1616591911749,
        "duration": 32405
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ff00b8-0052-0021-0050-002200e40031.png",
        "timestamp": 1616591944634,
        "duration": 16838
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00350056-00da-00f8-0049-00f000b60079.png",
        "timestamp": 1616591961862,
        "duration": 21789
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00210086-0080-006b-00b5-006300fa00cc.png",
        "timestamp": 1616591984026,
        "duration": 4862
    },
    {
        "description": "Test 2 - Резервация на хотел с коректни данни; |Test of https://www.phptravels.net/home",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f800b7-0066-00d2-007d-008a00ea00b3.png",
        "timestamp": 1616591989739,
        "duration": 12524
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001b001e-001e-00a5-0072-00ab004d0067.png",
        "timestamp": 1616592002746,
        "duration": 7768
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001f0028-0071-0081-009f-00a5007600e5.png",
        "timestamp": 1616592010971,
        "duration": 5644
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0052004e-0084-0054-00c2-001e001200d3.png",
        "timestamp": 1616592017421,
        "duration": 5570
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00740071-003a-0076-00ed-00f800fd000c.png",
        "timestamp": 1616592023798,
        "duration": 7918
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0064004d-00e9-001b-0052-002900840036.png",
        "timestamp": 1616592032169,
        "duration": 1314
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007f0002-0027-0066-00d1-00f1003300d0.png",
        "timestamp": 1616592033836,
        "duration": 15887
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b10089-008f-004a-008a-0037001200a4.png",
        "timestamp": 1616592050084,
        "duration": 577
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00830033-009a-00d1-008c-0043006f0044.png",
        "timestamp": 1616592051026,
        "duration": 556
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c7004e-003c-0054-00b3-000f000200a7.png",
        "timestamp": 1616592052000,
        "duration": 600
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f900e1-0016-002a-006e-004500c300cd.png",
        "timestamp": 1616592052938,
        "duration": 514
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007f001e-0034-00c2-00bf-006600740081.png",
        "timestamp": 1616592053867,
        "duration": 5634
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d00007-007f-00de-00cf-00e20024004a.png",
        "timestamp": 1616592059956,
        "duration": 638
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a500ff-0044-0009-00a1-002000dc0046.png",
        "timestamp": 1616592060952,
        "duration": 634
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f1000c-0025-001c-00f0-0075007e005b.png",
        "timestamp": 1616592061936,
        "duration": 653
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e900fb-00dd-002c-00a7-0018005100b1.png",
        "timestamp": 1616592062937,
        "duration": 629
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0048003d-00cb-0018-0087-0061005d0051.png",
        "timestamp": 1616592063906,
        "duration": 565
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004a00f6-00e5-0073-005d-00d3009f00d7.png",
        "timestamp": 1616592064937,
        "duration": 577
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00590071-00d1-0058-00e1-002c000e0078.png",
        "timestamp": 1616592065862,
        "duration": 523
    },
    {
        "description": "Test 1 - попълване коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006f0026-00c2-0028-007a-00ac00df0045.png",
        "timestamp": 1616592066790,
        "duration": 5607
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f900fb-00ee-00e2-00bd-009c0060006c.png",
        "timestamp": 1616592072900,
        "duration": 8319
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00db002f-0002-003c-0020-00e7001f0055.png",
        "timestamp": 1616592081663,
        "duration": 4666
    },
    {
        "description": "Test 1 - Резервация на хотел с некоректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d400ae-0035-005d-0073-00b2009e002d.png",
        "timestamp": 1616592087143,
        "duration": 4655
    },
    {
        "description": "Test 1 - Резервация на хотел с коректни данни; |Екран за контакти - това е ТестСуит",
        "passed": true,
        "pending": false,
        "os": "windows",
        "sessionId": "f2c31b19cd03f0dcab28b58d6ee3b8cc",
        "instanceId": 20516,
        "browser": {
            "name": "chrome",
            "version": "89.0.4389.90"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fd00e4-00fc-0095-00b0-006200a900fa.png",
        "timestamp": 1616592092595,
        "duration": 7147
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });

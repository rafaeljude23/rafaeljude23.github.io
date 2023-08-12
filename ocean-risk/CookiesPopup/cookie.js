// DATA PREPARATION PROCESS STARTS HERE

let cookiePopup = "cookie-notice-" + siteID

// Step 1: Get all cookies
function getCookies() {
    let cookies = {};

    if (document.cookie)
        document.cookie.split(";").forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            cookies[name] = value;
        });

    cookies["cookie-notice-popup"] = "true"; // add a popup notice popup

    return cookies;
}

// Step 2: Parse cookies
function parseCookies() {
    const cookies = getCookies();
    const parsedCookies = [];
    for (const [name, value] of Object.entries(cookies)) {
        const [cookieValue, ...options] = value.split("; ");
        const cookie = {
            name,
            value: cookieValue,
        };
        options.forEach((option) => {
            const [key, val] = option.split("=");
            cookie[key] = val;
        });
        parsedCookies.push(cookie);
    }
    return parsedCookies;
}

// Step 3: Classify cookies
function classifyCookies() {
    const cookies = parseCookies();
    const classifiedCookies = {
        necessary: [],
        statistics: [],
        marketing: [],
        preferences: [],
        unclassified: [],
    };
    const regex = {
        necessary: /^cookie-notice-[^=]+$/,
        statistics: /^(ga|_ga|_gid|_gat_|__utma|__utmb|__utmc|__utmz)$/,
        marketing: /^(fbp|_fbp|fr|_fr|tr|_tr|tawkUUID|tawkUUID|tawkConnectionTime|_uetsid|_uetvid|_cc_cc|_cc_aud|_cc_dc)$/,
        preferences: /^(language_|currency_|timezone_|theme_|product_category_|consent_cookie)$/,
    };
    cookies.forEach((cookie) => {
        const { name } = cookie;
        let matched = false;
        Object.keys(regex).forEach((category) => {
            if (name.match(regex[category])) {
                classifiedCookies[category].push(cookie);
                matched = true;
            }
        });
        if (!matched) {
            classifiedCookies.unclassified.push(cookie);
        }
    });
    return classifiedCookies;
}

// Cookies Classification
const classifiedNecessary = classifyCookies().necessary;
const classifiedStatistics = classifyCookies().statistics;
const classifiedMarketing = classifyCookies().marketing;
const classifiedPreferences = classifyCookies().preferences;
const classifiedUnclassified = classifyCookies().unclassified;

function addPair(str, cookie, value) {
    // Create a regular expression to match the pair we want to add
    const pairRegex = new RegExp(`--\\*,${cookie},${value}`);

    // Create a regular expression to match any existing pairs with the same cookie
    const existingPairsRegex = new RegExp(`--\\*,${cookie},[^\\-]*`, "g");

    // If the pair we want to add already exists, we don't need to do anything
    if (pairRegex.test(str)) {
        return str;
    }

    // Otherwise, remove any existing pairs with the same cookie
    const newStr = str.replace(existingPairsRegex, "");

    // Add the new pair to the end of the string
    return `${newStr},--*,${cookie},${value}`;
}


let statisticsLS = "statisticsCookiesLS" + siteID
let marketingLS = "marketingCookiesLS" + siteID
let preferencesLS = "preferencesCookiesLS" + siteID
let unclassifiedLS = "unclassifiedCookiesLS" + siteID

// Set a LocalStorage string for each cookie category (which could be deactivated: exception necessaryCookies - always active) THIS WILL HAPPEN EACH TIME cookie-notice-ID EXPIRES, SO EACH TIME THE COOKIE POPUP IS SHOWN AGAIN
if (!getCookie(cookiePopup)) {
    // Set Statistics Cookies To Local Storage (as a string)
    if (localStorage[statisticsLS] === undefined) localStorage.setItem(statisticsLS, "");
    // make sure we start with empty string
    else
        classifiedStatistics.forEach((cookie) => {
            if (!localStorage[statisticsLS].includes(["--*", cookie.name, cookie.value])) localStorage[statisticsLS] = addPair(localStorage[statisticsLS], cookie.name, cookie.value); // will make sure cookie updates its value if necessary and does not become duplicate
        });

    // Set Marketing Cookies To Local Storage (as a string)
    if (localStorage[marketingLS] === undefined) localStorage.setItem(marketingLS, "");
    else
        classifiedMarketing.forEach((cookie) => {
            if (!localStorage[marketingLS].includes(["--*", cookie.name, cookie.value])) localStorage[marketingLS] = addPair(localStorage[marketingLS], cookie.name, cookie.value);
        });

    // Set Preferences Cookies To Local Storage (as a string)
    if (localStorage[preferencesLS] === undefined) localStorage.setItem(preferencesLS, "");
    else
        classifiedPreferences.forEach((cookie) => {
            if (!localStorage[preferencesLS].includes(["--*", cookie.name, cookie.value])) localStorage[preferencesLS] = addPair(localStorage[preferencesLS], cookie.name, cookie.value);
        });

    // Set Unclassified Cookies To Local Storage (as a string)
    if (localStorage[unclassifiedLS] === undefined) localStorage.setItem(unclassifiedLS, "");
    else
        classifiedUnclassified.forEach((cookie) => {
            if (!localStorage[unclassifiedLS].includes(["--*", cookie.name, cookie.value])) localStorage[unclassifiedLS] = addPair(localStorage[unclassifiedLS], cookie.name, cookie.value);
        });
}

function parseLocalStorageString(inputString) {
    const objects = [];

    if (!inputString) {
        return objects;
    }

    const parts = inputString.split("--*,");

    for (let i = 1; i < parts.length; i++) {
        const name = parts[i].split(",")[0];
        const value = parts[i].split(",")[1].split("--*")[0];

        objects.push({ name, value });
    }

    return objects;
}

// Transform each localStorage string (for each category) into a more useful format array of objects {name:value}

const classifiedStatisticsLS = parseLocalStorageString(localStorage[statisticsLS]);
const classifiedMarketingLS = parseLocalStorageString(localStorage[marketingLS]);
const classifiedPreferencesLS = parseLocalStorageString(localStorage[preferencesLS]);
const classifiedUnclassifiedLS = parseLocalStorageString(localStorage[unclassifiedLS]);

// DATA PREPARATION PROCESS ENDS HERE

// FRONTEND WORK STARTS HERE

const cookiePopupContainer = document.querySelector(".cookie-popup-container"); // cookie container

// Cookie panel and top options
const cookiePanel = document.querySelector(".cookie-panel");
const cookiePanelOptions = document.querySelectorAll(".cookie-panel ul li");

// Cookie content for each option
const cookieConsentContent = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-mid .cookie-consent");
const cookieCookiesDisplayContent = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-mid .cookie-cookies-display");
const cookieAboutContent = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-mid .cookie-about");

// Cookie categories (necessary cookies, statistics cookies, marketing cookies, preferences cookies, unclassified cookies)
const cookieCategories = document.querySelectorAll(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-category");
const cookieCatNecessary = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-necessary");
const cookieCatStatistics = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-statistics");
const cookieCatMarketing = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-marketing");
const cookieCatPreferences = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-preferences");
const cookieCatUnclassified = document.querySelector(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-unclassified");

// Elements for each cookie category: name, check mark to set on and off and counter of cookies in each categroy
const cookieCatNames = document.querySelectorAll(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-name");
const cookieCheckMarks = document.querySelectorAll(".cookie-popup-container .cookie-popup .cookie-popup-content-container .choose");
const cookieListCounters = document.querySelectorAll(".cookie-popup-container .cookie-popup .cookie-popup-content-container .cookie-cat-count");

// Cookie popup buttons (customize will become allow selection in details panel)
const cookieDenyBtn = document.querySelector(".cookie-popup-container .cookie-popup .cookie-decide .deny");
const cookieCustomizeBtn = document.querySelector(".cookie-popup-container .cookie-popup .cookie-decide .customize");
const cookieAllowCustomisedBtn = document.querySelector(".cookie-popup-container .cookie-popup .cookie-decide .allow-selection");
const cookieAllowBtn = document.querySelector(".cookie-popup-container .cookie-popup .cookie-decide .allow");

// Active Content
function setActiveMidContent(option) {
    // If user clicked "Consent" in panel, we will show consent text content
    if (option.classList.contains("consent-panel")) {
        cookieConsentContent.style.display = "block";
        cookieCookiesDisplayContent.style.display = "none";
        cookieAboutContent.style.display = "none";
    }

    // If user clicked "Details" in panel, we will show the cookies panel with classification and cookies list
    else if (option.classList.contains("details-panel")) {
        cookieConsentContent.style.display = "none";
        cookieCookiesDisplayContent.style.display = "block";
        cookieAboutContent.style.display = "none";
    }

    // If user clicked "About" in panel, we will show about text content
    else if (option.classList.contains("about-panel")) {
        cookieConsentContent.style.display = "none";
        cookieCookiesDisplayContent.style.display = "none";
        cookieAboutContent.style.display = "block";
    }

    // In case we have the cookies panel active, we'll hide "Customize" button and show "Allow Selection"; In other panels, we'll change back to "Customize" visible and "Allow Selection" hidden
    if (document.querySelector(".cookie-panel ul li.details-panel").classList.contains("active")) {
        cookieCustomizeBtn.style.display = "none";
        cookieAllowCustomisedBtn.style.display = "block";
    } else {
        cookieCustomizeBtn.style.display = "block";
        cookieAllowCustomisedBtn.style.display = "none";
    }
}

// When user clicks on option in cookie panel we'll set that specific option as active and then call the setActiveMidContent function to make sure we're matching option with specific content
cookiePanelOptions.forEach((option) => {
    option.addEventListener("click", function () {
        // Set all options inactive
        cookiePanelOptions.forEach((panelOption) => {
            panelOption.classList.remove("active");
        });

        // Set clicked option active and call setActiveMidContent() function to show specific content, based on selection
        option.classList.add("active");
        setActiveMidContent(option);
    });
});

// When "Customize" button from the bottom of the popup is clicked, remove the active class from other tabs, set details tab as active and display content about the cookies
cookieCustomizeBtn.addEventListener("click", function () {
    if (!document.querySelector(".cookie-panel ul li.details-panel").classList.contains("active"))
        cookiePanelOptions.forEach((panelOption) => {
            panelOption.classList.remove("active");
        });

    document.querySelector(".cookie-panel ul li.details-panel").classList.add("active");
    setActiveMidContent(document.querySelector(".cookie-panel ul li.details-panel"));
});

// Init state: always on consent tab
setActiveMidContent(document.querySelector(".cookie-popup .cookie-panel ul li.active"));

// Place Necessary Cookies in Necessary Cookies Block (Necessary will always be active, so no need to use localStorage for them)
classifiedNecessary.forEach((cookie) => {
    let li = "<li>" + decodeURIComponent(cookie.name) + ": " + decodeURIComponent(cookie.value) + "</li>";
    cookieCatNecessary.querySelector("ul").innerHTML += li;
});

// Place Statistics Cookies in Statistics Cookies Block
classifiedStatisticsLS.forEach((cookie) => {
    let li = "<li>" + decodeURIComponent(cookie.name) + ": " + decodeURIComponent(cookie.value) + "</li>";
    cookieCatStatistics.querySelector("ul").innerHTML += li;

    if (classifiedStatistics.length !== classifiedStatisticsLS.length) {
        cookieCatStatistics.querySelector(".choose").classList.remove("active");
    }
});
// Place Marketing Cookies in Marketing Cookies Block
classifiedMarketingLS.forEach((cookie) => {
    let li = "<li>" + decodeURIComponent(cookie.name) + ": " + decodeURIComponent(cookie.value) + "</li>";
    cookieCatMarketing.querySelector("ul").innerHTML += li;

    if (classifiedMarketing.length !== classifiedMarketingLS.length) {
        cookieCatMarketing.querySelector(".choose").classList.remove("active");
    }
});
// Place Preferences Cookies in Preferences Cookies Block
classifiedPreferencesLS.forEach((cookie) => {
    let li = "<li>" + decodeURIComponent(cookie.name) + ": " + decodeURIComponent(cookie.value) + "</li>";
    cookieCatPreferences.querySelector("ul").innerHTML += li;

    if (classifiedPreferences.length !== classifiedPreferencesLS.length) {
        cookieCatPreferences.querySelector(".choose").classList.remove("active");
    }
});
// Place Unclassified Cookies in Unclassified Cookies Block
classifiedUnclassifiedLS.forEach((cookie) => {
    let li = "<li>" + decodeURIComponent(cookie.name) + ": " + decodeURIComponent(cookie.value) + "</li>";
    cookieCatUnclassified.querySelector("ul").innerHTML += li;

    if (classifiedUnclassified.length !== classifiedUnclassifiedLS.length) {
        cookieCatUnclassified.querySelector(".choose").classList.remove("active");
    }
});

// All cookies will be hidden initially; Show them when user clicks on category name
cookieCatNames.forEach((cookieCat) => {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');

    cookieCat.addEventListener("click", function () {
        let cookiesList = cookieCat.parentNode.parentNode.parentNode.parentElement.querySelector(".data-describe");
        if (cookiesList.style.display == "block"){
            cookiesList.style.display = "none";
            cookieCat.style.color = "#111"

        } 
        else {
            cookiesList.style.display = "block";
            cookieCat.style.setProperty('color', accentColor);
        }
    });
});

// Disable/Reenable category when user clicks on radio mark from the left of the category
cookieCheckMarks.forEach((mark) => {
    mark.addEventListener("click", function () {
        // In case user wants to disable mandatory cookies category, alert him that's not possible
        if (mark.classList.contains("always-on"))
            alert(
                "Mandatory - can not be deselected. Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies."
            );
        else {
            if (mark.classList.contains("active")) mark.classList.remove("active");
            //disable cookies category
            else mark.classList.add("active"); //enable cookies category
        }
    });
});

// Count all cookies from a category and display the number in the cookie-counter
cookieListCounters.forEach((counter) => {
    let relatedCookies = counter.parentNode.parentNode.parentNode.parentElement.querySelectorAll(".data-describe li");
    counter.innerText = relatedCookies.length;
});

// In case there is no cookie in a category, hide that category
cookieCategories.forEach((category) => {
    let counter = category.querySelector(".cookie-cat-count");
    if (counter.innerText == 0) {
        category.style.display = "none";
        category.querySelector(".choose").classList.remove("active");
    }
});

// FRONTEND WORK ENDS HERE

// INTEGRATE FE WITH BE PROCESS STARTS HERE

// Set cookie with specific name, value and duration !Used 5s for testing, don't forget to set days back
function setcookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        // date.setTime(date.getTime()+5*1000); // TO BE COMMENTED
        var expires = "; expires=" + date.toGMTString(); //
    } else var expires = "";
    document.cookie = name + "=" + value + expires + ";path=/"; // + and " added
}

// Check if the user is in incognito mode
function isIncognito() {
    return !!(window.webkitRequestFileSystem || window.RequestFileSystem);
}

// Set the cookie popup to display
function showCookiePopup() {
    document.querySelector(".cookie-popup-container").style.display = "flex";
}

// Hide the cookie popup and set a cookie named cookie-notice-ID when the user makes a selection to be able to decide if popup will be shown when user interactis with website (might need to use variable with ID for each website as cookie)
function decideCookies() {
    var popup = document.querySelector(".cookie-popup-container");
    popup.style.display = "none";

    // Set the cookie with a 90-day expiration
    setcookie(cookiePopup, "true", 90);
}

// Check if the cookie has been set and show the cookie popup if it hasn't or if the user is in incognito mode
function checkCookiesAccepted() {
    var cookiesAccepted = document.cookie.match('(^|;\\s*)' + cookiePopup + '\\s*=\\s*([^;]+)');
    if (!cookiesAccepted || cookiesAccepted[2] !== "true") {
        showCookiePopup();
    }
}

// Helper function to retrieve the value of a cookie by its name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");

    if (parts.length == 2) return parts.pop().split(";").shift();
}

function toggleCookies(cookieCategories, disable) {
    cookieCategories.forEach(function (category) {
        category.forEach(function (cookieObj) {
            var cookieName = cookieObj.name;
            var cookieValue = cookieObj.value;

            if (disable) {
                document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // in case we need to disable cookie, we'll set its expiration date in the past
            } else {
                // Reset the value of the cookie and set its expiration date to a future date
                var date = new Date();
                date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000); // Set the expiration date to 1 year in the future
                document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toUTCString() + "; path=/;"; // place value back (got it from localStorage in early functions)
            }
        });
    });
}

// User clicks Allow All: enable all cookies and go in decideCookies()
cookieAllowBtn.addEventListener("click", function () {
    let cookiesToEnable = new Array();
    // Push the cookies which are not mandatory to cookiesToEnable
    cookiesToEnable.push(classifiedNecessary);
    cookiesToEnable.push(classifiedPreferencesLS);
    cookiesToEnable.push(classifiedStatisticsLS);
    cookiesToEnable.push(classifiedMarketingLS);
    cookiesToEnable.push(classifiedUnclassifiedLS);

    toggleCookies(cookiesToEnable, false); // activate all cookies (even if they were inactive earlier)
    decideCookies();
});

// User clicks Allow Selection: Disable the cookies which are not selected, enable the ones which are selected and go in decideCookies()
cookieAllowCustomisedBtn.addEventListener("click", function () {
    let allCookies = [classifiedNecessary, classifiedPreferencesLS, classifiedStatisticsLS, classifiedMarketingLS, classifiedUnclassifiedLS];
    let cookiesToDisable = new Array();
    // If cookie category is not active, push it to cookiesToDisable array
    if (!cookieCatPreferences.querySelector(".choose").classList.contains("active")) cookiesToDisable.push(classifiedPreferencesLS);
    if (!cookieCatStatistics.querySelector(".choose").classList.contains("active")) cookiesToDisable.push(classifiedStatisticsLS);
    if (!cookieCatMarketing.querySelector(".choose").classList.contains("active")) cookiesToDisable.push(classifiedMarketingLS);
    if (!cookieCatUnclassified.querySelector(".choose").classList.contains("active")) cookiesToDisable.push(classifiedUnclassifiedLS);

    let cookiesToEnable = allCookies.filter((value) => !cookiesToDisable.includes(value));

    toggleCookies(cookiesToDisable, true); // disable cookies which are deactivated
    toggleCookies(cookiesToEnable, false); // enable cookies which are activated
    decideCookies();
});

// User clicks Deny: Disable the cookies which are not mandatory and go in decideCookies()
cookieDenyBtn.addEventListener("click", function () {
    let cookiesToDisable = new Array();

    // Push the cookies which are not mandatory to cookiesToDisable
    cookiesToDisable.push(classifiedPreferencesLS);
    cookiesToDisable.push(classifiedStatisticsLS);
    cookiesToDisable.push(classifiedMarketingLS);
    cookiesToDisable.push(classifiedUnclassifiedLS);

    // Filter cookiesToDisable array to contain only the names of the cookies which are disabled
    // cookiesToDisable = cookiesToDisable.filter((innerArr) => innerArr.length > 0).flatMap((innerArr) => innerArr.map((obj) => obj.name));

    toggleCookies(cookiesToDisable, true);
    decideCookies();
});

checkCookiesAccepted(); // Check if cookie pop-up should be shown (if cookie-notice-ID expired and needs update )

// INTEGRATE FE WITH BE PROCESS ENDS HERE

// TESTING DATA STARTS HERE

// function setcookie2(name, value, days)
// {
//   if (days)
//   {
//     var date = new Date();
//     date.setTime(date.getTime()+days*24*60*60*1000);
//     // date.setTime(date.getTime()+5*1000); // TO BE COMMENTED
//     var expires = "; expires=" + date.toGMTString(); //
//   }
//   else
//     var expires = "";
//   document.cookie = name+"=" + value+expires + ";path=/"; // + and " added
// }

// // Statistics cookies
// setcookie2("_ga", "GA1.2.1234567890.1616380655", 90);
// setcookie2("_gid", "GA1.2.987654321.1616380655", 90);
// setcookie2("_gat_UA-123456-7", "1", 90);
// setcookie2("__utma", "123456789.987654321.1616380655.1616380655.1616380655.1", 90);
// setcookie2("__utmb", "123456789.1.10.1616380655", 90);
// setcookie2("__utmc", "123456789", 90);
// setcookie2("__utmz", "123456789.1616380655.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)", 90);

// // Marketing cookies
// setcookie2("fbp", "fb.1.1616380655.1234567890", 90);
// setcookie2("utm_source", "google", 90);
// setcookie2("utm_medium", "cpc", 90);
// setcookie2("utm_campaign", "summer_sale", 90);
// setcookie2("referral_code", "friend567", 90);
// setcookie2("ab_test", "variation_a", 90);

// // Preferences cookies
// setcookie2("language_pref", "en_US", 90);
// setcookie2("currency_pref", "USD", 90);
// setcookie2("timezone_pref", "America/New_York", 90);
// setcookie2("theme_pref", "light", 90);
// setcookie2("product_category_pref", "clothing", 90);
// setcookie2("consent_cookie", "true", 90);

// TESTING DATA ENDS HERE

/**
 * Converts a written cost into a number
 * @param {*} value The written value 
 * @returns The numeric value
 */
function parseMoney(value) {
    var baseValue = value.replace("円", "");
    if (baseValue.includes("万")) {
        baseValue = baseValue.replace("万", "") * 10000;
    }
    if (baseValue == "-") {
        return 0;
    }
    return parseFloat(baseValue);
}

/**
 * Synchronous wrapper for chrome.tabs.sendMessage
 * @param {*} id The tab ID to send to 
 * @param {*} message The message to send
 * @returns The response
 */
const syncSendMessage = async (id, message) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(id, message, function (result) {
            if (result === undefined) {
                reject();
            } else {
                console.log("Result: " + result);
                console.log(result);
                resolve(result);
            }
        });
    });
};

/**
 * Synchronous wrapper for chrome.storage.local.get
 * @param {*} key The key of the data to get
 * @returns Data from Chrome storage
 */
const syncStorageLocalGet = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            if (result[key] === undefined) {
                reject();
            } else {
                resolve(result[key]);
            }
        });
    });
};

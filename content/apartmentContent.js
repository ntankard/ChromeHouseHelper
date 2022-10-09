// LOCAL DATA ==========================================================================================================

let rawApartment;

// MAIN CODE ===========================================================================================================

rawApartment = scrapeApartment();
console.log("Scrapped apartment");
console.log(rawApartment);

// Enable response to requests
chrome.runtime.onMessage.addListener(gotMessage);

/**
 * Process all income messages. Expects message.type to be present and can respond to getPageType and getApartment 
 * depending on the page type
 * @param {*} message 
 * @param {*} sender 
 * @param {*} sendResponse 
 */
function gotMessage(message, sender, sendResponse) {
    console.log("Request Received: " + message.type);
    switch (message.type) {
        case REQUEST_PAGE_TYPE:
            sendResponse(PAGE_TYPE_APARTMENT);
            break;
        case REQUEST_PAGE_APARTMENT:
            if (rawApartment) {
                sendResponse(rawApartment);
            } else {
                throw "Calling getApartment on a non apartment page";
            }
            break;
    }
}

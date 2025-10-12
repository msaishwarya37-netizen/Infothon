/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Phishing Detection Extension installed');
});
// Listen for tab updates to potentially scan URLs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Could add automatic scanning here
        console.log('Tab updated:', tab.url);
    }
});
// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeUrl') {
        // Forward to backend API
        fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: request.url }),
        })
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Will respond asynchronously
    }
});

/******/ })()
;
//# sourceMappingURL=background.js.map
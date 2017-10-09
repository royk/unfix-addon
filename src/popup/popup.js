function runClearerScript() {
	chrome.tabs.executeScript({
			    file: 'clearer.js'
		  }); 
}
var saveSiteOptions = function(siteOptions) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.extension.getBackgroundPage().saveSiteOptions(tabs[0].url, siteOptions);
	});
};
var originalLayout = true;
var updatePopupTexts = function(isOriginalLayout, clearButton) {
	console.log("updatePopupTexts");
	console.log("isOriginalLayout", isOriginalLayout);
	if (isOriginalLayout) {
		clearButton.innerText = "Improve readability";
	} else {
		clearButton.innerText = "Restore original layout"
	}
}
var updatePopup = function() {
	console.log("updatePopup");
	var siteOptions = chrome.extension.getBackgroundPage().siteOptions || {};
	console.log("siteOptions", siteOptions);
	originalLayout = !siteOptions.autoEnabled;
	console.log("originalLayout", originalLayout);
	// instrument toggle button
	let enableButton = document.getElementById("enableButton");
	updatePopupTexts(originalLayout, enableButton);
	enableButton.onclick = function() {
		originalLayout = !originalLayout;
		runClearerScript();
		updatePopupTexts(originalLayout, enableButton);
	};
	
	// instrument always on checkbox
	let alwaysOnCB = document.getElementById("alwaysOnCB");
	alwaysOnCB.checked =  siteOptions.autoEnabled;
	alwaysOnCB.onclick = function() {
		siteOptions.autoEnabled = alwaysOnCB.checked
		saveSiteOptions(siteOptions);
	};
};
document.addEventListener('DOMContentLoaded', function() {
	console.log("DOMContentLoaded");
	updatePopup();
});
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.event === "onUpdated") {
        	console.log("onUpdated");
           updatePopup();
        }
    }
);
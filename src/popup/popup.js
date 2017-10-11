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
var enableButton = null;
var updatePopupTexts = function(isOriginalLayout) {
	console.log("updatePopupTexts");
	console.log("isOriginalLayout", isOriginalLayout);
	if (isOriginalLayout) {
		enableButton.innerText = "Improve readability";
	} else {
		enableButton.innerText = "Restore original layout"
	}
}
var updatePopup = function() {
	console.log("updatePopup");
	console.log("originalLayout", originalLayout);
	updatePopupTexts(originalLayout);
};
var instrumentPopup = function() {
	var siteOptions = chrome.extension.getBackgroundPage().siteOptions || {};
	console.log("siteOptions", siteOptions);
	originalLayout = !siteOptions.autoEnabled;
	// instrument enable button
	enableButton = document.getElementById("enableButton");
	enableButton.onclick = function() {
		originalLayout = !originalLayout;
		runClearerScript();
		updatePopup();
	};

	// instrument always on checkbox
	let alwaysOnCB = document.getElementById("alwaysOnCB");
	alwaysOnCB.checked =  siteOptions.autoEnabled;
	alwaysOnCB.onclick = function() {
		siteOptions.autoEnabled = alwaysOnCB.checked
		saveSiteOptions(siteOptions);
	};
	updatePopup();
};
document.addEventListener('DOMContentLoaded', function() {
	instrumentPopup();
});
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.event === "onUpdated") {
        	console.log("onUpdated");
			updatePopup();
        }
        if (request.event === "onReady") {
			console.log("onReady");
			updatePopup();
        }
    }
);
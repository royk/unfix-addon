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
document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get('clearData', function(data) {
		var siteOptions = chrome.extension.getBackgroundPage().siteOptions || {};
		console.log("siteOptions", siteOptions);
		// instrument toggle button
		let enableButton = document.getElementById("enableButton");
		enableButton.onclick = function() {
			runClearerScript();
		};
		if (data.clearData || siteOptions.autoEnabled) {
			enableButton.innerText = "Restore original layout"
		}
		// instrument always on checkbox
		let alwaysOnCB = document.getElementById("alwaysOnCB");
		alwaysOnCB.checked =  siteOptions.autoEnabled;
		alwaysOnCB.onclick = function() {
			siteOptions.autoEnabled = alwaysOnCB.checked
			saveSiteOptions(siteOptions);
		};
	});
});
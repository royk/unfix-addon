// extracting host name from url source: https://stackoverflow.com/a/23945027
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}
function runClearerScript() {
	chrome.tabs.executeScript({
			    file: 'clearer.js'
		  }); 
}
var siteOptions = {};
document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		var siteName = extractRootDomain(tabs[0].url);
		var optionsKey = 'siteOptions';
		chrome.storage.sync.get(optionsKey, function(options) {
	  		let enableButton = document.getElementById("enableButton");
	  		enableButton.onclick = function() {
	  			runClearerScript();
	  		};
	  		console.log("Options", options, "siteName", siteName);
	  		var autoEnabled = false;
	  		if (options.hasOwnProperty(optionsKey)) {
	  			options = options[optionsKey];
	  		}
	  		if (options.hasOwnProperty(siteName)) {
	  			siteOptions = options[siteName];
	  			console.log("Autoenabled was preconfigured", siteOptions);
	  		}
	  		let alwaysOnCB = document.getElementById("alwaysOnCB");
			alwaysOnCB.checked =  siteOptions.autoEnabled;
			alwaysOnCB.onclick = function() {
				siteOptions.autoEnabled = alwaysOnCB.checked
				options[siteName] = siteOptions;
				var data = {};
				data[optionsKey] = options;
				chrome.storage.sync.set(data);
			};
	  	});
	});
});
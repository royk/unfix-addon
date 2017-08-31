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
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status!=="complete") return;
    chrome.tabs.getSelected(null, function(tab) {
    	var siteName = extractRootDomain(tab.url);
		var optionsKey = 'siteOptions';
		console.log("auto loading clearer. siteName", siteName);
		chrome.storage.sync.get(optionsKey, function(options) {
			options = options[optionsKey] || {};
			if (options.hasOwnProperty(siteName)) {
	  			siteOptions = options[siteName];
	  			if (siteOptions.autoEnabled) {
	  				console.log("Auto running clearer")
	  				chrome.tabs.executeScript(tab.id, {file: "clearer.js"});
	  			}
		  	}
		});
	});
});
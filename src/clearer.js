var elements = [];
function recurseDomChildren(start)
{
    var nodes;
    if(start.childNodes)
    {
        nodes = start.childNodes;
        loopNodeChildren(nodes);
    }
}

function loopNodeChildren(nodes)
{
    var node;
    for(var i=0;i<nodes.length;i++)
    {
        node = nodes[i];
        elements.push(node);
        if(node.childNodes)
        {
            recurseDomChildren(node);
        }
    }
}
var unclearer = function(data) {
	recurseDomChildren(document.documentElement);
	for (var i=0; i<data.length; i++) {
		var datum = data[i];
		var elem = elements[datum.elemIndex];
		if (elem) {
			elem.setAttribute('style','position: '+datum.position);
			elem.style.opacity = datum.opacity;
		}
	}
	return null;
};
var clearer = function() {
	var modifiedElements = [];
	try {
		recurseDomChildren(document.documentElement);
		for (var i=0;i<elements.length; i++) {
			var elem = elements[i];
		    if (elem && elem.toString().indexOf("HTML")>-1) {
		    	var computedStyle = window.getComputedStyle(elem,null);
		    	if (computedStyle.getPropertyValue('position').indexOf('fixed')>-1) {
		    		modifiedElements.push({elemIndex: i, position: computedStyle.getPropertyValue('position'), opacity: computedStyle.getPropertyValue('opacity')});
		        	var top = computedStyle.getPropertyValue('top');
		        	var bottom = computedStyle.getPropertyValue('bottom');
		        	// make headers non-floating
		        	if (top==='0px' && bottom!=='0px') {
	        			elem.setAttribute('style','position: absolute !important');
		        	} else 
		        	// make footers bottom sticky
		        	if (bottom==='0px' && top!=='0px') {
	        			elem.setAttribute('style','position: absolute !important');
	        			document.getElementsByTagName('body')[0].style.position = 'relative';
		        	} else {
	        			elem.style.opacity = 0.1;
		        	}
		        }
		    } 

		}
	}catch(e) {
		// ignore
	}
	return modifiedElements;
};
var data = chrome.storage.local.get('clearData', function(data) {
	if (data.clearData) {
		chrome.storage.local.remove('clearData');
		unclearer(data.clearData);
	} else {
		chrome.storage.local.set({clearData: clearer()});
	}
});

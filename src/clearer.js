(function() {
	var elements = [];
	var _className = '___clearer-';
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
		var removed = false;
		for (var i=0; i<data.length; i++) {
			var datum = data[i];
			var elem = document.getElementsByClassName(_className+datum.elementIndex)[0];
			if (elem) {
				removed = true;
				elem.classList.remove(_className + datum.elementIndex);
				elem.setAttribute('style', datum.originalStyle);
			}
		}
		return removed;
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
			    		var originalStyle = elem.style.cssText;
			    		modifiedElements.push({elementIndex: i, originalStyle: originalStyle});
			        	var top = computedStyle.getPropertyValue('top');
			        	var bottom = computedStyle.getPropertyValue('bottom');
			        	var left = computedStyle.getPropertyValue('left');
			        	var right = computedStyle.getPropertyValue('right');
			        	// make headers non-floating
			        	if (top==='0px' && bottom!=='0px') {
		        			elem.setAttribute('style',originalStyle + 'position: absolute !important');
			        	} else 
			        	// make footers bottom sticky
			        	if (bottom==='0px' && top!=='0px') {
		        			elem.setAttribute('style',originalStyle + 'position: absolute !important');
		        			document.getElementsByTagName('body')[0].style.position = 'relative';
			        	}  else 
			        	// make screen blockers completely hidden
			        	if (bottom==='0px' && top==='0px' && left==='0px' && right==='0px') {
			        		elem.setAttribute('style',originalStyle + 'display: none !important');
			        	}
			        	else {
		        			elem.style.opacity = 0.1;
			        	}
			        	elem.classList.add(_className + i);
			        }
			    } 

			}
		}catch(e) {
			// ignore
		}
		return modifiedElements;
	};
	var data = chrome.storage.local.get('clearData', function(data) {
		var removed = false;
		if (data.clearData) {
			chrome.storage.local.remove('clearData');
			removed = unclearer(data.clearData);
		}
		if (!removed) {
			chrome.storage.local.set({clearData: clearer()});
		}
	});
}());

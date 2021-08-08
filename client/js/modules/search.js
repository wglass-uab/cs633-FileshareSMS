function autocompletesearch() { 
	let _inp = null,
	    _arr = [], 
	    curFocus; 

	let setAutocomplete = function (inp, arr) { 
		_arr = arr; 
		if (_inp === inp) { return; } 
		
		removePriviousListener(); 

		_inp = inp; 
		$(_inp).on("input", inputEvent);
		$(_inp).on("keydown", keydownEvent); 
	}
	
        let inputEvent = function (e) { 	   
		var inputText = this.value; 	
		closeAllLists(); 
			       
		if (!inputText) { return false; }
		curFocus = -1; 
			    
		const $div = $("<div>", {"class":"search-items","id":this.id+"search-list"});
		$(this.parentNode).append($div); 
		
		for (let i = 0; i < _arr.length; i++) { 
			if (_arr[i].substr(0, inputText.length).toUpperCase() == inputText.toUpperCase()) {    
				var $innerDiv = $("<div>").html("<strong>" + _arr[i].substr(0, inputText.length) + "</strong>");  
				$innerDiv.append(_arr[i].substr(inputText.length))
				$innerDiv.append("<input type='hidden' value='" + _arr[i] + "'>");
								   
				$innerDiv.click (function (e) {     
					_inp.value = this.getElementsByTagName("input")[0].value;  
					closeAllLists(); 
				});		 
				$div.append($innerDiv); 
			} 
		}
	} 
	
	let keydownEvent = function (e) {
		var x = document.getElementById(this.id + "search-list");
		if (x) { x = x.getElementsByTagName("div"); } 
			
		if (e.keyCode == 40) { // key down
			curFocus += 1;
			addActive(x); 
		} else if (e.keyCode == 38) { // key up
			curFocus -= 1;
			addActive(x); 
		} else if (e.keyCode == 13) { // key enter 
			e.preventDefault(); 
			if (curFocus > -1) { if (x) x[curFocus].click(); } 
		} 
	} 
		   
	let addActive = function (x) {
		if (!x) return false;
		removeActive(x); 
		if (curFocus >= x.length) curFocus = 0; 
		if (curFocus < 0) curFocus = (x.length - 1); 
		x[curFocus].classList.add("search-active");
	} 
	
	let removeActive = function (x) { 
		for (var i = 0; i < x.length; i++) { 
			x[i].classList.remove("search-active"); 
		} 
	} 
	
	let closeAllLists = function (element) { 
		var x = document.getElementsByClassName("search-items");
		for (var i = 0; i < x.length; i++) { 
			if (element != x[i] && element != _inp) { 
				x[i].parentNode.removeChild(x[i]); 
			} 
		} 
	} 
	
        let removePriviousListener = function () { 
	        if (_inp !== null) { 
		      $(_inp).off("input", inputEvent);
		      $(_inp).off("keydown", keydownEvent); 
	        } 
        }
	autocompletesearch.setAutocomplete = setAutocomplete;
}

export { autocompletesearch };
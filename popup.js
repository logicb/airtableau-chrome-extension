document.addEventListener('DOMContentLoaded', function(){
	var div = document.getElementById('btn-run');
	div.addEventListener('click', btnCapture);

	var cls = document.getElementById('btn-cls');
	cls.addEventListener('click', myClose);
});

function btnCapture(e)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    
	    //Check if the current Tab's URL is the Application Base' API URL
	    if(tabs[0].url.indexOf("https://airtable.com/app") !== -1)
	    {

			chrome.tabs.executeScript(null, { file: "content.js"}, 
				 function() {
				 	// If you try and inject into an extensions page or the webstore/NTP you'll get an error
				 	if (chrome.runtime.lastError) {
				 		var message = document.querySelector('#message');
				 		message.innerHTML = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
				 	}
				 });
	    }
	    else
	    {
	    	//Check if the current Tab's URL is the Base API. If not, then redirect to the base API URL
	    	if(tabs[0].url.indexOf("https://airtable.com/api") === -1)
	    		{
	    			updateProperties = new Object();
	    			updateProperties.url = "https://airtable.com/api/";
	    			chrome.tabs.update(tabs[0].id, updateProperties, function() {
		                 // Anything else you want to do after the tab has been updated.
		            });
		        }
	    }
	    });
}

function myClose(e)
{
	window.close();
}

function copyToClipboard(text) {
	
	//Create a new input field to copy the text into the Clip board
	const input = document.createElement('input');
	input.style.position = 'fixed';
	input.style.opacity = 0;
	input.value = text;
	document.body.appendChild(input);
	input.select();
	document.execCommand('Copy');
	document.body.removeChild(input);
};



chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSchema") {

  	//This function will be called once the content.js script executes the request.
  	var message = document.querySelector('#message');
  	if( request.source !== '')
  	{
	    copyToClipboard(request.source);
	    message.innerHTML = 'Schema copied successfully';
  	}
  	else
  	{
  		copyToClipboard('N/A');
  		message.innerHTML = 'Schema not found';
  	}

  }
});



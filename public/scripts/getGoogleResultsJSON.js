// getJSON_new.js
// server-side

/*
Note: Custom Search JSON API URI is:

	https://www.googleapis.com/customsearch/v1?[parameters]

Required Parameters:
	1) API key 
		-> Use the key query parameter to identify your application.
	2) Custom search engine ID 
		-> Use cx to specify the custom search engine you want to use to perform this search. 
			The search engine must be created with the Control Panel
	3) Search query 
		-> Use the q query parameter to specify your search expression.


Example:
	GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures

		API: 	INSERT_YOUR_API_KEY
		ID: 	017576662512468239146:omuauf_lfve
		QUERY: 	lectures 
*/

'use strict';

// requires
const {
    google
} = require('googleapis');
const customsearch = google.customsearch('v1');

async function createQuery(query) {

    const options = {
        q: query,
        apiKey: 'AIzaSyCWw5a-REWH3EnTxVVNK4ZghAEog1CoYjA',
        cx: '006303259406563352342:pkhojuu5620',
    };

    const res = await customsearch.cse.list({
        cx: options.cx,
        q: options.q,
        auth: options.apiKey,
    });

    return res.data; // Promise
}

module.exports = createQuery;
var twitter = {
	/**
	 * [generateAuthzHeader]
	 * @param  {String} url                The URL of the API request.
	 * @param  {String} method             GET or POST.
	 * @param  {Object} params             A set of key/value pairs being sent as paramteres in the request.
		 * {String}     oauth_token        [OPTIONAL] The OAuth token used in the param string (and signature base string); used in most* requests.
	 * @param  {Bool}   requestToken       If the request is to oauth/request_token (requiring a callback, but no token or token_secret, for example).
	 * @param  {String} oauth_token_secret [OPTIONAL] The OAuth token secret used in the signing key; used in most* requests.
	 * @return {String}                    The OAuth Authorization header required for all Twitter API requests.
	 */
	generateAuthzHeader: function(url, method, params, requestToken, oauth_token_secret) {
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// COLLECT ALL PARAMETERS
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// oauth_callback [ONLY IN oauth/request_token]
		if (requestToken === true) {
			params.oauth_callback = "https://postplusapp.com/";
		}
		// oauth_consumer_key
		params.oauth_consumer_key = 'JndzzjUy4Nej49X0qGDWNQ';
		// oauth_nonce: random 32-character string
		params.oauth_nonce = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < 32; i++) {
			params.oauth_nonce += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		// oauth_signature_method
		params.oauth_signature_method = 'HMAC-SHA1';
		// oauth_timestamp
		params.oauth_timestamp = Math.round(new Date().getTime() / 1000);
		// oauth_version
		params.oauth_version = '1.0';
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// GENERATE THE SIGNATURE
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// Create the parameter string, for use in the signature base string (the 'message' to be encrypted for the signature).
		var paramStr = '';
		// For each param (sorted alphabetically) . . .
		Object.keys(params).sort().forEach(function(key) {
			// Add percent-encoded keys and values to the header in such a format: 'KEY=VALUE&'.
			paramStr += twitter.percentEncode(key) + '=' + twitter.percentEncode(params[key]) + '&';
		});
		// No ampersand is necessary after the last param, so remove the last '&'.
		paramStr = paramStr.slice(0, -1);
		// Create signature base string: 'method&url&paramStr' (percent-encoding both the url and param string).
		var baseStr = method.toUpperCase() + '&';
		baseStr += twitter.percentEncode(url) + '&';
		baseStr += twitter.percentEncode(paramStr);
		// Create the signing key: 'oauth_consumer_secret&oauth_token_secret' (if the request is to oauth/request_token, the token_secret is omitted).
		var oauth_consumer_secret = 'CCztEsN37EEHmy7xNlsHNiRou9IJxZBlYsuz4T7HLiE';
		var signingKey = twitter.percentEncode(oauth_consumer_secret) + '&';
		if (requestToken === false) {
			signingKey += twitter.percentEncode(oauth_token_secret);
		}
		// Calculate the signature. Use HMAC-SHA1 encryption, and Base64 to encode the raw output.
		params.oauth_signature = CryptoJS.HmacSHA1(baseStr, signingKey).toString(CryptoJS.enc.Base64);
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// CREATE AUTHORIZATION HEADER
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		authzHeader = 'OAuth ';
		// For each param (sorted alphabetically) . . .
		Object.keys(params).sort().forEach(function(key) {
			// Only append parameters to authorization header if they are one of the eight OAuth-compliant ones.
			var oauthParams = ['oauth_callback', 'oauth_consumer_key', 'oauth_nonce', 'oauth_signature', 'oauth_signature_method', 'oauth_timestamp', 'oauth_token', 'oauth_version'];
			if ($.inArray(key, oauthParams) > -1) {
				// Add percent-encoded keys and values to the header in such a format: 'KEY="VALUE", '.
				authzHeader += twitter.percentEncode(key) + '="' + twitter.percentEncode(params[key]) + '", ';
			}
		});
		// No comma is necesary after the last item, so remove the last two characters: ', '.
		authzHeader = authzHeader.slice(0, -2);
		return authzHeader;
	},
	/**
	 * [percentEncode]
	 * @param  {String} str  A string of parameters to be URL-encoded for an OAuth request.
	 * @return {String}      An OAuth compliant percent/URL-encoded string of parameters.
	 */
	percentEncode: function(str) {
		str = encodeURIComponent(str);
		// Replace the values which encodeURIComponent doesn't do.
		// encodeURIComponent ignores: - _ . ! ~ * ' ( )
		// OAuth dictates the only ones you can ignore are: - _ . ~
		str = str.replace(/\!/g, "%21");
		str = str.replace(/\*/g, "%2A");
		str = str.replace(/\'/g, "%27");
		str = str.replace(/\(/g, "%28");
		str = str.replace(/\)/g, "%29");
		return str;
	}
};
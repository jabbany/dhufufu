if(API == null)
	API = {};
API.Bangumi = function () {
	var init = false;
	this.credentials = {
		chii_sid:"",
		chii_cookietime:0,
		chii_auth:""
	};
	this.init = function(){
		init = true;
	}
};
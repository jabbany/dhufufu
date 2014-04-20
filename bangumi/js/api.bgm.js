/** Provides API functions for querying BGM.tv **/
function BangumiCore(){
	var apiroot = "http://api.bgm.tv";
	var auth = null;
	var globalGet = {
		"source":encodeURIComponent("BangumiJS-Core/0.8")
	}
	
	var createGet = function(append){
		var cget = "";
		for(var i in globalGet){
			cget += encodeURIComponent(i) + "=" + encodeURIComponent(globalGet[i]) + "&";
		}
		if(append != null)
			for(var j in append){
				cget += encodeURIComponent(j) + "=" + encodeURIComponent(append[j]) + "&";
			}
		if(cget.substring(cget.length - 1) == "&")
				cget = cget.substring(0, cget.length - 1);
		return "?" + cget;
	};
	var xrequest = function (api, post, get, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(typeof callback == "function")
					callback(xhr.responseText);
			}
		}
		xhr.open(post == null ? "GET" : "POST", apiroot + api + createGet(get), true);
		if(post){
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			var p = "";
			for(var x in post){
				p += encodeURIComponent(x) + "=" + encodeURIComponent(post[x]) + "&";
			}
			if(p.substring(p.length - 1) == "&")
				p = p.substring(0, p.length - 1);
			xhr.send(p);
		}else{
			xhr.send();
		}
	};
	
	this.authenticate = function(user, pass, callback){
		xrequest("/auth",{
			"username": user,
			"password": pass
		},null,function(resp){
			if(resp == ""){
				if(typeof callback == "function"){
					callback({
						"status":500,
					});
				}
			}else{
				try{
					var response = JSON.parse(resp);
					if(response.auth != null){
						auth = response;
						if(typeof callback == "function"){
							callback({
								"status":200
							});
						}
						return;
					}
					if(typeof callback == "function"){
						callback({
							"status":500,
							"msg":response
						});
					}
				}catch(e){
					if(typeof callback == "function"){
						callback({
							"status":500,
							"msg":resp
						});
					}
				}
			}
		});
	};
	
	this.getToken = function(){
		if(auth == null)
			return null;
		return auth.auth;
	};
	
	this.getUID = function(){
		if(auth == null)
			return -1;
		return auth.id;
	};
	
	this.getLogin = function(){
		return auth == null ? "": auth.username;
	};
	
	this.getNickname = function(){
		if(auth == null)
			return "";
		return auth.nickname;
	};
	
	this.getSignature = function(){
		if(auth == null)
			return "";
		return auth.sign;
	};
	
	this.getAvatar = function(size){
		if(auth == null)
			return "";
		if(size == null)
			size = "large";
		return auth.avatar[size];
	};
	
	this.saveAuth = function(){
		//Save it somewhere, localstorage perhaps
	};
	
	this.loadAuth = function(){
		//Load the auth data
	};
	
	this.api = function(url, needsAuth, post, get , callback){
		var authGet = {};
		if(needsAuth){
			authGet["auth"] = this.getToken();
			authGet["sysusername"] = this.getLogin();
			authGet["sysuid"] = this.getUID();
		}
		for(var i in get){
			authGet[i] = get[i];
		}
		xrequest(url, post, authGet, function(response){
			if(response != null && response != ""){
				if(typeof callback == "function"){
					callback(JSON.parse(response));
				}
			}else{
				if(typeof callback == "function")
					callback(null);
			}
		});
	};
	
	this.clearAuth = function(clearSettings){
		//Clear the auth data
	};
	
	this.setGlobalGet = function(key, value){
		globalGet[key] = value;
		return;
	};
	
	this.getGlobalGet = function(key){
		return globalGet[key];
	};
}

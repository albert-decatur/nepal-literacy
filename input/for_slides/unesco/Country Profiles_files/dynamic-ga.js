(function ($) {

	$.extend({
		parseUrl: function (url) {
	 		var pattern = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)$/;
			var result = pattern.exec(url);

			if (result == null) { 
				return undefined;
			}

			var names = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
			var res = [];

			for (var i = 0; i < names.length; i++) {
				res[names[i]] = result[i];
			}

			return res;
		},

		parseJs: function (js) {
			var pattern = /(?:location[^=]*=[\s]*['"]([^'"]*)['"])/;

			var result = pattern.exec(js);

			if (result == null) { 
				return undefined;
			}

			var names = ["source", "url"];
			var res = [];

			for (var i = 0; i < names.length; i++) {
				res[names[i]] = result[i];
			}

			return res;

		},

		isMailto: function (uri) {
			return uri.match(/^mailto:/)
		},

		isDocument: function (uri) {
			return uri.match(/\.(?:doc|docx|ppt|pptx|xls|xlsx|pdf|zip|rar|wma|mov|avi|wmv|mp3|csv)$/);
		},

		isSocialNetwork: function (uri) {			
			return uri.match(/(facebook|twitter|delicious|digg|stumbleupon)\./);
		},

		track: function (uri) {
			_gaq.push(["_trackPageview", uri]);
			//alert("track: '" + uri + "'");
		},

		bind: function (e, uri, isEmailto, isExternal, isSocialNetwork) {
			var p = uri;

			if (isEmailto !== undefined && isEmailto) {
				p = "/mailto/?to=" + uri.replace(/^mailto:/i, "");
			} else if (isExternal !== undefined && isExternal) {
				p = "/external/?url=" + encodeURIComponent(uri);
			} else if (isSocialNetwork !== undefined && isSocialNetwork) {
				p = "/socialnetwork/?url=" + encodeURIComponent(uri);
			}

			e.bind("click", function() {
				$.track(p);
				return true;
			});
		},

		domainsAreEqual: function(d1, d2) {
			if (d1 === undefined || d2 === undefined) {
				return false;
			}

			d1 = d1.replace(/^www\./gi, "");
			d2 = d2.replace(/^www\./gi, "");

			return d1 === d2;
		},

		trackLinks: function () { 
	
			$("a").each(function() {
				try {
					var href = $(this).attr("href");

					if (href !== undefined) {
						var url = $.parseUrl(href);

						if (url != null) {
							var js = $.parseJs(href)
							
							if ($.isMailto(href)) {
								$.bind($(this), href, true);
							} else if (js !== undefined && js["url"] !== undefined) {
								if ($.isDocument(js["url"])) {
									$.bind($(this), js["url"]);
								}
							} else {
								var authority = url["authority"];
								
								if (authority === undefined || $.domainsAreEqual(authority, location.host)) {
									var path = url["path"];

									if (path !== undefined && $.isDocument(path)) {
										$.bind($(this), path);
									}
								} else if (authority !== undefined) {
									if ($.isDocument(href)) {
										$.bind($(this), href, false, true);
									} else if ($.isSocialNetwork(href)) {
										$.bind($(this), href, false, false, true);
									}
								}
							}
						}
					}
				} catch(e) {
					// Ignore					
				}
			});

			$("img").each(function() {
				try {
					var onclick = $(this).attr("onclick");

					if (onclick !== undefined) {
						var js = $.parseJs(onclick);

						if (js != null) {
							var url = js["url"];

							if (url !== undefined) { 
								if ($.isDocument(url)) {
									$.bind($(this), url);
								} else if ($.isSocialNetwork(url)) {
									$.bind($(this), url, false, false, true);
								}
							}
						}
					}
				} catch(e) {
					// Ignore					
				}
			});
		}
	})

})(jQuery);		

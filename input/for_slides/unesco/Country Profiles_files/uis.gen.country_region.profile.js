function IsCountryProfileRequest() {

    var countryCode = getParameter("code");
    var regionCode = getParameter("regioncode");

    return countryCode && regionCode;
}

function getLocation() {
    $.getJSON("http://api.ipinfodb.com/v3/ip-country/?key=e6d55a6cb4f28a9d1fb5ccbaccbdfaf3653f9c50c8d2586775d5b667caadfe2b&format=json&callback=?",
			function (data) {

			    if (data.statusCode) {
			        $("#flag_section_img").attr("src", 'http://www.uis.unesco.org/DAS/Images/world_flags/' + data.countryCode + '.png');
			        $("#flag_section_img").css("display", "inline");

			        var countryAbbr = "";
			        var regionCode = "";

			        d3.json('http://www.uis.unesco.org/das/api/countries/?isocode=' + data.countryCode, function (rows) {

			            if (rows != null) {
			                countryAbbr = rows.CountriesDefinition[0]["Abbr"];

			                var language = getLanguage();
			                if (language == 'FR') {
			                    $("#country_title").text(rows.CountriesDefinition[0]["FrnLabel"]);
			                }
			                else {
			                    $("#country_title").text(rows.CountriesDefinition[0]["EngLabel"]);
			                }

			            }
			            else {
			                countryAbbr = 'CAN';
			                countryName = 'Canada';
			            }

			            d3.json('http://www.uis.unesco.org/das/api/countries/?countryabbr=' + countryAbbr, function (rows) {
			                if (rows != null) {
			                    regionCode = rows.CountriesDefinition[0]["Abbr"];
			                }
			                else {
			                    regionCode = '40510'; //world		
			                }

			                $("#me").attr("href", "http://www.uis.unesco.org/DataCentre/Pages/country-profile.aspx?regioncode=" + regionCode + "&code=" + countryAbbr);

			            });

			        });

			    }
			    else {
			        //alert("Cannot get IF for the country! Will default to Canada");
			        $("#me").attr("href", "http://www.uis.unesco.org/DataCentre/Pages/country-profile.aspx?code=CAN");
			        $("#flag_section_img").attr("src", 'http://www.uis.unesco.org/DAS/Images/world_flags/ca.png');
			    }

			});
}


function GetListItems() {

    var k = 0;
    var language = getLanguage();
    if (language == 'FR') {
        userCountry = 'Chercher votre pays';
    }
    else {
        userCountry = 'Searching your country';
    }

    $().SPServices({
        operation: "GetListItems",
        async: false,
        webURL: "http://www.uis.unesco.org/",
        listName: "Unesco Menu 4 Trial(1)",
        CAMLViewFields: "<ViewFields><FieldRef Name='Title' /><FieldRef Name='GroupOrder' /><FieldRef Name='ItemOrder' /><FieldRef Name='Link' /></ViewFields>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var shrp_lang = $(this).attr("ows_SharePoint_Item_Language");
                var link = $(this).attr("ows_Link");
                var groupOrder = $(this).attr("ows_GroupOrder");
                var itemTitle = $(this).attr("ows_Title");
                var itemOrder = $(this).attr("ows_ItemOrder");

                // highlight active item in navigation menu
                if (link !== undefined) {
                    var file = link.split('?')[0];
                    var pathanddomain = file.split('/');
                    var pathname = '';

                    if (pathanddomain.length > 2) {
                        path = pathanddomain.splice(3, pathanddomain.length - 1);
                        pathname = "/" + path.join('/');
                    }

                    if (pathname.toLowerCase() === window.location.pathname.toLowerCase()) {
                        if (groupOrder === "1") {
                            $("#profiles_section").addClass("nav-item-active");
                        }
                        else if (groupOrder === "2") {
                            $("#browse_section").addClass("nav-item-active");
                        }
                        else if (groupOrder === "3") {
                            $("#create_section").addClass("nav-item-active");
                        }
                    }
                }

                if (shrp_lang == 'SPS_LNG_' + language) {

                    if (typeof link === 'undefined' && groupOrder == "1") {
                        $('#view-profiles').text(itemTitle);
                    }
                    else if (typeof link === 'undefined' && groupOrder == "2") {
                        $('#browse-by-theme').text(itemTitle);
                    }
                    else if (typeof link === 'undefined' && groupOrder == "3") {
                        $('#create-dataset').text(itemTitle);
                    }
                    else if (groupOrder == "1") {
                        if ($(this).attr("ows_Link") != null) {

                            k = k + 1;

                            var liHtml = "<span class='span_item_nav'><a class='a_item_nav' href='" + $(this).attr("ows_Link") + "'>" + $(this).attr("ows_Title") + "</a></span>";
                            $("#viewProfile").append(liHtml);

                            if (k == 1) {

                                var flagHtml = "<span class='span_item_nav'><a id='me' class='a_item_nav' href=''><img style='display: none' id='flag_section_img' src='' alt='' ><span id='country_title'>" + userCountry + "</span></a></span>";
                                $("#viewProfile").append(flagHtml);
                            }
                        }
                    }
                    else if (groupOrder == "2") {
                        if ($(this).attr("ows_Link") != null) {
                            var liHtml = "<span class='span_item_nav'><a class='a_item_nav' href='" + $(this).attr("ows_Link") + "'>" + $(this).attr("ows_Title") + "</a></span>";
                            $("#browseTheme").append(liHtml);
                        }
                    }
                    else if (groupOrder == "3") {
                        if ($(this).attr("ows_Link") != null) {

                            if (itemOrder === "41") {
                                var liHtml = "<span class='span_item_nav'><a target='_blank' class='a_item_nav' href='" + $(this).attr("ows_Link") + "'>" + $(this).attr("ows_Title") + "</a></span>";
                                $("#createDataset").append(liHtml);
                            }
                            else {
                                var liHtml = "<span class='span_item_nav'><a class='a_item_nav' href='" + $(this).attr("ows_Link") + "'>" + $(this).attr("ows_Title") + "</a></span>";
                                $("#createDataset").append(liHtml);
                            }
                        }
                    }
                }

                $('#TitleSiteName').css("display", "none");
            });
        }
    }); //END SPServices
}

function LoadCountryRegionDropdown() {
    d3.loadData().json('ged_regions', 'http://www.uis.unesco.org/das/api/countries/?region=ALL')
   	             .json('ged_countries', 'http://www.uis.unesco.org/das/api/countries/?region=ALLCOUNTRIES')
		.onload(function (data) {
		    //create region matrix, this way we will know 
		    //what countries belong to what regions
		    read_ged_regional_data(data.ged_countries);

		    var countryCode = getParameter("code");
		    var regionCode = getParameter("regioncode");
		    var setCountryRegion = true;

		    if (typeof regionCode === "undefined" ||
	            regionCode == null ||
                regionCode == "null") {
		        regionCode = "40510"; //WORLD
		    }

		    var language = getLanguage();
		    var optionsText = "";

		    var dataforDropdown = [];
		    dataforDropdown.push({ EngLabel: "", FrnLabel: "", CoCode: 0, Abbr: "", RegAbbr: "" });

		    for (var i = 0; i < data.ged_regions.CountriesDefinition.length; i++) {
		        var reg = data.ged_regions.CountriesDefinition[i];
		        dataforDropdown.push(reg);


		        if (reg.Abbr != "40510") {

		            var countries = worldRegionMatrix[data.ged_regions.CountriesDefinition[i].Abbr];
		            countries.sort(compareCountry);

		            for (var j = 0; j < countries.length; j++) {
		                countries[j].RegAbbr = reg.Abbr;
		                dataforDropdown.push(countries[j]);


		                if (setCountryRegion &&
                            countries[j].Abbr == countryCode ||
                            countries[j].CoCode == countryCode) {

                            //set proper country name and region name
		                    if (language == 'FR') {
		                        $("#country-name").text(countries[j].FrnLongLabel);
		                    }
		                    else {
		                        $("#country-name").text(countries[j].EngLongLabel);
		                    }

		                    setCountryRegion = false;

		                }

		            }




		        }
		    }


		    if (language == 'FR') {
		        optionsText = 'Changez votre sélection';
		    }
		    else {
		        optionsText = 'Change your selection';
		    }

		    var pane = d3.selectAll(".RFPane").data(dataforDropdown);
		    pane.append("select").attr("data-placeholder", optionsText)
                                               .attr("id", "chosen")
                                               .attr("class", "chzn-select chzn-container")
					                           .attr("style", "width:389px;")
                                               .selectAll("option")
                                               .data(dataforDropdown)
                                               .enter().append("option")
                                               .attr("class", "chzn-container")
                                               .attr("style", function (d) {
                                                   if (d.CoCode != 0) {
                                                       return "margin-left:10px";
                                                   }
                                               })
                                               .attr("value", function (d) {
                                                   if (d.CoCode == 0)
                                                       return d.CoCode + "," + d.Abbr;
                                                   else
                                                       return d.Abbr + "," + d.RegAbbr;
                                               })
                                               .text(function (d) {

                                                   var rtLb = language == 'FR' ? d.FrnLabel : d.EngLabel;
                                                   if (d.CoCode == 0) {
                                                       rtLb = rtLb.toUpperCase();
                                                   }

                                                   return rtLb;
                                               });

		    $(".chzn-select").chosen();
		    //$(".chzn-select-deselect").chosen({ allow_single_deselect: true }); 



		    $('.RFPane').on('change', '#chosen', function (d) {

		        var cntry_region = this.value.split(',');

		        if (cntry_region[0] == 0) {
		            window.location.href = "http://www.uis.unesco.org/DataCentre/Pages/region-profile.aspx?regioncode=" + cntry_region[1];

		        }
		        else {
		            window.location.href = "http://www.uis.unesco.org/DataCentre/Pages/country-profile.aspx?code=" + cntry_region[0] + "&regioncode=" + cntry_region[1];

		        }
		    });

		});
}

function setCookie(c_name, value) {
    var c_value = escape(value);
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function SetActiveTab(tabName) {
    switch (tabName) {
        case ('edu'):
            $("#edu").attr("src", "http://www.uis.unesco.org/das/Country/?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
            $("#tabs").tabs("option", "active", 0);
            break;
        case ('lit'):
            $("#lit").attr("src", "http://www.uis.unesco.org/das/Country/Literacy?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
            $("#tabs").tabs("option", "active", 1);
            break;
        case ('sti'):
            $("#sti").attr("src", "http://www.uis.unesco.org/das/Country/Science?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
            $("#tabs").tabs("option", "active", 2);
            break;
        case ('cul'):
            $("#cul").attr("src", "http://www.uis.unesco.org/das/Country/Culture?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
            $("#tabs").tabs("option", "active", 3);
            break;
    }
}


function ResizeTabEdu() {
    var hEdu = $("#edu").contents().height();
    if (hEdu !== fEdu) {
        fEdu = hEdu;
        $("#edu").css({ 'height': fEdu + "px" });
    }

    if (secTot < 10) {
        secTot++;
        setTimeout(ResizeTabEdu, dResize);
    }
}

function ResizeTabLit() {
    var hLit = $("#lit").contents().height();
    if (hLit !== fLit) {
        fLit = hLit;
        $("#lit").css({ 'height': fLit + "px" });
    }

    if (secTot < 10) {
        secTot++;
        setTimeout(ResizeTabLit, dResize);
    }
}

function ResizeTabSti() {
    var hSti = $("#sti").contents().height();
    if (hSti !== fSti) {
        fSti = hSti;
        $("#sti").css({ 'height': fSti + "px" });
    }

    if (secTot < 10) {
        secTot++;
        setTimeout(ResizeTabSti, dResize);
    }
}

function ResizeTabCul() {
    var hCul = $("#cul").contents().height();
    if (hCul !== fCul) {
        fCul = hCul;
        $("#cul").css({ 'height': fCul + "px" });
    }

    if (secTot < 10) {
        secTot++;
        setTimeout(ResizeTabCul, dResize);
    }
}

function OnCountryProfileLoad() {

    var country = getParameter("code");
    var regionCode = getParameter("regioncode");
    var language = getLanguage();

    var tabName = getCookie("selectedtab");
    if ((typeof tabName == "undefined") || tabName == null || tabName == "") {
        tabName = 'edu';
        $("#edu").attr("src", "http://www.uis.unesco.org/das/Country/?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
    }


    $('#tabs').tabs().on('click', function (d) {

        var dResize = 2000;
        var fEdu = 0;
        var fLit = 0;
        var fSti = 0;
        var fCul = 0;
        var secTot = 0;

        switch (d.target.id) {

            case ('ui-id-1'):
                if (($("#edu").attr("src")) == "") {
                    $("#edu").attr("src", "http://www.uis.unesco.org/das/Country/?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
                }
                setCookie("selectedtab", "edu");
                //console.log("edu height =" + $("#edu").contents().height());
                setTimeout(ResizeTabEdu, dResize);
                break;
            case ('ui-id-2'):
                if (($("#lit").attr("src")) == "") {
                    $("#lit").attr("src", "http://www.uis.unesco.org/das/Country/Literacy?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
                }
                setCookie("selectedtab", "lit");
                //console.log("lit height=" + $("#lit").contents().height());
                setTimeout(ResizeTabLit, dResize);
                break;
            case ('ui-id-3'):
                if (($("#sti").attr("src")) == "") {
                    $("#sti").attr("src", "http://www.uis.unesco.org/das/Country/Science?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
                }
                setCookie("selectedtab", "sti");
                //console.log("sti height=" + $("#sti").contents().height());
                setTimeout(ResizeTabSti, dResize);
                break;
            case ('ui-id-4'):
                if (($("#cul").attr("src")) == "") {
                    $("#cul").attr("src", "http://www.uis.unesco.org/das/Country/Culture?code=" + country + "&regioncode=" + regionCode + "&SPSLanguage=" + language);
                }
                setCookie("selectedtab", "cul");
                //console.log("cul height=" + $("#cul").contents().height());
                setTimeout(ResizeTabCul, dResize);
                break;
        }
    });


    $("#edu").css({ 'height': "4600px" });  //4600px
    $("#lit").css({ 'height': "2000px" }); 	//2200px
    $("#sti").css({ 'height': "4000px" }); 	//4300px
    $("#cul").css({ 'height': "3000px" }); 	//3700px


   /* $("#tabs ul li").css({ 'margin-right': '30px' });
    $("#tabs ul li").css({ 'margin-left': '-18px' });
    $("#tabs ul li").css({ 'margin-top': '-10px' });
    $('.ui-widget-header').css('background', 'none');
    $('.ui-widget-header').css('border-top-style', 'none');
    $('.ui-widget-header').css('border-right-style', 'none');
    $('.ui-widget-content').css('border-top-style', 'none');
    $('.ui-widget-content').css('border-top-right-radius', '0px');
    $('.ui-widget-content').css('border-top-left-radius', '0px');
    $("#tabs ul li").css({ 'border-top-left-radius': '0px' });
    $("#tabs ul li").css({ 'border-top-right-radius': '0px' });
    $("#tabs ul li").css({ 'border-bottom-left-radius': '0px' });
    $("#tabs ul li").css({ 'border-bottom-right-radius': '0px' });

    $('.ui-widget-content').css('border-left-style', 'none');
    $('.ui-widget-content').css('border-right-style', 'none');
    $('.ui-widget-content').css('border-bottom-style', 'none');
    */

    LoadCountryRegionDropdown();

    FixBreadCrumbs();

    SetActiveTab(tabName);
}





function OnRegionProfileLoad() {
    var country = getParameter("code");
    var regioncode = getParameter("regioncode");
    var language = getLanguage();

    $("#edu").attr("src", "http://www.uis.unesco.org/das/?regioncode=" + regioncode + "&SPSLanguage=" + language);
    $('#tabs').tabs().on('click', function (d) {
        switch (d.target.id) {

            case ('ui-id-1'):
                if (($("#edu").attr("src")) == "") {
                    $("#edu").attr("src", "http://www.uis.unesco.org/das/?regioncode=" + regioncode + "&SPSLanguage=" + language);
                }
                break;
            case ('ui-id-2'):
                if (($("#lit").attr("src")) == "") {
                    $("#lit").attr("src", "http://www.uis.unesco.org/das/?regioncode=" + regioncode + "&SPSLanguage=" + language);
                }
                break;
            case ('ui-id-3'):
                if (($("#sti").attr("src")) == "") {
                    $("#sti").attr("src", "http://www.uis.unesco.org/das/?regioncode=" + regioncode + "&SPSLanguage=" + language);
                }
                break;
            case ('ui-id-4'):
                if (($("#cul").attr("src")) == "") {
                    $("#cul").attr("src", "http://www.uis.unesco.org/das/?regioncode=" + regioncode + "&SPSLanguage=" + language);
                }
                break;
        }

    });

   /*
    $("#tabs ul li").css({ 'margin-right': '30px' });
    $("#tabs ul li").css({ 'margin-left': '-18px' });
    $("#tabs ul li").css({ 'margin-top': '-10px' });
    $('.ui-widget-header').css('background', 'none');
    $('.ui-widget-header').css('border-top-style', 'none');
    $('.ui-widget-header').css('border-right-style', 'none');
    $('.ui-widget-content').css('border-top-style', 'none');
    $('.ui-widget-content').css('border-top-right-radius', '0px');
    $('.ui-widget-content').css('border-top-left-radius', '0px');
    $("#tabs ul li").css({ 'border-top-left-radius': '0px' });
    $("#tabs ul li").css({ 'border-top-right-radius': '0px' });
    $("#tabs ul li").css({ 'border-bottom-left-radius': '0px' });
    $("#tabs ul li").css({ 'border-bottom-right-radius': '0px' });

    $('.ui-widget-content').css('border-left-style', 'none');
    $('.ui-widget-content').css('border-right-style', 'none');
    $('.ui-widget-content').css('border-bottom-style', 'none');
   */

    LoadCountryRegionDropdown();

    FixBreadCrumbs();

}


function highlightMenu(_this) {
    $(_this).attr("style", "background-color: #605F5D !important");
}

function registerMenuEvents() {
    $('.nav-item-container').mouseenter(function () { highlightMenu(this); });
    $('.nav-item-container').mouseleave(function () { hideMenu(this); });
    $('.nav-item-container').click(function () { showMenu(this); });
}

function showMenu(_this) {
    var id = $(_this).attr('id');
    var idList = id + "_list";
    var list = $('#' + idList);

    $(_this).attr("style", "background-color: #605F5D !important");
    if (list.css('display') === 'none') {
        list.css("display", "block");
    }

    if (id === 'profiles_section') {
        getLocation();
    }
}

function hideMenu(_this) {
    var id = $(_this).attr('id');
    var idList = id + "_list";
    var list = $('#' + idList);

    $(_this).removeAttr("style");
    list.removeAttr("style");
}

// Fix item from breadcrumb trail
function FixBreadCrumbs() {

    var countryCode = getParameter("code");
    var regionCode = getParameter("regioncode");
    var sector = getParameter("sector");
    var language = getLanguage();
	
	if(language == 'FR')
	{
	    //FIX FOR TRANSLATOR NOT SWITCHING LANGUAGE
		$('a[href^="/datacentre/pages/default.aspx"]').each(function()
		{ 
			this.href = this.href.replace("default.aspx", "defaultFR.aspx");
		});
	}

	
    $("Span[id='ctl00_MyPlaceHolderTitleBreadcrumb_ContentMap']").children().each(function () {
        var txt = $(this).text();
        if (this.children.length >= 1 &&
	   this.children[0].className.indexOf("breadcrumbCurrent") > 0) {
            if (sector != null) {
                this.children[0].href += "?sector=" + sector;
            }
            else if (countryCode != null && this.children[0].href.indexOf("code") <= 0 ) {
                this.children[0].href += "?code=" + countryCode + "&regioncode=" + regionCode;
            }
            else if (regionCode != null && this.children[0].href.indexOf("regioncode") <= 0 ) {
                this.children[0].href += "?regioncode=" + regionCode;
            }
			
			//quick fix for hide last link
			if( this.children[0].href.indexOf("defaultFR.aspx") > 0 ) {
				this.children[0].style.display = 'none';
				this.children[0].hidden = true;
			}
			
			//temporaty while we are in beta TODO: remove if stmnt
			//if(language == 'EN' && this.children[0].href.indexOf("/DataCentre/Pages/default.aspx") > 0) 
			//{
			//	if ( this.children[0].innerHTML.indexOf("beta") <= 0 )
			//	   this.children[0].innerHTML += " - beta"; 
			//}
        }
		else if (this.children.length >= 1 &&
		         this.children[0].className.indexOf("Breadcrumb") > 0) {
			//quick fix for the default.aspx page
			if(language == 'FR' && this.children[0].href.indexOf("/DataCentre/Pages/default.aspx") > 0)
			{
			    this.children[0].href = this.children[0].href.replace("default.aspx", "defaultFR.aspx");
				//if ( this.children[0].innerHTML.indexOf("bêta") <= 0 )
				//	this.children[0].innerHTML += " - bêta"; //temporaty while we are in beta todo: remove this line
			}
			//temporaty while we are in beta TODO: remove else if stmnt
			//else if(language == 'EN' && this.children[0].href.indexOf("/DataCentre/Pages/default.aspx") > 0) 
			//{
			//	if ( this.children[0].innerHTML.indexOf("beta") <= 0 )
			//		this.children[0].innerHTML += " - beta";
			//}
		}
		
    });
}

/*function RemoveLinksFromBreadCrumb(linksToRemoveFromBreadCrumb) {

    var countryCode = getParameter("code");
    var regionCode = getParameter("regioncode");
    var sector = getParameter("sector");
    
    $("Span[id='ctl00_MyPlaceHolderTitleBreadcrumb_ContentMap']").children().each(function () {
        var txt = $(this).text();
        if (this.children.length >= 1 &&
	   this.children[0].className.indexOf("breadcrumbCurrent") > 0) {
            if (sector != null) {
                this.children[0].href += "?sector=" + sector;
            }
            else if (countryCode != null) {
                this.children[0].href += "?code=" + countryCode + "&regioncode=" + regionCode;
            }
        }
    });
}*/
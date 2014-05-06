// Table des matières des fonctions :
//12- getQueryVariable 


// Variable à mettre du coté client :
//{ddwrt:ListProperty('Name')}   -   Donne le GUID de la list avec les "{"  - Ex. {466CFA4B-1DC6-43B7-8AD9-1381093DE280}
//{ddwrt:GetVar('RootFolder')}   -   Donne le path du Root folder d'une liste, sans le "/" au début   ex. "PublicDocuments"
//{$PagePath} 			 -   Donne l'URL relative de la page courrante - ex "/it/TSAG/Pages/AllDocuments.aspx"

//Variable coté server
// L_Menu_BaseUrl  		- DOnne l'url du site courant

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == variable)
        {
            return pair[1];
        }
    }
}
function navigateTo(RelativeDestinationPath)
//ex. onclick="javascript:navigateTo_QueryString('/pages/OperationsApp.aspx'"
{
    //done le URL relatif d'un site SharePoint. Attention, URL du site et non de la page. ex. /sites/TSAG/SubSite/
    var SiteUrl = L_Menu_BaseUrl;
    window.location.href = SiteUrl + RelativeDestinationPath;
}
function navigateTo_QueryString(RelativeDestinationPath, Parameter1Name, Parameter1Value, IDParameter2Name, IDParameter2Value)
//ex. onclick="javascript:navigateTo_QueryString('/pages/OperationsApp.aspx','OpeApp','{@Title}','OpeAppID','{@ID}')"
//Le paramètre2 doit être un paramètre qui est un ID d'une liste SharePoint.
{
    //done le URL relatif d'un site SharePoint. Attention, URL du site et non de la page. ex. /sites/TSAG/SubSite/
    var SiteUrl = L_Menu_BaseUrl;
    //Le drop-down dans la page newform.aspx semble etre decaler de 1 par rapport a la valeur reelle du ID.
    var IDParameter2Value = IDParameter2Value++;
    window.location.href = SiteUrl + RelativeDestinationPath + "?" + Parameter1Name + "=" + Parameter1Value + "&" + IDParameter2Name + "=" + IDParameter2Value;
}
function navigateTo_UploadDocument(ListGUIDEncoded, RelativeRootFolder, RelativeSourcePath)
//ex : javascript:navigateTo_UploadDocument('{ddwrt:ListProperty('Name')}','{ddwrt:GetVar('RootFolder')}','{$PagePath}')
//ex : javascript:navigateTo_UploadDocument('%7B2EDB160F%2DCF17%2D497F%2DBBA2%2D2FD1F68EC8C0%7D','/Documents','/Pages/OperationsApp.aspx')
{
    var SiteUrl = L_Menu_BaseUrl;
    var ParametersStart = window.location.href.indexOf('?');
    var RelativeRootFolderEncoded = encodeURIComponent(RelativeRootFolder);
    var SiteUrlEncoded = encodeURIComponent(SiteUrl);
    var RelativeSourcePathEncoded = encodeURIComponent(RelativeSourcePath);

    window.location.href = SiteUrl + "/_layouts/upload.aspx?" + "List=" + ListGUIDEncoded + "&RootFolder=" + "&Source=" + RelativeSourcePathEncoded;
}
function navigateTo_GoToItemWithSource(RelativeDestinationPath, ID, RelativeSourcePath, QueryToTransfert1, QueryToTransfert2)
//ex : onclick="javascript:navigateTo_UploadDocumentTransfert2QueryStringWithSource('%7B2EDB160F%2DCF17%2D497F%2DBBA2%2D2FD1F68EC8C0%7D','/Documents','/Pages/OperationsApp.aspx','OpeApp','OpeAppID')
// work with dispitem.aspx and edititem.aspx
{
    var ParametersStart = window.location.href.indexOf('?');
    var SiteUrl = L_Menu_BaseUrl;

    var QueryToTransfert1Value = getQueryVariable(QueryToTransfert1)
    var QueryToTransfert2Value = getQueryVariable(QueryToTransfert2)
    var SiteUrlEncoded = encodeURIComponent(SiteUrl);
    var RelativeSourcePathEncoded = encodeURIComponent(RelativeSourcePath);
    if (ParametersStart > 0)
    {
        window.location.href = SiteUrl + RelativeDestinationPath + "?ID=" + ID + "&Source=" + SiteUrlEncoded + RelativeSourcePathEncoded + "%3F" + QueryToTransfert1 + "=" + QueryToTransfert1Value + "%26" + QueryToTransfert2 + "=" + QueryToTransfert2Value;
    }
    else
    {
        window.location.href = SiteUrl;
    }
}


// Determines if the web part page is in design mode by looking at hidden fields produced by SharePoint
function IsDesignMode()
{
    // Is the web part page in design mode?
    if (document.forms['aspnetForm']['MSOLayout_InDesignMode'].value == '1')
        return true;
    else
        return false;
}

$(document).ready(function()
{
    if (IsDesignMode())
        return;

    ShowHideSummary();
    ShowHideContent();
	FixSharepointTranslator();
});

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function FixSharepointTranslator()
{
	var langParam  = getQueryVariable("SPSLanguage");
	var langCookie = getCookie("SharePointTranslator");
	
	if((typeof langParam != "undefined") && langParam != "" && langParam != langCookie)
	{
		createCookie("SharePointTranslator", langParam, 30);
	}
	else if(langCookie == "" && (typeof langParam == "undefined") )
	{
		createCookie("SharePointTranslator", "EN", 30);
	}
}

function ShowHideSummary()
{
    var pageContent1 = $("#PageContent1")
    pageContent1.hide();

    var learnMore1 = $("a.PageContentLearnMore1");
    learnMore1.click(TogglePageContent1);

    var hide1 = $("a.PageContentHide1");
    hide1.hide().click(TogglePageContent1);

    $("a.PageContentHide2").hide();
    $("a.PageContentLearnMore2").hide();
        
    function TogglePageContent1()
    {
        pageContent1.toggle();
        learnMore1.toggle();
        hide1.toggle();
    }
}

function ShowHideContent()
{
    // Init center zone.
    $("a.show").hide();
    $("a.hide").hide();
    $("#TL2LeftZoneBottom").hide();

    // Init right zone.
    $("a.show-right").hide();
    $("a.hide-right").hide();
    $("#TL2RightZoneBottom").hide();

    var itemCount = 0;

    // Small library.
    itemCount = $(".SmallLibraryItem").length;
    if (itemCount > 8)
    {
        $("a.show:first").show().click(ToggleSmallLibrary);
        $("a.hide:last").show().click(ToggleSmallLibrary);
    }

    // Other resources. 
    itemCount = $("div.unesco-resources2-item").length;
    if (itemCount > 8)
    {
        $("a.show-right:first").show().click(ToggleOtherResource);
        $("a.hide-right:last").show().click(ToggleOtherResource);
    }
   
    function ToggleSmallLibrary()
    {
        $("#TL2LeftZoneTopContent").toggle();
        $("#TL2LeftZoneBottom").toggle();
    }

    function ToggleOtherResource()
    {
        $("#TL2RightZoneTopContent").toggle();
        $("#TL2RightZoneBottom").toggle();
    }
}

function onLoadHide()
{
    // empty, only presents for not raising error.
}

function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function changeBandeauPleinEx()
{
    langue = navigator.language;
    langue1 = navigator.browserLanguage;
    nom = navigator.appName;
    if (langue1 == "en-us")
    {
        document.getElementById('bandeauPleinEx2').className = 'bandeauPleinEx-EN';
    }
    else if (langue == "en-us")
    {
        document.getElementById('bandeauPleinEx2').className = 'bandeauPleinEx-EN';
    }
    else
    {
        document.getElementById('bandeauPleinEx2').className = 'bandeauPleinEx';
    }
}

function showSendMail(urlrelative, querystring, nom, largeur, hauteur, options)
{
    var url = location.protocol + '//' + location.host + urlrelative + '?' + querystring + '=' + location.href;
    var haut = (screen.height - hauteur) / 2;
    var Gauche = (screen.width - largeur) / 2;
    window.open(url, nom, "top=" + haut + ",left=" + Gauche + ",width=" + largeur + ",height=" + hauteur + "," + options);
}

function setDefaultSearchScope() {
	var url = window.location.href.toLowerCase();
	var index = 1;
	if (url.indexOf('uis.unesco.org/datacentre') > -1 || url.indexOf('s=dot_stat') > -1) {
		index = 3;
	}
	else if (url.indexOf('uis.unesco.org/library') > -1 || url.indexOf('s=document%20library') > -1) {
		index = 2;
	}
	var selector = ".ms-sbscopes select :nth-child(" + index + ")";
	
	$(selector).attr("selected", "true")
}

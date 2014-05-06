d3.loadData = function () {
    var loadedCallback = null;
    var toload = {};
    var data = {};
    var loaded = function (name, d) {
        delete toload[name];
        data[name] = d;
        return notifyIfAll();
    };
    var notifyIfAll = function () {
        if ((loadedCallback != null) && d3.keys(toload).length === 0) {
            loadedCallback(data);
        }
    };
    var loader = {
        json: function (name, url) {
            toload[name] = url;
            d3.json(url, function (d) {
                return loaded(name, d);
            });
            return loader;
        },
        csv: function (name, url) {
            toload[name] = url;
            d3.csv(url, function (d) {
                return loaded(name, d);
            });
            return loader;
        },
        onload: function (callback) {
            loadedCallback = callback;
            notifyIfAll();
        }
    };
    return loader;
};

//Akufen defined colors.
var bar_color1          = "#96F2F1";
var bar_color2          = "#13CBC9";
var bar_color3          = "#FCAE27";
var line_color          = "#424242";
var nodata_color        = "#E2E2E2";
var graphMultipleColors = ["#7C0AC9", "#0AC9C7", "#FE6D1A", "#65D6FC", "#605F5D", "#0054AF", "#FCAE26"];
var PieChartColor       = ["#0AC9C7", "#C9AA0A", "#7C0AC9"];

var language = "EN";

var progCompTable = [];
var regionsDef    = [];
var indicGenMap   = d3.map();
var stringLangMap = d3.map();

var worldRegionMatrix = {};
var countryInformationArray = [];
var formatNumber2p    = d3.format('0.2f');
var formatNumber1p    = d3.format('0.2f');
var formatNumber0p    = d3.format('0.0f');

var populationSchool  = "SAP_0,SAP_1,SAP_23,SAP_56";
var educationBeginEnd = "400,401,402,403,404,901208,901209,901210";

var agesByLevel      = "299902,299905,299929,299932,299908,299935,1000,1030,299914,299941";
var agesByLevelOfEdu = populationSchool + "," + agesByLevel + "," + educationBeginEnd;
var progCompInEduc   = "SLE_1T6,SLE_1T6_F,SLE_1T6_M,REPP_1,REPP_1_F,REPP_1_M,SR_1_GLAST_CP,SR_1_GLAST_F_CP,SR_1_GLAST_M_CP,AIR_1_GLAST,AIR_1_GLAST_F,AIR_1_GLAST_M,TRANRA_23_GPV_CP,TRANRA_23_GPV_F_CP,TRANRA_23_GPV_M_CP";

var generalIndicators    = "NY_GDP_MKTP_PP_CD,NY_GDP_MKTP_KD_ZG,SP_DYN_IMRT_IN,DT_TDS_DECT_GN_ZS,SP_POP_GROW,SI_POV_2DAY,SP_DYN_TFRT_IN,SH_DYN_AIDS_ZS,NY_GDP_PCAP_PP_CD,SP_DYN_LE00_IN,SP_RUR_TOTL_ZS";
var populationIndicators = "P_AG0T99,P_AG0T99_F,P_AG15T99,P_AG15T99_F,P_AG30T34,P_AG30T34_F,P_AG35T39,P_AG35T39_F,P_AG40T44,P_AG40T44_F,P_AG45T49,P_AG45T49_F,P_AG50T54,P_AG50T54_F,P_AG55T59,P_AG55T59_F,P_AG5T79,P_AG5T79_F,P_AG60T64,P_AG60T64_F,P_AG65T69,P_AG65T69_F,P_AG70T74,P_AG70T74_F,P_AG75T79,P_AG75T79_F,P_AG80T99,P_AG80T99_F,P_AG0T4,P_AG0T4_F,P_AG10T14,P_AG10T14_F,P_AG15T19,P_AG15T19_F,P_AG20T24,P_AG20T24_F,P_AG25T29,P_AG25T29_F,P_AG5T9,P_AG5T9_F";

var numbOfChildrenPre14 = 0;
var numbOfChildern15t24 = 0;
var totalNumberOfPeople = 0;

var month = new Array();
month[0] = "JAN";
month[1] = "FEB";
month[2] = "MAR";
month[3] = "APR";
month[4] = "MAY";
month[5] = "JUN";
month[6] = "JUL";
month[7] = "AUG";
month[8] = "SEP";
month[9] = "OCT";
month[10] = "NOV";
month[11] = "DEC";

function p_ShowCntryReg() {
  $('#country-region-name').show();
  
}

function p_SetDocTitle() {
  $("#country-name").css("font-family","Arial");
  $("#country-name").css("font-size","24px");
  $("#region-name").css("font-family","Arial"); 
  $("#region-name").css("font-size","16px");  
  $("#region-name").css("font-weight","bold");
  document.title = $("#country-name").text() + ", " + $('#region-name').text();
}

function p_HideCntryReg() {
 $('#country-region-name').hide();
}

function p_ShowPrintableVersion() {

  p_ShowCntryReg();

  p_SetDocTitle();

  window.print();

  p_HideCntryReg();
}

function thousandSep(val) {
            return String(val).split("").reverse().join("")
                  .replace(/(\d{3}\B)/g, "$1,")
                  .split("").reverse().join("");
}


function formatStringForSVGDisplay(val ) {

var retval ="";
if (!(typeof val === "undefined")) {
    retval  = val.replace(new RegExp("&eacute;", 'g'),"\xE9"); 
    retval  = retval.replace(new RegExp("&egrave;", 'g'),"\xE8"); 
    retval  = retval.replace(new RegExp("&ecirc;",  'g'),"\xEA"); 

    retval  = retval.replace(new RegExp("&aacute;",  'g'),"\xE1"); 
    retval  = retval.replace(new RegExp("&agrave;",  'g'),"\xE0"); 
    retval  = retval.replace(new RegExp("&acirc;",  'g'),"\xE2"); 
    retval  = retval.replace(new RegExp("&Eacute;",  'g'),"\xC9"); 
}

return retval;

}

function get_ents(str){
var temp=document.createElement("pre");
temp.innerHTML=str;
return temp.firstChild.nodeValue;
}

function range(start, end, delta) {
   
   if (typeof delta === "undefined") 
   {
    delta = 1;
   }

    if(arguments.length == 1) {
        count = start;
        start = 0;
    }

    var range = [];
    for (var i = 0; i < (end-start); i+=delta ) {
        range.push(start + i);
    }
    return range;
}

function strRange(start, end) {
   
    if(arguments.length == 1) {
        count = start;
        start = 0;
    }

    var range = [];
    for (var i = 0; i <= (end-start); i++) {
        range.push(  (start + i).toString() );
    }
    return range;
}

function getParameter(paramName) {
    var searchString = window.location.search.substring(1),
            i, val, params = searchString.split("&");

    for (i = 0; i < params.length; i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
            return unescape(val[1]);
        }
    }
    return null;
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

function getLanguage() {

    var lang = getParameter('SPSLanguage');

    if (lang != null) {
        lang = lang.toUpperCase();
    }

    if(lang === 'EN' || lang === 'FR' ) //two supported languages
    {
        return lang;
    }
    
	lang = getCookie('SharePointTranslator');

    if (lang != null) {
        lang = lang.toUpperCase();
    }

    return lang === 'FR' ? 'FR' : 'EN';
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

function getConfigParam( data, page ) {

var res_dat={start_yr:0,end_yr:0}; 

    for (i = 0; i < data.config.length; i++) {

        if ( data.config[i].page == page ) {
            res_dat.start_yr = data.config[i].start_yr;
            res_dat.end_yr = data.config[i].end_yr;
            break;
        }
    }
    return res_dat;
}

function getStringFromDict(str) {

    var res_str = stringLangMap.get(str);

    if (!(typeof res_str === "undefined")) {

        if (language == "FR") {
            res_str = res_str.FRN_NAME;
        }
        else {
            res_str = res_str.ENG_NAME;
        }
    }

    return res_str;

}

function getIndicatorTitle(Indicator) {

    if (language == "FR") {
        return Indicator.FRN_NAME;
    }
    return Indicator.ENG_NAME;
}

function getIndicatorNote(Indicator) {
    if (language == "FR") {
        return Indicator.FRN_NOTE;
    }
    return Indicator.ENG_NOTE; 
}

function getIndicatorDescription(Indicator) {

    var result = indicGenMap.get(Indicator.Indicator);
    return result;
}

function getIndicatorDescriptionByStr(Indicator) {

    var result = indicGenMap.get(Indicator);
    return result;
}


function initAndRun( runf )
{
    d3.loadData()
          .csv('indicators', './../Country_Data/indicatorsGen.csv')
          .csv('strings',    './../Country_Data/stringDict.csv'   )
          .onload(function (data) {
              createStringMaps(data.indicators, data.strings);

              runf();
          });
}

function signViz( selector ) {
    d3.select(selector)
      .attr("class", "educ-system-title")
      .attr("align", "right")
      .text('Data Source: UIS');
}

function createStringMaps(indicators, strings) {

         //create a map from indicator list - will be easier to match indicator when we need to!!!
         if ( indicators != null )
         {
                  for(var i =0; i < indicators.length;i++)
                  {
                      indicGenMap.set(indicators[i].INDICATOR, {
                          ENG_NAME: indicators[i].ENG_NAME,
                          FRN_NAME: indicators[i].FRN_NAME,
                          ENG_NOTE: indicators[i].ENG_NOTE,
                          FRN_NOTE: indicators[i].ENG_NOTE, //TODO: Change the note!!!
                      });
                  }
           }
           if ( strings  != null  )
           {
                  for(var i =0; i < strings.length;i++)
                  {
                      stringLangMap.set(strings[i].STR_NAME, {
                          ENG_NAME: strings[i].ENG_NAME,
                          FRN_NAME: strings[i].FRN_NAME,
                      });
                  }
           }
}

function showData(xval, yval, d) {

    var infobox = d3.select(".infobox");
    // now we just position the infobox roughly where our mouse is
    infobox.style("left", xval + 10 + "px");
    infobox.style("top", yval - 190 + "px");
    $(".infobox").html(d);
    $(".infobox").show();
}

function hideData() {
    $(".infobox").hide();
}

function setRegionName( regCode ) {

  d3.json('./../api/countries/?region=ALL', function (ged_regions) {
                      for (i = 0; i < ged_regions.CountriesDefinition.length; i++) {
                          if (ged_regions.CountriesDefinition[i].Abbr == regCode) {
                              if (language == 'FR') {
                                  $('#region-name').text(ged_regions.CountriesDefinition[i].FrnLabel);
                              }
                              else {
                                  $("#region-name").text(ged_regions.CountriesDefinition[i].EngLabel);
                              }
                          }
                      }
          });
}

function setCountryRegionName()
{
        var cntryCode = getParameter("code");
        var regCode   = getParameter("regioncode");

       if ( typeof regCode === "undefined" || 
            regCode ==  null ||
            regCode == "null" ) {
            regCode = "ALLCOUNTRIES"; //WORLD
       }

         d3.json('./../api/countries/?region=' + regCode, function (countries) {

                      for (i = 0; i < countries.CountriesDefinition.length; i++) {

                          if (countries.CountriesDefinition[i].Abbr == cntryCode || 
                              countries.CountriesDefinition[i].CoCode == cntryCode) {

                              setRegionName( countries.CountriesDefinition[i].RegCode );

                              if (language == 'FR') {
                                  $('#country-name').text(countries.CountriesDefinition[i].FrnLongLabel);
                                  break;
                              }
                              else {
                                  $("#country-name").text(countries.CountriesDefinition[i].EngLongLabel);
                                  break;
                              }
                          }
                      }
                  });
}

function findRegionNameForCountry(country) {

    var ret = "";
    for (var instance in worldRegionMatrix) {
        for (var j = 0; j < worldRegionMatrix[instance].length; j++) {
            if (country == worldRegionMatrix[instance][j].Abbr) {
                ret = instance;
                break;
            }
        }
    }

    if (ret != "") {
        for (var j = 0; j < regionsDef.CountriesDefinition.length; j++) {
            if (regionsDef.CountriesDefinition[j].Abbr == ret) {
                ret = (language == 'FR' ? regionsDef.CountriesDefinition[j].FrnLabel : regionsDef.CountriesDefinition[j].EngLabel);
                break;
            }
        }
    }

    return ret;
}

function read_ged_regional_data( countries ) 
{
    worldRegionMatrix['40510'] = [];
    for (var i = 0; i < countries.CountriesDefinition.length; i++) {

         if( typeof worldRegionMatrix[ countries.CountriesDefinition[i].RegCode ] === "undefined" )
         {
             worldRegionMatrix[countries.CountriesDefinition[i].RegCode] = [];
         }

         worldRegionMatrix[ countries.CountriesDefinition[i].RegCode ].push( countries.CountriesDefinition[i] );
         worldRegionMatrix[ '40510' ].push( countries.CountriesDefinition[i] );

         if(typeof countryInformationArray[countries.CountriesDefinition[i].Abbr] === "undefined" )
            countryInformationArray[countries.CountriesDefinition[i].Abbr] = countries.CountriesDefinition[i];
     }
 }


 function compareCountry(a,b) {

  var aname = (language == 'FR' ? a.FrnLabel : a.EngLabel);
  var bname = (language == 'FR' ? b.FrnLabel : b.EngLabel);

  return aname.localeCompare(bname);

//  if (aname < bname)
//     return -1;
//  if (aname > bname)
//    return 1;

//  return 0;
}

var general_indic_order = ["TOTAL", "SP_POP_GROW", "CHILDREN", "SP_RUR_TOTL_ZS", "SP_DYN_TFRT_IN", "SP_DYN_IMRT_IN", "SP_DYN_LE00_IN", 
                           "SH_DYN_AIDS_ZS", "SI_POV_2DAY", "NY_GDP_PCAP_PP_CD", "NY_GDP_MKTP_KD_ZG", "DT_TDS_DECT_GN_ZS", "NY_GDP_MKTP_PP_CD"];

var geninfoIndicatorsLabelValue = [];

function displayGeneralData(indicators, maxYr) {

    
    var i, j;
    var generalIndicMap = d3.map();

    for (i = 0; i < indicators.length; i++) {
        generalIndicMap[indicators[i].Indicator] = indicators[i];
    }


    for(i = 0; i < general_indic_order.length; i++) {

        if(general_indic_order[i] == "TOTAL")
        {
            geninfoIndicatorsLabelValue.push({ label: getStringFromDict('TOTAL_POPUL'), value: thousandSep(totalNumberOfPeople)   });
        }
        else if(general_indic_order[i] == "CHILDREN")
        {
            if (numbOfChildern15t24 > 0) {

                geninfoIndicatorsLabelValue.push({ label: getStringFromDict('ADOLESC_POPUL'), value: thousandSep(numbOfChildern15t24)   });
            }

            if (numbOfChildrenPre14 > 0) {

                geninfoIndicatorsLabelValue.push({ label: getStringFromDict('CHILDREN_POPUL'), value: thousandSep(numbOfChildrenPre14)  });
            }
        }
        else
        {
            var indicInfo = generalIndicMap[ general_indic_order[i] ];
            var indicTitle = getIndicatorTitle( getIndicatorDescriptionByStr( general_indic_order[i] ) );

            if(!(typeof indicInfo === "undefined")){

                var val = indicInfo.Value;
                if(indicInfo.Indicator == "NY_GDP_MKTP_PP_CD")
                {
                    val = formatNumber0p(val/1000000000);
                }

                geninfoIndicatorsLabelValue.push({ label: indicTitle, value: thousandSep(val)  });

            }
            else{
                
                geninfoIndicatorsLabelValue.push({ label: indicTitle, value: "..." });
            }
        }
    }

    //Final closing line
    //geninfo.append("hr").attr("size", 1).attr("width", 330);
     $('#generalinfo-table-title').html(getStringFromDict('SOCIO_ECONOMIC') + ", " + maxYr);

    displayTableLabelValue("#generalinfo-table",geninfoIndicatorsLabelValue,'', 260);

}


//This method collects the data into the tables which are used to display 
//the stacked chart and the OFST table.
function getTableDataForStackedChart(Indicators, curr_indic, femRegEx, malRegEx) {
    var currIndicator = "";

    var processFemale = false, processMale = false, processChildren = false;
    var strTot = getStringFromDict("TOTAL").capitalizeFirstLetter();
    var strMal = getStringFromDict("MALE").capitalizeFirstLetter();
    var strFem = getStringFromDict("FEMALE").capitalizeFirstLetter();

    var curr_gender = 0;
    var malfemidx   = 0;

    tableData = [];
    tableData[curr_indic]= [];
    initTotalMaleFemaleRows(tableData, curr_indic + "_CP", curr_indic, false);

    for (var j = 0; j < Indicators.length; j++) {

                var indicator = Indicators[j];

                if (currIndicator != indicator.Indicator) {
                     currIndicator = indicator.Indicator;

                 processFemale  = indicator.Indicator.match(femRegEx);
                 processMale    = indicator.Indicator.match(malRegEx);
                 malfemidx      = processFemale ? 0 : 1;


                 //Set Table Values
                 var genderSuff = processFemale ? "_F_CP" : processMale ? "_M_CP" : "_CP";
                 var genderStr = processFemale ? strFem : processMale ? strMal : strTot;

                 for (var f = 0; f < tableData[curr_indic].length; f++) {

                     var parent = tableData[curr_indic][f].parent;

                     if (!(typeof parent === "undefined")) {

                            parent = parent.replace("_CP", '');

                            if (indicator.Indicator.match("^" + parent + genderSuff + "$") && (genderStr == tableData[curr_indic][f].id)) {
                                curr_gender = f;
                                tableData[curr_indic][curr_gender][indicator.Year] = thousandSep(indicator.Value);
                                break;
                            }
                        }
                   }
                }

                //update table values
                tableData[curr_indic][curr_gender][indicator.Year] = thousandSep(indicator.Value);
        }

    return tableData[curr_indic];
}

//This method collects the data into the tables which are used to display 
//the stacked chart and the OFST table.
function getStackedChartData( Indicators, femRegEx, malRegEx) {

            var currIndicator = "";
            var processFemale = false, processMale = false;

            var strMal = getStringFromDict("MALE").capitalizeFirstLetter();
            var strFem = getStringFromDict("FEMALE").capitalizeFirstLetter();
            var malfemidx = 0;

            chartData = [];
            chartData[0] = {};
            chartData[1] = {};

            //init chart Data
            chartData[0].key = "female"; //this is key value, not string!
            chartData[0].descr = strFem;
            chartData[0].values = [];

            chartData[1].key = "male";   //this is key value not string!
            chartData[1].descr = strMal;
            chartData[1].values = [];


            for (var j = 0; j < Indicators.length; j++) {

                var indicator = Indicators[j];

                if (currIndicator != indicator.Indicator) {

                        currIndicator = indicator.Indicator;
                        processFemale  = indicator.Indicator.match(femRegEx);
                        processMale    = indicator.Indicator.match(malRegEx);
                        malfemidx      = processFemale ? 0 : 1;
                }

                 //update chart values
                 if (processFemale || processMale) {
                        chartData[malfemidx].values.push({ date: indicator.Year, value: indicator.Value / 1000 });
                 }
         }

         return chartData;
 }


function populationChart(selector) {

    var param = { left_margin: 70, gap: 2, bar_height: 15, bar_width: 330, viz_width:280, highl0t14: false };
    var popChrt = new Object();
    var totalNumberOfPeople = 0;
    var perChildrenPre14    = 0;
    var perChildren15t24    = 0;

    function draw(indicators) {

        var dataset          = [];
        var maxYr            = 0;
        

        if (indicators.length <= 0)
            return;

        //populate dataset array for age groups
        for (i = 0; i < indicators.length; i++) {

            //generate dataset
            if (!indicators[i].Indicator.match("F$")) {

                var matches  = indicators[i].Indicator.toUpperCase().match(/AG(\d+)T(\d+)/);
                var fromYear = matches[1];
                var toYear   = matches[2];

                if (toYear - fromYear < 6) {

                    dataset.push({ fromYear: fromYear, label: fromYear + " to " + toYear, value: indicators[i].Value });

                    if (param.highl0t14) {
                        if (toYear < 15)
                            numbOfChildrenPre14 += indicators[i].Value;
                    }
                    else {
                        if (toYear >= 15 && toYear <= 24)
                            numbOfChildern15t24 += indicators[i].Value;
                    }
                }
                else if (fromYear == "80" && toYear == "99") {
                    dataset.push({ fromYear: fromYear, label: fromYear + " + ", value: indicators[i].Value });
                }

                if (maxYr < indicators[i].Year) {
                    maxYr = indicators[i].Year;
                }

                if (indicators[i].Indicator.toUpperCase().match("P_AG0T99")) {
                    totalNumberOfPeople = indicators[i].Value;
                }
            }

        }

        if (totalNumberOfPeople > 0) {
            perChildrenPre14 = (numbOfChildrenPre14 / totalNumberOfPeople);
            perChildren15t24 = (numbOfChildern15t24 / totalNumberOfPeople);
        }

        //assign the values
        popChrt.totalNumberOfPeople = totalNumberOfPeople;
        popChrt.perChildrenPre14    = numbOfChildrenPre14;
        popChrt.perChildren15t24    = numbOfChildern15t24;


        if (dataset.length > 0) {
            dataset.sort(function (a, b) { return b.fromYear - a.fromYear; });

            //Here generate the graph
            var chart = d3.select(selector).append("svg:svg")
                                              .attr("class", "chart")
                                              .attr("width", param.left_margin + param.viz_width)
                                              .attr("height", param.bar_height * (dataset.length + 3) + 20);

            var max = d3.max(dataset, function (d) {
                return d.value;
            });

            var x = d3.scale.linear().domain([0, max]).range([param.left_margin, param.bar_width]);



            chart.selectAll("rect")
                                   .data(dataset)
                                   .enter().append("rect")
                                   .attr("x", param.left_margin)
                                   .attr("y", function (d, i) { return ((i + 1) * param.bar_height - 7); })
                                   .transition().duration(1000).delay(100)
                                   .attr("width", function (d) {
                                       return x(d.value) - param.left_margin;
                                   })
                                   .style("fill", function (d) {
                                       if ((param.highl0t14 && d.fromYear < 11) ||
                                            (!param.highl0t14 && d.fromYear >= 15 && d.fromYear < 21)) {
                                           $(this).attr("class", "generalChartHighlightedBars");
                                       }
                                       else
                                           $(this).attr("class", "generalChartBars");
                                   })
                                   .attr("height", 15).text(function (d) {
                                       return "" + d.value;
                                   });



            // Add a label per for population
            chart.selectAll("text.name")
                                  .data(dataset)
                                  .enter().append("text")
                                  .attr("x", param.left_margin / 2)
                                  .attr("y", function (d, i) { return (i + 1) * param.bar_height; })
                                  .attr("dy", ".36em")
                                  .attr('class', 'gneralChartTextAg')
                                  .text(function (d) {
                                      return d.label;
                                  });


            chart.selectAll("line")
              .data(x.ticks(3))
              .enter().append("line")
              .attr("x1", x)
              .attr("x2", x)
              .attr("y1", param.bar_height * (dataset.length + 1) - 5)
              .attr("y2", param.bar_height * (dataset.length + 1))
              .attr("class", "generalChartVertLines");


            chart.selectAll(".rule")
                                   .data(x.ticks(3))
                                   .enter().append("text")
                                   .attr("class", "rule")
                                   .attr("x", x)
                                   .attr("y", param.bar_height * (dataset.length + 2))
                                   .attr("dy", -3)
                                   .attr('class', 'gneralChartTextAg')
                                   .text(function (d) {
                                       return thousandSep(d);
                                   });

            var label = chart.selectAll("text")
                                      .data(x.domain())
                                      .enter().append("svg:text")
                                      .attr("x", function (d) {
                                          return x(d) + x.rangeBand() / 2;
                                      })
                                      .attr("y", param.bar_height * (dataset.length + 3))
                                      .attr("dy", ".71em")
                                      .text(function (d) {
                                          return d;
                                      });


            $(selector+ '-title').html(getStringFromDict('TOTAL_POPUL_5YRGR') + ", " + maxYr + " (" + getStringFromDict('IN_THOUSANDS') + ")")
                                 .attr("width", "350px")
                                 .attr("align", "center");

            var percent = d3.format("%");
            var ystrt = 15.5;
            var fromToStr = formatStringForSVGDisplay(getStringFromDict('STR_15_TO_24'));
            if (param.highl0t14) {
                fromToStr = formatStringForSVGDisplay(getStringFromDict('STR_0_TO_14'));
                percent = percent(perChildrenPre14);
                ystrt = 18;
            }
            else {
                percent = percent(perChildren15t24);
            }


            chart.append("svg:text")
                .attr("y", param.bar_height * (dataset.length + 3) + 5)// + 10)
                .attr("x", 20)
                .attr("class", "generalChartBottomText")
                .text(fromToStr + " " + formatStringForSVGDisplay(getStringFromDict('YEARS_OLD_PEOPLE_REPR')) + " " + percent + " " + formatStringForSVGDisplay(getStringFromDict('OF_TOTAL_POP')));

            return popChrt;
        }
    }

    popChrt.draw = draw;

    popChrt.param = function (_) {

        if (!arguments.length)
            return param;

        param = _;
        return popChrt;
    };


    return popChrt;
}

function displayPopulationData(indicators, highl0t14) {

    var dataset = [];
    var left_width = 70;
    var gap = 2;
    var bar_height = 15;
    var bars_width = 330;

    var maxYr = 0;

    var perChildrenPre14 = 0;
    var perChildren15t24 = 0;

    if (indicators.length <= 0)
        return;

    //populate dataset array for age groups
    for (i = 0; i < indicators.length; i++) {

        //generate dataset
        if (!indicators[i].Indicator.match("F$")) {

            var matches  = indicators[i].Indicator.toUpperCase().match(/AG(\d+)T(\d+)/);
            var fromYear = matches[1];
            var toYear   = matches[2];

            if (toYear - fromYear < 6) {

                dataset.push({ fromYear: fromYear, label: fromYear + " to " + toYear, value: indicators[i].Value });

                if (highl0t14) {
                    if (toYear < 15)
                        numbOfChildrenPre14 += indicators[i].Value;
                }
                else {
                    if (toYear >= 15 && toYear <= 24)
                        numbOfChildern15t24 += indicators[i].Value;
                }
            }
            else if(fromYear == "80" && toYear == "99"){
                dataset.push({ fromYear: fromYear, label: fromYear + " + ", value: indicators[i].Value });
            }

            if (maxYr < indicators[i].Year) {
                maxYr = indicators[i].Year;
            }

            if (indicators[i].Indicator.toUpperCase().match("P_AG0T99")) {
                totalNumberOfPeople = indicators[i].Value;
            }
        }

    }

    if (totalNumberOfPeople > 0) {
        perChildrenPre14 = (numbOfChildrenPre14 / totalNumberOfPeople);
        perChildren15t24 = (numbOfChildern15t24 / totalNumberOfPeople);
    }


    if(dataset.length > 0)
    {
        dataset.sort(function (a, b) { return b.fromYear - a.fromYear; });

        //Here generate the graph
        var chart = d3.select("#population-chart").append("svg:svg")
                                          .attr("class", "chart")
                                          .attr("width", left_width + 280)
                                          .attr("height", bar_height * (dataset.length + 3) + 20);

        var max = d3.max(dataset, function (d) {
            return d.value;
        });

        var x = d3.scale.linear().domain([0, max]).range([left_width, bars_width]);



        chart.selectAll("rect")
                               .data(dataset)
                               .enter().append("rect")
                               .attr("x", left_width)
                               .attr("y", function (d, i) { return ( (i + 1) * bar_height - 7) ; })
                               .transition().duration(1000).delay(100)
                               .attr("width", function (d) {
                                   return x(d.value) - left_width;
                               })
                               .style("fill", function (d) {
                                   if ( (highl0t14 && d.fromYear < 11) || 
                                        (!highl0t14 && d.fromYear >= 15 && d.fromYear < 21) ) 
                                   {
                                       $(this).attr("class", "generalChartHighlightedBars");
                                   }
                                   else 
                                       $(this).attr("class", "generalChartBars");
                               })
                               .attr("height", 15).text(function (d) {
                                   return "" + d.value;
                               });



        // Add a label per for population
        chart.selectAll("text.name")
                              .data(dataset)
                              .enter().append("text")
                              .attr("x", left_width / 2)
                              .attr("y", function (d, i) { return (i + 1) * bar_height ; })
                              .attr("dy", ".36em")
                              .attr('class', 'gneralChartTextAg')
                              .text(function (d) {
                                  return d.label;
                              });

    
            chart.selectAll("line")
              .data(x.ticks(3))
              .enter().append("line")
              .attr("x1", x)
              .attr("x2", x)
              .attr("y1", bar_height * (dataset.length + 1) -5)
              .attr("y2", bar_height * (dataset.length + 1))
              .attr("class", "generalChartVertLines");


        chart.selectAll(".rule")
                               .data(x.ticks(3))
                               .enter().append("text")
                               .attr("class", "rule")
                               .attr("x", x)
                               .attr("y", bar_height * (dataset.length + 2) )
                               .attr("dy", -3)
                               .attr('class', 'gneralChartTextAg')
                               .text(function (d) {
                                      return thousandSep(d);
                                  }); 

        var label = chart.selectAll("text")
                                  .data(x.domain())
                                  .enter().append("svg:text")
                                  .attr("x", function (d) {
                                      return x(d) + x.rangeBand() / 2;
                                  })
                                  .attr("y", bar_height * (dataset.length + 3) )
                                  .attr("dy", ".71em")
                                  .text(function (d) {
                                      return d;
                                  });


        $('#population-chart-title').html( getStringFromDict('TOTAL_POPUL_5YRGR') + ", " + maxYr + " (" + getStringFromDict('IN_THOUSANDS')+")" );

        var percent = d3.format("%");
        var ystrt = 15.5;
        var fromToStr =formatStringForSVGDisplay( getStringFromDict('STR_15_TO_24'));
        if (highl0t14) {
            fromToStr = formatStringForSVGDisplay(getStringFromDict('STR_0_TO_14'));
            percent = percent(perChildrenPre14);
            ystrt = 18;
        }
        else {
            percent = percent(perChildren15t24);
        }

            
        chart.append("svg:text")
            .attr("y", bar_height * (dataset.length + 3) + 5 )// + 10)
            .attr("x", 20)
            .attr("class", "generalChartBottomText")
            .text(  fromToStr + " "+ formatStringForSVGDisplay(getStringFromDict('YEARS_OLD_PEOPLE_REPR')) + " " + percent + " " +  formatStringForSVGDisplay(getStringFromDict('OF_TOTAL_POP'))  );

        }
}


function displayAgesByLevelData(indicators, display_pop_indic) {

    var dataset = [];

    var offAgesByLevelOfEdu = [{ lev: formatStringForSVGDisplay(getStringFromDict('POP_PRE_PRIM_AGE')), start_ind: "299902",  dur: "299929",   start_val: 0, dur_val: 0, start_val1: 0, dur_val1: 0,  xval: 50,  yval: 148,  txval: 30,  img: "./../Images/pre-primary.png",  imgw: 18, imgh: 27 },
                               { lev: formatStringForSVGDisplay(getStringFromDict('POP_PRIM_AGE')),     start_ind: "299905",  dur: "299932",   start_val: 0, dur_val: 0, start_val1: 0, dur_val1: 0, xval: 118,  yval: 130, txval: 107,  img: "./../Images/primary.png",      imgw: 24, imgh: 42 },
                               { lev: formatStringForSVGDisplay(getStringFromDict('POP_SECOND_AGE')),   start_ind: "299908",  dur: "299935",   start_ind1: "299914", dur1:"299941",  start_val: 0, dur_val: 0, start_val1: 0, dur_val1: 0, xval: 190, yval: 48,   txval: 174, img: "./../Images/secondary.png",    imgw: 26, imgh: 75 },
                               { lev: formatStringForSVGDisplay(getStringFromDict('POP_TERT_AGE')),     start_ind: "1000",    dur: "1030",     start_val: 0, dur_val: 0, start_val1: 0, dur_val1: 0,  xval: 277, yval: 0,    txval: 274, img: "./../Images/tertiary.png",     imgw: 34, imgh: 110}];

    var popSchoolIndicators = [{ indic: "SAP_0",  label: formatStringForSVGDisplay(getStringFromDict('POP_PRE_PRIM_AGE')), value: '...' },
                               { indic: "SAP_1",  label: formatStringForSVGDisplay(getStringFromDict('POP_PRIM_AGE')),     value: '...' },
                               { indic: "SAP_23", label: formatStringForSVGDisplay(getStringFromDict('POP_SECOND_AGE')),   value: '...' },
                               { indic: "SAP_56", label: formatStringForSVGDisplay(getStringFromDict('POP_TERT_AGE')),     value: '...' }];

    var educBeginEnd = {};
    var indidx    = 0;
    var cur_par   = "";
    var agLevHgt  = 200;

    for (i = 0; i < indicators.length; i++) {

        //Ages by level of education
        if (agesByLevel.indexOf(indicators[i].Indicator) >= 0) {
            for (j = 0; j < offAgesByLevelOfEdu.length; j++) {

                if (indicators[i].Indicator == offAgesByLevelOfEdu[j].start_ind) {
                    offAgesByLevelOfEdu[j].start_val = indicators[i].Value;
                    break;
                }
                else if (indicators[i].Indicator == offAgesByLevelOfEdu[j].dur) {
                    offAgesByLevelOfEdu[j].dur_val = indicators[i].Value;
                    break;
                }
                else if (indicators[i].Indicator == offAgesByLevelOfEdu[j].start_ind1) {
                    offAgesByLevelOfEdu[j].start_val1 = indicators[i].Value;
                    break;
                }
                else if (indicators[i].Indicator == offAgesByLevelOfEdu[j].dur1) {
                    offAgesByLevelOfEdu[j].dur_val1 = indicators[i].Value;
                    break;
                }
            }
        }
        else if (display_pop_indic &&
                  populationSchool.indexOf(indicators[i].Indicator) >= 0) { //Population of School age
            for (j = 0; j < popSchoolIndicators.length; j++) {
                if (indicators[i].Indicator == popSchoolIndicators[j].indic) {
                    popSchoolIndicators[j].value =  thousandSep( indicators[i].Value );
                    break;
                }
            }
        }
        else if (progCompInEduc.indexOf(indicators[i].Indicator) >= 0) {

            var ind_code = indicators[i].Indicator.replace('_F', ''); 
            ind_code = ind_code.replace('_M', ''); 

            if(cur_par != ind_code)
            {
                for (var f = 0; f < progCompTable.length; f++) {

                           var parent = progCompTable[f].parent;
                           if (!(typeof parent === "undefined"))
                           {
                               parent = parent.replace("_CP", '');
           
                               if (ind_code.match("^" + parent ) ) {
                                   indidx = f;
                                   cur_par = ind_code;
                                   break;
                               }
                           }
                }
            }


            if (indicators[i].Indicator.match("_M")) {
                progCompTable[indidx]["Male"] = indicators[i].Value;
            }
            else if (indicators[i].Indicator.match("_F")) {
                progCompTable[indidx]["Female"] = indicators[i].Value;
            }
            else{

                progCompTable[indidx]["Total"] = indicators[i].Value;
                progCompTable[indidx]["Year"] =  "(" + indicators[i].Year + ")";
            }

        }
        else if (educationBeginEnd.indexOf(indicators[i].Indicator) >= 0) {

            //collect all indicators in the map first
            educBeginEnd["" + indicators[i].Indicator + ""] = indicators[i].Value;
        }
    }

    //Here generate the graph
    var images = d3.select("#ages-by-level").append("svg:svg").attr("width", 350).attr("height", agLevHgt );


    images.selectAll("text")
          .data(offAgesByLevelOfEdu)
          .enter()
          .append("svg:text")
          .attr("x", function (d) {
              return d.txval;
          })
           .attr("y", function (d) {
               return agLevHgt - 40;
           })
           .attr("class", "educ-system-title")
           .text(function (d, i) {
                   return d.lev;
           });

     images.selectAll("image")
          .data(offAgesByLevelOfEdu)
          .enter()
          .append("svg:text")
          .attr("x", function (d) {
              if (d.start_val <= 0 && d.dur_val <= 0)
                 return d.xval + 12;
              else
                return d.xval + 3;
          })
           .attr("y", function (d) {
               return agLevHgt - 25;
           })
           .attr("class", "educ-system-title")
           .text(function (d, i) {

                if (d.start_val <= 0 && d.dur_val <= 0)
                   return ("...");
               else if (d.start_val >= 1 && d.dur_val <= 1)
                   return (d.start_val + "-" + "..");
               else{
                  if (d.start_val1 <= 0 && d.dur_val1 <= 0)
                    return (d.start_val + "-" + (d.start_val + d.dur_val - 1));
                  else
                    return (d.start_val + "-" + (d.start_val1 + d.dur_val1 - 1));
                }
           });

           
         images.append("g").append("g:svg:text")
           .attr("class", "ages-by-lev-note")
           .attr("x", 25)
           .attr("y", 195)
           .text(formatStringForSVGDisplay(getStringFromDict('POP_TERT_AGE_NOTE')));  

   $('#ages-by-level-title').html(getStringFromDict('OFF_AGES_BY_LEV'));

    var imgs = images.selectAll("image").data(offAgesByLevelOfEdu);

    imgs.enter()
        .append("svg:image")
        .attr("xlink:href", function (d) {
                return d.img;
                })
        .attr("x", function (d) {
                return d.xval;
                })
        .attr("y", function (d) {
                return agLevHgt - (d.imgh + 50);
                })
        .attr("width", function (d) {
                return d.imgw;
                })
        .attr("height", function (d) {
                return d.imgh;
                });

    if (display_pop_indic) {

        var compEduc = d3.select("#population-begin-end")
                         .append('ul')
                         .attr("align", "left")
                         .style("padding-left", "0px");

        // compEduc.append('');
        if (!(typeof educBeginEnd["400"] === "undefined") && !(typeof educBeginEnd["401"] === "undefined") && !(typeof educBeginEnd["402"] === "undefined")) {
            compEduc
            //.append("tr").append("td")
            .append('li').attr("class", "educ-system-text")
                         .text( get_ents(getStringFromDict('COMP_EDUC_LASTS') + " " + educBeginEnd["400"] + " " + 
                                         getStringFromDict('YRS_FROM_AGE')    + " " + educBeginEnd["401"] + " " + 
                                         getStringFromDict('YRS_TO_AGE')      + " " + educBeginEnd["402"]) );
        }

        if (!(typeof educBeginEnd["901208"] === "undefined") && !(typeof educBeginEnd["901209"] === "undefined") && !(typeof educBeginEnd["901210"] === "undefined")) {
            compEduc
            //.append("tr").append("td")
            .append('li').attr("class", "educ-system-text")
                         .text( get_ents(getStringFromDict('COMP_EDUC_COVERS') + " " + educBeginEnd["901208"] + " " +
                                         getStringFromDict('GRADES_GRADE')     + " " + educBeginEnd["901209"] + " " + 
                                         getStringFromDict('TO_GRADE')         + " " + educBeginEnd["901210"]) );
        }


        if (!(typeof educBeginEnd["403"] === "undefined") && 
            !(typeof educBeginEnd["404"] === "undefined")) {
            var beg = educBeginEnd["403"];
            var end = educBeginEnd["404"];

            if (beg < 12 && beg > 0 && end < 12 && end > 0)
                compEduc
                  .append('li').attr("class", "educ-system-text")
                  .text( get_ents(getStringFromDict('PRIM_TO_POST_SEC') + " " +  formatStringForSVGDisplay(getStringFromDict(month[beg - 1])) + " " + 
                                  getStringFromDict('AND_END_IN')       + " " + formatStringForSVGDisplay(getStringFromDict( month[end - 1])) ) );
        }
        
        $('#population-school-title').html(getStringFromDict('POP_SCHOOL_AGE_TITLE'));

        displayTableLabelValue("#population-school",popSchoolIndicators,'', 260);
    }

}


function drawBarChartOneIndicator(container, indicators, grpahTitle,  barColor, axisTitle) {

  $(container).text("");


  indicators = indicators.values();

  //empty check
  var isEmpty = true;
  for(var i = 0; i < indicators.length; i++){
    if(indicators[i].y > 0){
      isEmpty = false;
      break;
    }
  }

  if(isEmpty)
    return;

   var margin = 20;
   //DISPLAY BAR CHART SVG
   ////////////////////////////////////////////////////////////
   var w = 350, h = 220, p = [33, 50, 30, 20],
       x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
       y = d3.scale.linear().range([0, h - p[0] - p[2]]), offset = 10;

   format = d3.time.format("%Y");

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain(indicators.map(function (d) {
        return d.x;
    }));

     y.domain([0, d3.max(indicators, function (d) {
                          return 1.2*d.y;
        })]);



    var svg = d3.select(container).append("svg:svg")
                                  .attr("width", w)
                                  .attr("height", h + 20)
                                  .append("svg:g")
                                  .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

    // Add a rect for each date.
    var rect = svg.selectAll("g.indic")
                              .data(indicators)
                              .enter()
                              .append("svg:g")
                              .style("fill", barColor )
                              .attr("class", "chartStrokeHighl")
                              .on("mouseover", function (d) {
                                  d3.select(this).style("stroke-width", 2);
                                  var outText =  getStringFromDict('VALUE') + ": " + d.y + " (" + d.x + ")";
                                  showData(d3.event.pageX-65, d3.event.pageY, outText);
                              })
                              .on("mouseout", function () {
                                 d3.select(this).style("stroke-width", 0);
                                 hideData();
                              })
                              .append("svg:rect")
                              .attr("x", function (d) {
                                  return x(d.x) + margin-5  + x.rangeBand() / 3;
                              })
                              .attr("y", function (d) {
                                  return -y(d.y);
                              })
                              .transition().duration(1000).delay(100)
                              .attr("height", function (d) {
                                  return y(d.y);
                              })
                              .attr("width", 10);



    // Add a label per date.
    var label = svg.selectAll("text")
                              .data(x.domain())
                              .enter().append("svg:text")
                              .attr("x", function (d) {
                                  return x(d) + margin  + x.rangeBand() / 3 ;
                              })
                              .attr("y", 12)
                              .attr("class", "chartXaxis")
                              .text(function (d) {
                                  return d;
                              });

    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
                              .data(y.ticks(7))
                              .enter().append("svg:g")
                              .attr("class", "rule")
                              .attr("transform", function (d) {
                                  return "translate(0," + -y(d) + ")";
                              });

    rule.append("svg:line").attr("x1", offset + margin)
                           .attr("x2", w - p[1] - p[3])
                           .style("stroke", function (d) {
                                  return d > 0 ? "#fff" : "#000";
                            });
                           //.style("stroke-opacity", function (d) {
                           //       return d ? .7 : null;
                           // });
                              

    rule.append("svg:text")
        .attr("x", margin + offset - 5)// w - p[1] - p[3] + 6)
        .attr("class", "chartYaxis")
        .text(d3.format(",d"));


//    svg.append("svg:text")
//       .attr("y", -(h - 40))
//       .attr("x", 150 )
//       .style("text-anchor", "middle")
//       .attr("class", "chartTitle")
//       .text( formatStringForSVGDisplay(grpahTitle) );


       if (!(typeof grpahTitle === "undefined")) {

             if (grpahTitle.indexOf('\\n') > 0) {

                  var title_splt = grpahTitle.split('\\n');
                  svg.append("svg:text")
                                 .attr("y", -(h - 40))
                                 .attr("x", 150 )
                                 .attr("class", "chartTitle")
                                 .style("text-anchor", "middle")
                                 .text(formatStringForSVGDisplay(title_splt[0]) );

                   svg.append("svg:text")
                          .attr("y", -(h - 55))
                          .attr("x", 150 )
                          .attr("class", "chartTitle")
                          .style("text-anchor", "middle")
                          .text(formatStringForSVGDisplay(title_splt[1]));
               }
               else {
                    svg.append("svg:text")
                       .attr("y", -(h - 40))
                       .attr("x", 150 )
                       .attr("class", "chartTitle")
                       .style("text-anchor", "middle")
                       .text(formatStringForSVGDisplay(grpahTitle));
               }
     }




   //Axis title
   if ( !(typeof axisTitle === "undefined") )
   {
         if (axisTitle.indexOf('\\n') > 0) { //multiple lign text

            var axis_title_splt = axisTitle.split('\\n');
            svg.append("svg:text")
               .attr("y", -5)
               .attr("x", (h - p[0]) / 2 -20  )
               .attr("class", "chartYaxisUnits")
               .style("text-anchor", "middle")
               .attr("transform", "rotate(-90)")
               .text( formatStringForSVGDisplay(axis_title_splt[0]) );

             svg.append("svg:text")
                .attr("y", 7 )
                .attr("x", (h - p[0]) / 2 -20 )
                .attr("class", "chartYaxisUnits")
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .text( formatStringForSVGDisplay(axis_title_splt[1]) );
        }
        else if(axisTitle.length == 1) { //one char length: display on the top!

            svg.append("svg:text")
               .attr("x", 5)
               .attr("y", -(h - (p[0] + margin)))
               .attr("class", "chartYaxisUnits")
               .style("text-anchor", "middle")
               .text(axisTitle);
        }
        else{                           //one line text

            svg.append("svg:text")
               .attr("x", (h - p[0]) / 2 -20 )
               .attr("y", 0)
               .attr("class", "chartYaxisUnits")
               .style("text-anchor", "middle")
               .attr("transform", "rotate(-90)")
               .text( formatStringForSVGDisplay(axisTitle) );
       }
      
   }
}

//Draw group bar chart!
function drawBarChartTwoIndicators(container, indicators1, indicators2, label1, label2, grpahTitle, start_yr, end_yr) {

    $(container).text("");

    indicators1 = indicators1.values();
    indicators2 = indicators2.values();

    if(indicators1.length == 0 && indicators2.length == 0)
        return;

    //DISPLAY BAR CHART SVG
    ////////////////////////////////////////////////////////////
    var margin = 20;
    var w = 350, h = 200, p = [20, 50, 30, 20],
        x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
        y = d3.scale.linear().range([0, h - p[0] - p[2]]);

    format = d3.time.format("%Y");
    var arrays = [indicators1, indicators2];
    
    // Compute the x-domain (by date) and y-domain (by top).
   if(indicators2.length > indicators1.length)
    x.domain(indicators2.map(function (d) { return d.x; }));
   else
    x.domain(indicators1.map(function (d) { return d.x; }));

    y.domain([0, d3.max(arrays, function (array) {
        return d3.max(array, function (d) { return d.y + 200; });
    })]);


    var svg = d3.select(container).append("svg:svg")
                                      .attr("width",  w)
                                      .attr("height", h + 20)
                                      .append("svg:g")
                                      .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");


    // Add a rect for each date.
    var rect = svg.selectAll("g.indic")
                              .data(indicators1)
                              .enter()
                              .append("svg:g")
                              .attr("class", "chartMaleBarColor")
                              .on("mouseover", function (d) {
                                  d3.select(this).style("stroke-width", "2px");
                                  var outText = label1 + ":" + d.y + " (" + d.x + ")";
                                  showData(d3.event.pageX, d3.event.pageY, outText);

                              })
                              .on("mouseout", function () {
                                  d3.select(this).style("stroke-width", 0);
                                  hideData();
                              })
                              .append("svg:rect")
                              .attr("x", function (d) {
                                  return x(d.x) + margin;
                              })
                              .attr("y", function (d) {
                                  return -y(d.y);
                              })
                              .transition().duration(1000).delay(100)
                              .attr("height", function (d) {
                                  return y(d.y);
                              })
                              .attr("width", 10);


    // Add a rect for each date.
    var rect2 = svg.selectAll("g.indic") 
                              .data(indicators2)
                              .enter()
                              .append("svg:g")
                              .attr("class", "chartFemaleBarColor")
                              .on("mouseover", function (d) {
                                  d3.select(this).style("stroke-width", "2px");
                                  var outText = label2 + ":" + d.y + " (" + d.x + ")";
                                  showData(d3.event.pageX, d3.event.pageY, outText);
                              })
                              .on("mouseout", function () {
                                  d3.select(this).style("stroke-width", 0);
                                  hideData();
                              })
                              .append("svg:rect")
                              .attr("x", function (d) {
                                  return x(d.x) + margin + 10;
                              })
                              .attr("y", function (d) {
                                  return -y(d.y);
                              })
                              .transition().duration(1000).delay(100)
                              .attr("height", function (d) {
                                  return y(d.y);
                              })
                              .attr("width", 10);


    // Add a label per date.
    var label = svg.selectAll("text")
                              .data(x.domain())
                              .enter().append("svg:text")
                              .attr("x", function (d) {
                                  return x(d) + margin + x.rangeBand() / 3;
                              })
                              .attr("y", 12)
                              .attr("class", "chartXaxis")
                              .text(function (d) {
                                  return d;
                              });

    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
                              .data(y.ticks(5))
                              .enter().append("svg:g")
                              .attr("class", "rule")
                              .attr("transform", function (d) {
                                  return "translate(0," + -y(d) + ")";
                              });

    rule.append("svg:line").attr("x1", margin)
                              .attr("x2", w - p[1] )
                              .style("stroke", function (d) {
                                  return d > 0 ? "#fff" : "#000";
                              });
                              //.style("stroke-opacity", function (d) {
                             //     return d ? .7 : null;
                             // });
                              

    rule.append("svg:text")
        .attr("x", margin - 5)
        .attr("class", "chartYaxis")
        .text(d3.format(",d"));


    var xtrt = displayOneLeged(svg, formatStringForSVGDisplay(label1), bar_color1, margin, 25); //male
    displayOneLeged(svg, formatStringForSVGDisplay(label2), bar_color2, margin + xtrt, 25);     //female


    svg.append("svg:text")
                       .attr("y", -(h - 40))
                       .attr("x", margin + 40)
                       .attr("class", "chartTitle")
                       .text( formatStringForSVGDisplay(grpahTitle) );
}

function calculateFourRowMaxScale(indicators1, indicators2, indicators3, indicators4)
{
  var arrays = [indicators4.values(), indicators3.values(),  indicators1.values(), indicators2.values() ];

  var yscale = d3.max(arrays, function (array) {
        return d3.max(array, function (d) { return d.y + 1.1; }); });

  return Math.ceil(yscale/10)*10;
}

//Draw group bar chart and a line with it. Note scale can be either by maximum value or a user value, like 100 for percentage
function drawBarChartLine(container, indicators, indicators_line, title_indicator, title_line, title_graph, yscale, start_yr, end_yr, axis_title, offset_tip) {

    $(container).text("");

    indicators = indicators.values();
    indicators_line = indicators_line.values();

    //DISPLAY BAR CHART SVG
    ////////////////////////////////////////////////////////////
    var w = 350, h = 200, p = [20, 50, 30, 20],
        x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
        y = d3.scale.linear().range([0, h - p[0] - p[2]]);

    var margin = 20;

    var y_strt = 40;
    format = d3.time.format("%Y");

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain(indicators.map(function (d) { return d.x; }));

    var yscaleCalc = d3.max(indicators, function (d) {return 1.1*d.y; });
    if (yscale == null) {
       yscale = yscaleCalc;
    }
    y.domain([0, yscale]);

    //Empty chart!!!
    if((yscaleCalc == 0 || indicators.length == 0) && indicators_line.length == 0) 
        return;

    var j = 0, i = 0;
    for (j = 0, i = 0; j < indicators.length && i < indicators_line.length; j++) {

        while (indicators_line[i].x < indicators[j].x &&
                                 i < indicators_line.length) {
            i++;
        }

        if (indicators_line[i].x == indicators[j].x) {
            indicators[j].nval = indicators_line[i].y;
            i++;
        }
    }

    var svg = d3.select(container).append("svg:svg")
                                      .attr("width", w)
                                      .attr("height", h + 20)
                                      .append("svg:g")
                                      .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

    // Add a rect for each date.
    var rect = svg.selectAll("g.indic") //indicat.selectAll("rect")
                              .data(indicators)
                              .enter()
                              .append("svg:g")
                              .attr("class", "chartTotalBarColor")
                              .on("mouseover", function (d, indicators_line) {
                                  d3.select(this).style("stroke-width", "2px");
                                  var outText = title_indicator + ":" + d.y + " (" + d.x + ")";
                                  showData(d3.event.pageX + offset_tip, d3.event.pageY, outText);
                              })
                              .on("mouseout", function () {
                                  d3.select(this).style("stroke-width", 0);
                                  hideData();
                              })
                              .append("svg:rect")
                              .attr("x", function (d) {
                                  return x(d.x) + margin;
                              })
                              .attr("y", function (d) {
                                  return -y(d.y);
                              })
                              .transition().duration(1000).delay(100)
                              .attr("height", function (d) {
                                  return y(d.y);
                              })
                              .attr("width", 10);



    // create a line function that can convert data[] into x and y points
    var line2 = d3.svg.line()
    // assign the X function to plot our line as we wish
			                .x(function (d, i) {
			                    // return the X coordinate where we want to plot this datapoint
			                    return x(d.x) + 5 + margin;
			                })
			                .y(function (d) {
			                    // return the Y coordinate where we want to plot this datapoint
			                    return -y(d.y);
			                });
    svg.append("svg:path").attr("d", line2(indicators_line)).style("stroke", line_color ).style("stroke-width", "2px").style("fill", "none");


    var circle = svg.selectAll("data_line1")
                             .data(indicators_line)
                             .enter().append("circle")
                             .attr("class", "chartLinePointer")
                             .attr("r", 3)
                             .attr("cx", function (d, i) {
                                 // return the X coordinate where we want to plot this datapoint
                                 return x(d.x) + 5 + margin;
                             })
                             .attr("cy", function (d) {
                                 // return the Y coordinate where we want to plot this datapoint
                                 return -y(d.y);
                             })
                             .on("mouseover", function (d) {
                                 d3.select(this).style("stroke-width", 6);
                                 var outText = title_line + ":" + d.y + " (" + d.x + ")";
                                 showData(d3.event.pageX + offset_tip, d3.event.pageY, outText);
                             })
                             .on("mouseout", function () {
                                 d3.select(this).style("stroke-width", 1);
                                 hideData();
                             });




    // Add a label per date.
    var label = svg.selectAll("text")
                              .data(x.domain())
                              .enter().append("svg:text")
                              .attr("x", function (d) {
                                  return x(d) + margin+ x.rangeBand() / 3;
                              })
                              .attr("y", 6)
                              .attr("class", "chartXaxis")
                              .attr("dy", ".71em")
                              .text(function (d) {
                                  return d;
                              });

    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
                              .data(y.ticks(10))
                              .enter().append("svg:g")
                              .attr("class", "rule")
                              .attr("transform", function (d) {
                                  return "translate(0," + -y(d) + ")";
                              });

    rule.append("svg:line")
                              .attr("x1", margin)
                              .attr("x2",margin +  w - p[1] - p[3])
                              .style("stroke", function (d) {
                                  return d > 0 ? "#fff" : "#000";
                              });
                              //.style("stroke-opacity", function (d) {
                              //    return d ? .7 : null;
                              //});

    rule.append("svg:text")
        .attr("x", margin-5)
        .attr("dy", ".18em")
        .attr("class", "chartYaxis")
        .attr('text-anchor', 'end')
        .text(d3.format(",d"));

    
    var xtrt = displayOneLeged(svg, formatStringForSVGDisplay(title_indicator), bar_color3,  5 , 25);       

    if(indicators_line.length > 0)
    {
        svg.append("svg:rect").attr("x", xtrt).attr("y", 29).attr("width", 10).attr("height", 2).style("fill", line_color); 
        svg.append("svg:text").attr("x", xtrt + 17).attr("y", 34).attr("class", "chartLegend").text(formatStringForSVGDisplay(title_line));
    }

    if (title_graph != null) {
    
        var title_margin = margin + 10;
    
        if(title_graph.length <  40){
            title_margin = w/2  - (title_graph.length + 3*margin);
        }
        else if(title_graph.length > 50)
        {
            title_margin = -10;
        }
        

        svg.append("svg:text")
           .attr("y", -(h - 40))
           .attr("x", title_margin)
           .attr("class", "chartTitle")
           .text( formatStringForSVGDisplay(title_graph) );

    }

     if ( !(typeof axis_title === "undefined") )
     {
        svg.append("svg:text")
           .attr("x", -12)
           .attr("y", -(h-50))
           .attr("class", "chartYaxisUnits")
           //.attr("transform", "rotate(-90)")
           .text(axis_title);
     }

    $(container).append("<div class='infobox' style='display:none;'>Test</div>");
}

function addtoValueArray(indicator, label, value_array, label_array) {

    if (!(typeof indicator === "undefined") && indicator != null) {

        if (indicator.length != 0) {
            value_array.push(indicator.values());
            label_array.push(label);
        }

    }
}

function drawStackedChart(chart_name, value_array,
                          grpahTitle, colorArray,
                          display_nodata_section,
                          startYr, endYr,
                          draw_legend, axis_title) {

    var format = d3.time.format("%m/%d/%y");

    $(chart_name).text("");

    for (var j = 0; j < value_array.length; j++) {
        if (value_array[j].values.length > 1) {
            break;
        }
    }
    if (j >= value_array.length) {
        return;
    }

    var margin = { top: 30, right: 30, bottom: 20, left: 60 };

    if (!draw_legend) {
        margin.top = 50;
        margin.bottom = 0;
    }

    var width = 330 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var stack = d3.layout.stack()
                   .offset("zero")
                   .values(function (d) {
                       if (!(typeof d.values === "undefined"))
                           return d.values;
                   })
                   .x(function (d) {
                       if (!(typeof d.date === "undefined"))
                           return d.date;
                   })
                   .y(function (d) {
                       if (!(typeof d.value === "undefined"))
                           return d.value;
                   });

    var area = d3.svg.area()
                  .x(function (d) {
                      return x(d.date);
                  })
                  .y0(function (d) {
                      return y(d.y0);
                  })
                  .y1(function (d) {
                      return y(d.y0 + d.y);
                  });

    var svg = d3.select(chart_name).append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + 20 + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layers = stack(value_array);

    x.domain([startYr, endYr]);
    y.domain([0, d3.max(layers, function (layer) { return d3.max(layer.values, function (d) { return d.y0 + d.y; }); })]);

    if (display_nodata_section) {
        svg.append("svg:rect")
            .attr("x", x(startYr))
            .attr("y", 0)
            .attr("height", height)
            .attr("width", x(value_array[0].values[0].date) - x(startYr))
            .attr("fill", nodata_color)
            .attr("id", "gerval2");

        svg.append("svg:rect")
             .attr("x", x(value_array[0].values[value_array[0].values.length - 1].date))
             .attr("y", 0)
             .attr("height", height)
             .attr("width", x(endYr) - x(value_array[0].values[value_array[0].values.length - 1].date))
             .attr("fill", "gray")
             .attr("opacity", 0.2)
             .attr("id", "gerval2");
    }

    var xAxis = d3.svg.axis().scale(x).tickFormat(d3.format("4d"));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .on("mousemove", function (d, j) {
            var mouse = d3.mouse($(chart_name)[0]);

            var closest_match = 1000; var idx = 0;
            for (var i = 0; i < d.values.length; i++) {

                var curval = Math.abs(x(d.values[i].date) - mouse[0] + 80);
                if (curval < closest_match) {
                    closest_match = curval;
                    idx = i;
                }
            }

            var desc = d.descr + ": " + thousandSep(d.values[idx].value) + " (" + d.values[idx].date + ")";
            showData(d3.event.pageX - 70, d3.event.pageY, desc);

            svg.select("circle#" + "cvalue").remove();

            svg.append("svg:circle")
                .style("stroke-width", 3)
                .attr("cx", function () {
                    // return the X coordinate where we want to plot this datapoint
                    return x(d.values[idx].date);
                })
                 .attr("cy", function () {
                     // return the Y coordinate where we want to plot this datapoint
                     return y(d.values[idx].y0 + d.values[idx].y);
                 })
                 .attr("id", "cvalue")
                 .style("fill", "none")
                .transition().duration(1000).attr('r', 7)
                .style("stroke", function () {
                    return d3.rgb(colorArray[j]).darker(0.5);
                });


        })
              .on("mouseout", function () {
                  svg.select("circle#" + "cvalue").remove();
                  hideData();
              })
              .transition().duration(1000).attr('opacity', 1)
              .attr("class", "layer")
              .attr("d", function (d) {
                  var ar = area(d.values);
                  return ar;
              })
              .style("fill", function (d, i) {
                  return colorArray[i];
              });

    svg.append("g").attr("class", "y axis").call(yAxis);
    svg.append("svg:line")
        .attr("y1", height)
        .attr("y2", height)
        .attr("x1", x(startYr))
        .attr("x2", x(endYr))
        .style("stroke", "#000");

    if (draw_legend) {
        var i = 0, xstrt = 0;

        xstrt += displayOneLeged(svg,
                                  formatStringForSVGDisplay(value_array[1].descr),
                                  colorArray[1], xstrt, 180);

        xstrt += displayOneLeged(svg,
                                  formatStringForSVGDisplay(value_array[0].descr),
                                  colorArray[0], xstrt, 180);


        if (display_nodata_section) {
            xstrt += 5;

            displayOneLeged(svg,
                             formatStringForSVGDisplay(getStringFromDict('NODATA')),
                             nodata_color, xstrt, 180);
        }
    }

    svg.append("svg:text")
       .attr("y", -20)
       .attr("x", width / 2)
       .attr("class", "chartTitle")
       .style("text-anchor", "middle")
       .text(formatStringForSVGDisplay(grpahTitle));

    if (!(typeof axis_title === "undefined")) {
        svg.append("svg:text")
            .attr("x", -100)
            .attr("y", -40)
            .attr("class", "chartYaxisUnits")
            .attr("transform", "rotate(-90)")
            .text(axis_title);
    }

    $(chart_name).append("<div class='infobox' style='display:none;'>Test</div>");
}

function stackedMalFemChart(selector) {

    var param = {
        width: 330,
        height: 200,
        margin_top: 30,
        margin_right: 30,
        margin_bottom: 20,
        margin_left: 60,
        draw_legend: true,
        display_nodata_section: true,
        C: [bar_color2, bar_color1]
    };
    var stkChart = new Object();
    var chart_name = selector;
    stkChart.chart_name = selector;

function draw(value_array, grpahTitle, startYr, endYr, axis_title) {

        var format = d3.time.format("%m/%d/%y");

         $(chart_name).text("");

         for (var j = 0; j < value_array.length; j++) {
            if (value_array[j].values.length > 1) {
                 break;
                 }
             }
             if (j >= value_array.length) {
                 return;
             }

             if (!param.draw_legend)
             {
                param.margin_top    += 20;
                param.margin_bottom -= 20;
             }

             var width  = param.width  - param.margin_left - param.margin_right;
             var height = param.height - param.margin_top  - param.margin_bottom;

             var x     = d3.time.scale().range([0, width]);
             var y     = d3.scale.linear().range([height, 0]);
             var yAxis = d3.svg.axis().scale(y).orient("left");

             var stack = d3.layout.stack()
                            .offset("zero")
                            .values(function (d) {
                                if (!(typeof d.values === "undefined"))
                                    return d.values;
                            })
                            .x(function (d) {
                                if (!(typeof d.date === "undefined"))
                                    return d.date;
                            })
                            .y(function (d) {
                                if (!(typeof d.value === "undefined"))
                                    return d.value;
                            });

              var area = d3.svg.area()
                            .x(function (d) {
                                return x(d.date);
                            })
                            .y0(function (d) {
                                return y(d.y0);
                            })
                            .y1(function (d) {
                                return y(d.y0 + d.y);
                            });

               var svg = d3.select(chart_name).append("svg")
                            .attr("width",  width  + param.margin_left + param.margin_right)
                            .attr("height", height + 20 + param.margin_top + param.margin_bottom)
                            .append("g")
                            .attr("transform", "translate(" + param.margin_left + "," + param.margin_top + ")");

              var layers = stack(value_array);

              x.domain([startYr, endYr]);
              y.domain([0, d3.max(layers, function (layer) { return d3.max(layer.values, function (d) { return d.y0 + d.y; }); })]);

              if (param.display_nodata_section) {
                      svg.append("svg:rect")
                          .attr("x", x(startYr))
                          .attr("y", 0)
                          .attr("height", height)
                          .attr("width", x(value_array[0].values[0].date) - x(startYr))
                          .attr("fill", nodata_color)
                          .attr("id", "gerval2");

                     svg.append("svg:rect")
                          .attr("x", x(value_array[0].values[value_array[0].values.length - 1].date))
                          .attr("y", 0)
                          .attr("height", height)
                          .attr("width", x(endYr) - x(value_array[0].values[value_array[0].values.length - 1].date))
                          .attr("fill", "gray")
                          .attr("opacity", 0.2)
                          .attr("id", "gerval2");
                }

                var xAxis = d3.svg.axis().scale(x).tickFormat(d3.format("4d"));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
                    
                    svg.selectAll(".layer")
                        .data(layers)
                        .enter().append("path")
                        .on("mousemove", function (d, j) {
                                var mouse = d3.mouse($(chart_name)[0]);

                                var closest_match = 1000; var idx = 0;
                                for(var i = 0; i < d.values.length;i++){

                                    var curval =  Math.abs ( x(d.values[i].date) - mouse[0] + 80 );
                                    if(curval < closest_match){
                                        closest_match = curval;
                                        idx = i;
                                    }
                                }

                                var desc = d.descr +  ": " + thousandSep(d.values[idx].value) +" (" + d.values[idx].date + ")";
                                showData(d3.event.pageX - 70, d3.event.pageY, desc);

                                svg.select("circle#" + "cvalue").remove();

                                svg.append("svg:circle")
                                    .style("stroke-width", 3)
                                    .attr("cx", function () {
                                         // return the X coordinate where we want to plot this datapoint
                                         return x(d.values[idx].date);
                                     })
                                     .attr("cy", function () {
                                         // return the Y coordinate where we want to plot this datapoint
                                         return y(d.values[idx].y0 + d.values[idx].y);
                                     })
                                     .attr("id", "cvalue")
                                     .style("fill", "none")
                                    .transition().duration(1000).attr('r', 7)
                                    .style("stroke", function () {
                                              return d3.rgb(param.stack_color[j]).darker(0.5);
                                     });


                              })
                              .on("mouseout", function () {
                                 svg.select("circle#" + "cvalue").remove();
                                 hideData();
                              })
                              .transition().duration(1000).attr('opacity', 1)
                              .attr("class", "layer")
                              .attr("d", function (d) {
                                  var ar = area(d.values);
                                  return ar;
                              })
                              .style("fill", function (d, i) {
                                  return param.stack_color[i];
                              });

                      svg.append("g").attr("class", "y axis").call(yAxis);
                      svg.append("svg:line")
                          .attr("y1", height)
                          .attr("y2", height)
                          .attr("x1", x(startYr))
                          .attr("x2", x(endYr))
                          .style("stroke", "#000" );

                     if (param.draw_legend)
                     {
                          var i = 0, xstrt = 0;

                          xstrt += displayOneLeged(svg, formatStringForSVGDisplay(value_array[1].descr), param.stack_color[1], xstrt, 180);
                          xstrt += displayOneLeged(svg, formatStringForSVGDisplay(value_array[0].descr), param.stack_color[0], xstrt, 180);


                          if (param.display_nodata_section) {
                              xstrt +=5;

                              displayOneLeged( svg,  formatStringForSVGDisplay(getStringFromDict('NODATA')), nodata_color, xstrt, 180);
                          }
                      }

                      svg.append("svg:text")
                         .attr("y", -20)
                         .attr("x", width/2)
                         .attr("class", "chartTitle")
                         .style("text-anchor", "middle")
                         .text( formatStringForSVGDisplay(grpahTitle) );

                       if ( !(typeof axis_title === "undefined") )
                       {
                           svg.append("svg:text")
                               .attr("x", -100)
                               .attr("y", -40)
                               .attr("class", "chartYaxisUnits")
                               .attr("transform", "rotate(-90)")
                               .text(axis_title);
                        }

                       $(chart_name).append("<div class='infobox' style='display:none;'>Test</div>");
    }


    stkChart.draw = draw;


    stkChart.param = function (_) {

        if (!arguments.length)
            return param;

        param = _;
        return stkChart;
    };


    return stkChart;

}

function displayOneLeged(svg, descr, color, xstrt, ystrt) 
{
    svg.append("svg:rect").attr("x", xstrt - 15)
       .attr("y", ystrt)
       .attr("width", 10)
       .attr("height", 10)
       .style("fill", color );

   svg.append("svg:text").attr("x", xstrt)
       .attr("y", ystrt + 9)
       .attr("class", "chartLegend").text( descr );

   return ((descr.length + 6) * 5);
}

function isEmptyGraph( indicators_array )
{
    var value_array = [];
    
    for(var indicator in indicators_array)
    {
     value_array.push(indicators_array[0].values());
    }

    var stack = d3.layout.stack().offset("zero");
    var layers = stack(value_array);
    var yStackMax = d3.max(layers, function (layer) { return d3.max(layer, function (d) { return d.y0 + d.y; }); });

    if(yStackMax == 0)
        return true;

    return false;

}

function drawLegend( container, label_array, color )
{
    $(container).text("");
     var w = 600;
     w = label_array.length * 120;

     var svg = d3.select(container).append("svg:svg")
                                   .attr("width", w)
                                   .attr("height", 30)
                                   .append("svg:g");


    var j = 0;
    var legendStrt = 0;
    var totalength = 0;
    for (i = 0; i < label_array.length; i++) {
        var displText = formatStringForSVGDisplay(label_array[i]);
        totalength += (displText.length+8)*5;
    }
    if(totalength < 240)
        legendStrt = 80;

    for (i = 0; i < label_array.length; i++) {
        if (i % 5 == 0) {
            j++;
        }

        var displText = formatStringForSVGDisplay(label_array[i]);

        svg.append("svg:rect")
            .attr("x",  legendStrt)
            .attr("y", j )
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color[i]);

        svg.append("svg:text")
           .attr("x",  legendStrt +  17 ).attr("y", j  + 9)
           .attr("class", "chartLegend")
          .text( displText );

          legendStrt += (displText.length+8)*5;
    }

}


//Draw stacked bar chart, takes maximum 7 indicators, send colors as a parameters!!
function drawStackedBar(container, grpahTitle,
                        indicators1, indicators2, indicators3, indicators4, indicators5, indicators6, indicators7,
                        label1, label2, label3, label4, label5, label6, label7, drawLegend, start_year, end_year, y_label) {

    $(container).text("");
    var margin = 20;
    var w = 350, h = 200;

    var  p = [20, 50, 30, 20],
        x = d3.scale.ordinal().rangeRoundBands( [0, w - p[1] - p[3]]),
        y = d3.scale.linear().range([0, h - p[0] - p[2]]);

    var dates_labels = range(start_year, end_year, 2); 


    //DISPLAY BAR CHART SVG
    ////////////////////////////////////////////////////////////
    var value_array = [];
    var label_array = [];

    addtoValueArray(indicators1, label1, value_array, label_array);
    addtoValueArray(indicators2, label2, value_array, label_array);
    addtoValueArray(indicators3, label3, value_array, label_array);
    addtoValueArray(indicators4, label4, value_array, label_array);
    addtoValueArray(indicators5, label5, value_array, label_array);
    addtoValueArray(indicators6, label6, value_array, label_array);
    addtoValueArray(indicators7, label7, value_array, label_array);

    if (value_array.length <= 0)
        return false;

    var stack = d3.layout.stack().offset("zero");
    var layers = stack(value_array);
    var yStackMax = d3.max(layers, function (layer) { return d3.max(layer, function (d) { return d.y0 + d.y; }); });

    format = d3.time.format("%Y");

    //Chart is Empty!!!
    if(yStackMax == 0)
        return false;

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain(indicators2.values().map(function (d) {
        return d.x;
    }));

    y.domain([0, yStackMax]);
    
    if(!drawLegend)
     h = 150;

    var svg = d3.select(container).append("svg:svg")
                                  .attr("width", w)
                                  .attr("height", h + 50)
                                  .append("svg:g");


    if(!drawLegend)
    {
        svg.attr("transform", "translate(" + p[3] + "," + (h + 60 - p[2])  + ")");
    }
    else
    {
        svg.attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");
    }

    
                                  

    var layer = svg.selectAll(".layer")
                   .data(layers)
                   .enter().append("g")
                   .attr("class", "layer")
                   .attr("id",  function (d, i) { 
                      return label_array[i]; 
                   })
                   .style("fill", function (d, i) { 
                      return graphMultipleColors[i]; 
                   });
                   

    var rect = layer.selectAll("rect")
                    .data(function (d) { return d; })
                    .enter().append("rect")
                    .attr("x", function (d) { return x(d.x) + margin; })
                    .attr("y", h)
                    .attr("width", 15)
                    .attr("class", "chartStrokeHighl")
                    .on("mouseover", function (d, i) {

                          var label = " ";
                          d3.select(this).style("stroke-width", 2);
                          if( !(typeof this.parentElement === "undefined") ) {
                            label = this.parentElement.attributes["id"].value;
                          }
                          else {
                            label = this.parentNode.attributes["id"].value;
                          }

                          var outText = label + ":" + d.y + " (" + d.x + ")";
                          showData(d3.event.pageX-80, d3.event.pageY+10, outText);

                      })
                     .on("mouseout", function () {
                          d3.select(this).style("stroke-width", 0);
                          hideData();
                     })
                    .attr("height", h + 20);
                    

    rect.transition()
        .delay(function (d, i) { return i * 10; })
        .attr("y", function (d) { return -y(d.y0 + d.y); })
        .attr("height", function (d) { return y(d.y); });

    // Add a label per date.
    var label = svg.selectAll("text")
                              .data(x.domain())
                              .enter().append("svg:text")
                              .attr("x", function (d) {
                                  return x(d) +x.rangeBand() / 3 + margin;
                              })
                              .attr("y", 6)
                              .attr("class", "chartXaxis")
                              .attr("dy", ".71em")
                              .text(function (d) {
                                  return d;
                              });

    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
                              .data(y.ticks(10))
                              .enter().append("svg:g")
                              .attr("class", "rule")
                              .attr("transform", function (d) {
                                  return "translate("+margin+"," + -y(d) + ")";
                              });

                         rule.append("svg:line")
                              .attr("x2", w - p[1] - p[3] )
                              .style("stroke", function (d) {
                                  return d > 0 ? "#fff" : "#000";
                              });
                              //.style("stroke-opacity", function (d) {
                              //    return d ? .7 : null;
                              //});

                         rule.append("svg:text")
                              .attr("x",  -2)
                              .attr("dy", ".18em")
                              .attr("class", "chartYaxis")
                              .text(function(d){ var f1 = d3.format("0.%"); var val = f1(d); return val; }) ;

    if(y_label.length > 1)
    {
       svg.append("svg:text")
           .attr("x", 70 - (y_label.length*3))
           .attr("y", 0)
           .attr("class", "chartYaxisUnits")
           .attr("transform", "rotate(-90)")
           .text(y_label);
    }
    else
    {
        svg.append("svg:text")
           .attr("x", -10)
           .attr("y", -145)
           .attr("class", "chartYaxisUnits")
           //.attr("transform", "rotate(-90)")
           .text(y_label);
    }

    if(drawLegend)
    {
        var j = 0;
        margin = margin - 10;
        for (i = 0; i < label_array.length; i++) {

          var labelText = formatStringForSVGDisplay(label_array[i]);
           if(labelText.length < 30)
           {
                if (i % 2 == 0) {
                    j++;
                }

                svg.append("svg:rect")
                 .attr("x", margin + (i % 2) * 170)
                 .attr("y", j * 17)
                 .attr("width", 10)
                 .attr("height", 10)
                 .style("fill", graphMultipleColors[i]);

                svg.append("svg:text")
                 .attr("x",  margin + (i % 2) * 170 + 17)
                 .attr("y", j * 17 + 9)
                 .attr("class", "chartLegend")
                 .text( labelText );
            }
            else
            {
                if (i % 1 == 0) {
                    j++;
                }

                svg.append("svg:rect").attr("x", margin + (i % 1) * 170).attr("y", j * 17).attr("width", 10).attr("height", 10).style("fill", graphMultipleColors[i]);
                
                svg.append("svg:text")
                   .attr("x",  margin + (i % 1) * 170 + 17)
                   .attr("y", j * 17 + 9)
                   .attr("class", "chartLegend")
                   .text( labelText );
            }
        }
    }

    var legendHght = -(h + 10); var marginTitle = margin - 10;
    if(drawLegend)
    {
        legendHght = -(h - 40);
    }

    svg.append("g").append("svg:text")
        .attr("y", legendHght)
        .attr("x", (w - 2*margin)/2 )
        .style("text-anchor", "middle")
        .attr("class", "chartTitle").text( formatStringForSVGDisplay(grpahTitle) );

    $(container).append("<div class='infobox' style='display:none;'>Test</div>");
    
    return true;
}

//Draw group bar chart!
function drawOneLineChart(container, indicator, label, title, start_year, end_year, axis_title) {

    $(container).text("");

    var indVal = indicator.values();

    if(indVal.length <= 0)
        return;

    //DISPLAY BAR CHART SVG
    ////////////////////////////////////////////////////////////
    var w = 350, h = 230;
    var margin = 30;
    var p = [30, 50, 30, 20],
    x = d3.scale.linear().range([0, w - p[1] - p[3]]);
    y = d3.scale.linear().range([0, h - p[0] - p[2]]);
    format = d3.time.format("%Y");

    var dates_labels = range(start_year, end_year + 1);

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain([start_year, end_year]);

    // Compute the x-domain (by date) and y-domain (by top)
    y.domain([0, d3.max(indVal, function (d) {
        if (d.y < 1)
            return (d.y + 0.1);
        else if (d.y < 10)
            return (d.y + 1);
        else
            return Math.ceil(d.y*1.1);
    })]);

    var svg = d3.select(container).append("svg:svg")
                                  .attr("width",  w + margin)
                                  .attr("height", h + 20)
                                  .append("svg:g")
                                  .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");


    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
                              .data(y.ticks(7))
                              .enter().append("svg:g")
                              .attr("class", "rule")
                              .attr("transform", function (d) {
                                  return "translate(0," + -y(d) + ")";
                              });

//    rule.append("svg:line")
//        .attr("x1", margin + 5)
//        .attr("x2", margin + w - p[1] - p[3]);

    rule.append("svg:line")
        .attr("x1", p[0] )
        .attr("x2", w - p[0])
        .style("stroke", function (d) {
              return d ? "#000" : "#000"; })
        .style("stroke-width", function (d) {
              return d ? 0.3 : 1; })
        .style("stroke-opacity", function (d) {
              return d ? .7 : null; });

    var display_decimal = false;
    rule.append("svg:text")
        .attr("x", 15)
        .attr("dy", ".18em")
        .attr("class", "chartYaxis")
        .text( function(d) { 
           if(display_decimal || d % 1 != 0)
           {
              var df =  d3.format('0.1f');
              display_decimal = true;
              return df(d);
            }
            else{
              var df = d3.format("d");
              return df(d);
            }
         });

    // Add a label per date.
    var label = svg.selectAll("g.yrl")
                   .data(dates_labels)
                   .enter().append("svg:text")
                   .attr("x", function (d) {
                        return x(d) + margin; 
                    })
                   .attr("y", 6)
                   .attr("class", "chartXaxis")
                   .attr("dy", ".71em")
                   .text(function (d) {
                        return d;
                    });

    // create a line function that can convert data[] into x and y points
    var line2 = d3.svg.line()
			          .x(function (d, i) {
			             // return the X coordinate where we want to plot this datapoint
			             return x(d.x) + 5 + margin;
                         })
			           .y(function (d) {
			             // return the Y coordinate where we want to plot this datapoint
			             return -y(d.y);
                         });

	svg.append("svg:path").attr("d", line2(indVal)).attr("class", "chartLineBlue");

    var circle = svg.selectAll("chartLineBlue")
                             .data(indVal)
                             .enter().append("circle")
                             //.attr("fill", "none")
                             .style("stroke", line_color)
                             .style("cursor", "pointer")
                             .attr("r", 3)
                             .attr("cx", function (d, i) {
                                 // return the X coordinate where we want to plot this datapoint
                                 return x(d.x) + 5 + margin;
                             })
                             .attr("cy", function (d) {
                                 // return the Y coordinate where we want to plot this datapoint
                                 return -y(d.y);
                             })
                             .on("mouseover", function (d) {
                                 d3.select(this).style("stroke-width", 6);

                                 var outText =  getStringFromDict('VALUE') + ": " + d.y + " (" + d.x + ")";

                                 showData(d3.event.pageX-70, d3.event.pageY-40, outText);
                             })
                             .on("mouseout", function () {
                                 d3.select(this).style("stroke-width", 1);
                                 hideData();
                             });


    $(container).append("<div class='infobox' style='display:none;'>Test</div>");

    svg.append("svg:text")
       .attr("y", -(h - 43))
       .attr("x", (w - margin)/2 )
       .attr("class", "chartTitle")
       .style("text-anchor", "middle")
       .text( formatStringForSVGDisplay(title) );

       if (!(typeof axis_title === "undefined")) {

             if (axis_title.indexOf('\\n') > 0) {

                  var title_splt = axis_title.split('\\n');

                  svg.append("svg:text")
                               .attr("x", (h-p[0]-margin)/2)
                               .attr("y", -11)
                               .attr("class", "chartYaxisUnits")
                               .attr("transform", "rotate(-90)")
                               .style("text-anchor", "middle")
                               .text(formatStringForSVGDisplay(title_splt[0]) );

                   svg.append("svg:text")
                          .attr("x", (h-p[0]-margin)/2)
                          .attr("y", 0)
                          .attr("class", "chartYaxisUnits")
                          .attr("transform", "rotate(-90)")
                          .style("text-anchor", "middle")
                          .text(formatStringForSVGDisplay(title_splt[1]));
               }
               else {
                    svg.append("svg:text")
                       .attr("x", (h-p[0]-margin)/2)
                       .attr("y", -10)
                       .attr("class", "chartYaxisUnits")
                       .attr("transform", "rotate(-90)")
                       .style("text-anchor", "middle")
                       .text( formatStringForSVGDisplay(axis_title) );
               }
     }


}

function sortGroup(cellValus, rowData) {     
        return rowData.sort;
    }

    var fixGridWidth = function (grid) {
    var gviewScrollWidth = grid[0].parentNode.parentNode.parentNode.scrollWidth;
    var mainWidth = 710;
    var gridScrollWidth = grid[0].scrollWidth;
    var htable = jQuery('table.ui-jqgrid-htable', grid[0].parentNode.parentNode.parentNode);
    var scrollWidth = gridScrollWidth;
    if (htable.length > 0) {
        var hdivScrollWidth = htable[0].scrollWidth;
        if ((gridScrollWidth < hdivScrollWidth))
            scrollWidth = hdivScrollWidth; // max (gridScrollWidth, hdivScrollWidth)
    }
    if (gviewScrollWidth != scrollWidth || scrollWidth > mainWidth) {
        var newGridWidth = (scrollWidth <= mainWidth)? scrollWidth: mainWidth;  // min (scrollWidth, mainWidth)
        // if the grid has no data, gridScrollWidth can be less then hdiv[0].scrollWidth
        if (newGridWidth != gviewScrollWidth)
            grid.jqGrid("setGridWidth", newGridWidth);
    }
};

var fixGridSize = function (grid) {
    this.fixGridWidth(grid);
};

function displayGroupedTable(list_name, datasource, labelname, start_year, end_year, idwidth) {

    var selColumn;
    var hovColumn;

    var grid = $(list_name);
    if (datasource.length <= 0) 
    {
        grid.css("visibility", "hidden");

        $(list_name + "-nodata").css("visibility", "visible");
        //display NO DATA label
        return;
    }

    grid.css("visibility", "visible");
    $(list_name + "-nodata").css("visibility", "hidden");

    //Create definition arrays
    var colArr = strRange(start_year, end_year);
    var colNamesArr = ['id'].concat(colArr).concat( ['group', 'sort']);

    var iwidth = 145;
    if (!(typeof idwidth === "undefined"))
    {
        iwidth = idwidth;
    }
    
    //Column model Array create
    var colModelArr = [];
    colModelArr.push( { name: 'id', index: 'id', key: true, width: iwidth, sortable: false, fixed: true,
                           cellattr: function (rowId, val, rawObject, cm, rdata) {
                                var note = "";
                                if (!(typeof rawObject.note === "undefined"))
                                    note = ' (' + rawObject.note + ')';
                                return 'title="' + rawObject.id + note + '"';} } );

    for(var i = 0; i < colArr.length; i++)
    {
        colModelArr.push( { name: colArr[i], index: colArr[i], width: 51, height: 30, sortable: false, align: "Right", sortable: false, fixed: true  } );
    }
    colModelArr.push( { name: 'group', index: 'group', width: 0, fixed: true, editable: false, hidden: true, sorttype: function (cellValus, rowData) {return sortGroup(cellValus, rowData)}, sortable: false } );
    colModelArr.push( { name: 'sort',  index: 'sort',  width: 0, fixed: true, editable: false, hidden: true, sorttype: 'int',  sortable: true} );


    grid.GridUnload();
    grid.jqGrid({
        data: datasource,
        datatype: 'local',
        colNames: colNamesArr,
        colModel: colModelArr,
        pager: '#pager',
        rowNum: datasource.length,
       // rowList: [5, 10, 20],
        sortname: 'sort',
        sortorder: 'asc',
       // loadonce: false,     // to dis-able sorting on client side
        sortable: true,   
        viewrecords: true,
        //width: '100%',
        height: '100%',
        //  rownumbers: true,
        gridview: false,
        shrinkToFit: false,
        autowidth: false,
        grouping: true,
        altRows: true,
        altclass: 'myAltRowClass',
        groupingView: {
            groupField: ['group'],
            groupColumnShow: [false],
            groupText : ['<span  style="font-size:9pt; font-weight:bolder;">{0}</span>'],
            groupCollapse: false,
            groupDataSorted: true, 
            groupSorted: true, 
//           groupOrder: ['desc']
        },
        //  caption: 'How to select columns',
        beforeSelectRow: function (rowid, e) {
            return false;
        },
        gridComplete: function() {
            
        }
    }
    );

    $(list_name).jqGrid("setLabel", "id", labelname); //, { "text-align": "right" });

    grid.jqGrid('navGrid', '#pager', { add: false, edit: false, del: false, search: false, refresh: true });
    //grid.jqGrid('gridResize', { minWidth: 710, minHeight: 50 });

    fixGridSize(grid);

    for(var i = 0; i < $(list_name)[0].rows.length; i++)
    {
               var row = $(list_name)[0].rows[i];
               if ( row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("AIR_1"))) || 
                    row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("AIR_1_GLAST"))) || 
                    row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("SR_1_GLAST_CP"))) || 
                    row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("TRANRA_23_GPV_CP"))) || 
                    row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("GGR_5_A"))) ||
                    row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("GTVP_3_V"))) ||
                    row.id == get_ents(getIndicatorTitle( getIndicatorDescriptionByStr("PTRHC_0")))
                     )   
               {
                   row.cells[0].setAttribute("colspan", "12");
                   row.cells[0].setAttribute("style", "font-weight: bold;  background:#818080; color:white;");
               }
     }

     var listN = list_name.substring(1);

}

//display Total-Male-Female table
function displayTMFTable(list_name, datasource, labelname, highlightarr) {

    var selColumn;
    var hovColumn;

    var grid = $(list_name);
    if (datasource.length <= 0) {
        grid.css("visibility", "hidden");

        $(list_name + "-nodata").css("visibility", "visible");
        //display NO DATA label
        return;
    }

    grid.css("visibility", "visible");
    $(list_name + "-nodata").css("visibility", "hidden");

    var maleStr   = getStringFromDict("MALE").capitalizeFirstLetter();
    var femaleStr = getStringFromDict("FEMALE").capitalizeFirstLetter();
    var totalStr  = getStringFromDict("TOTAL").capitalizeFirstLetter();

    grid.GridUnload();
    grid.jqGrid({
        data: datasource,
        datatype: 'local',
        colNames: ['id', totalStr, maleStr, femaleStr, 'Year'],
        colModel: [{ name: 'id', index: 'id', key: true, width: 395, fixed: true, sortable: false,
            cellattr: function (rowId, val, rawObject, cm, rdata) {
                var note = "";
                if (!(typeof rawObject.note === "undefined"))
                    note = ' (' + rawObject.note + ')';
                return 'title="' + rawObject.id + note + '"';
            }
        },
          { name: 'Total', index: 'Total', width: 80, height: 30, fixed: true, sortable: false, align: "Right" },
          { name: 'Male', index: 'Male', width: 80, height: 30, fixed: true, sortable: false, align: "Right" },
          { name: 'Female', index: 'Female', width: 80, height: 30, fixed: true, sortable: false, align: "Right" },
          { name: 'Year', index: '', width: 50, height: 30, fixed: true, sortable: false, align: "Right"}],
        pager: '#pager',
        rowNum: datasource.length,
        rowList: [5, 10, 20],
        //sortname: 'id',
        //sortorder: 'asc',
        viewrecords: true,
       // width: '800px',
        height: '100%',
        //  rownumbers: true,
        gridview: false,
        shrinkToFit: false,
        autowidth: false,
        altRows: true,
        altclass: 'myAltRowClass',
        //  caption: 'How to select columns',
        beforeSelectRow: function (rowid, e) {
            return false;
        }
    } );
    $(list_name).jqGrid("setLabel", "id", labelname); //, { "text-align": "right" });
    $(list_name).jqGrid("setLabel", 'Year', " "); 

    fixGridSize(grid);

    for(var i = 0; i < $(list_name)[0].rows.length; i++)
    {
               var row = $(list_name)[0].rows[i];
               for(var item in highlightarr)
               {
                   if(row.id  == highlightarr[item]) 
                   {
                       row.cells[0].setAttribute("colspan", "5");
                       row.cells[0].setAttribute("style", "font-weight: bold;  background:#818080; color:white;");
                   }
               }
     }

    grid.jqGrid('navGrid', '#pager', { add: false, edit: false, del: false, search: false, refresh: true });
}



function displayTable(list_name, datasource, labelname, start_year, end_year, highlightarr) {

    var selColumn;
    var hovColumn;

    var grid = $(list_name);
    if (datasource.length <= 0) {
        grid.css("visibility", "hidden");

        $(list_name + "-nodata").css("visibility", "visible");
        //display NO DATA label
        return;
    }

    grid.css("visibility", "visible");
    $(list_name + "-nodata").css("visibility", "hidden");


    //Create definition arrays
    var colArr = strRange(start_year, end_year);
    var colNamesArr = ['id'].concat(colArr).concat( ['group', 'sort']);
    
    //Column model Array create
    var colModelArr = [];
    colModelArr.push( { name: 'id', index: 'id', key: true, width: 145, fixed: true, sortable: false,
                           cellattr: function (rowId, val, rawObject, cm, rdata) {
                                var note = "";
                                var id = rawObject.id.replace("<b>","").replace("</b>","");
                                if (!(typeof rawObject.note === "undefined"))
                                    note = ' (' + rawObject.note + ')';
                                return 'title="' + id + note + '"';} } );

    for(var i = 0; i < colArr.length; i++)
    {
        colModelArr.push( { name: colArr[i], index: colArr[i], width: 51, height: 30, fixed: true, sortable: false, align: "Right"  } );
    }

    colModelArr.push( { name: 'group', index: 'group', width: 0, editable: false, hidden: true } );
    colModelArr.push( { name: 'sort', index: 'sort', width: 0, editable: false, hidden: true, sorttype: 'int', sortable: true} );

    grid.GridUnload();
    grid.jqGrid({
        data: datasource,
        datatype: 'local',
        colNames: colNamesArr,
        colModel: colModelArr,
      //  pager: '#pager',
        rowNum: datasource.length,
        //rowList: [5, 10, 20],
        //sortname: 'id',
        //sortorder: 'asc',
        viewrecords: true,
        height: '100%',
        //width: '100%',
        //  rownumbers: true,
        gridview: false,
        shrinkToFit: false,
        autowidth: false,
        altRows: true,
        altclass: 'myAltRowClass',
        //shrinkToFit: true,
        //  caption: 'How to select columns',
        beforeSelectRow: function (rowid, e) {
            return false;
        }
    });
    $(list_name).jqGrid("setLabel", "id", labelname); //, { "text-align": "right" });
    
    fixGridSize(grid);

    for(var i = 0; i < $(list_name)[0].rows.length; i++)
    {
               var row = $(list_name)[0].rows[i];
               for(var item in highlightarr)
               {
                   if(row.id  == highlightarr[item]) 
                   {
                       row.cells[0].setAttribute("colspan", "12");
                       row.cells[0].setAttribute("style", "font-weight: bold;  background:#818080; color:white;");
                   }
               }
     }

   // grid.jqGrid('navGrid', '#pager', { add: false, edit: false, del: false, search: false, refresh: true });
}


function displayTableLabelValue(list_name, datasource, labelname, label_width) {

    var selColumn;
    var hovColumn;

    var grid = $(list_name);

    //Column model Array create
    var colModelArr = [];
    colModelArr.push( { name: 'label', index: 'label', key: true, width: label_width,  sortable: false, autowidth: true
                           /*cellattr: function (rowId, val, rawObject, cm, rdata) {
                                var note = "";
                                var label = rawObject.label.replace("<b>","").replace("</b>","");
                                if (!(typeof rawObject.note === "undefined"))
                                    note = ' (' + rawObject.note + ')';
                                return 'title="' + label + note + '"';}*/ }  );

    colModelArr.push( { name: "value", index: "value", width: 80, height: 30, sortable: false, align: "Right", autowidth: true } );


    grid.GridUnload();
    grid.jqGrid({
        data: datasource,
        datatype: 'local',
        colNames: [getStringFromDict('POP_SCHOOL_AGE_TITLE'),'value'],
        colModel: colModelArr,
        pager: '#pager',
        rowNum: datasource.length,
        //rowList: [5, 10, 20],
        //sortname: 'id',
        //sortorder: 'asc',
        viewrecords: true,
        height: '100%',
        width: '100%',
        //  rownumbers: true,
        gridview: false,
        altRows: true,
        altclass: 'myAltRowClass',
        autowidth: true,
        shrinkToFit: false,
        //  caption: 'How to select columns',
        beforeSelectRow: function (rowid, e) {
            return false;
        }
    });


    $('#gview_' + list_name.substring(1) + ' .ui-jqgrid-hdiv').hide();
    $('#gbox_' + list_name.substring(1)).css('width', label_width + 80);
    grid.jqGrid('navGrid', '#pager', { add: false, edit: false, del: false, search: false, refresh: true });
}

 //pie chart with transition
 function drawPieChart(container, indicators, grpahTitle, label) {

                      $(container).text("");

                      var indicStart = [];
                      indicators = indicators.values();

                      if(indicators.length <= 0)
                        return;

                      //create a dummy array - used for transition 
                      for (var i = 0; i < indicators.length; i++) {
                        indicStart.push({ value: 100/indicators.length });
                      }

                      //DISPLAY BAR CHART SVG
                      ////////////////////////////////////////////////////////////
                      var w = 350, h = 200, radius = Math.min(w, h) / 2;
                      var arc =  d3.svg.arc()
                                  .outerRadius(radius - 10)
                                  .innerRadius(0)
                                  .startAngle(0)
                                  .endAngle(function (d) { return (d.value / 100) * 2 * Math.PI; });


                      var arcOver = d3.svg.arc().outerRadius(radius );
                      var arcOut  = d3.svg.arc().outerRadius(radius - 10);


                      var pie = d3.layout.pie()
                                  .sort(null)
                                  .value(function (d) { return d.value; });

                      var svg = d3.select(container).append("svg")
                                  .attr("width", w)
                                  .attr("height", h + 20)
                                  .append("g")
                                  .attr("transform", "translate(" + w / 3.3 + "," + h / 1.7 + ")");

                      indicators.forEach(function (d) {
                          d.value = +d.value;
                      });

                      var path = svg.selectAll("path")
                                    .data(pie(indicStart))
                                    .enter().append("path")
                                    .attr("fill", function (d, i) { return PieChartColor[i]; })
                                    .attr("d", arc)
                                    .each(function (d) {
                                        this._current = d;
                                     }).on("mouseover", function(d, i) {
                                        d3.select(this)
                                        //.select("path")
                                        .transition()
                                           .duration(700)
                                           .attr("d", arcOver);

                                           var outText =  d.value + "%";

                                           svg.insert("svg:text")
                                            .attr("id", "textval")
                                            .text(outText)
                                            .attr("x", -14)
                                            .attr("y", 5 )
                                            .attr("class", "pieChartMiddleText");

                                    })
                                    .on("mouseout", function(d) {

                                        svg.select("text#" + "textval").remove();

                                        d3.select(this)
                                           .transition()
                                           .duration(700)
                                           .attr("d", arcOut);
                                    });

                      path = path.data(pie(indicators)); // update the data
                      path.transition().duration(1000).delay(100).attrTween("d", arcTween); // redraw the arcs

                       
                       for (var i = 0; i < indicators.length; i++)
                       {
                         svg.append("svg:rect")
                            .attr("x",  110)
                            .attr("y", i * 30 - 50)
                            .attr("width", 10).attr("height", 10)
                            .style("fill", PieChartColor[i]);
                         
                         svg.append("svg:text")
                            .attr("x",  130).attr("y", i * 30  - 41)
                            .attr("class", "chartLegend")
                            .text(indicators[i].descr);
                       }

                       svg.append("svg:text")
                          .attr("y", -108)
                          .attr("x", -70)
                          .attr("class", "chartTitle")
                          .text( formatStringForSVGDisplay(label + ", " + indicators[0].year + " (%)") );

                       $(container).append("<div class='infobox' style='display:none;'>Test</div>");

                      // Store the displayed angles in _current.
                      // Then, interpolate from _current to the new angles.
                      // During the transition, _current is updated in-place by d3.interpolate.
                      function arcTween(a) {
                          var w = 350, h = 200, radius = Math.min(w, h) / 2;
                          var arc = d3.svg.arc()
                                .outerRadius(radius - 10)
                                  .innerRadius(0)

                          var i = d3.interpolate(this._current, a);
                          this._current = i(0);
                          return function (t) {
                              return arc(i(t));
                          };
                      }

  }

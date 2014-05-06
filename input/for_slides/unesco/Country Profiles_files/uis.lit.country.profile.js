 

        var illChartData = {};
        var illPeopleTable = [];
        var literRateTable = [];

        var educ_start_yr = 0;
        var educ_end_yr   = 0;

        var start_yr = 0;
        var end_yr   = 0;

        var litRateChartDataMale   = {};
        var litRateChartDataFemale = {};
        var litRateChartDataTotal = {};

        var iscedChartDataMale = {};
        var iscedChartDataFemale = {};
        var iscedChartDataTotal = {};

        var illiteratePeopleIndic = "ILLPOP_AG15T24,ILLPOP_AG15T24_F,ILLPOP_AG15T24_M,ILLPOP_AG15T99,ILLPOP_AG15T99_M,ILLPOP_AG15T99_F";
        var literacyReatesIndic   = "LR_AG15T24,LR_AG15T24_F,LR_AG15T24_M,LR_AG15T99,LR_AG15T99_F,LR_AG15T99_M,LR_AG65T99,LR_AG65T99_F,LR_AG65T99_M";
        var lieracyIsched         = "EA_1T6_AG25T99,EA_1T6_AG25T99_F,EA_1T6_AG25T99_M,EA_2T6_AG25T99,EA_2T6_AG25T99_F,EA_2T6_AG25T99_M,EA_3T6_AG25T99,EA_3T6_AG25T99_F,EA_3T6_AG25T99_M,EA_4T6_AG25T99,EA_4T6_AG25T99_F,EA_4T6_AG25T99_M,EA_56_AG25T99,EA_56_AG25T99_F,EA_56_AG25T99_M";

        function setStaticStrings() {

            $('#section_geninfo').html(getStringFromDict('SECT_GEN_INFO'));
            $('#section_educsystem').html(getStringFromDict('EDUC_SYSTEM'));
            $('#section_illiterpeople').html(getStringFromDict('ILLITER_POPULATION'));
           // $('#illiterate_15to24').text(getStringFromDict('ILL_15T24'));
            $('#str_female').html(getStringFromDict('FEMALE').capitalizeFirstLetter());
            $('#str_male').html(getStringFromDict('MALE').capitalizeFirstLetter());
            $('#str_nodata').html(getStringFromDict('NODATA'));
           // $('#illiterate_15older').text(getStringFromDict('ILL_15OLDER'));
            $('#section_partedu').html(getStringFromDict('SECT_PART_EDU'));
            $('#literacy_rates').html(getStringFromDict('LITERACY_RATES'));

            $('#section_notes').html(getStringFromDict('SECT_NOTES'));

            if (language == 'FR') {
                $('#notes_english').text("");
            }
            else
                $('#notes_french').text("");
        }


 //call main method
initAndRun(renderprofile);

 function renderprofile() {
     d3.loadData()
                  .json('countries', './../Country_Data/world-countries.json')
                  .csv('nodes', './../Country_Data/nodes.csv')
                  .json('config', './../api/general/?keys=EDU_CP_END_YR,EDU_CP_START_YR,LIT_CP_END_YR,LIT_CP_START_YR')
                  .onload(function (data) {

                      start_yr = parseInt(data.config.LIT_CP_START_YR);
                      end_yr = parseInt(data.config.LIT_CP_END_YR);

                      educ_start_yr = parseInt(data.config.EDU_CP_START_YR);
                      educ_end_yr = parseInt(data.config.EDU_CP_END_YR);


                      language = getLanguage();

                      setStaticStrings();
                      //regionsDef = data.ged_regions;
                      setCountryRegionName();

                      var code = getParameter("code");

                      if (!(typeof code === "undefined")) {
                          loadDataforCountry(code);
                      }
                      else {
                          loadDataforCountry("CAN");
                      }


                      //Draw group bar chart!
                      //ISCED charts may be removed. Hene no refactor them for now
                      function drawBarChartISCED(container, indicators1, indicators2, indicators3) {

                          $(container).text("");

                          //DISPLAY BAR CHART SVG
                          ////////////////////////////////////////////////////////////
                          var w = 350,
                              h = 200,
                              p = [20, 50, 30, 20],
                              x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
                              y = d3.scale.linear().range([0, h - p[0] - p[2]]);

                          format = d3.time.format("%Y");

                          // Compute the x-domain (by date) and y-domain (by top).
                          x.domain(["ISCED 1", "ISCED 2", "ISCED 3", "ISCED 4", "ISCED 5"]);

                          y.domain([0, d3.max(indicators1, function (d) {
                              return d.y + 20;
                          })]);

                          var svg = d3.select(container).append("svg:svg")
                                          .attr("width", w)
                                          .attr("height", h + 20)
                                          .append("svg:g")
                                          .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

                          // Add a rect for each date.
                          var rect = svg.selectAll("g.indic") //indicat.selectAll("rect")
                                  .data(indicators1)
                                  .enter()
                                  .append("svg:g")
                                  .attr("class", "chartMaleBarColor")
                                  .style("cursor", "pointer")
                                  .on("mouseover", function (d, indicators_line1) {

                                      d3.select(this).style("stroke-width", "2px");
                                      svg.insert("svg:text")
                                                .text(d.y)
                                                .attr("x", x(d.x) + 5)
                                                .attr("y", -y(d.y) - 7)
                                                .attr("class", "chartMaleColor")
                                                .attr("font-size", "11pt")
                                                .attr("font-family", "arial")
                                                .style("stroke", "#ff3f3f")
                                                .attr("id", "gerval");

                                  })
                                  .on("mouseout", function () {
                                      svg.select("text#" + "gerval").remove();
                                      svg.select("text#" + "nerval").remove();

                                      d3.select(this).style("stroke-width", 0);
                                  })
                                  .append("svg:rect")
                                  .attr("x", function (d) {
                                      return x(d.x) + 5;
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
                          var rect2 = svg.selectAll("g.indic") //indicat.selectAll("rect")
                                  .data(indicators2)
                                  .enter()
                                  .append("svg:g")
                                  .style("fill", "#9bbb59")
                                  .attr("class", "chartStrokeHighl")
                                  .style("cursor", "pointer")
                                  .on("mouseover", function (d, indicators_line2) {
                                      d3.select(this).style("stroke-width", "2px");
                                      svg.insert("svg:text").text(d.y)
                                                            .attr("x", x(d.x) + 5)
                                                            .attr("y", -y(d.y) - 7)
                                                            .style("fill", "#9bbb59")
                                                            .attr("font-size", "11pt")
                                                            .attr("font-family", "arial")
                                                            .style("stroke", "#9bbb59")
                                                            .attr("id", "gerval");
                                  })
                                  .on("mouseout", function () {
                                      svg.select("text#" + "gerval").remove();
                                      svg.select("text#" + "nerval").remove();
                                      d3.select(this).style("stroke-width", 0);
                                  })
                                  .append("svg:rect")
                                  .attr("x", function (d) {
                                      return x(d.x) + 15;
                                  })
                                  .attr("y", function (d) {
                                      return -y(d.y);
                                  })
                                  .transition().duration(1000).delay(100)
                                  .attr("height", function (d) {
                                      return y(d.y);
                                  })
                                  .attr("width", 10);


                          var rect3 = svg.selectAll("g.indic") //indicat.selectAll("rect")
                                  .data(indicators3)
                                  .enter()
                                  .append("svg:g")
                                  .style("fill", "steelblue")
                                  .attr("class", "chartStrokeHighl")
                                  .style("cursor", "pointer")
                                  .on("mouseover", function (d, indicators_line2) {
                                      d3.select(this).style("stroke-width", "2px");
                                      svg.insert("svg:text")
                                         .text(d.y)
                                         .attr("x", x(d.x) + 5)
                                         .attr("y", -y(d.y) - 7)
                                         .style("fill", "steelblue")
                                         .attr("font-size", "11pt")
                                         .attr("font-family", "arial")
                                         .style("stroke", "steelblue")
                                         .attr("id", "indic3val");
                                  })
                                  .on("mouseout", function () {
                                      svg.select("text#" + "indic3val").remove();
                                      d3.select(this).style("stroke-width", 0);
                                  })
                                  .append("svg:rect")
                                  .attr("x", function (d) {
                                      return x(d.x);
                                  })
                                  .attr("y", function (d) {
                                      return -y(d.y);
                                  })
                                  .transition().duration(1000).delay(100)
                                  .attr("height", function (d) {
                                      if (y(d.y) < 3)
                                          y(d.y);
                                      else
                                          return 3;
                                  })
                                  .attr("width", 25);


                          // create a line function that can convert data[] into x and y points
                          var line2 = d3.svg.line()
                          // assign the X function to plot our line as we wish
                                .x(function (d, i) {
                                    // return the X coordinate where we want to plot this datapoint
                                    return x(d.x) + 5;
                                })
                                .y(function (d) {
                                    // return the Y coordinate where we want to plot this datapoint
                                    return -y(d.y);
                                });

                          // Add a label per ISCED alue.
                          var label = svg.selectAll("text")
                                  .data(x.domain())
                                  .enter().append("svg:text")
                                  .attr("x", function (d) {
                                      return x(d) + x.rangeBand() / 2 - 10;
                                  })
                                  .attr("y", 6)
                                  .attr("text-anchor", "middle")
                                  .attr("class", "chartLegend")
                                  .attr("dy", ".71em")
                                  .text(function (d) {
                                      return d;
                                  });

                          // Add y-axis rules.
                          var rule = svg.selectAll("g.rule")
                                  .data(y.ticks(5))
                                  .enter().append("svg:g")
                                  .attr("class", "rule")
                                  .attr("class", "chartLegend")
                                  .attr("transform", function (d) {
                                      return "translate(0," + -y(d) + ")";
                                  });

                          rule.append("svg:line")
                                  .attr("x2", w - p[1] - p[3])
                                  .style("stroke", function (d) {
                                      return d > 0 ? "#fff" : "#000";
                                  });

                          rule.append("svg:text")
                                  .attr("x", -15)// w - p[1] - p[3] + 6)
                                  .attr("dy", ".18em")
                                  .text(d3.format(",d"));

                          svg.append("svg:rect").attr("x", 0).attr("y", 25).attr("width", 15).attr("height", 15).attr("fill", bar_color1);
                          svg.append("svg:text").attr("x", 17).attr("y", 38).text(getStringFromDict('MALE').capitalizeFirstLetter());

                          svg.append("svg:rect").attr("x", 90).attr("y", 25).attr("width", 15).attr("height", 15).style("fill", bar_color2);
                          svg.append("svg:text").attr("x", 107).attr("y", 38).text(getStringFromDict('FEMALE').capitalizeFirstLetter());

                          svg.append("svg:rect").attr("x", 180).attr("y", 25).attr("width", 15).attr("height", 15).style("fill", "steelblue");
                          svg.append("svg:text").attr("x", 197).attr("y", 38).text(getStringFromDict('TOTAL').capitalizeFirstLetter());

                          svg.append("svg:text")
                           .attr("y", -(h - 50))
                           .attr("x", 0)
                           .attr("class", "chartLegend")
                           .text(getStringFromDict('PERC_POP_ISCED'));
                      }

                      function drawCommonLegend(container) {
                          $(container).text("");

                          var w = 300, h = 50;
                          var p = [20, 50, 30, 20];

                          var svg = d3.select(container).append("svg:svg")
                                          .attr("width", w)
                                          .attr("height", h + 20)
                                          .append("svg:g");
                          //.attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

                          svg.append("svg:circle")
                                .attr("r", 3)
                                .attr("class", "chartThreeLineLegendLine1")
                                .attr("transform", function () { return "translate(20," + 20 + ")"; });

                          svg.append("svg:text")
                              .attr("transform", function () { return "translate(28," + 24 + ")"; })
                              .attr("class", "chartThreeLineLegendText")
                              .text(formatStringForSVGDisplay(getStringFromDict('MALE').capitalizeFirstLetter()));

                          svg.append("svg:circle")
                                .attr("r", 3)
                                .attr("class", "chartThreeLineLegendLine2")
                                .attr("transform", function () { return "translate(100," + 20 + ")"; });

                          svg.append("svg:text")
                          .attr("transform", function () { return "translate(108," + 24 + ")"; })
                          .attr("class", "chartThreeLineLegendText")
                          .text(formatStringForSVGDisplay(getStringFromDict('FEMALE').capitalizeFirstLetter()));

                          svg.append("svg:circle")
                                .attr("r", 3)
                                .attr("class", "chartThreeLineLegendLine3")
                                .attr("transform", function () { return "translate(200," + 20 + ")"; });

                          svg.append("svg:text")
                          .attr("transform", function () { return "translate(208," + 24 + ")"; })
                          .attr("class", "chartThreeLineLegendText")
                          .text(formatStringForSVGDisplay(getStringFromDict('TOTAL').capitalizeFirstLetter()));

                      }

                      //Draw group bar chart!
                      function drawTreeLineChart(container, type, title, draw_legend, start_year, end_year, axis_title) {

                          $(container).text("");

                          var indMaleVal = litRateChartDataMale[type].values();
                          var indFemaleVal = litRateChartDataFemale[type].values();
                          var indTotalVal = litRateChartDataTotal[type].values();

                          if (indMaleVal.length == 0 && indFemaleVal.length == 0 && indTotalVal.length == 0)
                              return false;

                          //DISPLAY BAR CHART SVG
                          ////////////////////////////////////////////////////////////
                          var w = 350, h = 200;
                          var p = [20, 30, 30, 40];
                          if (type == "ADULT") {
                              w = 500;
                              h = 280;
                              p = [50, 30, 30, 40];
                          }

                          var x = d3.scale.linear().range([0, w - p[1] - p[3]]);
                          y = d3.scale.linear().range([0, h - p[0] - p[2]]);
                          format = d3.time.format("%Y");

                          var dates_labels = range(start_year, end_year, 5);

                          // Compute the x-domain (by date) and y-domain (by top).
                          x.domain([start_year, end_year]);

                          y.domain([0, d3.max(indTotalVal, function (d) {
                              return (100);
                          })]);

                          if (!draw_legend)
                              p[2] = p[2] - 35;

                          var svg = d3.select(container).append("svg:svg")
                                          .attr("width", w)
                                          .attr("height", h + 20)
                                          .append("svg:g")
                                          .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

                          if (draw_legend) {

                              var strtX = p[1] + 60;
                              svg.append("svg:circle")
                                .attr("r", 3)
                                .attr("class", "chartThreeLineLegendLine1")
                                .attr("transform", function () { return "translate(" + strtX + "," + 40 + ")"; });

                              svg.append("svg:text")
                              .attr("transform", function () { return "translate(" + (strtX + 8) + "," + 44 + ")"; })
                              .attr("class", "chartThreeLineLegendText")
                              .text(formatStringForSVGDisplay(getStringFromDict('MALE').capitalizeFirstLetter()));

                              svg.append("svg:circle")
                                .attr("r", 3)
                                .attr("class", "chartThreeLineLegendLine2")
                                .attr("transform", function () { return "translate(" + (strtX + 80) + "," + 40 + ")"; });

                              svg.append("svg:text")
                                .attr("transform", function () { return "translate(" + (strtX + 88) + "," + 44 + ")"; })
                                .attr("class", "chartThreeLineLegendText")
                                .text(formatStringForSVGDisplay(getStringFromDict('FEMALE').capitalizeFirstLetter()));

                              svg.append("svg:circle")
                                .attr("r", 3)
                                .attr("class", "chartThreeLineLegendLine3")
                                .attr("transform", function () { return "translate(" + (strtX + 175) + "," + 40 + ")"; });

                              svg.append("svg:text")
                              .attr("transform", function () { return "translate(" + (strtX + 183) + "," + 44 + ")"; })
                              .attr("class", "chartThreeLineLegendText")
                              .text(formatStringForSVGDisplay(getStringFromDict('TOTAL').capitalizeFirstLetter()));
                          }

                          // Add y-axis rules.
                          var rule = svg.selectAll("g.rule")
                                  .data(y.ticks(5))
                                  .enter().append("svg:g")
                                  .attr("class", "rule")
                                  .attr("transform", function (d) {
                                      return "translate(0," + -y(d) + ")";
                                  });

                          rule.append("svg:line")
                                  .attr("x2", w - p[1] - p[3])
                                  .style("stroke", function (d) {
                                      return d ? "#000" : "#000";
                                  })
                                  .style("stroke-width", function (d) {
                                      return d ? 0.3 : 1;
                                  })
                                  .style("stroke-opacity", function (d) {
                                      return d ? .7 : null;
                                  });

                          rule.append("svg:text")
                                  .attr("x", -5)
                                  .attr("class", "chartYaxis")
                                  .text(d3.format(",d"));

                          // Add a label per date.
                          var label = svg.selectAll("g.yrl")
                                  .data(dates_labels)
                                  .enter().append("svg:text")
                                  .attr("x", function (d) { return x(d); })
                                  .attr("y", 12)
                                  .attr("class", "chartXaxis")
                                  .text(function (d) {
                                      return d;
                                  });

                          // create a line function that can convert data[] into x and y points
                          var lineF = d3.svg.line()
                          // assign the X function to plot our line as we wish
                                .x(function (d, i) {
                                    // return the X coordinate where we want to plot this datapoint
                                    return x(d.x) + 5;
                                })
                                .y(function (d) {
                                    // return the Y coordinate where we want to plot this datapoint
                                    return -y(d.y);
                                });

                          svg.append("svg:path").attr("d", lineF(indMaleVal)).attr("class", "chartThreeLineLine1");
                          svg.append("svg:path").attr("d", lineF(indFemaleVal)).attr("class", "chartThreeLineLine2");
                          svg.append("svg:path").attr("d", lineF(indTotalVal)).attr("class", "chartThreeLineLine3");

                          var circle = svg.selectAll("chartThreeLineLine1")
                                 .data(indMaleVal)
                                 .enter().append("circle")
                                 .attr("r", 3)
                                 .attr("class", "chartThreeLinePointLine1")
                                 .attr("cx", function (d, i) {
                                     // return the X coordinate where we want to plot this datapoint
                                     return x(d.x) + 5;
                                 })
                                 .attr("cy", function (d) {
                                     // return the Y coordinate where we want to plot this datapoint
                                     return -y(d.y);
                                 })
                                 .on("mouseover", function (d) {
                                     d3.select(this).style("stroke-width", 6);

                                     var outText = getStringFromDict('MALE').capitalizeFirstLetter() + ":   " + d.y + " (" + d.x + ")";
                                     var mval = litRateChartDataMale[type].get(d.x);
                                     var fval = litRateChartDataFemale[type].get(d.x);
                                     var tval = litRateChartDataTotal[type].get(d.x);

                                     if (Math.abs(mval.y - fval.y) < 4)
                                         outText += "<br>" + getStringFromDict('FEMALE').capitalizeFirstLetter() + ": " + fval.y;
                                     if (Math.abs(mval.y - tval.y) < 4)
                                         outText += "<br>" + getStringFromDict('TOTAL').capitalizeFirstLetter() + ":    " + tval.y;

                                     showData(d3.event.pageX - 100, d3.event.pageY + 10, outText);
                                 })
                                 .on("mouseout", function () {
                                     d3.select(this).style("stroke-width", 1);
                                     hideData();
                                 });


                          $(container).append("<div class='infobox' style='display:none;'>Test</div>");


                          svg.selectAll("chartThreeLineLine2")
                                 .data(indFemaleVal)
                                 .enter().append("circle")
                                 .attr("r", 3)
                                 .attr("class", "chartThreeLinePointLine2")
                                 .attr("cx", function (d, i) {
                                     // return the X coordinate where we want to plot this datapoint
                                     return x(d.x) + 5;
                                 })
                                 .attr("cy", function (d) {
                                     // return the Y coordinate where we want to plot this datapoint
                                     return -y(d.y);
                                 })
                                 .on("mouseover", function (d) {
                                     d3.select(this).style("stroke-width", 6);

                                     var outText = getStringFromDict('FEMALE').capitalizeFirstLetter() + ":  " + d.y + " (" + d.x + ")";
                                     var mval = litRateChartDataMale[type].get(d.x);
                                     var fval = litRateChartDataFemale[type].get(d.x);
                                     var tval = litRateChartDataTotal[type].get(d.x);

                                     if (Math.abs(fval.y - mval.y) < 4)
                                         outText += "<br>" + getStringFromDict('MALE').capitalizeFirstLetter() + ": " + mval.y;
                                     if (Math.abs(fval.y - tval.y) < 4)
                                         outText += "<br>" + getStringFromDict('TOTAL').capitalizeFirstLetter() + ":    " + tval.y;

                                     showData(d3.event.pageX - 100, d3.event.pageY + 10, outText);
                                 })
                                 .on("mouseout", function () {
                                     d3.select(this).style("stroke-width", 1);
                                     hideData();
                                 });



                          svg.selectAll("chartThreeLineLine3")
                                 .data(indTotalVal)
                                 .enter().append("circle")
                                 .attr("r", 3)
                                 .attr("class", "chartThreeLinePointLine3")
                                 .attr("cx", function (d, i) {
                                     // return the X coordinate where we want to plot this datapoint
                                     return x(d.x) + 5;
                                 })
                                 .attr("cy", function (d) {
                                     // return the Y coordinate where we want to plot this datapoint
                                     return -y(d.y);
                                 })
                                 .on("mouseover", function (d) {
                                     d3.select(this).style("stroke-width", 6);


                                     var outText = getStringFromDict('TOTAL').capitalizeFirstLetter() + ":  " + d.y + " (" + d.x + ")";
                                     var mval = litRateChartDataMale[type].get(d.x);
                                     var fval = litRateChartDataFemale[type].get(d.x);
                                     var tval = litRateChartDataTotal[type].get(d.x);

                                     if (Math.abs(tval.y - fval.y) < 4)
                                         outText += "<br>" + getStringFromDict('FEMALE').capitalizeFirstLetter() + ": " + fval.y;
                                     if (Math.abs(tval.y - mval.y) < 4)
                                         outText += "<br>" + getStringFromDict('MALE').capitalizeFirstLetter() + ":    " + mval.y;

                                     showData(d3.event.pageX - 100, d3.event.pageY + 10, outText);

                                 })
                                 .on("mouseout", function () {
                                     d3.select(this).style("stroke-width", 1);
                                     hideData();
                                 });

                          if (!(typeof title === "undefined")) {

                              if (title.indexOf('\\n') > 0) {

                                  var title_splt = title.split('\\n');
                                  svg.append("svg:text")
                                     .attr("y", -(h - p[0]))
                                     .attr("x", (w - p[1] - p[3]) / 2)
                                     .attr("class", "chartTitle")
                                     .style("text-anchor", "middle")
                                     .text(formatStringForSVGDisplay(title_splt[0]));

                                  svg.append("svg:text")
                                    .attr("y", -(h - p[0]) + 15)
                                    .attr("x", (w - p[1] - p[3]) / 2)
                                    .attr("class", "chartTitle")
                                    .style("text-anchor", "middle")
                                    .text(formatStringForSVGDisplay(title_splt[1]));
                              }
                              else {

                                  svg.append("svg:text")
                                 .attr("y", -(h - p[0]))
                                 .attr("x", (w - p[1] - p[3]) / 2)
                                 .attr("class", "chartTitle")
                                 .style("text-anchor", "middle")
                                 .text(formatStringForSVGDisplay(title));
                              }
                          }

                          svg.append("svg:text")
                                   .attr("x", -30)
                                   .attr("y", -(h - p[0]))
                                   .attr("class", "chartYaxisUnits")
                                   .text(axis_title);


                          return true;

                      }

                      function initializeTables() {

                          litRateChartDataMale["ADULT"] = d3.map();
                          litRateChartDataFemale["ADULT"] = d3.map();
                          litRateChartDataTotal["ADULT"] = d3.map();

                          litRateChartDataMale["YOUTH"] = d3.map();
                          litRateChartDataFemale["YOUTH"] = d3.map();
                          litRateChartDataTotal["YOUTH"] = d3.map();

                          litRateChartDataMale["ELDER"] = d3.map();
                          litRateChartDataFemale["ELDER"] = d3.map();
                          litRateChartDataTotal["ELDER"] = d3.map();

                          iscedChartDataMale = d3.map();
                          iscedChartDataFemale = d3.map();
                          iscedChartDataTotal = d3.map();

                      }


                      //isched
                      function processIschedIndicators(Indicators, it) {

                          var currIndicator = "";
                          var ischedLev = "";

                          for (var j = it.i; j < Indicators.length; j++) {
                              var indicator = Indicators[j];


                              if (indicator.Indicator.match("^EA_")) {
                                  if (currIndicator != indicator.Indicator) {

                                      currIndicator = indicator.Indicator;
                                      var processFemale = indicator.Indicator.match("F$");
                                      var processMale = indicator.Indicator.match("M$");

                                      if (indicator.Indicator.match("^EA_1T6"))
                                          ischedLev = "ISCED 1";
                                      else if (indicator.Indicator.match("^EA_2T6"))
                                          ischedLev = "ISCED 2";
                                      else if (indicator.Indicator.match("^EA_3T6"))
                                          ischedLev = "ISCED 3";
                                      else if (indicator.Indicator.match("^EA_4T6"))
                                          ischedLev = "ISCED 4";
                                      else if (indicator.Indicator.match("^EA_56"))
                                          ischedLev = "ISCED 5";
                                  }

                                  if (processFemale) {

                                      iscedChartDataFemale.set(ischedLev, { x: ischedLev, y: indicator.Value });
                                  }
                                  else if (processMale) {

                                      iscedChartDataMale.set(ischedLev, { x: ischedLev, y: indicator.Value });
                                  }
                                  else {

                                      iscedChartDataTotal.set(ischedLev, { x: ischedLev, y: indicator.Value });
                                  }

                              }
                              else
                                  break;

                          }

                          it.i = j - 1;
                      }


                      function initializeIllTable() {

                          var indics = ["ILLPOP_AG15T24", "ILLPOP_AG15T99"];
                          illPeopleTable[0] = [];
                          illPeopleTable[0]["id"] = getStringFromDict('ILLITER_POPULATION');

                          for (var i = 0; i <= 1; i++) {
                              illPeopleTable[i + 1] = [];
                              illPeopleTable[i + 1]["Female"] = "...";
                              illPeopleTable[i + 1]["Male"] = "...";
                              illPeopleTable[i + 1]["Total"] = "...";
                              illPeopleTable[i + 1]["Year"] = "";
                              var ind_desc = getIndicatorDescriptionByStr(indics[i]);
                              if (!(typeof ind_desc === "undefined")) {
                                  illPeopleTable[i + 1]["id"] = getIndicatorTitle(ind_desc);
                                  illPeopleTable[i + 1]["note"] = getIndicatorNote(ind_desc);
                              }
                          }
                      }

                      function initializeLitTable() {

                          var indics = ["LR_AG15T24", "LR_AG15T99", "LR_AG65T99"];

                          literRateTable[0] = [];
                          literRateTable[0]["id"] = getStringFromDict('LITERACY_RATE_PERC');

                          for (var i = 0; i <= 2; i++) {
                              literRateTable[i + 1] = [];
                              literRateTable[i + 1]["Female"] = "...";
                              literRateTable[i + 1]["Male"] = "...";
                              literRateTable[i + 1]["Total"] = "...";
                              literRateTable[i + 1]["Year"] = "";
                              var ind_desc = getIndicatorDescriptionByStr(indics[i]);
                              if (!(typeof ind_desc === "undefined")) {
                                  literRateTable[i + 1]["id"] = getIndicatorTitle(ind_desc);
                                  literRateTable[i + 1]["note"] = getIndicatorNote(ind_desc);
                              }
                          }
                      }

                      //litrate 
                      function processLitRateIndicators(Indicators, it) {

                          var currIndicator = "";
                          var curr_indic = "ADULT";
                          var processFemale = false;
                          var processMale = false;
                          var cur_index = 1;

                          for (var j = it.i; j < Indicators.length; j++) {
                              var indicator = Indicators[j];

                              if (indicator.Indicator.match("^LR_AG")) {
                                  if (currIndicator != indicator.Indicator) {

                                      currIndicator = indicator.Indicator;
                                      var processFemale = indicator.Indicator.match("F$");
                                      var processMale = indicator.Indicator.match("M$");

                                      if (indicator.Indicator.match("^LR_AG15T24")) {
                                          curr_indic = "YOUTH";
                                          cur_index = 1;
                                      }
                                      else if (indicator.Indicator.match("^LR_AG65T99")) {
                                          curr_indic = "ELDER";
                                          cur_index = 3;
                                      }
                                      else {
                                          curr_indic = "ADULT";
                                          cur_index = 2;
                                      }
                                  }

                                  if (processFemale) {
                                      litRateChartDataFemale[curr_indic].set(indicator.Year, { x: indicator.Year, y: indicator.Value });
                                  }
                                  else if (processMale) {
                                      litRateChartDataMale[curr_indic].set(indicator.Year, { x: indicator.Year, y: indicator.Value });
                                  }
                                  else {
                                      litRateChartDataTotal[curr_indic].set(indicator.Year, { x: indicator.Year, y: indicator.Value });
                                  }


                                  if (processFemale) {
                                      literRateTable[cur_index]["Female"] = indicator.Value;
                                  }
                                  else if (processMale) {
                                      literRateTable[cur_index]["Male"] = indicator.Value;
                                  }
                                  else if (!processFemale && !processMale) {
                                      literRateTable[cur_index]["Total"] = indicator.Value;
                                      literRateTable[cur_index]["Year"] = "(" + indicator.Year + ")";
                                  }
                              }
                              else
                                  break;

                          }


                          it.i = j - 1;

                          var curr_indic = "ADULT";

                          litRateChartDataTotal[curr_indic].forEach(function (year) {
                              var valTot = litRateChartDataTotal[curr_indic][year];
                              var valMale = litRateChartDataFemale[curr_indic][year];
                              var valFem = litRateChartDataMale[curr_indic][year];

                          });


                      }


                      //This method collects the data into the tables which are used to display 
                      //the stacked chart and the OFST table.
                      function processILLIndicators(Indicators, it) {

                          var currIndicator = "";

                          var cur_index = 1;
                          var malfemidx = 0;
                          var processFemale = false, processMale = false, processChildren = false;

                          var femStr = getStringFromDict('FEMALE').capitalizeFirstLetter();
                          var malStr = getStringFromDict('MALE').capitalizeFirstLetter();


                          for (var j = it.i; j < Indicators.length; j++) {
                              var indicator = Indicators[j];

                              if (indicator.Indicator.match("^ILLPOP")) {

                                  if (currIndicator != indicator.Indicator) {
                                      currIndicator = indicator.Indicator;

                                      processFemale = indicator.Indicator.match("_F$");
                                      processMale = indicator.Indicator.match("_M$");
                                      processChildren = indicator.Indicator.match("^ILLPOP_AG15T24");

                                      var ind_code = "ILLPOP_AG15T24";
                                      if (!processChildren) {
                                          ind_code = "ILLPOP_AG15T99";
                                          cur_index = 2;
                                      }
                                      if (processMale)
                                          malfemidx = 1;
                                      else
                                          malfemidx = 0;
                                  }

                                  //Add to table values!!!
                                  /////////////////////////////////////////////////////////////////////////
                                  if (processFemale) {
                                      illPeopleTable[cur_index]["Female"] = thousandSep(indicator.Value);
                                  }
                                  else if (processMale) {
                                      illPeopleTable[cur_index]["Male"] = thousandSep(indicator.Value);
                                  }
                                  else if (!processFemale && !processMale) {
                                      illPeopleTable[cur_index]["Total"] = thousandSep(indicator.Value);
                                      illPeopleTable[cur_index]["Year"] = "(" + indicator.Year + ")";
                                  }
                              }
                              else {
                                  break; //just finish the loop
                              }
                          }


                          it.i = j - 1;

                      }


                      function loadDataforCountry(country) {

                          $('#chart-container1-legend').text("");
                          $('#population-chart').text("");
                          $('#generalinfo-table').text("");

                          $('#list').GridUnload();
                          $('#litrate_list').GridUnload();

                          $('#outOfSchl1').text("");
                          $('#outOfSchl2').text("");

                          $('#chart-adult').text("");
                          $('#chart-youth').text("");
                          $('#chart-elder').text("");

                          $('#ages-by-level').text("");
                          $('#chart-isced').text("");

                          $('#population-school').text("");


                          var it = {};

                          //Initialize tables
                          //////////////////////////////////////////////////////////////////////////////////////////////
                          initializeTables();

                          //ASYNC call to Data Access Service 
                          d3.loadData().json('literacy_data', "./../api/countries/?code=" + country + "&category=EDULIT_DS&indicators=" + illiteratePeopleIndic + "," + literacyReatesIndic + "&fromyear=" + start_yr + "&toyear=" + end_yr + "&mostrecent=false")
                                       .json('literacy_data_isched', "./../api/countries/?code=" + country + "&category=EDULIT_DS&indicators=" + lieracyIsched + "&fromyear=" + start_yr + "&toyear=" + end_yr + "&mostrecent=true")
                                       .json('ages_bylev_data', "./../api/countries/?code=" + country + "&category=EDULIT_DS&indicators=" + agesByLevelOfEdu + "&fromyear=" + educ_start_yr + "&toyear=" + educ_end_yr + "&mostrecent=true")
                                       .json('general_data', "./../api/countries/?code=" + country + "&category=DEMO_DS&indicators=" + generalIndicators + "&fromyear=" + start_yr + "&toyear=" + "2012" + "&mostrecent=true")
                                       .json('pop_data', "./../api/countries/?code=" + country + "&category=DEMO_DS&indicators=" + populationIndicators + "&fromyear=" + start_yr + "&toyear=" + "2012" + "&mostrecent=true")
                                       .onload(function (dtQ) {

                                           literacy_data = dtQ.literacy_data;
                                           literacy_data_isched = dtQ.literacy_data_isched;
                                           ages_bylev_data = dtQ.ages_bylev_data;
                                           general_data = dtQ.general_data;
                                           pop_data = dtQ.pop_data;

                                           initializeLitTable();
                                           initializeIllTable();

                                           var indicatorsMap = new d3.map();

                                           //Create Sets of indicator Maps
                                           indicatorsMap["ILLPOP_AG15T24"] = [];
                                           indicatorsMap["ILLPOP_AG15T99"] = [];

                                           for (j = 0; j < literacy_data.Indicators.length; j++) {
                                               //out of school children/adolesents
                                               if (literacy_data.Indicators[j].Indicator.match("^ILLPOP_AG15T24")) {
                                                   indicatorsMap["ILLPOP_AG15T24"].push(literacy_data.Indicators[j]);  //don't process data now, just separate it from the rest of the indicators
                                               }
                                               else if (literacy_data.Indicators[j].Indicator.match("^ILLPOP_AG15T99")) {
                                                   indicatorsMap["ILLPOP_AG15T99"].push(literacy_data.Indicators[j]);  //don't process data now, just separate it from the rest of the indicators
                                               }

                                           }
                                           //Get Chart Data from the OFST map
                                           var chrtIllPop15t24 = getStackedChartData(indicatorsMap["ILLPOP_AG15T24"], "_F$", "_M$");
                                           var chrtIllPop15t99 = getStackedChartData(indicatorsMap["ILLPOP_AG15T99"], "_F$", "_M$");


                                           for (it.i = 0; it.i < literacy_data.Indicators.length; it.i++) {
                                               if (illiteratePeopleIndic.indexOf(literacy_data.Indicators[it.i].Indicator) >= 0) {
                                                   processILLIndicators(literacy_data.Indicators, it);
                                               }
                                               else if (literacyReatesIndic.indexOf(literacy_data.Indicators[it.i].Indicator) >= 0) {
                                                   processLitRateIndicators(literacy_data.Indicators, it);
                                               }
                                           }

                                           if (typeof literacy_data_isched === "undefined") {
                                               for (it.i = 0; it.i < literacy_data_isched.Indicators.length; it.i++) {
                                                   if (lieracyIsched.indexOf(literacy_data_isched.Indicators[it.i].Indicator) >= 0) {
                                                       processIschedIndicators(literacy_data_isched.Indicators, it); //process ISCED
                                                   }
                                               }
                                           }


                                           if (ages_bylev_data)
                                               displayAgesByLevelData(ages_bylev_data.Indicators, true);

                                           //Display population table bar chart
                                           ////////////////////////////////////////////
                                           if (pop_data) {

                                               var popChart = populationChart("#population-chart")
                                                                     .param({ left_margin: 70, gap: 2, bar_height: 15, bar_width: 330, viz_width: 280, highl0t14: false })
                                                                     .draw(pop_data.Indicators);

                                               //total number of people and childern Pre 14, pre 15 pass to General data
                                               totalNumberOfPeople = popChart.totalNumberOfPeople;
                                               perChildrenPre14 = popChart.perChildrenPre14;
                                               perChildren15t24 = popChart.perChildren15t24;
                                           }

                                           //Display general data indicators
                                           ////////////////////////////////////////////
                                           if (general_data)
                                               displayGeneralData(general_data.Indicators, end_yr);


                                           //display table
                                           displayTMFTable('#list', illPeopleTable, '   ', [get_ents(getStringFromDict('ILLITER_POPULATION'))]);


                                           var stackColor = [bar_color2, bar_color1];
                                           var skip_legend = (typeof chrtIllPop15t24[0].values !== "undefined"
                                                           && typeof chrtIllPop15t24[1].values !== "undefined"
                                                              && chrtIllPop15t24[0].values.length > 1
                                                              && chrtIllPop15t24[1].values.length > 1)
                                                              &&
                                                              (typeof chrtIllPop15t99[0].values !== "undefined"
                                                            && typeof chrtIllPop15t99[1].values !== "undefined"
                                                              && chrtIllPop15t99[0].values.length > 1
                                                              && chrtIllPop15t99[1].values.length > 1);

                                           if (typeof chrtIllPop15t24[0].values !== "undefined") {

                                              stackedMalFemChart("#outOfSchl1")
                                                            .param({
                                                                width: 330,
                                                                height: 200,
                                                                margin_top: 30,
                                                                margin_right: 30,
                                                                margin_bottom: 20,
                                                                margin_left: 60,
                                                                draw_legend: !skip_legend,
                                                                display_nodata_section: true,
                                                                stack_color: [bar_color2, bar_color1]
                                                            }).draw(chrtIllPop15t24,
                                                                    getStringFromDict('ILL_15T24'),
                                                                    start_yr, end_yr,
                                                                    getStringFromDict('IN_THOUSANDS').capitalizeFirstLetter());

                                             //  drawStackedChart("#outOfSchl1", chrtIllPop15t24, getStringFromDict('ILL_15T24'), stackColor, true,
                                             //                   start_yr, end_yr, !skip_legend, getStringFromDict('IN_THOUSANDS').capitalizeFirstLetter());
                                           }

                                           if (typeof chrtIllPop15t99[0].values !== "undefined") {

                                               stackedMalFemChart("#outOfSchl2")
                                                            .param({
                                                                width: 330,
                                                                height: 200,
                                                                margin_top: 30,
                                                                margin_right: 30,
                                                                margin_bottom: 20,
                                                                margin_left: 60,
                                                                draw_legend: !skip_legend,
                                                                display_nodata_section: true,
                                                                stack_color: [bar_color2, bar_color1]
                                                            }).draw(chrtIllPop15t99,
                                                                    getStringFromDict('ILL_15OLDER'),
                                                                    start_yr, end_yr,
                                                                    getStringFromDict('IN_THOUSANDS').capitalizeFirstLetter());

                                              // drawStackedChart("#outOfSchl2", chrtIllPop15t99, getStringFromDict('ILL_15OLDER'), stackColor, true,
                                              //                  start_yr, end_yr, !skip_legend, getStringFromDict('IN_THOUSANDS').capitalizeFirstLetter());
                                           }

                                           if (skip_legend) {
                                               drawLegend('#outOfSchl-legend',
                                                         [formatStringForSVGDisplay(getStringFromDict('MALE').capitalizeFirstLetter()),
                                                          formatStringForSVGDisplay(getStringFromDict('FEMALE').capitalizeFirstLetter()),
                                                          formatStringForSVGDisplay(getStringFromDict('NODATA').capitalizeFirstLetter())],
                                                          [bar_color1, bar_color2, nodata_color]);
                                           }

                                           drawTreeLineChart("#chart-adult", "ADULT", getStringFromDict('LIT_RATE_ADULT'), true, start_yr, end_yr, "%");
                                           var youthchrt = drawTreeLineChart("#chart-youth", "YOUTH", getStringFromDict('LIT_RATE_YOUTH'), false, start_yr, end_yr, "%");
                                           var elderchrt = drawTreeLineChart("#chart-elder", "ELDER", getStringFromDict('LIT_RATE_ELDER'), false, start_yr, end_yr, "%");
                                           if (youthchrt || elderchrt)
                                               drawCommonLegend("#chart-yth-eld-legend");

                                           iscedChartDataMale = iscedChartDataMale.values();
                                           iscedChartDataFemale = iscedChartDataFemale.values();
                                           iscedChartDataTotal = iscedChartDataTotal.values();
                                           drawBarChartISCED("#chart-isced", iscedChartDataMale, iscedChartDataFemale, iscedChartDataTotal);

                                           displayTMFTable('#litrate_list', literRateTable, '   ', [get_ents(getStringFromDict('LITERACY_RATE_PERC'))]);

                                       });
                      }
                  });
        }

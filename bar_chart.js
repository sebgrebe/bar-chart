$(document).ready(function() {
       $.ajax({
                            url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
                            dataType: 'json',
                            error: (xhr,errorType) => {
                                   alert(errorType)
                            },
                            success: (data) => {
                                   const dataset = data['data'];
                                   const padding_left = 70;
                                   const padding_top = 20;
                                   const padding_bottom = 40;
                                   const padding_right = 100;
                                   const w = 1000;
                                   const h = window.innerHeight-100;
                                   const graph = document.getElementById('graph');
                                   const svg = d3.select(graph)
                                                        .append('svg')
                                                        .attr('width',w)
                                                        .attr('height',h);
                                   //turns date into number, i.e., '1957-04' into 1957.25
                                   function yearNumber(date) {
                                          var year = date.substr(0,4);
                                          var month = date.substr(5);
                                          var month_value;  
                                          if (month === '01-01') {
                                                 month_value = 0
                                          }
                                          else if (month === '04-01') {
                                                 month_value = 0.25
                                          }
                                          else if (month === '07-01') {
                                                 month_value = 0.5
                                          }
                                          else {
                                                 month_value = 0.75
                                          }
                                          return parseInt(year) + month_value
                                   }
                                   for (var i=0;i<dataset.length;i++) {
                                          var year_dateformat = dataset[i][0];
                                          dataset[i][2] = yearNumber(year_dateformat)
                                   }
                                   const year_earliest = dataset[0][2]
                                   const year_latest = dataset[dataset.length-1][2]
                                   function gatherGdps(data) {
                                          var gdps = [];
                                          for (var i=0;i<dataset.length;i++) {
                                                 gdps.push(dataset[i][1])
                                          }
                                          return gdps
                                   }
                                   const gdps = gatherGdps(data);
                                   const gdp_lowest = d3.min(gdps)
                                   const gdp_highest = d3.max(gdps);
                                   const xScale = d3.scaleLinear()
                                          .domain([year_earliest,year_latest])
                                          .range([padding_left,w-padding_right])
                                   const yScale = d3.scaleLinear()
                                          .domain([0,gdp_highest])
                                          .range([h-padding_bottom,padding_top])
                                   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
                                   const yAxis = d3.axisLeft(yScale)
                                   const bar_width = (w-padding_left-padding_right)/dataset.length;
                                   
                                   //x-Axis
                                   svg.append('g')
                                          .attr("transform", "translate(0, " + (h - padding_bottom) + ")")
                                          .call(xAxis)
                                   
                                   //y-Axis
                                   svg.append('g')
                                          .attr("transform", "translate("+padding_left+", 0)")
                                          .call(yAxis)  
                                   
                                   //bars
                                   svg.selectAll('rect')
                                          .data(dataset)
                                          .enter()
                                          .append('rect')
                                          .attr("x", (d) => xScale(d[2]))
                                          .attr("y", (d) => yScale(d[1]))
                                          .attr('width',3)
                                          .attr('height',(d) => h-yScale(d[1])-padding_bottom)
                                          .attr('fill','DeepSkyBlue')
                                          .attr('class','bar')

                                   //tooltips
                                   svg.selectAll('rect')
                                          .data(dataset)
                                          .on('mouseover',(d,i) =>
                                                 svg.append('foreignObject')
                                                 .attr("x", xScale(d[2]) + 10)
                                                 .attr("y", yScale(d[1]))
                                                 .attr('width', 100)
                                                 .attr('height',45)
                                                 .append('xhtml:div')
                                                 .html('<b>Year: '+d[0].substr(0,7)+'</b></br>'+'GDP: '+d[1])
                                                 .attr('class','tip')
                                                 )
                                          .on('mouseout',() =>
                                                 svg.selectAll('foreignObject').remove()
                                                 )

                                   //y-label
                                   svg.append('text')
                                   .text("US Gross Domestic Product (in 1bn US-$)")
                                   .attr('x',20)
                                   .attr('y',50)
                                   .attr('class','label_y')

                                   //x-label
                                   svg.append('text')
                                   .text("Year")
                                   .attr('x',450)
                                   .attr('y',h)
                                   .attr('class','label_x')

                            }                                  
                     });
       })
var trimestres = new Array(
  1975,
  1976,
  1977,
  1978,
  1979,
  1980,
  1981,
  1982,
  1983,
  1984,
  1985,
  1986,
  1987,
  1988,
  1989,
  1990,
  1991,
  1992,
  1993,
  1994,
  1995,
  1996,
  1997,
  1998,
  1999,
  2000,
  2001,
  2002,
  2003,
  2004,
  2005,
  2006,
  2007,
  2008,
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  
  
  );
  // trimestres.reverse();
  
  function addComas(n) {
    var formatValue = d3.format("0,000");
    return formatValue(n)
      .replace(".", ",")
      .replace(".", ",");
  }
  var colores = new Array("#ECC5B4", "#E3A78F", "#D9886C", "#D0694C", "#CC4f2C","#AD3413","#66220D");
  
  function getColor(d) {
    return d > 95
      ? colores[6]
      : d > 90
      ? colores[5]
      : d > 85
      ? colores[4]
      : d > 75
      ? colores[3]
      : d > 60
      ? colores[2]
      : d > 40
      ? colores[1]
      : colores[0];
  }
  
  var div = d3
    .select("#wrapper")
    .append("div")
    .attr("class", "tooltip")
    .attr("opacity", 0);
  
  var wmap = 1000;
  var hmap = 450;
  // var hCan = 100;
  // var wCan = 240;
  var projection = d3.geo
    .mercator();
    // .translate([410, 2140])
    // .scale(2500);
  var path = d3.geo.path().projection(projection);
  var map = d3
    .select("#mapa")
    .append("svg")
    .attr("width", wmap)
    .attr("height", hmap)
    .attr("transform", "translate(5,5)");
  
  d3.select("#year").html('Year '+trimestres[trimestres.length - 1]);
  
  var height = 330,
    width = 885,
    trans = 60;
  var w = 950,
    h = 380;
  var aux = trimestres.length - 1;
  var width_slider = 920;
  var height_slider = 50;
  d3.csv("./data/df_process.csv", function(data) {
  d3.csv("./data/df_ori.csv", function(ori_data) {
    d3.json("./data/global_polygons_process.json", function(json) {
      d3.csv("./data/lit_global_class.csv", function(global_data_class) {
      d3.csv("./data/lit_global_region.csv", function(global_data_region) {
  
        /* ------SLIDER----- */
        var svg = d3
          .select("#slider")
          .attr("class", "chart")
          .append("svg")
          .attr("width", width_slider)
          .attr("height", height_slider)
          .attr("transform", "translate(0,0)");
        var yeardomain = [0, trimestres.length - 1];
        var axisyears = [
          parseFloat(trimestres[0]),
          parseFloat(trimestres[0]),
          parseFloat(trimestres[0]),
          parseFloat(trimestres[trimestres.length - 1])
        ];
  
        var pointerdata = [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 25
          },
          {
            x: 25,
            y: 25
          },
          {
            x: 25,
            y: 0
          }
        ];
        var scale = d3.scale
          .linear()
          .domain(yeardomain)
          .rangeRound([0, width]);
        var x = d3.svg
          .axis()
          .scale(scale)
          .orient("top")
          .tickFormat(function(d) {
            return d;
          })
          .tickSize(0)
          .tickValues(axisyears);
        svg
          .append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + 15 + ",0)")
          .call(x);
        var drag = d3.behavior
          .drag()
          .origin(function() {
            return {
              x: d3.select(this).attr("x"),
              y: d3.select(this).attr("y")
            };
          })
          .on("dragstart", dragstart)
          .on("drag", dragmove)
          .on("dragend", dragend);
  
        svg
          .append("g")
          .append("rect")
          .attr("class", "slideraxis")
          .attr("width", width_slider)
          .attr("height", 7)
          .attr("x", 0)
          .attr("y", 16);
        var cursor = svg
          .append("g")
          .attr("class", "move")
          .append("svg")
          .attr("x", width)
          .attr("y", 7)
          .attr("width", 30)
          .attr("height", 60);
  
        cursor.call(drag);
        var drawline = d3.svg
          .line()
          .x(function(d) {
            return d.x;
          })
          .y(function(d) {
            return d.y;
          })
          .interpolate("linear");
  
        //---------------------------
        cursor
          .append("path")
          .attr("class", "cursor")
          .attr("transform", "translate(" + 7 + ",0)")
          .attr("d", drawline(pointerdata));
        cursor.on("mouseover", function() {
          d3.select(".move").style("cursor", "hand");
        });
  
        function dragmove() {
          var x = Math.max(0, Math.min(width, d3.event.x));
          d3.select(this).attr("x", x);
          var z = parseInt(scale.invert(x));
          aux = z;
          drawMap(z);
        }
  
        function dragstart() {
          d3.select(".cursor").style("fill", "#D9886C");
        }
  
        function dragend() {
          d3.select(".cursor").style("fill", "");
        }
        for (var i = 0; i < data.length; i++) {
          var codeState = data[i].code;
          var dataValue = data[i][trimestres[trimestres.length - 1]];
          //                console.log(dataValue);
          for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.code;
            if (codeState == jsonState) {
              json.features[j].properties.value = dataValue;
              break;
            }
          }
  
        }
        var cont = map
          .selectAll("#mapa path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("class", "path")
          .attr("d", path)
          .style("fill", function(d) {
            return getColor(d.properties.value);
          })
          .attr("fill-opacity", "1")
          .attr("stroke", "#202020")
          .attr("stroke-width", 0.3)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseout", mouseout);
  
        function mouseover(d) {
          d3.select(this)
            .attr("stroke-width", "1px")
            .attr("fill-opacity", "0.9");
          div.style("opacity", 0.9);
          div.html(
            "<b>" +
              d.properties.name +
              "</b></br>Literacy Rate: <b>" +
              addComas(data[d.properties.code][trimestres[aux]]) +
              "%</b> <br>" +
              d.properties.comunidad
          );
        }
  
        function mouseout(d) {
          d3.select(this)
            .attr("stroke-width", ".3")
            .attr("fill-opacity", "1");
          div.style("opacity", 0);
        }
  
        function mousemove(d) {
          div.style({
            left: function() {
              if (d3.event.pageX > 780) {
                return d3.event.pageX - 180 + "px";
              } else {
                return d3.event.pageX + 23 + "px";
              }
            },
            top: d3.event.pageY - 20 + "px"
          });
        }
        //maxMin(data, aux);
        function drawMap(index) {
          // d3.select("#tasa").html("Y " + trimestres[index]);
          d3.select("#year").html('Year '+trimestres[index]);
          cont.style("fill", function(d) {
            for (var i = 0; i < data.length; i++) {
              var codeState = data[i].code;
              var dataValue = data[i][trimestres[index]];
              // if (codeState==168) {
              //   console.log(data[i]);
              // }
  
              for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.code;
                if (codeState == jsonState) {
                  json.features[j].properties.value = dataValue;
                  break;
                }
              }
            }
            var value = d.properties.value;
            if (value) {
              return getColor(value);
            } else {
              return "#ccc";
            }
          });
          cont
            .on("mousemove", function(d) {
              div.style("opacity", 0.9);
              if (data[d.properties.code][trimestres[aux]]>0.1){
              div
                .html(
                  "<b>" +
                    d.properties.name +
                    "</b></br>Literacy Rate: <b>" +
                    addComas(data[d.properties.code][trimestres[aux]]) +
                    "%</b> <br>" +
                    d.properties.comunidad
                )
                .style("left", function() {
                  if (d3.event.pageX > 780) {
                    return d3.event.pageX - 180 + "px";
                  } else {
                    return d3.event.pageX + 23 + "px";
                  }
                })
                .style("top", d3.event.pageY - 20 + "px");}
                else{
                  div
                  .html(
                    "<b>" +
                      d.properties.name +
                      "</b></br>Literacy Rate: <b>" +
                      "None Value" +
                      "</b> <br>" +
                      d.properties.comunidad
                  )
                  .style("left", function() {
                    if (d3.event.pageX > 780) {
                      return d3.event.pageX - 180 + "px";
                    } else {
                      return d3.event.pageX + 23 + "px";
                    }
                  })
                  .style("top", d3.event.pageY - 20 + "px");
                }
            })
            .on("mouseout", function() {
              return div.style("opacity", 0);
            })
            .on("mouseout", mouseout);
          maxMin(data, index);
        }
        function drawbar(index) {
          var svg = d3
          .select("#barrasInter")
          .append("svg")
          .attr("width", 430)
          .attr("height", 335)
          .attr("class", "barr")
          .append("g");
        var indiceBarras = d3.range(0, 6);
        var x = d3.scale
          .linear()
          .domain([0, 6])
          .range([0, 430]);
        var y = d3.scale
          .linear()
          .domain([0, 35])
          .range([0, 275]);
        var yBarras = d3.scale
          .linear()
          .domain([0, 50])
          .range([220, 5]);
        var ejeXBarras = d3.svg.axis().scale(x);
        var ejeYBarras = d3.svg
          .axis()
          .orient("left")
          .scale(yBarras)
          .ticks(5);
        svg
          .selectAll(".xLabel")
          .data(x.ticks(10))
          .enter()
          .append("svg:text")
          .attr("class", "xLabel")
          .text(function(d, i) {
            return years[i];
          })
          .attr("x", function(d) {
            return x(d) + 5;
          })
          .attr("y", 245);
  
        }
        maxMin(data, aux);
  
        function maxMin(d, index) {
          d3.select("#minimoParo").html("");
          d3.select("#maximoParo").html("");
          d3.select("#mediaParo").html("");
          var datos = [];
          var provincia = [];
          for (var i = 0; i < data.length - 1; i++) {
            if(data[i][trimestres[index]]){
            //-1 para que no cargue Nacional
            datos.push(d[i][trimestres[index]]);
            provincia.push(d[i].state);
            }
          }
          // console.log(datos)
          // console.log(provincia)
          var max_min = d3.extent(datos);
          if(max_min[0]-max_min[1]>0.0001){
            var temp=max_min[0];
            max_min[0]=max_min[1];
            max_min[1]=temp;
          }
          console.log(max_min[0]-max_min[1]);
          var provinciaMax;
          var provinciaMin;
          for (var j = 0; j < data.length - 1; j++) {
            if (max_min[0] == datos[j]) {
              provinciaMin = provincia[j];
            }
            if (max_min[1] == datos[j]) {
              provinciaMax = provincia[j];
            }
          }
          var nombreMediaParo = d3
            .select("#mediaParo")
            .html(addComas(global_data_region[6][trimestres[index]]) + "%");
          var nombreProvinciaMax = d3
            .select("#maximoParo")
            .html(
              addComas(max_min[1]) +
                "%<br>" +
                "<span id='provincia'>" +
                provinciaMax +
                "</span>"
            );
          var nombreProvinciaMin = d3
            .select("#minimoParo")
            .html(
              addComas(max_min[0]) +
                "%<br>" +
                "<span id='provincia'>" +
                provinciaMin +
                "</span>"
            );
        }
      });
    });
  });
  });
  });
  
  d3.select("#wrapper").on("touchstart", function() {
    div
      .transition()
      .duration(100)
      .style("opacity", 0);
  });
  
angular.module('directive.d3pedometer', ['service.d3'])
  //camel cased directive name
  //in your HTML, this will be named as bars-chart
  .directive('d3Pedometer', function ($window, d3Service) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           //in D3, any selection[0] contains the group
           //selection[0][0] is the DOM node
           //but we won't need that this time
           var chart = d3Service.select(element[0]);
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
            chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(scope.data).enter().append("div")
             .transition().ease("elastic")
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
           //a little of magic: setting it's width based
           //on the data value (d) 
           //and text all with a smooth transition
         }
      };
      return directiveDefinitionObject;
   });



  // .directive('d3Pedometer', ['$window', '$timeout', 'd3Service',
  //   function($window, $timeout, d3Service) {
  //     return {
  //       restrict: "EA",
  //       template: "<svg width='850' height='200'></svg>",
  //       link: function(scope, elem, attrs){
  //          var salesDataToPlot=scope[attrs.chartData];
  //          var padding = 20;
  //          var pathClass="path";
  //          var xScale, yScale, xAxisGen, yAxisGen, lineFun;

  //          var d3 = d3Service;
  //          var rawSvg=elem.find('svg');
  //          var svg = d3.select(rawSvg[0]);

  //          function setChartParameters(){

  //              xScale = d3.scale.linear()
  //                  .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length-1].hour])
  //                  .range([padding + 5, rawSvg.attr("width") - padding]);

  //              yScale = d3.scale.linear()
  //                  .domain([0, d3.max(salesDataToPlot, function (d) {
  //                      return d.sales;
  //                  })])
  //                  .range([rawSvg.attr("height") - padding, 0]);

  //              xAxisGen = d3.svg.axis()
  //                  .scale(xScale)
  //                  .orient("bottom")
  //                  .ticks(salesDataToPlot.length - 1);

  //              yAxisGen = d3.svg.axis()
  //                  .scale(yScale)
  //                  .orient("left")
  //                  .ticks(5);

  //              lineFun = d3.svg.line()
  //                  .x(function (d) {
  //                      return xScale(d.hour);
  //                  })
  //                  .y(function (d) {
  //                      return yScale(d.sales);
  //                  })
  //                  .interpolate("basis");
  //          }
         
  //        function drawLineChart() {

  //              setChartParameters();

  //              svg.append("svg:g")
  //                  .attr("class", "x axis")
  //                  .attr("transform", "translate(0,180)")
  //                  .call(xAxisGen);

  //              svg.append("svg:g")
  //                  .attr("class", "y axis")
  //                  .attr("transform", "translate(20,0)")
  //                  .call(yAxisGen);

  //              svg.append("svg:path")
  //                  .attr({
  //                      d: lineFun(salesDataToPlot),
  //                      "stroke": "blue",
  //                      "stroke-width": 2,
  //                      "fill": "none",
  //                      "class": pathClass
  //                  });
  //          }

  //          drawLineChart();
  //       }
  //   };
  // }]);
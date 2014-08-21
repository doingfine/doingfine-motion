angular.module('directive.d3stepschartoneday', ['service.d3'])

  .directive('d3StepsChartOneDay', function ($window, d3Service) {

    return {

      restrict: 'E', // use as element d3-steps-chart-one-day
      replace: false,
      scope: {data: '=stepsData'},
      link: function (scope, element, attrs) {

        var d3 = d3Service;
  
        var width = 320; // ios device width
        var height = 160;
        var padding = 10;
        var y = d3.scale.linear()
                  .range([0 + padding, height - padding]);
        var x = d3.scale.linear()
                  .range([0 + padding, width - padding]);

        var data = scope.data; // array of walking speed data points
        var svg;
        var el = d3.select(element[0]);

        y.domain([d3.max(data, function(d) { return d; }), 0]); // orientation is top to bottom
        x.domain([0, data.length - 1]); // orientation is left to right
       
        // Line generators
        var line = d3.svg.line()
          .interpolate('monotone')
          .x(function(d, i) { return x(i); })
          .y(function(d) { return y(d); });
        var flatLine = d3.svg.line()
          .interpolate('monotone')
          .x(function(d, i) { return x(i); })
          .y(height - padding);

        var setup = function() {
          el.selectAll('svg').remove();
          svg = el.append('svg')
            .attr('width', width)
            .attr('height', height);
        };
        setup();

        // draw line
        svg.append('path')
          .attr('class', 'line')
          .attr('d', flatLine(data));

        // update line
        d3.select('.line')
          .transition()
          .duration(3000)
          .attr('d', line(data));

      }
    };
   });

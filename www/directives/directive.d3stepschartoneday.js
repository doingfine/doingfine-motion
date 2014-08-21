angular.module('directive.d3stepschartoneday', ['service.d3'])

  .directive('d3StepsChartOneDay', function ($window, d3Service) {

    return {

      restrict: 'E', // use as element d3-steps-chart-one-day
      replace: false,
      scope: {data: '=stepsData'},
      link: function (scope, element, attrs) {
  
        var width = 320; // ios device width
        var height = 160;
        var center = { x: width / 2, y: height / 2};
        var svg;

        var el = d3Service.select(element[0]);

        var setup = function() {
          el.selectAll('svg').remove();
          svg = el.append('svg')
            .attr('width', width)
            .attr('height', height);
        };
        setup();

        svg.append('circle')
          .attr('cx', center.x)
          .attr('cy', center.y)
          .attr('r', 20)
          .attr('fill', 'green')
          .attr('fill-opacity', 50);

      }
    };
   });

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
      scope: {data: '=motionData'},
      link: function (scope, element, attrs) {


        var el = d3Service.select(element[0]);
  
        var width = 640;
        var height = 640;
        var layer = 25;
        var interval = 1000;
        var svg;

        var setup = function() {
          el.selectAll('svg').remove();
          svg = el.append('svg')
            .attr('width', height)
            .attr('height', width);
        };
        setup();

        var circle = svg.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', layer)
          .attr('fill', 'blue');

        var pulse = function (r) {
          circle
            .transition().duration(interval * 0.66).ease('linear')
            .attr('r', layer + r * layer)
            .transition().duration(interval * 0.4).ease('linear')
            .attr('r', layer)
            .transition().duration(interval * 0.66).ease('linear')
            .attr('r', layer / 2);
        };

        scope.$watch('data', function(newData) {
          console.log("WATCHING: ", newData, new Date().toString());
          pulse(newData);
        }, true);

        var render = function() {
          chart.selectAll('div').remove();
          chart.append('div').attr('class', 'chart')
            .selectAll('div')
            .data(scope.data).enter().append("div")
            .transition(100).ease('elastic')
            .style('width', function(d) { return d + "%"; })
            .text(function(d) { return d + '%'; });
        };

      }
    };
    return directiveDefinitionObject;
   });

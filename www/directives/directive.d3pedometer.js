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
  
        var width = 640;
        var height = 640;
        var center = { x: width / 2, y: width / 2};
        var layer = 25;
        var interval = 1000;
        var svg;

        var el = d3Service.select(element[0]);

        var setup = function() {
          el.selectAll('svg').remove();
          svg = el.append('svg')
            .attr('width', height)
            .attr('height', width);
        };
        setup();

        var circles = [];

        var AnimatedCircle = function(interval, rest, layer, color, center) {
          this.interval = interval * 1000; // seconds
          this.rest = rest;
          this.layer = layer;
          this.color = color;
          this.center = center;
        };

        AnimatedCircle.prototype.insert = function (svg) {
          this.el = svg.append('circle')
            .attr('cx', this.center.x)
            .attr('cy', this.center.y)
            .attr('r', this.radius)
            .attr('fill', this.color);
        };

        AnimatedCircle.prototype.pulse = function (magnitude) {
          this.el.transition().duration(this.interval * 0.66).ease('linear') // grow to new value
            .attr('r', this.rest + magnitude * this.layer)
            .transition().duration(this.interval * 0.4).ease('linear') // collapse to 'resting' value
            .attr('r', this.rest)
            .transition().duration(this.interval * 0.66).ease('linear') // breath
            .attr('r', this.rest / 2);
        };

        var circle1 = new AnimatedCircle (1, layer, layer, 'green', center);
        circle1.insert(svg);
        circles.push(circle1);

        scope.$watch('data', function(newData) {
          console.log("WATCHING: ", newData, new Date().toString());
          for (var i = 0; i < circles.length; i++) {
            circles[i].pulse(newData);
          }
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

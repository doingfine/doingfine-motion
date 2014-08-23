angular.module('directive.d3pedometer', ['service.d3'])

  .directive('d3Pedometer', function (d3Service) {

    return {

      restrict: 'E', // use as element d3-pedometer
      replace: false,
      scope: {data: '=motionData'},
      link: function (scope, element, attrs) {
  
        var width = 320; // ios device width
        var height = 320;
        var center = { x: width / 2, y: height / 2};
        var layer = 12; // 1 layer of the 'onion' (mulitplied by magnitude to determine how large the circle grows)
        var rest = 20; // radius of circle at rest
        var interval = 1000; // ms
        var svg;

        var el = d3Service.select(element[0]);

        var setup = function() {
          el.selectAll('svg').remove();
          svg = el.append('svg')
            .attr('width', width)
            .attr('height', height);
        };
        setup();

        var circles = [];

        var AnimatedCircle = function(interval, rest, layer, color, opacity, center) {
          this.interval = interval; // seconds
          this.rest = rest;
          this.layer = layer;
          this.color = color;
          this.opacity = opacity;
          this.center = center;
          this.data = [];
          this.currAvg = 1;
        };

        AnimatedCircle.prototype.insert = function (svg) {
          this.el = svg.append('circle')
            .attr('id', 'circle' + this.interval)
            .attr('cx', this.center.x)
            .attr('cy', this.center.y)
            .attr('r', this.radius)
            .attr('fill', this.color)
            .attr('fill-opacity', this.opacity);
        };

        AnimatedCircle.prototype.pulse = function (magnitude) {
          this.data.push(magnitude);
          if (this.data.length % this.interval === 0) {

            // update averages
            var sum = 0;
            for (var i = 0; i < this.data.length; i++) {
              sum += this.data[i];
            }
            this.prevAvg = this.currAvg;
            this.currAvg = sum / this.data.length;
            this.data = [];

            // update animation
            var interval = this.interval * 1000;
            this.el.transition().duration(interval * 0.66).ease('linear') // grow to new value
              .attr('r', this.rest + magnitude * this.layer)
              .transition().duration(interval * 0.4).ease('linear') // collapse to 'resting' value
              .attr('r', this.rest)
              .transition().duration(interval * 0.66).ease('linear') // breath
              .attr('r', this.rest / 2);
          }
        };

        makeConcentricCircles = function (count, rest, layer, color, center, svgCanvas) {
          var circles = [];
          var opacity = 1 / count;
          var circle;
          var timeStrech = 1;
          for (var i = 0; i < count; i++) {
            circle = new AnimatedCircle (i * timeStrech + 1, rest, layer, color, opacity, center);
            circle.insert(svgCanvas);
            circles.push(circle);
          }
          return circles;
        };
        circles = makeConcentricCircles(10, rest, layer, 'rgb(40, 169, 162)', center, svg);

        scope.$watch('data', function(newData) {
          for (var i = 0; i < circles.length; i++) {
            circles[i].pulse(newData);
          }
        }, true);

      }
    };
   });

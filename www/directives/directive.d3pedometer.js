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

        scope.$watch('data', function(newData, oldData) {
          console.log("WATCHING: ", newData, oldData);
          render();
        }, true);
        //in D3, any selection[0] contains the group
        //selection[0][0] is the DOM node
        //but we won't need that this time
        var chart = d3Service.select(element[0]);
        //to our original directive markup bars-chart
        //we add a div with out chart stling and bind each
        //data entry to the chart
        var render = function() {
          chart.selectAll('div').remove();
          chart.append('div').attr('class', 'chart')
            .selectAll('div')
            .data(scope.data).enter().append("div")
            .transition(100).ease('elastic')
            .style('width', function(d) { return d + "%"; })
            .text(function(d) { return d + '%'; });
        };
        render();
      }
    };
    return directiveDefinitionObject;
   });

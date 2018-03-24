angular.module('mySearch', []).controller('searchCtrl', function($scope, $interval, $timeout) {
  /*A "module" is basically a model. mySearch can be seen as the value of the attribute ng-app which basically turns your chosen html
  element into a model. The controller is the function that will be executed for the given element. The idea is that angular js wants
  you not to use global functions as they "pollute the global namespace". Therfore all the specific fucntions are defined within
  the controller

  $scope is kind of like "this" not is not necessarily the same.
  $interval is a "service", there are many different ones, this one basically calls the function repeatedly
  */
  alert("here");
  $scope.name = "";
  $scope.suggestions = [{
      name: "Bernie Sanders",
      title: "Senator Vermont(I) [US]"
    },
    {
      name: "Barack Obama",
      title: "Former POTUS [US]"
    },
    {
      name: "Justin Trudeau",
      title: "Prime Minister [CAN]"
    },
    {
      name: "Donald Trump",
      title: "POTUS [US]"
    },
    {
      name: "Hillary Clinton",
      title: "Former Secretary of State [US]"
    }
  ]
  var i = 0;
  var j = 0;
  var x = 0;
  $scope.suggest = $interval(function() {
    if ($scope.name.length < $scope.suggestions[i].name.length) {
      $scope.name += $scope.suggestions[i].name[j];
    } else {
      $scope.name += " ";
    }
    j++;
    if ($scope.name.length > $scope.suggestions[i].name.length) {
      x++;
      if (x < 10) {
        $scope.name += " ";
      }
      if (x >= 10) {
        j = 0;
        x = 0;
        i++;
        $scope.name = "";
      }
    }
    if (i == $scope.suggestions.length) {
      i = 0;
    }
  }, 250);
  $scope.suggestOff = function() {
    $interval.cancel($scope.suggest);
    $scope.name = "";
  }
});

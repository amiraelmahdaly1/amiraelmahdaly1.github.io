var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {


    $scope.USerCredentials = { UserName: "", Password: "" };

    angular.element(document).ready(function () {
        Office.initialize = function (reason) {

        };


    });
    $scope.Logout = function () {
        localStorage.removeItem("logged");
        Redirect("Index.html?Taskpane=LessonLearned");
    }

}];

app.controller("myCtrl", myCtrl);

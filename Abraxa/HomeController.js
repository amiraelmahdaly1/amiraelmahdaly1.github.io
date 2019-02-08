var myCtrl = ['$scope', 'AngularServices', '$sce', function ($scope, AngularServices, $sce) {





    $scope.Logout = function () {


        var headers = {
            "Content-Type": "application/json"
        };

        var User = {
            "Email": $scope.Email,
            "Pass": $scope.Pass
        };

        var data = {
            "grant_type": "password",
            "username": User.Email,
            "password": User.Pass,
            "scope": "SCOPE",
            "client_id": clientID
        };



        AngularServices.GET("v2/logout?client_id" + clientID, data, headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        SaveUser(null);
                        Redirect("Login.html");
                        break;
                    default:
                        SaveUser(null);
                        Redirect("Login.html");
                        break;
                }
            }
            );


    }

}];

app.controller("myCtrl", myCtrl);







var myCtrl = ['$scope', 'AngularServices', '$sce', function ($scope, AngularServices, $sce) {
   
    $scope.Email = "";
    $scope.Pass= "";


  
   
    $scope.Login = function() {

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

      
      
        AngularServices.POST("oauth/token", data , headers ).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        SaveUser(User);
                        Redirect("Home.html");
                        break;
                    case 403:
                        showNotification("Invalid Email or Password")
                        break;
                    default:
                        Redirect("Login.html");
                        break;
                }
            }
            );


    }
    
}];

app.controller("myCtrl", myCtrl);







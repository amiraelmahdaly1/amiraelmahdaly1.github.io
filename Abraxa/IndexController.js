var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    angular.element(document).ready(function () {
        Login();

    });


    function Login() {
     

        var User = getCurrentUser();
        if (User == null)
            Redirect("Login.html")


        var headers = {
            "Content-Type": "application/json"
        };
        var data = {
            "grant_type": "password",
            "username": User.Email,
            "password": User.Pass,
            "scope": "SCOPE",
            "client_id": clientID
        };



        AngularServices.POST("oauth/token", data, headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        Redirect("Home.html");
                        break;
                    case 403:
                        Redirect("Login.html")
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

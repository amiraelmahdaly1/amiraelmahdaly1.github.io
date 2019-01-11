var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {
Office.initialize = function (reason) {
    var element = document.querySelector('.ms-MessageBanner');
    messageBanner = new fabric.MessageBanner(element);
    messageBanner.hideBanner();
    };

    if (localStorage.getItem('staffID') === null)
        Redirect('Home.html');
    else
        Redirect("DailySchedule.html?staffID=" + localStorage.getItem('staffID') + "&userID=" + localStorage.getItem('userID') + "&userName=" + localStorage.getItem('userName'));


   
}];

app.controller("myCtrl", myCtrl);

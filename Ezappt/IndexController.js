﻿var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {
    if (localStorage.getItem('staffID') === null)
        Redirect('Home.html');
    else
        Redirect("DailySchedule.html?staffID=" + localStorage.getItem('staffID') + "&userID=" + localStorage.getItem('userID') + "&userName=" + localStorage.getItem('userName'));


   
}];

app.controller("myCtrl", myCtrl);

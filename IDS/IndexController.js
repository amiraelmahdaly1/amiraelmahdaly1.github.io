var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {


    $scope.USerCredentials = { UserName: "", Password: "" };
    var TokenDialog;
    var TokenDialogUrl = DeploymentHost + "TokenDialog.html";
   
    angular.element(document).ready(function () {
        Office.initialize = function (reason) {
            if (localStorage.hasOwnProperty("logged"))
                Redirect(getQueryStringValue("Taskpane") + ".html");
            else
                ShowTokenDialog();

        };


    });
    function openTemplate(temp) {
        Word.run(function (context) {

            // this getDocumentAsBase64 assumes a valid base64-encoded docx file

            var myNewDoc = context.application.createDocument(temp);
            context.load(myNewDoc);

            return context.sync()
                .then(function () {
                    myNewDoc.open();
                    context.sync();
                    //Redirect(getQueryStringValue("Taskpane") + ".html");
                }).catch(function (myError) {
                    //otherwise we handle the exception here!
                    showNotification("Error", myError.message);
                })

        }).catch(function (myError) {
            showNotification("Error", myError.message);
        });
    }
    function ShowTokenDialog() {
        Office.context.ui.displayDialogAsync(TokenDialogUrl, { height: 40, width: 38, displayInIframe: true },
            function (asyncResult) {
                TokenDialog = asyncResult.value;
                TokenDialog.addEventHandler(Office.EventType.DialogMessageReceived, processtokenDialogMessage);
                // TokenDialog.addEventHandler(Office.EventType.DialogEventReceived, TokenDialogClosed);
            }
        );
    }

    function processtokenDialogMessage(arg) {
        var MessageObj = JSON.parse(arg.message);
        $scope.USerCredentials.UserName = MessageObj.UserName;
        $scope.USerCredentials.Password = MessageObj.Password;
        TokenDialog.close();
        openTemplate(templates[MessageObj.TemplateIndex]);
    }

}];

app.controller("myCtrl", myCtrl);

// The initialize function must be run each time a new page is loaded.
(function () {
    Office.initialize = function (reason) {
        // If you need to initialize something you can do so here.
    };
})();
function getDocumentAsCompressed() {

    Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 65536 /*64 KB*/ },
        function (result) {
            if (result.status == "succeeded") {
                // If the getFileAsync call succeeded, then
                // result.value will return a valid File Object.
                var myFile = result.value;
                var sliceCount = myFile.sliceCount;
                var slicesReceived = 0, gotAllSlices = true, docdataSlices = [];
                //    showNotification("File size:" + myFile.size + " #Slices: " + sliceCount);

                // Get the file slices.
                getSliceAsync(myFile, 0, sliceCount, gotAllSlices, docdataSlices, slicesReceived);
            }
            else {
                showNotification("Error:", result.error.message);
            }
        });
}
function getSliceAsync(file, nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived) {
    file.getSliceAsync(nextSlice, function (sliceResult) {
        if (sliceResult.status == "succeeded") {
            if (!gotAllSlices) { // Failed to get all slices, no need to continue.
                return;
            }

            // Got one slice, store it in a temporary array.
            // (Or you can do something else, such as
            // send it to a third-party server.)
            docdataSlices[sliceResult.value.index] = sliceResult.value.data;
            if (++slicesReceived == sliceCount) {
                // All slices have been received.
                file.closeAsync();
                onGotAllSlices(docdataSlices);
            }
            else {
                getSliceAsync(file, ++nextSlice, sliceCount, gotAllSlices, docdataSlices, slicesReceived);
            }
        }
        else {
            gotAllSlices = false;
            file.closeAsync();
            showNotification("getSliceAsync Error:", sliceResult.error.message);
        }
    });
}
function onGotAllSlices(docdataSlices) {
    var docdata = [];
    for (var i = 0; i < docdataSlices.length; i++) {
        docdata = docdata.concat(docdataSlices[i]);
    }




    //var fileContent = btoa(unescape(encodeURIComponent(docdata)));

    var fileContent = new String();
    for (var j = 0; j < docdata.length; j++) {
        fileContent += String.fromCharCode(docdata[j]);
    }

    // var file = btoa(fileContent);
    pdfData = btoa(fileContent);
    localStorage.setItem("b64", pdfData);
    showDialog();
  

}

function showDialog() {
    Office.context.ui.displayDialogAsync('https://localhost:44397/Home.html', { height: 50, width: 50, displayInIframe: true });
}
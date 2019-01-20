
(function () {
    "use strict";

    var messageBanner;
    var thePdf;
    var viewer;
    var last = false;
    var pdfData = '';
    var PdfDocumentLoaded;
    var pdfjsframe;
    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the FabricUI notification mechanism and hide it
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();
            pdfjsframe = document.getElementById('pdfViewer');
            pdfjsframe.onload = function () {
                getDocumentAsCompressed();
            };
            // If not using Word 2016, use fallback logic.
         
        });
    };

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
        LoadPdfDocument(pdfData);
    }


    function LoadPdfDocument(x) {
        //if (PdfDocumentLoaded)
        //    return;
        if (!x)
            return;

        var pdfData = base64ToUint8Array(x);
        pdfjsframe.contentWindow.PDFViewerApplication.open(pdfData);

        PdfDocumentLoaded = true;
    }

    function base64ToUint8Array(base64) {
        var raw = atob(base64);
        var uint8Array = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    }

    ////old trials
    function renderPage(pageNumber, canvas) {
        thePdf.getPage(pageNumber).then(function (page) {
            var viewport = page.getViewport(1.5);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
            if (last)
                printCanvas();
        });
    }
    function printCanvas() {
        var dataUrls = [];
        $('.pdf-page-canvas').each(function () {
            dataUrls.push(this.toDataURL());
        });
        var windowContent = '<!DOCTYPE html>';
        windowContent += '<html>';
        windowContent += '<head><title>Print canvas</title></head>';
        windowContent += '<body>';
        for (var i = 0; i < dataUrls.length; i++)
            windowContent += '<img src="' + dataUrls[i] + '">';
        windowContent += '</body>';
        windowContent += '</html>';
        var printWin = window.open('', '', 'width=340,height=260');
        printWin.document.open();
        printWin.document.write(windowContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
        printWin.close();
    }
    function printDocument(documentId) {
        var doc = document.getElementById(documentId);

        //Wait until PDF is ready to print    
        if (typeof doc.print === 'undefined') {
            setTimeout(function () { printDocument(documentId); }, 1000);
        } else {
            doc.print();
        }
    }

    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("Error:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();

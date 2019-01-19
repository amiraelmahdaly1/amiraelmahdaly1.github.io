
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
                LoadPdfDocument(localStorage.getItem('b64'));
            };
            // If not using Word 2016, use fallback logic.
         
            $('#print').click(function () {
                LoadPdfDocument(localStorage.getItem('b64'));
            });

        });
    };


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

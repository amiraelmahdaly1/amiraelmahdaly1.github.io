(function () {
    function printWhenReady() {
        if (typeof PDFViewerApplication !== 'undefined' && PDFViewerApplication.initialized && PDFViewerApplication.pdfViewer.pageViewsReady) {

            //$("#secondaryPrint").click();
         // document.getElementById("secondaryPrint").click();
         
            document.getElementById("pdfViewer").contentWindow.document.getElementById('secondaryPrint').click();

        }
        else {
            window.setTimeout(printWhenReady, 5000);
            //$("#secondaryPrint").click();
        }
    };

    printWhenReady();
})();
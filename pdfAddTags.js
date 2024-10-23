const Pdfix = require('pdfix-sdk');

const pdfixSdkWrapper = new Pdfix();
pdfixSdkWrapper.loadPdfixSdk().then(() => {
  const pdfixSdk = pdfixSdkWrapper.getPdfixSdk();
  const pdfix = pdfixSdk.GetPdfix();
  const pdfDoc = pdfixSdkWrapper.openDocumentFromPath("./pdf/test.pdf");

  // log document information before processing
  console.log({
    numOfPages: pdfDoc.GetNumPages(),
    version: pdfDoc.GetVersion(),
    pdfStandard: pdfDoc.GetPdfStandard()
  });

  const configJson = "";   // custom template configuration JSON

  // load template configuration from JSON file
  const tmpl = pdfDoc.GetTemplate()
  if (!tmpl) {
    throw Exception(pdfix.GetError())
  }

  // auto-generate template configuration or load from JSON
  if (configJson == "") {
    for (var i = 0; i < pdfDoc.GetNumPages(); i++) {
      if (!tmpl.AddPage(i)) {
        throw Exception(pdfix.GetError())
      }
    }
    if (!tmpl.Update()) {
      throw Exception(pdfix.GetError())
    }
  }
  else {
    const stm = pdfix.CreateMemStream();
    if (stm) {
      // TODO: write JSON config to stream
      if (!tmpl.LoadFromStream(stm, pdfixSdk.kDataFormatJson)) {
        throw Exception(pdfix.GetError())
      }
      stm.Destroy();
    }
  }

  const tagsParams = pdfixSdk.PdfTagsParams();
  if (!pdfDoc.AddTags(tagsParams)) {
    throw Exception(pdfix.GetError())
  }

  const docStream = pdfix.CreateMemStream();
  if (!pdfDoc.SaveToStream(docStream)) {
    throw Exception(pdfix.GetError())
  }

  // read file data to buffer for later use
  var arrayBuffer = new ArrayBuffer(docStream.GetSize());
  docStream.ReadToArrayBuffer(0, arrayBuffer, arrayBuffer.byteLength);
  docStream.Destroy();

  pdfDoc.Close();

});
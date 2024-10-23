/*
  `pdfToHtml.js`, demonstrates how to use the PDFix SDK for Node.js to convert a PDF document 
  to HTML format. It opens a PDF, extracts its content (text, images, and layout), and 
  converts it to a structured HTML representation, preserving the original document's formatting,
  responsive HTML layout, or layout defined by PDF Tags.
*/

const Pdfix = require('pdfix-sdk');

const pdfixSdkWrapper = new Pdfix();
pdfixSdkWrapper.loadPdfixSdk().then(() => {
  const pdfixSdk = pdfixSdkWrapper.getPdfixSdk();
  const pdfix = pdfixSdk.GetPdfix();
  const pdfDoc = pdfixSdkWrapper.openDocumentFromPath("./pdf/test.pdf");

  console.log({
    numOfPages: pdfDoc.GetNumPages(),
    version: pdfDoc.GetVersion(),
    pdfStandard: pdfDoc.GetPdfStandard()
  });

  const htmlConversion = pdfDoc.CreateHtmlConversion();

  // prepare conversion params
  const params = new pdfixSdk.PdfHtmlParams();
  params.html_type = pdfixSdk.kPdfHtmlFixed;
  // all resources (css, ja, img, font) must be embedded to save HTML into stream
  params.flags = pdfixSdk.kHtmlNoExternalCSS | pdfixSdk.kHtmlNoExternalJS | pdfixSdk.kHtmlNoExternalIMG | pdfixSdk.kHtmlNoExternalFONT;
  if (!htmlConversion.SetParams(params)) {
    throw Exception(pdfix.GetError())
  }

  // save HTML to memory stream
  const stream = pdfix.CreateMemStream();
  if (!stream) {
    throw Exception(pdfix.GetError())
  }
  if (!htmlConversion.SaveToStream(stream)) {
    throw Exception(pdfix.GetError())
  }
  htmlConversion.Destroy()

  // save data from stream to buffer
  const buffer = new ArrayBuffer(stream.GetSize())
  stream.ReadToArrayBuffer(0, buffer, buffer.byteLength)
  stream.Destroy()

  // display HTML
  const decoder = new TextDecoder();
  const str = decoder.decode(buffer);
  console.log(str)

  pdfDoc.Close();
});
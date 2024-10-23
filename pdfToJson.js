/*
  `pdfToJson.js`, demonstrates how to use the PDFix SDK for Node.js to convert 
  a PDF document's content into a JSON format. It opens a PDF, extracts its text, 
  images, and metadata, and then structures the data as JSON for easy 
  integration with other applications.
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

  const jsonConversion = pdfDoc.CreateJsonConversion();

  // prepare conversion params
  const params = new pdfixSdk.PdfJsonParams();
  params.struct_tree = 1; // export structure tree
  params.text = 1; // include text
  jsonConversion.SetParams(params);

  // save JSON to memory stream
  const stream = pdfix.CreateMemStream();
  jsonConversion.SaveToStream(stream);
  jsonConversion.Destroy()

  // save data from stream to buffer
  const buffer = new ArrayBuffer(stream.GetSize())
  stream.ReadToArrayBuffer(0, buffer, buffer.byteLength)
  stream.Destroy()

  // display JSON
  const decoder = new TextDecoder();
  const str = decoder.decode(buffer);
  console.log(str)

  pdfDoc.Close();
});
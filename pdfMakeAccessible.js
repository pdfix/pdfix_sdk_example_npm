/*
  `pdfMakeAccessible.js`, demonstrates how to use the PDFix SDK for Node.js to convert 
  a PDF document into an accessible format. It opens a PDF, performs auto-tagging 
  to create a structure tree, adjusts the content for compliance (e.g., reading order, 
  alt text), and saves the accessible PDF.
*/

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

  const commandPath = "";   // path to custom command JSON file
  const command = pdfDoc.GetCommand();

  // load the make-accessible command from JSON or use the default
  var cmdStm = null;
  if (commandPath == "") {
    cmdStm = pdfix.CreateMemStream()
    if (cmdStm) 
      command.SaveCommandsToStream(pdfixSdk.kActionMakeAccessible, cmdStm, pdfixSdk.kDataFormatJson, pdfixSdk.kSaveFull);
  } 
  else {
    cmdStm = pdfix.CreateFileStream(commandPath, pdfixSdk.kPsReadOnly);
  }
  if (!cmdStm) {
    throw Exception(pdfix.GetError())
  }

  // load command params and and run
  if (!command.LoadParamsFromStream(cmdStm, pdfixSdk.kDataFormatJson)) {
    throw Exception(pdfix.GetError())
  }
  cmdStm.Destroy();

  if (!command.Run()) {
    throw Exception(pdfix.GetError())
  }

  const docStream = pdfix.CreateMemStream();
  if (!pdfDoc.SaveToStream(docStream)) {
    throw Exception(pdfix.GetError())
  }

  // read file data to buffer
  var arrayBuffer = new ArrayBuffer(docStream.GetSize());
  docStream.ReadToArrayBuffer(0, arrayBuffer, arrayBuffer.byteLength);
  docStream.Destroy();

  // log document information after processing
  console.log({
    numOfPages: pdfDoc.GetNumPages(),
    version: pdfDoc.GetVersion(),
    pdfStandard: pdfDoc.GetPdfStandard()
  });

  pdfDoc.Close();
});
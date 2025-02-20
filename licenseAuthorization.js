/* 
  pdfAddTags.js, demonstrates how to use the PDFix SDK for Node.js to add 
  accessibility tags to a PDF document. It opens a PDF, generates a structure tree, applies 
  tags (e.g., headings, paragraphs), and saves the tagged PDF, making the document more 
  accessible for assistive technologies. 
  */

const Pdfix = require('pdfix-sdk');

const pdfixSdkWrapper = new Pdfix();
pdfixSdkWrapper.loadPdfixSdk().then(() => {
  const pdfixSdk = pdfixSdkWrapper.getPdfixSdk();
  const pdfix = pdfixSdk.GetPdfix();

  const licenseName = "my_license_name";
  const licenseKey = "my_license_key";
  // Account Authorization using licnese name and key 
  if (!pdfix.GetAccountAuthorization().Authorize(licenseName, licenseKey)) {
    throw Exception(pdfix.GetError())
  }

});
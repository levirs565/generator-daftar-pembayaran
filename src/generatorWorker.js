import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import expressionParser from "docxtemplater/expressions";
import { formatCurrency, getItemById } from "./util";

function processData({ recipientList, liabilityTypeList }) {
  return {
    Daftar: recipientList.map(({ name, liabilityList }) => ({
      Nama: name,
      Tanggungan: liabilityList.map(({ id, amount }) => ({
        Nama: getItemById(liabilityTypeList, id).name,
        Nominal: formatCurrency(amount),
      })),
    })),
  };
}

async function processTemplate(templateBuffer, data) {
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    parser: expressionParser,
  });

  doc.render(data);

  return doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
}

async function generateDocument(templateFile, data) {
  const templateBuffer = await templateFile.arrayBuffer();
  const processedData = processData(data);
  return processTemplate(templateBuffer, processedData);
}

addEventListener("message", (event) => {
  const data = event.data;
  if (data.action === "generate") {
    generateDocument(data.templateFile, data.data)
      .then((blob) => {
        postMessage({
          success: true,
          blob,
        });
      })
      .catch((error) => {
        console.error(error);
        postMessage({
          success: false,
          error,
        });
      });
  }
});

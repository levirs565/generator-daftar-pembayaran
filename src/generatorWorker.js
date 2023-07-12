import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import expressionParser from "docxtemplater/expressions";
import { getItemById } from "./util";

const numberFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

function processData({ recipientList, lialibilityTypeList }) {
  return {
    Daftar: recipientList.map(({ name, lialibilityList }) => ({
      Nama: name,
      Tanggungan: lialibilityList.map(({ id, amount }) => ({
        Nama: getItemById(lialibilityTypeList, id).name,
        Nominal: numberFormat.format(amount),
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

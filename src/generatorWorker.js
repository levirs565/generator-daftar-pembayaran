import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import expressionParser from "docxtemplater/expressions";
import { formatCurrency, getLiabilityTotal } from "./util";
import { appStore } from "./db";

async function mapRecipientLiability({ name, amount }) {
  return {
    Nama: name,
    Nominal: formatCurrency(amount),
  };
}

function mapRecipient({ name, liabilityList }) {
  return {
    Nama: name,
    Tanggungan: liabilityList.map(mapRecipientLiability),
    Total: formatCurrency(getLiabilityTotal(liabilityList)),
  };
}

async function getData() {
  const recipientList = await appStore.getRecipientList();
  return {
    Daftar: recipientList.map(mapRecipient),
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

async function generateDocument(templateFile) {
  const templateBuffer = await templateFile.arrayBuffer();
  const processedData = await getData();
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

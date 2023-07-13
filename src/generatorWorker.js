import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import expressionParser from "docxtemplater/expressions";
import { formatCurrency } from "./util";
import { liabilityStore, recipientStore } from "./db";

async function mapRecipientLiability({ id, amount }) {
  return {
    Nama: (await liabilityStore.get(id)).name,
    Nominal: formatCurrency(amount),
  };
}

async function mapRecipient({ name, liabilityList }) {
  const total = liabilityList.reduce((result, item) => result + item.amount, 0);
  return {
    Nama: name,
    Tanggungan: await Promise.all(liabilityList.map(mapRecipientLiability)),
    Total: formatCurrency(total),
  };
}

async function getData() {
  const recipientList = await recipientStore.getAll();
  return {
    Daftar: await Promise.all(recipientList.map(mapRecipient)),
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

export function removeItemById(array, id) {
  array.splice(
    array.findIndex((item) => item.id === id),
    1
  );
}

export function removeItemByIndex(array, index) {
  array.splice(index, 1);
}

export function getItemById(array, id) {
  return array.find((item) => item.id === id);
}

export function getItemIndexById(array, id) {
  return array.findIndex((item) => item.id === id);
}

export function getLiabilityTotal(list) {
  return list.reduce((result, item) => result + item.amount, 0);
}

const numberFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount) {
  return numberFormat.format(amount);
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.addEventListener("click", () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  });
  link.click();
}

export function catchRethrow(fn, type, message) {
  try {
    return fn();
  } catch (e) {
    if (e instanceof type) {
      throw new SyntaxError(message);
    }
    throw e;
  }
}

export class CancelException extends Error {
  constructor() {
    super();
  }
}

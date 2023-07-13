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

const numberFormat = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount) {
  return numberFormat.format(amount);
}

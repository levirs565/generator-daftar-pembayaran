export function removeItemById(array, id) {
  array.splice(
    array.findIndex((item) => item.id === id),
    1
  );
}

export function getItemById(array, id) {
  return array.find((item) => item.id === id);
}

export function generateId() {
  return window.crypto.randomUUID();
}

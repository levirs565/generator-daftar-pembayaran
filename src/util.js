import { nanoid } from "nanoid";

export function removeItemById(array, id) {
  array.splice(
    array.findIndex((item) => item.id === id),
    1
  );
}

export function getItemById(array, id) {
  return array.find((item) => item.id === id);
}

export function getItemIndexById(array, id) {
  return array.findIndex((item) => item.id === id);
}

export function generateId() {
  return nanoid();
}

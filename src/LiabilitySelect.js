import { Select } from "@chakra-ui/react";

export function LialibilitySelect({ value, onValueChange, jenisList }) {
  return (
    <Select
      value={value}
      onChange={onValueChange}
      placeholder="Pilih Jenis Tanggungan"
    >
      {jenisList.map((item) => (
        <option key={item.id} value={item.id}>
          {item.nama}
        </option>
      ))}
    </Select>
  );
}

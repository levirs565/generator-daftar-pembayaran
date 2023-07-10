import { Select } from "@chakra-ui/react";

export function LialibilitySelect({ value, onValueChange, typeList }) {
  return (
    <Select
      value={value}
      onChange={onValueChange}
      placeholder="Pilih Jenis Tanggungan"
    >
      {typeList.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  );
}

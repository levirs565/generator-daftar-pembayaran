import { DeleteIcon } from "@chakra-ui/icons";
import { Input, Button, IconButton, Th, Tr, Td } from "@chakra-ui/react";
import CurrencyInput from "react-currency-input-field";
import { generateId, getItemById, removeItemById } from "./util";
import { LialibilityTable } from "./LialibilityTable";

function LialibilityTypeItem({ liability, onUpdate, onRemove }) {
  return (
    <Tr>
      <Td>
        <Input
          value={liability.nama}
          placeholder="Nama"
          onChange={(e) =>
            onUpdate((draft) => {
              draft.nama = e.target.value;
            })
          }
        />
      </Td>
      <Td>
        <Input
          as={CurrencyInput}
          intlConfig={{ locale: "id-ID", currency: "IDR" }}
          value={liability.nominal}
          onValueChange={(e) =>
            onUpdate((draft) => {
              draft.nominal = parseInt(e);
            })
          }
        />
      </Td>
      <Td>
        <IconButton
          aria-label="Remove Current Item"
          colorScheme="red"
          icon={<DeleteIcon />}
          onClick={onRemove}
        />
      </Td>
    </Tr>
  );
}

function LialibilityTypeAdder({ onAdd }) {
  return (
    <Tr>
      <Th></Th>
      <Th colSpan={2}>
        <Button colorScheme="orange" onClick={onAdd} width={"100%"}>
          Tambah Jenis
        </Button>
      </Th>
    </Tr>
  );
}

export function LialibilityTypesTab({ list, onUpdateList }) {
  function addItem() {
    onUpdateList((draft) => {
      draft.push({
        id: generateId(),
        nama: "",
        nominal: 0,
      });
    });
  }

  return (
    <LialibilityTable
      body={list.map((item) => (
        <LialibilityTypeItem
          key={item.id}
          liability={item}
          onUpdate={(fn) =>
            onUpdateList((draft) => {
              fn(getItemById(draft, item.id));
            })
          }
          onRemove={() =>
            onUpdateList((draft) => {
              removeItemById(draft, item.id);
            })
          }
        />
      ))}
      footer={<LialibilityTypeAdder onAdd={addItem} />}
    />
  );
}

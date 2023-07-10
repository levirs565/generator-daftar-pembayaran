import { DeleteIcon } from "@chakra-ui/icons";
import { Input, Button, IconButton, Th, Tr, Td } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { LialibilityTable } from "./LialibilityTable";
import { getItemById, removeItemById } from "./util";
import { LialibilitySelect } from "./LiabilitySelect";

function RecipientLiabilityItem({ liability, onUpdate, onRemove, jenisList }) {
  return (
    <Tr key={liability.id}>
      <Td>{getItemById(jenisList, liability.id).nama}</Td>
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
          onClick={onRemove}
          icon={<DeleteIcon />}
        />
      </Td>
    </Tr>
  );
}

function RecipientLiabilityAdder({ jenisList, onAdd }) {
  const [selectedJenis, setSelectedJenis] = useState("");
  return (
    <Tr>
      <Th>
        <LialibilitySelect
          value={selectedJenis}
          onValueChange={(e) => setSelectedJenis(e.target.value)}
          jenisList={jenisList}
        />
      </Th>
      <Th colSpan={2}>
        <Button
          colorScheme="orange"
          width="100%"
          isDisabled={selectedJenis === ""}
          onClick={(e) => {
            onAdd(selectedJenis);
            setSelectedJenis("");
          }}
        >
          Tambah Tanggungan
        </Button>
      </Th>
    </Tr>
  );
}

export function RecipientLiabilityList({ list, onUpdateList, jenisList }) {
  const unusedJenisList = useMemo(
    () =>
      jenisList.filter(
        (jenis) =>
          list.findIndex((tanggungan) => tanggungan.id === jenis.id) === -1
      ),
    [jenisList, list]
  );
  return (
    <LialibilityTable
      body={list.map((item) => (
        <RecipientLiabilityItem
          key={item.id}
          liability={item}
          jenisList={jenisList}
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
      footer={
        unusedJenisList.length > 0 && (
          <RecipientLiabilityAdder
            jenisList={unusedJenisList}
            onAdd={(jenis) =>
              onUpdateList((draft) => {
                draft.push({
                  id: jenis,
                  nominal: getItemById(jenisList, jenis).nominal,
                });
              })
            }
          />
        )
      }
    />
  );
}

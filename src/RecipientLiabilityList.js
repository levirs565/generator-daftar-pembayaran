import { DeleteIcon } from "@chakra-ui/icons";
import { Input, Button, IconButton, Th, Tr, Td } from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { LialibilityTable } from "./LialibilityTable";
import { getItemById, removeItemById } from "./util";
import { LialibilitySelect } from "./LiabilitySelect";
import { LialibilityTypeListContext } from "./LialibilityTypeListContext";

function RecipientLiabilityItem({ liability, onUpdate, onRemove }) {
  const liabilityTypeList = useContext(LialibilityTypeListContext);
  return (
    <Tr key={liability.id}>
      <Td>{getItemById(liabilityTypeList, liability.id).name}</Td>
      <Td>
        <Input
          as={CurrencyInput}
          intlConfig={{ locale: "id-ID", currency: "IDR" }}
          value={liability.amount}
          onValueChange={(e) =>
            onUpdate((draft) => {
              draft.amount = parseInt(e);
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

function RecipientLiabilityAdder({ typeList, onAdd }) {
  const [selectedJenis, setSelectedJenis] = useState("");
  return (
    <Tr>
      <Th>
        <LialibilitySelect
          value={selectedJenis}
          onValueChange={(e) => setSelectedJenis(e.target.value)}
          typeList={typeList}
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

export function RecipientLiabilityList({ list, onUpdateList }) {
  const liabilityTypeList = useContext(LialibilityTypeListContext);
  const unusedLialibilityTypeList = useMemo(
    () =>
      liabilityTypeList.filter(
        (jenis) =>
          list.findIndex((lialibilityList) => lialibilityList.id === jenis.id) === -1
      ),
    [liabilityTypeList, list]
  );
  return (
    <LialibilityTable
      body={list.map((item) => (
        <RecipientLiabilityItem
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
      footer={
        unusedLialibilityTypeList.length > 0 && (
          <RecipientLiabilityAdder
            typeList={unusedLialibilityTypeList}
            onAdd={(jenis) =>
              onUpdateList((draft) => {
                draft.push({
                  id: jenis,
                  amount: getItemById(liabilityTypeList, jenis).amount,
                });
              })
            }
          />
        )
      }
    />
  );
}

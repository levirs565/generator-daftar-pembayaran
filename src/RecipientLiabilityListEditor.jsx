import {
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import { getItemById, removeItemById } from "./util";
import { LialibilitySelect } from "./LiabilitySelect";
import { LialibilityTypeListContext } from "./LialibilityTypeListContext";
import { FastCurrencyInput } from "./FastInput";

function NestedCard({ children }) {
  return (
    <Box borderWidth="1px" p={4} borderRadius="lg">
      {children}
    </Box>
  );
}

function RecipientLiabilityItemEditor({ liability, onUpdate, onRemove }) {
  const liabilityTypeList = useContext(LialibilityTypeListContext);
  return (
    <NestedCard>
      <VStack>
        <FormControl>
          <FormLabel>Nama</FormLabel>
          <Text>{getItemById(liabilityTypeList, liability.id).name}</Text>
        </FormControl>
        <FormControl>
          <FormLabel>Nominal</FormLabel>
          <FastCurrencyInput
            value={liability.amount}
            onUpdate={(e) =>
              onUpdate((draft) => {
                draft.amount = parseInt(e);
              })
            }
          />
        </FormControl>
        <Button
          aria-label="Remove Current Item"
          colorScheme="red"
          onClick={onRemove}
          alignSelf="end"
        >
          Hapus Tanggungan
        </Button>
      </VStack>
    </NestedCard>
  );
}

function RecipientLiabilityAdder({ typeList, onAdd }) {
  const [selectedJenis, setSelectedJenis] = useState("");
  return (
    <NestedCard>
      <VStack>
        <FormControl>
          <FormLabel>Jenis Pembayaran</FormLabel>
          <LialibilitySelect
            value={selectedJenis}
            onValueChange={(e) => setSelectedJenis(e.target.value)}
            typeList={typeList}
          />
        </FormControl>
        <Button
          colorScheme="pink"
          isDisabled={selectedJenis === ""}
          onClick={() => {
            onAdd(selectedJenis);
            setSelectedJenis("");
          }}
          alignSelf="end"
        >
          Tambah Tanggungan
        </Button>
      </VStack>
    </NestedCard>
  );
}

export function RecipientLiabilityListEditor({ list, onUpdateList }) {
  const liabilityTypeList = useContext(LialibilityTypeListContext);
  const unusedLialibilityTypeList = useMemo(
    () =>
      liabilityTypeList.filter(
        (jenis) =>
          list.findIndex(
            (lialibilityList) => lialibilityList.id === jenis.id
          ) === -1
      ),
    [liabilityTypeList, list]
  );
  return (
    <VStack alignItems="stretch" gap={2}>
      {list.map((item) => (
        <RecipientLiabilityItemEditor
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
      {unusedLialibilityTypeList.length > 0 && (
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
      )}
    </VStack>
  );
}

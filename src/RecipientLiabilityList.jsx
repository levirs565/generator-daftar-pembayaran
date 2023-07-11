import {
  Input,
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { getItemById, removeItemById } from "./util";
import { LialibilitySelect } from "./LiabilitySelect";
import { LialibilityTypeListContext } from "./LialibilityTypeListContext";

function NestedCard({ children }) {
  return (
    <Box borderWidth="1px" p={4} borderRadius="lg">
      {children}
    </Box>
  );
}

function RecipientLiabilityItem({ liability, onUpdate, onRemove }) {
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

export function RecipientLiabilityList({ list, onUpdateList }) {
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

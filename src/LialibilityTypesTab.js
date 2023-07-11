import {
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Flex,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
import CurrencyInput from "react-currency-input-field";
import { generateId, getItemById, removeItemById } from "./util";

function LialibilityTypeItem({ liability, onUpdate, onRemove, index }) {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Tanggungan ke {index + 1}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          {!isExpanded && (
            <Text px={4} py={2}>
              {liability.name}
            </Text>
          )}
          <AccordionPanel>
            <FormControl>
              <FormLabel>Nama</FormLabel>
              <Textarea
                value={liability.name}
                placeholder="Nama"
                onChange={(e) =>
                  onUpdate((draft) => {
                    draft.name = e.target.value;
                  })
                }
                onInput={(e) => {
                  e.target.value = e.target.value.split("\n").join(" ");
                }}
                rows={2}
              />
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
            <Flex mt={4} justifyContent="end">
              <Button colorScheme="red" onClick={onRemove}>
                Hapus
              </Button>
            </Flex>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}

function LialibilityTypeList({ list, onUpdateList }) {
  return (
    <Accordion allowToggle>
      {list.map((item, index) => (
        <LialibilityTypeItem
          key={item.id}
          index={index}
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
    </Accordion>
  );
}

function LialibilityTypeAdder({ onAdd }) {
  return (
    <Flex alignSelf="end">
      <Button colorScheme="pink" onClick={onAdd} width={"100%"}>
        Tambah Jenis
      </Button>
    </Flex>
  );
}

export function LialibilityTypesTab({ list, onUpdateList }) {
  function addItem() {
    onUpdateList((draft) => {
      draft.push({
        id: generateId(),
        name: "",
        amount: 0,
      });
    });
  }

  return (
    <VStack alignItems="stretch" gap={4}>
      <LialibilityTypeList list={list} onUpdateList={onUpdateList} />
      <LialibilityTypeAdder onAdd={addItem} />
    </VStack>
  );
}

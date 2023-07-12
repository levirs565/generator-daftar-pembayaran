import {
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import CurrencyInput from "react-currency-input-field";
import { motion } from "framer-motion";
import { generateId, getItemById, removeItemById } from "./util";
import {
  AccordionItemAnimatable,
  AccordionBodyMotionProps,
  AccordionAnimatable,
} from "./AccordionAnimatable";
import { useEffect, useRef, useState } from "react";

function LialibilityTypeItem({ liability, onUpdate, onRemove, index }) {
  return (
    <AccordionItemAnimatable
      id={liability.id}
      title={`Tanggungan ke ${index + 1}`}
      collapsedBodyTitle={liability.name}
      expandedBody={
        <>
          <FormControl>
            <FormLabel>Nama</FormLabel>
            <motion.div {...AccordionBodyMotionProps}>
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
            </motion.div>
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
        </>
      }
    />
  );
}

function LialibilityTypeList({ list, onUpdateList, index, onChange }) {
  return (
    <AccordionAnimatable allowToggle index={index} onChange={onChange}>
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
    </AccordionAnimatable>
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
  const [openIndex, setOpenIndex] = useState(-1);
  const pendingScroll = useRef(false);

  function addItem() {
    setOpenIndex(list.length);
    pendingScroll.current = true;
    onUpdateList((draft) => {
      draft.push({
        id: generateId(),
        name: "",
        amount: 0,
      });
    });
  }

  useEffect(() => {
    if (pendingScroll.current) {
      window.scrollTo(0, document.body.scrollHeight);
      pendingScroll.current = false;
    }
  });

  return (
    <VStack alignItems="stretch" gap={4}>
      <LialibilityTypeList
        list={list}
        onUpdateList={onUpdateList}
        index={openIndex}
        onChange={(index) => setOpenIndex(index)}
      />
      <LialibilityTypeAdder onAdd={addItem} />
    </VStack>
  );
}

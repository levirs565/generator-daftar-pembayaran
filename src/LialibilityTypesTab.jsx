import { Button, FormControl, FormLabel, VStack, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { generateId, getItemIndexById, removeItemById } from "./util";
import {
  AccordionItemAnimatable,
  AccordionBodyMotionProps,
  AccordionAnimatable,
  useAccordionAutoScroller,
} from "./AccordionAnimatable";
import { FastCurrencyInput, FastTextArea } from "./FastInput";

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
              <FastTextArea
                value={liability.name}
                placeholder="Nama"
                onUpdate={(e) =>
                  onUpdate((draft) => {
                    draft.name = e;
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
            <FastCurrencyInput
              value={liability.amount}
              onUpdate={(e) =>
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

function LialibilityTypeList({ list, onUpdateList, ...rest }) {
  return (
    <AccordionAnimatable allowToggle {...rest}>
      {list.map((item, index) => (
        <LialibilityTypeItem
          key={item.id}
          index={index}
          liability={item}
          onUpdate={(fn) => {
            const index = getItemIndexById(list, item.id);
            onUpdateList((draft) => {
              fn(draft[index]);
            });
          }}
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
  const { accordionProps, onBeforeAddItem } = useAccordionAutoScroller();

  function addItem() {
    onBeforeAddItem(list);
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
      <LialibilityTypeList
        list={list}
        onUpdateList={onUpdateList}
        {...accordionProps}
      />
      <LialibilityTypeAdder onAdd={addItem} />
    </VStack>
  );
}

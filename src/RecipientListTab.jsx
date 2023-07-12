import { AddIcon } from "@chakra-ui/icons";
import {
  VStack,
  IconButton,
  Heading,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { generateId, getItemById, removeItemById } from "./util";
import {
  AccordionAnimatable,
  AccordionBodyMotionProps,
  AccordionItemAnimatable,
} from "./AccordionAnimatable";
import { motion } from "framer-motion";
import { FastInput } from "./FastInput";

function RecipientItem({ recipient, index, onUpdate, onRemove }) {
  return (
    <AccordionItemAnimatable
      id={recipient.id}
      title={`Penerima ke ${index + 1}`}
      collapsedBodyTitle={recipient.name}
      expandedBody={
        <>
          <VStack alignItems={"stretch"}>
            <FormControl>
              <FormLabel>Nama</FormLabel>
              <motion.div {...AccordionBodyMotionProps}>
                <FastInput
                  value={recipient.name}
                  placeholder="Nama Penerima"
                  onUpdate={(e) =>
                    onUpdate((draft) => {
                      draft.name = e;
                    })
                  }
                />
              </motion.div>
            </FormControl>
            <Heading size={"sm"}>Tanggungan</Heading>
            <RecipientLiabilityList
              list={recipient.lialibilityList}
              onUpdateList={(fn) => {
                onUpdate((draft) => {
                  fn(draft.lialibilityList);
                });
              }}
            />
            <Button colorScheme="red" onClick={onRemove} alignSelf="end">
              Hapus Penerima
            </Button>
          </VStack>
        </>
      }
    />
  );
}

function RecipientList({ list, onUpdateList }) {
  return (
    <AccordionAnimatable allowToggle>
      {list.map((item, index) => (
        <RecipientItem
          key={item.id}
          recipient={item}
          index={index}
          onUpdate={(fn) =>
            onUpdateList((draft) => {
              fn(getItemById(draft, item.id));
            })
          }
          onRemove={() => {
            onUpdateList((draft) => {
              removeItemById(draft, item.id);
            });
          }}
        />
      ))}
    </AccordionAnimatable>
  );
}

function RecipientAdder({ onAdd }) {
  return (
    <IconButton
      aria-label="Tambah Penerima"
      colorScheme="orange"
      onClick={onAdd}
      icon={<AddIcon />}
      isRound
      position={"fixed"}
      right={4}
      bottom={4}
      size="lg"
    />
  );
}

export function RecipientListTab({ list, onUpdateList }) {
  return (
    <>
      <RecipientList list={list} onUpdateList={onUpdateList} />
      <RecipientAdder
        onAdd={() =>
          onUpdateList((draft) => {
            draft.push({
              id: generateId(),
              name: "",
              lialibilityList: [],
            });
          })
        }
      />
    </>
  );
}

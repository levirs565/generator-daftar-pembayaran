import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FastInput } from "./FastInput";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { useState } from "react";
import { useImmer } from "use-immer";

function RecipientModalContent({ initialItem, onClose, onSubmit }) {
  const [name, setName] = useState(initialItem ? initialItem.name : "");
  const [lialibilityList, updateLialibilityList] = useImmer(
    initialItem ? initialItem.lialibilityList : []
  );
  const isNew = !initialItem;
  return (
    <ModalContent>
      <ModalHeader>{isNew ? "Buat Penerima" : "Ubah Penerima"}</ModalHeader>
      <ModalBody>
        <FormControl>
          <FormLabel>Nama</FormLabel>
          <FastInput
            value={name}
            placeholder="Nama Penerima"
            onUpdate={(e) => setName(e)}
          />
        </FormControl>
        <Heading size={"sm"}>Tanggungan</Heading>
        <RecipientLiabilityList
          list={lialibilityList}
          onUpdateList={updateLialibilityList}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Batal
        </Button>
        <Button
          colorScheme="pink"
          onClick={() => {
            onClose();
            onSubmit({
              ...initialItem,
              name,
              lialibilityList,
            });
          }}
        >
          {isNew ? "Buat" : "Simpan"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export function RecipientModal({ item, isOpen, onClose, onSubmit }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <RecipientModalContent
        initialItem={item}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  );
}

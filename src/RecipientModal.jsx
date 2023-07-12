import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { useState } from "react";
import { useImmer } from "use-immer";

function RecipientModalContent({ initialItem, onClose, onSubmit }) {
  const [name, setName] = useState(initialItem ? initialItem.name : "");
  const [lialibilityList, updateLialibilityList] = useImmer(
    initialItem ? initialItem.lialibilityList : []
  );
  const isNameInvalid = name.length === 0;
  const isNew = !initialItem;
  return (
    <ModalContent>
      <ModalHeader>{isNew ? "Buat Penerima" : "Ubah Penerima"}</ModalHeader>
      <ModalBody>
        <FormControl isInvalid={isNameInvalid} isRequired>
          <FormLabel>Nama</FormLabel>
          <Input
            value={name}
            placeholder="Nama Penerima"
            onChange={(e) => setName(e.target.value)}
          />
          <FormErrorMessage>Nama tidak boleh kosong.</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Tanggungan</FormLabel>
          <RecipientLiabilityList
            list={lialibilityList}
            onUpdateList={updateLialibilityList}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Batal
        </Button>
        <Button
          isDisabled={isNameInvalid}
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

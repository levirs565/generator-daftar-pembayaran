import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FastCurrencyInput, FastTextArea } from "./FastInput";
import { useEffect, useState } from "react";

function LialibilityTypeModalContent({ item, isNew, onSubmit, onClose }) {
  const [name, setName] = useState(item ? item.name : "");
  const [amount, setAmount] = useState(0);

  const isNameInvalid = name.length === 0;

  useEffect(() => {
    if (item) {
      setAmount(item.amount);
    } else {
      setAmount(0);
    }
  }, [item]);

  return (
    <ModalContent>
      <ModalHeader>
        {isNew ? "Buat Jenis Tanggungan" : "Ubah Jenis Tanggungan"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl isInvalid={isNameInvalid} isRequired>
          <FormLabel>Nama</FormLabel>
          <FastTextArea
            value={name}
            placeholder="Nama"
            onUpdate={(e) => setName(e)}
            onInput={(e) => {
              e.target.value = e.target.value.split("\n").join(" ");
            }}
            rows={2}
            data-autofocus
          />
          <FormErrorMessage>Nama tidak boleh kosong.</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Nominal</FormLabel>
          <FastCurrencyInput
            value={amount}
            onUpdate={(e) => setAmount(parseInt(e))}
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
              ...item,
              name,
              amount,
            });
          }}
        >
          {isNew ? "Buat" : "Simpan"}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export function LialibilityTypeModal({
  lialibility,
  isOpen,
  onClose,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <LialibilityTypeModalContent
        item={lialibility}
        onSubmit={onSubmit}
        onClose={onClose}
        isNew={!lialibility}
      />
    </Modal>
  );
}

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
  Textarea,
} from "@chakra-ui/react";
import { FastCurrencyInput } from "./FastInput";
import { useState } from "react";

function LiabilityTypeModalContent({ item, isNew, onSubmit, onClose }) {
  const [name, setName] = useState(item ? item.name : "");
  const [amount, setAmount] = useState(item ? item.amount : 0);

  const isNameInvalid = name.length === 0;

  return (
    <ModalContent>
      <ModalHeader>
        {isNew ? "Buat Jenis Tanggungan" : "Ubah Jenis Tanggungan"}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl isInvalid={isNameInvalid} isRequired>
          <FormLabel>Nama</FormLabel>
          <Textarea
            value={name}
            placeholder="Nama"
            onInput={(e) => {
              e.target.value = e.target.value.split("\n").join(" ");
            }}
            onChange={(e) => setName(e.target.value)}
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
        <Button variant="ghost" onClick={onClose} mr={4}>
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

export function LiabilityTypeModal({
  liability,
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
      <LiabilityTypeModalContent
        item={liability}
        onSubmit={onSubmit}
        onClose={onClose}
        isNew={!liability}
      />
    </Modal>
  );
}

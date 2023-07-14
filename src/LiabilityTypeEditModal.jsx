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
import { AppCurrencyInput } from "./AppCurrencyInput";
import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { CancelException } from "./util";

function LiabilityTypeModalContent({ initialItem, onSubmit, onCancel }) {
  const [name, setName] = useState(initialItem ? initialItem.name : "");
  const [amount, setAmount] = useState(initialItem ? initialItem.amount : 0);
  const isNameInvalid = name.length === 0;
  const isNew = !initialItem;

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
          <AppCurrencyInput
            value={amount}
            onValueChange={(e) => setAmount(e ? parseInt(e) : 0)}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onCancel} mr={4}>
          Batal
        </Button>
        <Button
          isDisabled={isNameInvalid}
          colorScheme="pink"
          onClick={() => {
            onSubmit({
              ...initialItem,
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

export const LiabilityTypeEditModal = NiceModal.create(({ item }) => {
  const modal = useModal();
  return (
    <Modal
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <LiabilityTypeModalContent
        initialItem={item}
        onSubmit={(item) => {
          modal.resolve({ item });
          modal.hide();
        }}
        onCancel={() => {
          modal.reject(new CancelException());
          modal.hide();
        }}
      />
    </Modal>
  );
});

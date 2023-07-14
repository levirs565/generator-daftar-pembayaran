import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useRef } from "react";
import { CancelException } from "./util";

export const PromptDialog = NiceModal.create(
  ({ title, message, ctaColor, ctaText, cancelText = "Batal" }) => {
    const modal = useModal();
    const cancelButtonRef = useRef();
    return (
      <AlertDialog isOpen={modal.visible} onCloseComplete={modal.remove}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          {title && (
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
          )}
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelButtonRef}
              variant="ghost"
              onClick={() => {
                modal.reject(new CancelException());
                modal.hide();
              }}
              mr={4}
            >
              {cancelText}
            </Button>
            <Button
              colorScheme={ctaColor}
              onClick={() => {
                modal.resolve();
                modal.hide();
              }}
            >
              {ctaText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

function showCancelCofirmation() {
  return NiceModal.show(PromptDialog, {
    title: "Buang perubahan?",
    message: "Perubahan yang telah dibuat akan hilang",
    ctaColor: "red",
    ctaText: "Buang",
    cancelText: "Tetap Mengubah",
  });
}

export function cancelModalWithConfirm(modal) {
  return showCancelCofirmation()
    .then(() => {
      modal.reject(new CancelException());
      modal.hide();
    })
    .catch(() => {});
}

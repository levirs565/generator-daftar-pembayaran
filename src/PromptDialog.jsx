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
  ({ title, message, ctaColor, ctaText }) => {
    const modal = useModal();
    const cancelButtonRef = useRef();
    return (
      <AlertDialog isOpen={modal.visible} onCloseComplete={modal.remove}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
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
              Batal
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

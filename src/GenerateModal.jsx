import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { downloadBlob } from "./util";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useGlobalToast } from "./toastUtil";

const workerResultEvent = "generateWorkerResult";

let activeWorker = undefined;

function getWorker() {
  if (!activeWorker) {
    activeWorker = new Worker(
      new URL("./generatorWorker.js", import.meta.url),
      {
        type: "module",
      }
    );
    activeWorker.addEventListener("message", (event) => {
      const data = event.data;
      window.dispatchEvent(
        new CustomEvent(workerResultEvent, {
          detail: data,
        })
      );
    });
  }

  return activeWorker;
}

function run(templateFile) {
  getWorker().postMessage({
    action: "generate",
    templateFile,
  });
}

export const GenerateModal = NiceModal.create(() => {
  const modal = useModal();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInput = useRef();
  const toast = useGlobalToast();

  useEffect(() => {
    const handleWorkerResult = (e) => {
      setIsProcessing(false);
      const detail = e.detail;
      if (detail.success) {
        const name = `Daftar Pembayaran ${Date.now()}.docx`;
        downloadBlob(detail.blob, name);
        modal.hide();
      } else {
        toast({
          title: "Error Saat Menghasilkan Dokumen",
          description: detail.error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
    window.addEventListener(workerResultEvent, handleWorkerResult);
    return () =>
      window.removeEventListener(workerResultEvent, handleWorkerResult);
  }, []);

  return (
    <Modal
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hasilkan Dokumen</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Text alignSelf="stretch">File Template</Text>
            <HStack alignSelf="stretch">
              <Input
                flexGrow={1}
                placeholder="File Template Kosong"
                value={file ? file.name : ""}
                isReadOnly
                cursor="pointer"
                onClick={() => fileInput.current.click()}
              />
              <Button as="label" cursor="pointer" htmlFor="fileInput">
                Pilih File
              </Button>
              <VisuallyHiddenInput
                ref={fileInput}
                id="fileInput"
                type="file"
                accept=".docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </HStack>
            <Link isExternal href="/template.docx" alignSelf="end">
              Unduh Contoh Template <ExternalLinkIcon mx={2} />
            </Link>
            <Text alignSelf="start">
              Dokumen akan otomatis terunduh setelah dokumen berhasil
              dihasilkan.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!file}
            isLoading={isProcessing}
            loadingText="Menghasilkan Dokumen"
            colorScheme="pink"
            onClick={() => {
              setIsProcessing(true);
              run(file);
            }}
          >
            Hasilkan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

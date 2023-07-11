import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  CircularProgress,
  HStack,
  Input,
  Link,
  Text,
  VStack,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

export function GenerateTab() {
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  return (
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
          onChange={(e) => setFile(e.target.files[0])}
        />
      </HStack>
      <Link isExternal>
        Unduh Contoh Template <ExternalLinkIcon mx={2} />
      </Link>
      <CircularProgress isIndeterminate />
      <Button colorScheme="pink">Hasilkan</Button>
    </VStack>
  );
}

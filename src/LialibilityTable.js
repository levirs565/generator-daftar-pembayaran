import { Table, Thead, Th, Tr, Tbody, Tfoot } from "@chakra-ui/react";

export function LialibilityTable({ body, footer }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th width={"70%"}>Nama</Th>
          <Th>Nominal</Th>
          <Th width={"40px"}></Th>
        </Tr>
      </Thead>
      <Tbody>{body}</Tbody>
      <Tfoot>{footer}</Tfoot>
    </Table>
  );
}

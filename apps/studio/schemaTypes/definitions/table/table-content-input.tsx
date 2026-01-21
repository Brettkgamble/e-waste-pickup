import { AddIcon } from "@sanity/icons";
import { Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { insert, PatchEvent, setIfMissing, type ArrayInputProps } from "sanity";

const createKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `math-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createMathBlock = () => ({
  _type: "mathBlock",
  _key: createKey(),
  tex: "",
});

export function TableCellContentInput(props: ArrayInputProps) {
  const handleInsertMathBlock = () => {
    props.onChange(
      PatchEvent.from([setIfMissing([]), insert([createMathBlock()], "after", [-1])]),
    );
  };

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="transparent">
        <Flex align="center" gap={3} wrap="wrap">
          <Text size={1} muted>
            Insert math blocks directly into the cell content.
          </Text>
          <Button
            icon={AddIcon}
            mode="ghost"
            text="Add math block"
            tone="primary"
            onClick={handleInsertMathBlock}
          />
        </Flex>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}

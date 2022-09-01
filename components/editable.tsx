import { ButtonGroup, Flex, IconButton, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiAtSign, FiCheck, FiEdit, FiX } from "react-icons/fi";

type EditableProps = {
  value?: string,
  onSave?: (value: string) => Promise<void>,
}

const Editable = ({ value, onSave}: EditableProps) => {
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSave = async () => {
    if (!onSave || !inputRef.current) {
      setEditing(false);
      return;
    }

    setLoading(true);
    await onSave(inputRef.current.value);
    setLoading(false);
    setEditing(false);
  };

  if (isEditing) return <Flex gap={2} align="center">
    <InputGroup variant="filled" size="lg">
      <InputLeftElement pointerEvents='none'><FiAtSign /></InputLeftElement>
      <Input defaultValue={value} ref={inputRef} />
    </InputGroup>

    <ButtonGroup>
      <IconButton
        aria-label="Save"
        icon={<FiCheck />}
        size="lg"
        color="green"
        isLoading={isLoading}
        onClick={handleSave}
      />
      <IconButton
        aria-label="Discard"
        icon={<FiX />}
        size="lg"
        color="red"
        onClick={() => setEditing(false)}
        disabled={isLoading}
      />
    </ButtonGroup>
  </Flex>;

  return <Flex gap={2} align="center">
    <Text fontSize="4xl" pl={4}>@{value}</Text>
    <IconButton
      aria-label="Edit"
      icon={<FiEdit />}
      variant="ghost"
      onClick={() => setEditing(true)}
    />
  </Flex>;
};

export default Editable;
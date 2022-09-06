import { Flex, IconButton, Image, Box, Button, Center, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import DropzoneUploader from "./dropzoneUploader";
import { FiEdit } from "react-icons/fi";

type EditableProps = {
  value?: string | null,
  onSave?: (file: File) => Promise<void>,
}

const EditableAvatar = ({ value, onSave}: EditableProps) => {
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleDrop = async (file: File) => {
    if (!onSave) {
      setEditing(false);
      return;
    }

    setLoading(true);
    await onSave(file);
    setLoading(false);
    setEditing(false);
  };

  if (isLoading) return <Center h={200}>
    <Spinner size="xl" />
  </Center>;

  if (isEditing) return <Box>
    <DropzoneUploader onDrop={handleDrop} />
    <Button onClick={() => setEditing(false)}>Cancel</Button>
  </Box>;

  return <Flex py={4} justifyContent="center">
    <Image
      src={value ? value : '/img/user.png'}
      borderRadius="full"
      boxSize="175px"
      alt="Your Avatar"
    />
    <IconButton
      aria-label="Edit"
      icon={<FiEdit />}
      variant="ghost"
      onClick={() => setEditing(true)}
    />
  </Flex>;
};

export default EditableAvatar;

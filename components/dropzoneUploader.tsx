import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

type DropzoneUploaderProps = {
  onDrop?: (file: File) => void,
}

const DropzoneUploader = ({ onDrop }: DropzoneUploaderProps) => {
  const [error, setError] = useState<string>();
  const onDropAccepted = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setError(undefined);
    if (onDrop) onDrop(file);
  };
  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: {'image/png': [], 'image/jpeg': [], 'image/gif': []},
    multiple: false,
    maxSize: 500000,
    onDropAccepted,
    onDropRejected: (r) => setError(r[0].errors[0].message),
  });

  const borderColor = isDragAccept ? "green" : (isDragReject ? "red" : "white" );

  return <Box>
    <Box {...getRootProps()} borderColor={borderColor} borderWidth={6} borderRadius="lg" borderStyle="dashed" h="12rem" p={8}>
      <input {...getInputProps()} />
      <Text>Drag &apos;n drop an image here, or click to select</Text>
    </Box>
    {error ? <Text color="red">{error}</Text> : null}
  </Box>
}

export default DropzoneUploader;

import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

// interface UploadResponse {
//   // Define the structure of the API response
//   message: string;
//   // Add more properties as needed
// }

const FileUploader: React.FC = () => {
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("pdf", file);
      console.log(file);

      //   try {
      //     const response = await axios.post<UploadResponse>("https://api.example.com/upload", formData, {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     });
      //     console.log("File uploaded successfully:", response.data.message);
      //   } catch (error) {
      //     console.error("Error uploading file:", error);
      //   }
    }
  };

  const options: DropzoneOptions = {
    onDrop,
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(options);

  return (
    <div {...getRootProps({ className: `dropzone ${isDragActive ? "active" : ""}` })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop your PDF document here...</p>
      ) : (
        <p>Drag and drop a PDF doc here, or click to select a PDF doc</p>
      )}
    </div>
  );
};

export default FileUploader;

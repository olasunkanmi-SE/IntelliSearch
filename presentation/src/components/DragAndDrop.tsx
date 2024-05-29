import React, { useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { AppModal } from "./Modal";

export const FileUploader: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [pdf, setPdf] = useState<File>();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const onHideModal = () => {
    setShowModal(false);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file) {
        if (file.type !== "application/pdf") {
          throw new Error("Only PDF files are allowed");
        }
        setPdf(file);
        handleShowModal();
      }
    }
  };

  const options: DropzoneOptions = {
    onDrop,
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(options);

  return (
    <>
      <AppModal show={showModal} onHide={onHideModal} pdfData={pdf} />
      <div {...getRootProps({ className: `dropzone ${isDragActive ? "active" : ""}` })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your PDF document here...</p>
        ) : (
          <p>Drag and drop a PDF doc here, or click to select a PDF doc</p>
        )}
      </div>
    </>
  );
};

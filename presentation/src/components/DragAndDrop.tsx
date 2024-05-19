import React, { useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AppModal } from "./Modal";

export const FileUploader: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [pdf, setPdf] = useState<File>();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const onHideModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = createFormData(file);
      const response = await uploadFileToServer(formData);
      console.log("File uploaded successfully:", response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
        await handleFileUpload(file);
      }
    }
  };

  const createFormData = (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    return formData;
  };

  const uploadFileToServer = async (formData: FormData) => {
    const url = "/embed/documents";
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await axiosPrivate.post(url, formData, { headers });
    return response;
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

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { DropDown } from "./DropDown";
import { IDataItem } from "../interfaces/document.interface";
import { Stack } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { UploadProgress } from "./ProgressBar";

interface IModalProps {
  show: boolean;
  onHide: () => void;
  pdfData?: File;
}
interface IInputInterface {
  author: string;
  title: string;
  documentTypeId: number;
  domainId: number;
}
//pass in the PDF data and append to the form data
export const AppModal: React.FC<IModalProps> = ({ show, onHide, pdfData }: IModalProps) => {
  const axiosPrivate = useAxiosPrivate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDomain, setSelectedDomain] = useState<IDataItem>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDocumentType, setSelectedDocumentType] = useState<IDataItem>();
  const [isSuccess, setIssuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onHide();
  };

  const [formInputData, setFormInputData] = useState({
    documentTitle: "",
    documentType: "",
    domain: "",
    documentAuthor: "",
  });

  const inputMapper = (formData: typeof formInputData): IInputInterface => {
    const { documentAuthor, documentTitle, documentType, domain } = formData;
    return {
      author: documentAuthor,
      title: documentTitle,
      documentTypeId: Number(documentType),
      domainId: Number(domain),
    };
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormInputData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = inputMapper(formInputData);
    console.log({ data });
    uploadFileToServer(data);
  };

  const uploadFileToServer = async (formData: IInputInterface): Promise<unknown> => {
    try {
      setIsLoading(true);
      const url = "/embed/documents";
      const headers = { "Content-Type": "multipart/form-data" };
      const formDataToString = JSON.stringify(formData);
      const response = await axiosPrivate.post(url, { other: formDataToString, pdf: pdfData }, { headers });
      if (response) {
        setIssuccess(response.data.isSuccess);
        if (isSuccess) {
          // Todo: On Success clear the local storage
          //Add cascade to your Document -> Embedding Model in Prisma
          // Fix the data pipeline
          setShowSuccessModal(true);
        } else {
          show = false;
          setIsLoading(false);
          throw Error("Could not save document");
        }
      }
      setIsLoading(false);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleSelectedDomainItem = (itemData: IDataItem) => {
    setSelectedDomain(itemData);
    setFormInputData((prevFormData) => ({ ...prevFormData, domain: itemData.id.toString() }));
  };

  const handleSelectedDocumentTypeItem = (itemData: IDataItem) => {
    setSelectedDocumentType(itemData);
    setFormInputData((prevFormData) => ({ ...prevFormData, documentType: itemData.id.toString() }));
  };

  return (
    <>
      {isLoading ? (
        <UploadProgress apiSuccess={false} />
      ) : (
        <>
          {showSuccessModal ? (
            <Modal show={showSuccessModal} onHide={handleSuccessModalClose}>
              <Modal.Body>
                <p>Upload successful!</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleSuccessModalClose}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
          ) : (
            <Modal show={show} onHide={onHide}>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      placeholder="Document Title"
                      autoFocus
                      name="documentTitle"
                      value={formInputData.documentTitle}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                      type="text"
                      placeholder="Document Author"
                      autoFocus
                      name="documentAuthor"
                      value={formInputData.documentAuthor}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Stack direction="horizontal" gap={3}>
                    <div className="p-2">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label> Type</Form.Label>
                        <DropDown onDataItemSelect={handleSelectedDocumentTypeItem} model="documentType" />
                      </Form.Group>
                    </div>
                    <div className="p-2 ms-auto">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label> Domain </Form.Label>
                        <DropDown onDataItemSelect={handleSelectedDomainItem} model="domain" />
                      </Form.Group>
                    </div>
                  </Stack>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                      Close
                    </Button>
                    <Button type="submit" variant="dark">
                      Save Document
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

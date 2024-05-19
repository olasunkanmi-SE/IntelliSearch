import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { DropDown } from "./DropDown";
import { IDataItem } from "../interfaces/document.interface";
import { Stack } from "react-bootstrap";

interface IModalProps {
  show: boolean;
  onHide: () => void;
  pdfData?: File;
}
//pass in the PDF data and append to the form data
export const AppModal: React.FC<IModalProps> = ({ show, onHide }: IModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDomain, setSelectedDomain] = useState<IDataItem>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDocumentType, setSelectedDocumentType] = useState<IDataItem>();

  const [formInputData, setFormInputData] = useState({
    documentTitle: "",
    documentType: "",
    domain: "",
    documentAuthor: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormInputData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form data:", formInputData);
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
    //how do I increase the opacity of the modal background
  );
};

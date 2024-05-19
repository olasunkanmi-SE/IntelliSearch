import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IDataItem } from "../interfaces/document.interface";

interface IBookProps {
  onDataItemSelect: (data: IDataItem) => void;
  model: string;
}

function Books({ onDataItemSelect, model }: Readonly<IBookProps>) {
  const axiosPrivate = useAxiosPrivate();
  const [selectedDataItems, setSelectedDataItems] = useState<string>("Select Book");
  const [dataItems, setDataItems] = useState<IDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch (model) {
          case "document":
            response = await axiosPrivate.get("/documents");
            break;
          case "documentType":
            response = await axiosPrivate.get("/documents");
            break;
          case "domain":
            response = await axiosPrivate.get("/documents");
            break;
          default:
            break;
        }
        setDataItems(response?.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSelect = async (eventKey: string | null) => {
    if (eventKey) {
      setSelectedDataItems(eventKey);
      const selectedBookData = dataItems.find((book: { title: string }) => book.title === eventKey);
      if (selectedBookData) {
        onDataItemSelect(selectedBookData);
      }
    }
  };
  try {
    return (
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          {selectedDataItems}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {dataItems?.map((document: { title: string; id: number }) => (
            <Dropdown.Item eventKey={document.title} key={document.id}>
              {document.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  } catch (error) {
    console.error(error);
  }
}

export default Books;

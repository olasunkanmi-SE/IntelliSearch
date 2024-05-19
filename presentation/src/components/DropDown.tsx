import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IDataItem } from "../interfaces/document.interface";
import { getLocalStorageData, setLocalStorageData } from "../utils";

interface IBookProps {
  onDataItemSelect: (data: IDataItem) => void;
  model: string;
}

function Books({ onDataItemSelect, model }: Readonly<IBookProps>) {
  const axiosPrivate = useAxiosPrivate();
  const [selectedDataItems, setSelectedDataItems] = useState<string>("Select Book");
  const [dataItems, setDataItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storageData = getLocalStorageData(`key-${model}`, true);
        if (!storageData) {
          const apiData = await getDataItems(model);
          setDataItems(apiData);
          setLocalStorageData(`key-${model}`, JSON.stringify(apiData), true);
        } else {
          setDataItems(JSON.parse(storageData));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDataItems = async (model: string): Promise<any> => {
    const response = await axiosPrivate.get(`/${model}`);
    return response ? response.data.data : [];
  };

  const handleSelect = async (eventKey: string | null) => {
    if (eventKey) {
      setSelectedDataItems(eventKey);
      const selectedItemData = dataItems.find((item: { title: string }) => item.title === eventKey);
      if (selectedItemData) {
        onDataItemSelect(selectedItemData);
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

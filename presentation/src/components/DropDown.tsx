import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IDataItem } from "../interfaces/document.interface";
import { capitalizeFirstLetter, getLocalStorageData, setLocalStorageData } from "../utils";
import { MODEL_URLS, MODELS } from "../constants";

interface IBookProps {
  onDataItemSelect: (data: IDataItem) => void;
  model: string;
}

export const DropDown = ({ onDataItemSelect, model }: Readonly<IBookProps>) => {
  const axiosPrivate = useAxiosPrivate();
  const prompt = model === MODELS.document ? "Select Book" : "Select";
  const [selectedDataItems, setSelectedDataItems] = useState<string>(prompt);
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

  // Todo To truly decouple this drop down, pass in the modelUrls as props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDataItems = async (model: string): Promise<any> => {
    let url = "";
    const models = Object.keys(MODEL_URLS);
    if (models.includes(model)) {
      if (model === MODELS.document) {
        url = MODEL_URLS.document;
      }
      if (model === MODELS.domain) {
        url = MODEL_URLS.domain;
      }
      if (model === MODELS.documentType) {
        url = MODEL_URLS.documentType;
      }
    }
    const response = await axiosPrivate.get(url);
    return response ? response.data.data : [];
  };

  const handleSelect = async (eventKey: string | null) => {
    if (eventKey) {
      setSelectedDataItems(eventKey);
      let selectedItemData;
      if (model === MODELS.document) {
        selectedItemData = dataItems.find((item: { title: string }) => item.title === eventKey);
      } else {
        selectedItemData = dataItems.find((item: { name: string }) => item.name === eventKey);
      }
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
          {dataItems?.map((document: { title: string; name: string; id: number }) =>
            model === MODELS.document ? (
              <Dropdown.Item eventKey={document.title} key={document.id}>
                {capitalizeFirstLetter(document.title.toLocaleUpperCase())}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item eventKey={document.name} key={document.id}>
                {capitalizeFirstLetter(document.name)}
              </Dropdown.Item>
            )
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  } catch (error) {
    console.error(error);
  }
};

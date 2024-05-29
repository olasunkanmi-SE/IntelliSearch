import cryptoJs from "crypto-js";

export const formatText = (text: string) => {
  const paragraphs = text.split("**");
  let formattedText = "";

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    if (i % 2 === 0) {
      formattedText += `<p>${paragraph}</p>`;
    } else {
      const boldText = paragraph;
      formattedText += `<p><b>${boldText}</b> `;
    }
  }
  return formattedText.replace(/\*/g, "");
};

export const formatCodeBlocks = (text: string) => {
  const regex = /```([^`]+)```/g;
  return text.replace(regex, (_, context) => {
    return `<pre><code>${context}</code></pre>`;
  });
};

export const setLocalStorageData = (key: string, value: string, encrypt: boolean) => {
  try {
    if (encrypt) {
      const encryptedText = cryptoJs.AES.encrypt(value, import.meta.env.VITE_SECRET);
      if (encryptedText) {
        localStorage.setItem(key, encryptedText.toString());
      }
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.log("Error while saving user Data", error);
  }
};

export const getLocalStorageData = (key: string, decrypt: boolean) => {
  try {
    const value = localStorage.getItem(key);
    if (value && decrypt) {
      const decryptedText = cryptoJs.AES.decrypt(value, import.meta.env.VITE_SECRET);
      return decryptedText.toString(cryptoJs.enc.Utf8);
    }
    return value;
  } catch (error) {
    console.log("Error while getting user data", error);
  }
};

export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

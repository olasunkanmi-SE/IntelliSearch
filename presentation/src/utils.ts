export const formatText = (text: string) => {
  const paragraphs = text.split("**");
  let formattedText = "";

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    if (i % 2 === 0) {
      formattedText += `<p>${paragraph}</p>`;
    } else {
      const startIndex = paragraph.indexOf(" ");
      const boldText = paragraph.substring(0, startIndex);
      const restOfParagraph = paragraph.substring(startIndex).trim();
      formattedText += `<p><b>${boldText}</b> ${restOfParagraph}</p>`;
    }
  }
  return formattedText.replace(/\*/g, "");
};

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

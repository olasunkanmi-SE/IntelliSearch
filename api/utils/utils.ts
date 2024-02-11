export class Utility {
  static readonly formatText = (text: string) => {
    const formattedText = text
      .replace(/(\*|_)/g, " ")
      .replace(/\[.*?\]/g, "")
      .replace(/<.*?>/g, "")
      .replace(/\n/g, " ");
    const lowercaseText = formattedText.toLowerCase();
    const stopWords = [
      "a",
      "an",
      "and",
      "are",
      "as",
      "at",
      "be",
      "but",
      "by",
      "for",
      "if",
      "in",
      "into",
      "is",
      "it",
      "no",
      "not",
      "of",
      "on",
      "or",
      "such",
      "that",
      "the",
      "their",
      "there",
      "these",
      "they",
      "this",
      "to",
      "was",
      "will",
      "with",
    ];
    const words = lowercaseText.split(" ");
    const filteredWords = words.filter((word) => !stopWords.includes(word));
    const preprocessedText = filteredWords.join(" ");
    return preprocessedText;
  };
}

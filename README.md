

<img width="1222" alt="Retrieval Augmented Generator project, intellisearch by Oyinlola Olasunkanmi Raymond" src="https://github.com/olasunkanmi-SE/IntelliSearch/assets/60177090/7eb9f525-b603-49f1-867c-197449e4bd88">

# IntelliSearch

IntelliSearch is an advanced retrieval-based question-answering and recommendation system that leverages embeddings and a large language model (LLM) to provide accurate and relevant information to users. With its intelligent search capabilities and future recommendation features, IntelliSearch aims to be a comprehensive solution for extracting knowledge and discovering personalized content from a vast corpus of documents.

## Features

- Intelligent search capabilities powered by embeddings and cosine similarity
- Integration with a state-of-the-art large language model (LLM) for generating high-quality embeddings
- Efficient storage and retrieval of document embeddings using a vector database
- Metadata enrichment of documents and embeddings for enhanced categorization and filtering
- Scalable architecture to handle large volumes of documents and queries
- User-centric design focusing on delivering accurate and relevant answers
- Extensible framework for incorporating additional features and improvements
- Future recommendation capabilities for personalized content discovery

## Architecture Overview

IntelliSearch consists of the following key components:

1. **Document Ingestion**: Documents are processed, chunked, and stored in the database along with their metadata. Embeddings are generated for each chunk using the LLM.

2. **Embedding Generation**: The LLM generates high-quality embeddings for documents, queries, and user profiles, capturing their semantic meaning and enabling efficient similarity search and recommendation.

3. **Vector Database**: Document embeddings are stored in a vector database optimized for fast similarity search operations, allowing for quick retrieval of relevant documents.

4. **Intelligent Search**: User queries are transformed into embeddings and used to perform a cosine similarity search against the document embeddings in the vector database. The most relevant document chunks are retrieved based on their similarity scores.

5. **Metadata Enrichment**: Documents and embeddings are enriched with metadata such as document type, domain, source, author, and more. This metadata facilitates advanced categorization, filtering, and analysis of search results.

6. **Ranking and Aggregation**: Retrieved document chunks are ranked based on their relevance scores and aggregated to provide a comprehensive and coherent answer to the user's question.

7. **Recommendation Engine (Future)**: IntelliSearch will incorporate a recommendation engine that analyzes user profiles, preferences, and interactions to provide personalized content recommendations. By leveraging embeddings and similarity measures, the system will suggest documents, articles, or other content that aligns with the user's interests.

## Getting Started

To get started with IntelliSearch, follow these steps:

1. Clone the repository:
   https://github.com/olasunkanmi-SE/IntelliSearch
   
2. Install the required dependencies:
   npm i
   
3. Configure the necessary environment variables for database connection and LLM integration.

4. Run the database migrations: Check the package.json file for more info

5. Start the application: npm run start:dev

For detailed installation instructions, configuration options, and usage guidelines, please refer to the [documentation](docs/README.md).

## Roadmap

- [x] Intelligent question-and-answer capabilities
- [x] Integration with a large language model (LLM)
- [x] Efficient storage and retrieval of document embeddings
- [ ] Metadata enrichment for enhanced categorization and filtering
- [ ] Recommendation engine for personalized content discovery
- [ ] User profile management and preference settings
- [ ] Integration with external data sources and APIs
- [ ] Advanced analytics and insights on user interactions and content performance
- [ ] Caching search results to avoid redundant queries

## Contributing

We welcome contributions to enhance IntelliSearch and make it even more powerful. If you encounter any issues, have suggestions for improvements, or want to add new features, please open an issue or submit a pull request. Let's collaborate and make IntelliSearch the go-to solution for intelligent question answering and content recommendation!

## Architecture
<img width="1222" alt="Retrieval Augmented Generator project, intellisearch by Oyinlola Olasunkanmi Raymond" src="https://github.com/olasunkanmi-SE/Vectorized-Intelligence/assets/60177090/d1f6495d-8245-400b-ba20-a520c7200950">


Knowledge Base: 
This is the collection of documents or data sources that the system will use to answer questions.
Chunking: The documents are broken down into smaller chunks or passages using a specified chunking method.
Embedding Model: An embedding model is used to convert the document chunks into dense vector representations (embeddings).
Knowledge Base as Vector Database: The embeddings of the document chunks are stored in a vector database, which allows efficient similarity search.
In Production:

Retriever:
User Query: The user provides a natural language query.
Reformulate User Query: The user query may be reformulated or rephrased to improve retrieval performance.
Embedding Model: The same embedding model is used to convert the user query into a vector representation.
Find Closest Documents: The vector database is searched to find the top k most similar document chunks to the embedded user query. This step may optionally use metadata in the search.

Reader:
Top k Similar Documents: The top k most relevant document chunks are retrieved from the vector database.
Context: The contents of these document chunks are post-processed and aggregated into a context. This may involve techniques like prompt compression or reranking.
LLM Prompt: A prompt is constructed based on the user query and the generated context.
LLM (Large Language Model): The prompt is fed into a large language model, which generates an answer.
Verify Generation (Optional): The generated answer may be verified or further processed before returning it to the user.
LLM Answer: The final answer is provided to the user.

<img width="1222" alt="RAG_workflow" src="https://github.com/olasunkanmi-SE/Vectorized-Intelligence/assets/60177090/d1f6495d-8245-400b-ba20-a520c7200950">

<img width="1222" alt="multistep reasoning llm agents by Olasunkanmi Oyinlola" src="https://github.com/olasunkanmi-SE/Vectorized-Intelligence/assets/60177090/364a6174-8e2a-4fee-9ba3-bc8d4d8344b4">

import { database } from "..";
import { products } from "../core/products";

export class GenericSQLRepository {
  insertDocument = async (content: string, embedding: string) => {
    try {
      const result = await database.client.query(
        `INSERT INTO documents (content, embedding)
        VALUES ($1, $2)`,
        [JSON.stringify(content), embedding]
      );
      if (!result) {
        throw new Error("Unable to insert embeddings into the DB");
      }
      return result;
    } catch (error) {
      console.error("Error inserting document into DB", error);
    }
  };

  createDocumentTable = async () => {
    try {
      const result = await database.client.query(
        `
    CREATE TABLE IF NOT EXISTS documents (
      id bigserial PRIMARY KEY,
      content text,
      embedding vector(768)
    );
  `
      );
      if (!result) {
        throw new Error("Unable to create the document table");
      }
      return result;
    } catch (error) {
      console.error("Unable to create the document table", error);
    }
  };

  createVectorExtension = async () => {
    try {
      const result = await database.client.query(`CREATE EXTENSION IF NOT EXISTS vector`);
      if (!result) {
        throw new Error("Error creating vector extension");
      }
    } catch (error) {
      console.error("Error creating vector extension", error);
    }
  };

  createIvfflatIndex = async () => {
    try {
      await database.client.query(`
      CREATE INDEX IF NOT EXISTS items_embedding_ivfflat_index
      ON documents
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
      `);
    } catch (error) {
      console.error("Error setting index on documents", error);
    }
  };

  checkDocumentsExists = async (): Promise<boolean> => {
    let exists = false;
    try {
      const result = await database.client.query(`SELECT * from documents LIMIT 1`);
      if (result.rowCount > 0) {
        exists = true;
      }
      return exists;
    } catch (error) {
      console.error("Error occured while query for documents", error);
    }
  };

  createProductTable = async () => {
    try {
      const result = await database.client.query(
        `
        CREATE TABLE IF NOT EXISTS Products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        amount_sold VARCHAR(50) NOT NULL,
        country_of_origin VARCHAR(100) NOT NULL 
          );`
      );
      if (!result) {
        throw new Error("Unable to create the document table");
      }
      return result;
    } catch (error) {
      console.error("Unable to create the document table", error);
      throw error;
    }
  };

  createReviewTable = async () => {
    try {
      const result = await database.client.query(
        `
        CREATE TABLE IF NOT EXISTS Reviews (
        review_id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        author VARCHAR(100) NOT NULL,
        rating INT NOT NULL,
        review TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
          );`
      );
      if (!result) {
        throw new Error("Unable to create the document table");
      }
      return result;
    } catch (error) {
      console.error("Unable to create the document table", error);
    }
  };

  insertIntoProduct = async (name: string, description: string, amountSold: number, countryOfOrigin: string) => {
    try {
      const result = await database.client.query(
        `INSERT INTO products (name, description, amount_sold, country_of_origin)
        VALUES ($1, $2, $3, $4)`,
        [name, description, amountSold, countryOfOrigin]
      );
      if (!result) {
        throw new Error("Unable to insert product into the DB");
      }
      return result;
    } catch (error) {
      console.error("Error inserting product into DB", error);
    }
  };

  InsertIntoReview = async (product_id: number, author: string, rating: number, review: string) => {
    try {
      const result = await database.client.query(
        `INSERT INTO reviews (product_id, author, rating, review)
        VALUES ($1, $2, $3, $4)`,
        [product_id, author, rating, review]
      );
      if (!result) {
        throw new Error("Unable to insert embeddings into the DB");
      }
      return result;
    } catch (error) {
      console.error("Error inserting document into DB", error);
    }
  };

  createProductsAndReviews = async () => {
    try {
      const productsToInsert: Partial<IProduct>[] = [...products];
      let mappedProducts: Partial<IProduct>[] = [];
      if (productsToInsert?.length) {
        mappedProducts = productsToInsert.map(
          ({ name, description, amount_sold, country_of_origin }: Partial<IProduct>) => {
            return {
              name,
              description,
              amount_sold,
              country_of_origin,
            };
          }
        );
      }
      const reviewsToInsert: IReview[] = productsToInsert.flatMap((product) => product.reviews);
      await database.client.query("BEGIN");
      this.createProductTable();
      this.createReviewTable();
      const productPromises = mappedProducts.map(
        ({ name, description, amount_sold, country_of_origin }: Partial<IProduct>) => {
          this.insertIntoProduct(name, description, amount_sold, country_of_origin);
        }
      );
      const reviewPromises = reviewsToInsert.map(({ product_id, author, rating, review }: IReview) => {
        this.InsertIntoReview(product_id, author, rating, review);
      });
      await Promise.all(reviewPromises);
      await Promise.all(productPromises);
      await database.client.query("COMMIT");
    } catch (error) {
      await database.client.query("ROLLBACK");
      console.error("Error inserting products into DB", error);
      throw error;
    }
  };
}

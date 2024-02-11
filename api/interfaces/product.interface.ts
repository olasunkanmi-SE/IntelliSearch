interface IProduct {
  product_id?: number;
  name: string;
  description: string;
  amount_sold: number;
  country_of_origin: string;
  reviews?: IReview[];
}

interface IReview {
  review_id?: number;
  product_id: number;
  author: string;
  rating: number;
  review: string;
}

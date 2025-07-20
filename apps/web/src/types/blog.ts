export type BlogCategory = {
  _id: string;
  name: string;
  slug: string | { current: string };
};

export type Blog = {
  _type: "blog";
  _id: string;
  title: string;
  description: string | null;
  slug: string | { current: string };
  richText: any | null; // Replace 'any' with your RichText type if available
  orderRank: string | null;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  };
  publishedAt?: string | null;
  authors?: Array<{
    _id: string;
    name: string;
    position?: string;
    image?: any;
  }>;
  categories?: BlogCategory[];
};

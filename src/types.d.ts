declare type MongooseDocument = import("mongoose").Document;

interface BlogPost extends MongooseDocument {
  _id: ?string;
  title: string;
  slug: string;
  mainImage: string;
  description: string;
  body: string;
  publish: boolean;
  tags: Tag[];
}

type PartialBlogPost = Partial<BlogPost>;

interface Tag extends MongooseDocument {
  _id: ?string;
  name: string;
}

type PartialTag = Partial<Tag>;

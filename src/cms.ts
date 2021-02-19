import { connectDB, BlogPostModel, TagModel } from "@cms/models";
import mongoose from "mongoose";

function setAttrs(obj: any, fields: any) {
  return Object.entries(fields).forEach(([key, val]) => {
    obj[key] = val;
  });
}

interface CMSConfig {
  mongoUser: string;
  mongoPassword: string;
  mongoHost: string;
  mongoPort: number;
}

export class CMS {
  config: CMSConfig;
  blogpost: BlogPostResource;
  tag: TagResource;

  constructor(config: CMSConfig) {
    const blogpostCRUD = new CMSCRUD<BlogPost>(BlogPostModel);
    const tagCRUD = new CMSCRUD<Tag>(TagModel);
    const blogPostResource = new BlogPostResource(blogpostCRUD);
    const tagResource = new TagResource(tagCRUD);

    this.config = config;
    this.blogpost = blogPostResource;
    this.tag = tagResource;
  }

  async init() {
    // Connect to mongo
    await connectDB(
      this.config.mongoUser,
      this.config.mongoPassword,
      this.config.mongoHost,
      this.config.mongoPort
    );
  }
}

type Model<T extends mongoose.Document> = mongoose.Model<T>;

class CMSCRUD<T extends mongoose.Document> {
  private _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async get(populateFields: string[] = []) {
    const res = this._model.find();
    // Populate fields
    populateFields.forEach((field) => res.populate(field));
    return await res;
  }

  async getById(id: string, populateFields: string[] = []) {
    const res = this._model.findById(id);
    // Populate fields
    populateFields.forEach((field) => res.populate(field));
    return await res;
  }

  async create(obj: Partial<T>) {
    return await this._model.create(obj);
  }

  async update(id: string, fields: Partial<T>) {
    const obj = await this._model.findById(id);
    if (obj === null) throw Error("Object not found.");
    setAttrs(obj, fields);
    return await obj.save();
  }
}

interface Resource<T extends mongoose.Document> {
  crud: CMSCRUD<T>;
}

class BlogPostResource implements Resource<BlogPost> {
  crud: CMSCRUD<BlogPost>;

  constructor(crud: CMSCRUD<BlogPost>) {
    this.crud = crud;
  }
}

class TagResource implements Resource<Tag> {
  crud: CMSCRUD<Tag>;

  constructor(crud: CMSCRUD<Tag>) {
    this.crud = crud;
  }
}

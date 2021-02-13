import { connectDB, BlogPostModel, TagModel } from "models";

function setAttrs(obj: any, fields: any) {
  return Object.entries(fields).forEach(([key, val]) => {
    obj[key] = val;
  });
}

interface CMSConfig {
  mongoUser: string;
  mongoPassword: string;
  mongoHost: string;
}

class CMS {
  config: CMSConfig;

  constructor(config: CMSConfig) {
    this.config = config;
  }

  async init() {
    // Connect to mongo
    await connectDB(
      this.config.mongoUser,
      this.config.mongoPassword,
      this.config.mongoHost
    );
  }

  async createBlogPost(title: string): Promise<BlogPost> {
    return await BlogPostModel.create({ title });
  }

  async updateBlogPost(id: string, fields: PartialBlogPost): Promise<BlogPost> {
    const blogPost = await BlogPostModel.findById(id);
    setAttrs(blogPost, fields);
    return await blogPost.save();
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await BlogPostModel.find().populate("tags");
  }

  async createTag(name: string): Promise<BlogPost> {
    return await TagModel.create({ name });
  }

  async getTags(): Promise<BlogPost[]> {
    return await TagModel.find();
  }

  async updateTag(id: string, fields: PartialTag): Promise<BlogPost> {
    const tag = await TagModel.findById(id);
    setAttrs(tag, fields);
    return await tag.save();
  }
}

export default CMS;

import mongoose, { Schema } from "mongoose";

export function connectDB(user: string, password: string, host: string) {
  return mongoose.connect(
    `mongodb://${user}:${password}@${host}:27017/main?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

const blogPostShema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    description: { type: String, default: "" },
    body: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    publish: { type: Boolean, default: false },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

export const BlogPostModel =
  mongoose.models.BlogPost ||
  mongoose.model<BlogPost>("BlogPost", blogPostShema);

const tagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const TagModel =
  mongoose.models.Tag || mongoose.model<Tag>("Tag", tagSchema);

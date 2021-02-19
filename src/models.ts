import mongoose, { Schema } from "mongoose";

export function connectDB(
  user: string,
  password: string,
  host: string,
  port: number
) {
  return mongoose.connect(
    `mongodb://${user}:${password}@${host}:${port}/main?authSource=admin`,
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

export const BlogPostModel: mongoose.Model<BlogPost> = mongoose.model(
  "BlogPost",
  blogPostShema
);

const tagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const TagModel: mongoose.Model<Tag> = mongoose.model("Tag", tagSchema);

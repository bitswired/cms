import { CMS } from "@cms/cms";
import mongoose from "mongoose";
import { expect } from "chai";

const cms = new CMS({
  mongoUser: process.env.MONGO_ROOT_USER as string,
  mongoPassword: process.env.MONGO_ROOT_PASSWORD as string,
  mongoHost: process.env.MONGO_HOST as string,
});

describe("CMS class test", () => {
  before(async () => {
    try {
      await cms.init();
    } catch (err) {
      console.log(err);
    }
  });

  afterEach(async () => {
    try {
      await mongoose.connection.dropDatabase();
    } catch (err) {
      console.log(err);
    }
  });

  it("creates a blog post", async () => {
    await cms.blogpost.crud.create({ title: "Test" });
    const res = await cms.blogpost.crud.get();
    expect(res[0]).to.have.property("title", "Test");
  });

  it("creates a tag", async () => {
    await cms.tag.crud.create({ name: "TypeScript" });
    const res = await cms.tag.crud.get();
    expect(res[0]).to.have.property("name", "TypeScript");
  });

  it("updates a tag", async () => {
    let tag = await cms.tag.crud.create({ name: "TypeScript" });

    tag = await cms.tag.crud.update(tag!._id!, { name: "Python" });
    const res = await cms.tag.crud.get();

    expect(res[0]).to.have.property("name", "Python");
  });

  it("creates a blog with tags", async () => {
    let tag1 = await cms.tag.crud.create({ name: "TypeScript" });
    let tag2 = await cms.tag.crud.create({ name: "Python" });
    let blogPost = await cms.blogpost.crud.create({ title: "A Blog Post" });

    blogPost = await cms.blogpost.crud.update(blogPost._id!, {
      tags: [tag1._id, tag2._id] as any,
    });

    const res = await cms.blogpost.crud.get();
    expect(res[0].tags[0]).to.have.deep.property("name", "TypeScript");
    expect(res[0].tags[1]).to.have.deep.property("name", "Python");
  });
});

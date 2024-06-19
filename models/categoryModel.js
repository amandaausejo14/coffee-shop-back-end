import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CategoryShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be blank"],
    },
  },
  { timestamps: true },
);

const Category = model("Category", CategoryShema);

export default Category;

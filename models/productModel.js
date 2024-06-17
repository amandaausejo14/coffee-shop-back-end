import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProductShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be blank"],
    },
    price: {
      type: Number,
      required: [true, "Price can't be blank"],
    },
    picture: {
      type: String,
      required: [true, "Picture URL can't be blank"],
    },
    description: {
      type: String,
      required: [true, "Decription can't be blank"],
    },
  },
  { timestamps: true },
);

const Product = model("Product", ProductShema);

export default Product;

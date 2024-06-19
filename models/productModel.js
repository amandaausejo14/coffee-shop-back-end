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
    description: {
      type: String,
      required: [true, "Decription can't be blank"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category can't be blank"],
    },
    image: {
      type: String,
      required: [true, "image URL can't be blank"],
    },
  },
  { timestamps: true },
);

const Product = model("Product", ProductShema);

export default Product;

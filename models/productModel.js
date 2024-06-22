import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PackageQuantitySchema = new Schema({
  value: {
    type: Number,
    required: [true, "Package quantity value can't be blank"],
  },
  unit: {
    type: String,
    enum: ["G", "KG"],
    required: [true, "Package quantity unit can't be blank"],
  },
});

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
    country_of_origin: {
      type: String,
      required: [true, "Country of origin can't be blank"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category can't be blank"],
    },
    image: {
      type: String,
      required: [true, "image URL can't be blank"],
    },
    package_quantity: {
      type: PackageQuantitySchema,
      required: [true, "Package quantity can't be blank"],
    },
    stock_quantity: {
      type: Number,
      required: [true, "Stock quantity can't be blank"],
    },
  },
  { timestamps: true },
);

const Product = model("Product", ProductShema);

export default Product;

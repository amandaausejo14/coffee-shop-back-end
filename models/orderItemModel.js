import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderItemShema = new Schema(
  {
    quantity: {
      type: Number,
      required: [true, "Name can't be blank"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Name can't be blank"],
    },
  },
  { timestamps: true },
);

const OrderItem = model("OrderItem", OrderItemShema);

export default OrderItem;

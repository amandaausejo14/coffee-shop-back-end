import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderShema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        id: { type: String },
        quantity: { type: Number },
      },
    ],
    totalPrice: {
      type: Number,
    },
    shipping_info: {
      type: Object,
      required: [true],
    },
    delivery_status: {
      type: String,
      required: true,
      default: "Pending",
    },
    payment_status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = model("Order", OrderShema);

export default Order;

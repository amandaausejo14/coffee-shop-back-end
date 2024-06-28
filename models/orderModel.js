import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderShema = new Schema(
  {
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    phone_number: {
      type: String,
      default: "",
      required: [true, "Name can't be blank"],
    },
    street: {
      type: String,
      default: "",
      required: [true, "Name can't be blank"],
    },
    house_number: {
      type: String,
      default: "",
      required: [true, "Name can't be blank"],
    },
    city: {
      type: String,
      default: "",
      required: [true, "Name can't be blank"],
    },
    zip: {
      type: String,
      default: "",
      required: [true, "Name can't be blank"],
    },
    country: {
      type: String,
      default: "",
      required: [true, "Name can't be blank"],
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    totalPrice: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Order = model("Order", OrderShema);

export default Order;

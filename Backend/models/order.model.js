import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product", // if you have a product model
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "Esewa", "Khalti", "Stripe"],
      required: true,
    },
    payment: { type: Boolean, default: false },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;


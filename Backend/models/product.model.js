import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  sizes: { type: Array, required: true },
  quantity: { type: Number, default: 0 },   
  inStock: { type: Boolean, default: true }, // auto-updated from quantity
  date: { type: Number, required: true },
},{ timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

productSchema.pre("save", function (next) {
  this.inStock = this.quantity > 0;
  next();
});


export default productModel;

// models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {   
    type: String, 
    required: [true, "shemsu"],
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 0,
  },
  price: { 
    type: Number, 
    required: true, 
    default: 0,
  },
  Image: {
    type: String,
    required: false,
  }
}, 
{ 
  timestamps: true 
});

const Product = mongoose.model("Product", productSchema);

// Use default export
export default Product;

import express from "express";
import Product from "../models/productModel.js";
const router = express.Router();
import mongoose from "mongoose";
//get all product
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//post product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, picture } = req.body;
    if ((!name, !price, !description, !picture)) {
      return res.status(400).json("You must name, price and description of the product");
    }

    const newProduct = new Product({
      name: name,
      price: price,
      description: description,
      picture: picture,
    });
    const createdProduct = await newProduct.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//put product
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id");
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      picture: req.body.picture,
    },
    {
      new: true,
    },
  );
  if (!product) {
    return res.status(500).send("Product cant be updated");
  }
  res.send(product);
});

//delete the product
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id");
  }
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `The Post ID${req.params.id} was erased from database`,
    });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});
export default router;

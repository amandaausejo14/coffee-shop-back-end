import express from "express";
import Product from "../models/productModel.js";
const router = express.Router();
import mongoose from "mongoose";
import multer from "multer";
import Category from "../models/categoryModel.js";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// to store all the img in our database
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    console.log(`isvA` + isValid);
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    //making the name of the file unique
    //  console.log(file);
    const fileName = file.originalname.replace(/ /g, "-");
    // console.log(`filename` + fileName);
    const extension = FILE_TYPE_MAP[file.mimetype]; //watched what is the image type and checks if its present inside the file type map
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

//get all product
router.get("/", async (req, res) => {
  //filter products based on categories
  let filter = {};
  if (req.query.caterories) {
    filter = { catery: req.query.caterories };
  }
  try {
    const products = await Product.find(filter).populate("category");
    return res.status(200).json(products);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    return res.status(200).json(product);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//post product
router.post("/", upload.single("image"), async (req, res) => {
  const isValidCategory = await Category.findById(req.body.category);
  if (!isValidCategory) {
    res.status(404).send(`No category found with the ID-${req.body.category}`);
  }
  try {
    const { name, price, description } = req.body;
    const file = req.file;
    if ((!name, !price, !description, !file)) {
      return res.status(400).json("You must name, price, description and image file of the product");
    }
    //we need the whole http:// adress URL for the front end to be able to see the image
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    const newProduct = new Product({
      name: name,
      price: price,
      description: description,
      image: `${basePath}${fileName}`,
      category: req.body.category,
    });
    const createdProduct = await newProduct.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
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
      image: req.body.image,
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
router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id");
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `The Product ID${req.params.id} was erased from database`,
    });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});
export default router;

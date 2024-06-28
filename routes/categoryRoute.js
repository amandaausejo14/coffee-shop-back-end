import express from "express";
import Category from "../models/categoryModel.js";
const router = express.Router();

//get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// //get single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(500).send(`No category found with the ID-${req.params.id}`);
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//post new category
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json("You must insert a name for the category");
  }

  try {
    const existingCategory = await Category.findOne({ name: name });

    if (existingCategory) {
      return res.status(400).json("There is already a category with that name.");
    }

    const newCategoty = new Category({
      name: name,
    });
    const createCategory = await newCategoty.save();
    return res.status(201).json(createCategory);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//update category
router.put("/:id", async (req, res) => {
  const updatedcategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    },
  );
  if (!updatedcategory) {
    return res.status(500).send("Category cant be updated");
  }
  res.send(updatedcategory);
});

//delete category
router.delete("/:id", async (req, res) => {
  const isValid = await Category.findById(req.params.id);
  if (!isValid) {
    res.status(404).send(`No category found with the ID-${req.params.id}`);
  }
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `The category ID-${req.params.id} was erased from database`,
    });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});
export default router;

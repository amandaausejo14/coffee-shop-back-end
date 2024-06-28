import express from "express";
import Order from "../models/orderModel.js";
const router = express.Router();
import OrderItem from "../models/orderItemModel.js";
import { controlAuthorization } from "../helpers/authHelpers.js";
//get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "user_name email").sort({ createdAt: -1 });
    if (!orders) {
      res.status(500).send("orders not found");
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

// //get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "user_name email")
      .populate("orderItems", "-createdAt -updatedAt")
      .populate({ path: "orderItems", populate: { path: "product", populate: "category" } });
    if (!order) {
      res.status(500).send(`No Order found with the ID-${req.params.id}`);
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//post new order
router.post("/", controlAuthorization, async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (item) => {
      let newOrderItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem;
    }),
  );
  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (itemId) => {
      const orderItemId = await OrderItem.findById(itemId).populate("product", "price");
      const totalPrice = orderItemId.product.price * orderItemId.quantity;
      return totalPrice;
    }),
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  console.log(totalPrice);
  try {
    const newOrder = new Order({
      orderItems: orderItemsIdsResolved,
      street: req.body.street,
      house_number: req.body.house_number,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone_number: req.body.phone_number,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });
    const createOrder = await newOrder.save();
    return res.status(201).json(createOrder);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});

//update category
// router.put("/:id", async (req, res) => {
//   const updatedcategory = await Category.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//     },
//     {
//       new: true,
//     },
//   );
//   if (!updatedcategory) {
//     return res.status(500).send("Category cant be updated");
//   }
//   res.send(updatedcategory);
// });

//delete order
router.delete("/:id", controlAuthorization, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).send(`No Order found with the ID-${req.params.id}`);
  }
  const items = order.orderItems;
  try {
    await Promise.all(items.map((item) => OrderItem.findByIdAndDelete(item)));
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: `The Order ID-${req.params.id} was erased from database`,
    });
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
});
export default router;

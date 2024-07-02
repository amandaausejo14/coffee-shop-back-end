import express from "express";
import Stripe from "stripe";
const router = express.Router();
const { CLIENT_URL, STRIPE_KEY } = process.env;
const stripe = Stripe(STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const line_items = req.body.items.map((item) => {
    //console.log(item.quantity);
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          images: [item.product.image],
          metadata: {
            id: item.product._id,
          },
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    };
  });

  // console.log(line_items);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${CLIENT_URL}/checkout-success`,
      cancel_url: `${CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.log(error);
  }
});

export default router;

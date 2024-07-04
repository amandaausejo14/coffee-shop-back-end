import express from "express";
import Stripe from "stripe";
import Order from "../models/orderModel.js";
const router = express.Router();
const { CLIENT_URL, STRIPE_KEY, END_POINT_SECRET } = process.env;
const stripe = Stripe(STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(
        req.body.items.map((item) => ({
          id: item.product._id,
          quantity: item.quantity,
        })),
      ),
    },
  });
  const line_items = req.body.items.map((item) => {
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

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "FR", "DE", "IT", "PL"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "eur",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
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

//Stripe Webhook
const createOrder = async (customer, data) => {
  const items = JSON.parse(customer.metadata.cart);
  const newOrder = new Order({
    userId: customer.metadata.userId,
    orderItems: items,
    totalPrice: data.amount_total,
    shipping_info: data.customer_details,
    payment_status: data.payment_status,
  });
  try {
    const savedOrder = await newOrder.save();

    console.log(`Processed`, savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
endpointSecret = END_POINT_SECRET;

router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let data;
  let eventType;
  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("webhook verified");
    } catch (err) {
      console.log(`webhook error,  ${err.message} `);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    const parsedBody = JSON.parse(req.body.toString("utf8"));
    data = parsedBody.data.object;
    eventType = parsedBody.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        console.log(customer);
        console.log("data", data);
        createOrder(customer, data);
      })
      .catch((err) => console.log(err.message));
  }

  res.send().end();
});

export default router;

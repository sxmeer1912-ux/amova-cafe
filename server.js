require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));
app.use("/images", express.static(path.join(__dirname, "images")));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                error: "Invalid amount"
            });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: "amova_" + Date.now()
        });

        res.json(order);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.error?.description || error.message
        });
    }
});

app.post("/verify-payment", (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        res.json({
            success: expectedSignature === razorpay_signature
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false
        });
    }
});

app.get("/check-order/:orderId", async (req, res) => {
    try {
        const order = await razorpay.orders.fetch(req.params.orderId);

        res.json(order);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.error?.description || error.message
        });
    }
});

app.get("/test-razorpay", async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: 10000,
            currency: "INR",
            receipt: "test_" + Date.now()
        });

        const fetchedOrder = await razorpay.orders.fetch(order.id);

        res.json({
            createdOrderId: order.id,
            fetchedOrderId: fetchedOrder.id,
            amount: fetchedOrder.amount,
            status: fetchedOrder.status,
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.error?.description || error.message
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Amova Cafe server running at http://localhost:${PORT}`);
});
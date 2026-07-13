import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { requireAuth } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../shared/asyncHandler";
import { ok } from "../../shared/apiResponse";
import { env } from "../../config/env";
import { prisma } from "../../config/db";

const router = Router();

// Initialize Razorpay client. Uses placeholders if credentials are not configured.
const razorpay = new Razorpay({
  key_id: env.razorpay.keyId || "rzp_test_placeholder",
  key_secret: env.razorpay.keySecret || "secret_placeholder",
});

// Creates a Razorpay Order for the Premium plan
router.post("/checkout", requireAuth, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Razorpay requires amount in paise (e.g., ₹499 = 49900 paise)
  const options = {
    amount: 49900,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    // Track order creation in user subscription state
    await prisma.subscription.upsert({
      where: { userId },
      update: {
        razorpayOrderId: order.id,
        plan: "free",
        status: "ACTIVE",
      },
      create: {
        userId,
        razorpayOrderId: order.id,
        plan: "free",
        status: "ACTIVE",
      },
    });

    return ok(res, {
      key: env.razorpay.keyId || "rzp_test_placeholder",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "SkillForge AI Premium",
      description: "Upgrade to Premium Placement Prep (₹499/mo)",
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return res.status(500).json({ success: false, message: "Could not create payment order." });
  }
}));

// Verifies the Razorpay payment signature
router.post("/verify", requireAuth, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "All payment verification fields are required" });
  }

  // Generate signature verification
  const hmac = crypto.createHmac("sha256", env.razorpay.keySecret || "secret_placeholder");
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    // Payment failed
    await prisma.payment.create({
      data: {
        userId,
        razorpayPaymentId: razorpay_payment_id,
        amount: 49900,
        currency: "inr",
        status: "FAILED",
      },
    });
    return res.status(400).json({ success: false, message: "Payment signature verification failed" });
  }

  // Payment succeeded
  await prisma.subscription.update({
    where: { userId },
    data: {
      plan: "premium",
      status: "ACTIVE",
      razorpaySubscriptionId: razorpay_payment_id,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: "PREMIUM" },
  });

  await prisma.payment.create({
    data: {
      userId,
      razorpayPaymentId: razorpay_payment_id,
      amount: 49900,
      currency: "inr",
      status: "SUCCEEDED",
    },
  });

  return ok(res, { message: "Payment verified successfully" });
}));

// Mock webhook endpoint for Razorpay routing compatibilities
router.post("/webhook", asyncHandler(async (req, res) => {
  return res.json({ received: true });
}));

export default router;

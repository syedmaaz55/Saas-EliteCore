const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')({ origin: true }); // 👈 CORS fix ke liye

admin.initializeApp();

// 1. Checkout Session
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
    // CORS wrap karna zaroori hai taake Vercel se request aa sake
    cors(req, res, async () => {
        try {
            const { priceId, userId, email, planName, planPrice } = req.body; 
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [{ price: priceId, quantity: 1 }],
                customer_email: email,
                client_reference_id: userId,
                subscription_data: { metadata: { userId: userId } },
                metadata: { userId: userId, planName: planName },
                // Production URLs (Inko deployment ke baad apne site URL se replace karna)
                success_url: `https://syedmaaz.vercel.app/success?plan=${planName}&amount=${planPrice}`,
                cancel_url: "https://syedmaaz.vercel.app/pricing",
            });
            res.json({ url: session.url });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

// 2. Portal Session
exports.createPortalSession = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { customerId } = req.body; 
            const session = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: 'https://syedmaaz.vercel.app/dashboard', 
            });
            res.json({ url: session.url });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

// 3. Webhook (Signature Verification Fix)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    // Hardcoded key hata kar process.env use kiya
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; 
    
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;
    
    // Check for both session and subscription events
    if (event.type === 'checkout.session.completed') {
        const userId = data.client_reference_id;
        const customerId = data.customer;
        
        if (userId) {
            await admin.firestore().collection('subscriptions').doc(userId).set({
                stripeCustomerId: customerId,
                status: 'active',
                planName: data.metadata.planName,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
    }
    res.json({ received: true });
});
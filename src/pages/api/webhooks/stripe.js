import Cors from 'micro-cors';
import stripeInit from 'stripe';
import getRawBody from 'raw-body';
import clientPromise from "../../../../lib/mongodb";

const cors = Cors({
    allowMethods:['POST', 'HEAD']
});

export const config ={
    api:{
        bodyParser: false
    }
}
const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

const handler = async (req, res)=>{

    if(req.method === 'POST'){
        let event;
        try {
            const sig = req.headers['stripe-signature'];
            const rawBody = await getRawBody(req)
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
          } catch (err) {
           console.log("ERROR", err);
           response.status(400).send(`Webhook Error: ${err.message}`);
           return;
          }
        
          // Handle the event
          switch (event.type) {
            case 'payment_intent.succeeded' :{
                const client = await clientPromise;
                const db = client.db("blogAI");

                const paymentIntent = event.data.object;
                const auth0Id = paymentIntent.metadata.sub;
            
                const userProfile = await db.collection("users").updateOne({
                    auth0Id
                },{
                  $inc:{
                    availableTokens:10
                  },
                  $setOnInsert:{
                    auth0Id
                  }
                },{
                  upsert:true,
                })
            
            }
            break;
            // ... handle other event types
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
          res.status(200).json({received: true});
    }
}

export default cors(handler);
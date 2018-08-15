import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib.js";
import { success, failure } from "./libs/response-lib.js";

export async function main(event, context, callback){
   const {storage, source} = JSON.parse(event.body);
   const amount = calculateCost(storage);
   const description = "Scratch charge";

   //load our secret key from the environment vars
   const stripe = stripePackage(process.env.stripeSecretKey);

   try{
       await stripe.charges.create({
           source,
           amount,
           description,
           currency: "usd"
       });
       callback(null, success({status: true}));
   } catch(e){
       callback(null, failure({message: e.message}));
   }

}
import { withApiAuthRequired , getSession} from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../../lib/mongodb";
export default withApiAuthRequired( async function handler(req, res) {

    const {user} = await getSession(req, res);

    const client = await clientPromise;
    const db = client.db("blogAI")

    const userProfile = await db.collection("users").findOne({
      auth0Id:user.sub
    })

    const {lastPostDate, getNewerPosts} = req.body;

    const posts = await db.collection("posts").find({
        userId: userProfile._id,
        created:{[getNewerPosts? "$gt":"$lt"]: new Date(lastPostDate)}
    }).limit(getNewerPosts? 0: 5).sort({
        created:-1
    }).toArray();

    res.status(200).json({posts});

})
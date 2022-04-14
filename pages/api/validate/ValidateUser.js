import { connectToDatabase } from "../../../util/mongodb";
import bcrypt from "bcrypt";


export default async function handler(req, res) {
  const { method } = req;
  const {
   email,password
  } = req.body;

  const { db } = await connectToDatabase();

  if (method === "POST") {

    try {
            const user = await db.collection("users").findOne({ email: email });
            // console.log(user)
            !user && res.status(404).json({ok:false,status:"user not found"});
        
           
            const validPassword = await bcrypt.compare(password, user.password)
            !validPassword && res.status(400).json({ok:false,status:"wrong password"})
        
            
            res.status(200).json({ ok: true, id:user._id , email:user.email,name:user.username })
            // console.log(res)
          } catch (err) {
            res.status(500).json(err)
          }
  }
}
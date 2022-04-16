import { connectToDatabase } from "../../../util/mongodb";
import { Timestamp } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method, body } = req;
  const { username, email, password } = req.body;
  console.log(req.body)

  const { db } = await connectToDatabase();

  if (method === "POST") {
    try {
       if(username && email && password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            username:username,
            password:hashedPassword,
            email:email
        }
      const user = await db
        .collection("users")
        .insertOne({ ...newUser });
    //   res.status(201).json(newUser);
    res.status(201).json({status:"successfully signed up"});
       }
    } catch (error) {
      res.status(500).json(error);
    }
  }
  else {
      res.status(422).send('req_method_not_supported');
    }

};



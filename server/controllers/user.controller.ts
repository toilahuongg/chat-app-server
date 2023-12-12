import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import UserModel from "@server/models/user.model";

export class UserController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const foundUser = await UserModel.findOne({
      $or: [
        {
          username,
        }
      ],
    }).lean();

    if (!foundUser) return res.status(401).json({ message: 'Unauthorized'});
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError('Incorrect username, email or password!');
    return res.json({ oke: 1})
  }
}
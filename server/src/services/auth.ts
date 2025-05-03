import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = ({req}:{req:Request}) => { 
  let token = req.headers['authorization'] || req.body.token || req.query.token;
  if (req.headers.authorization) {
    token = token.split(' ') .pop() .trim();
  }
  if (!token) {
    return  req;
  }
  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'test';
    const decoded = jwt.verify(token, secretKey, {maxAge: "1hr"}) as JwtPayload;
    req.user = decoded;
    
  } catch (err) {
    console.log("No Token")
  }
 return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || 'test';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

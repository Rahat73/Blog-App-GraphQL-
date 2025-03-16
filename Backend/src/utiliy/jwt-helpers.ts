import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = (payload: { id: number }, secret: Secret) => {
  const token = jwt.sign({ userId: payload.id }, secret, {
    expiresIn: "1d",
  });

  return token;
};

const getUserInfo = (token: string) => {
  try {
    const userInfo = jwt.verify(token, config.jwt.JWT_SECRET as Secret);
    return userInfo;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const jwtHelpers = {
  generateToken,
  getUserInfo,
};

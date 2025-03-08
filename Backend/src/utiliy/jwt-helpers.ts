import jwt, { Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret) => {
  const token = jwt.sign({ userId: payload.id }, secret, {
    expiresIn: "1d",
  });

  return token;
};

export const jwtHelpers = {
  generateToken,
};

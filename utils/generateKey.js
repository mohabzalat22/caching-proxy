import crypto from "crypto";

export const generateKey = (secret, message) => {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  return hash;
};

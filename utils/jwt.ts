import { jwtVerify } from "jose";

import type { JwtPayload } from "@/lib/types";

const getSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing in .env");
  }

  return new TextEncoder().encode(secret);
};

export const verifyToken = async (
  token: string | undefined
): Promise<JwtPayload | null> => {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());

    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
};

import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key } = req.query as { key: string };
  const user = await kv.json.get(key);
  return res.status(200).json(user);
}

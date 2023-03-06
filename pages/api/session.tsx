import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: any, res: any) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    return res.json(session?.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to load data" });
  }
}

import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export default async function handler(req: any, res: any) {
  try {
    const filePath = path.join(process.cwd(), `resources/categories.json`);
    const fileContents = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(fileContents);
    // console.log("file", json);
    return res.json(json);
    // return new NextResponse(JSON.stringify(json));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to load data" });
  }
}

import { Storage } from "@google-cloud/storage";

export default async function handler(req: any, res: any) {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
  });

  const bucket = storage.bucket(process.env.BUCKET_NAME!);
  const file = bucket.file(req.query.file);
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { "x-goog-meta-test": "data" },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  //   console.log(response);
  res.status(200).json(response);
}

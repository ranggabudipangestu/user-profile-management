import { s3Client } from "./config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

// Uploads the specified file to the chosen path.
export const uploadFile = async (filePath, filename) => {
  const bucketParams = {
    Bucket: process.env.AWS_BUCKETNAME,
    Key: filename,
    Body: fs.readFileSync(filePath),
  };
  try {
    await s3Client.send(new PutObjectCommand(bucketParams));
    return filename;
  } catch (err) {
    throw new Error(err)
  }
};
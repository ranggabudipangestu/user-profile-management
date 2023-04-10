import { s3Client } from "./config"

export const getObject = async(filename) => {
  try {
      const data = await s3Client.getObject({ Bucket: process.env.AWS_BUCKETNAME, Key: filename })
      return await data.Body.transformToByteArray()
  } catch (error) {
    throw new Error
  }
}
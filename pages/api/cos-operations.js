import { S3Client, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.COS_REGION,
  credentials: {
    accessKeyId: process.env.COS_SECRET_ID,
    secretAccessKey: process.env.COS_SECRET_KEY,
  },
  endpoint: `https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com`,
});

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      try {
        const { path } = body;
        const data = await getBucketContents(path);
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
      }
      break;

    case 'POST':
      try {
        const { file, path } = body;
        const result = await uploadFile(file, path);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getBucketContents(path) {
  const command = new ListObjectsCommand({
    Bucket: process.env.COS_BUCKET,
    Prefix: path,
    Delimiter: '/',
  });

  try {
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function uploadFile(file, path) {
  const command = new PutObjectCommand({
    Bucket: process.env.COS_BUCKET,
    Key: path + file.name,
    Body: file,
  });

  try {
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

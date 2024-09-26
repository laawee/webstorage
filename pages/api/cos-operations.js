import COS from 'cos-js-sdk-v5';

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
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
  return new Promise((resolve, reject) => {
    cos.getBucket({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Prefix: path,
      Delimiter: '/',
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function uploadFile(file, path) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: path + file.name,
      Body: file,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

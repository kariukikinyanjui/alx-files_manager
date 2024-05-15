const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');
const dbClient = require('./utils/db');
const fs = require('fs');
const path = require('path');

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId || !userId) {
    done(new Error('Missing fileId or userId'));
    return;
  }

  const file = await dbClient.db.collection('files').findOne({ _id: fileId, userId });
  if (!file) {
    done(new Error('File not found'));
    return;
  }

  const sizes = [500, 250, 100];
  sizes.forEach(async (size) => {
    const thumbnail = await imageThumbnail(file.localPath, { width: size });
    const thumbnailPath = `${file.localPath}_${size}`;
    fs.writeFileSync(thumbnailPath, thumbnail);
  });

  done();
});

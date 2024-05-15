const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');
const dbClient = require('./utils/db');
const fs = require('fs');
const path = require('path');

const fileQueue = new Queue('fileQueue');
const userQueue = new Queue('userQueue');

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

userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) {
    done(new Error('Missing userId'));
    return;
  }

  const user = await dbClient.db.collection('users').findOne({ _id: userId });
  if (!user) {
    done(new Error('User not found'));
    return;
  }

  console.log(`Welcome ${user.email}!`);
  // In real life, here you would call an email service to send the actual email

  done();
});

// Start the worker
userQueue.on('completed', (job, result) => {
  console.log(`Sent welcome email to user ${job.data.userId}`);
});

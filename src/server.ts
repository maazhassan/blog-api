import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import watch from './services/watcher.js';
import sequelize from './services/db.js';
import { Post } from './models/post.model.js';

if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
}

if (process.env.SERVER_DOMAIN === undefined) {
  console.error('SERVER_DOMAIN environment variable is required but not set. Exiting.');
  process.exit(1);
}

sequelize.sync();
dotenv.config();
watch();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(process.env.IMAGES_PATH || "./attachments"));

app.get('/api/v1/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

app.get('/api/v1/posts/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  res.json(post);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`); 
});
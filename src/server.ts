import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import watch from './services/watcher.js';
import sequelize from './services/db.js';
import { Post } from './models/post.model.js';

sequelize.sync();
dotenv.config();
watch();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.get('/create_example', async () => {
  await Post.create({
    id: 1,
    filename: "example.md",
    title: "Example Post",
    author: "Maaz Hassan",
    description: "This is an example post",
    content: "This is the content of the example post"
  });
});

app.get('/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`); 
});
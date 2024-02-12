import Watcher from 'watcher';
import matter from 'gray-matter';
import fs from 'fs';
import sequelize from './db.js';
import { Post } from '../models/post.model.js';

export default function watch() {
  const watcher = new Watcher(process.env.POSTS_PATH, {
    renameDetection: true,
    persistent: true
  });

  watcher.on('change', path => {
    console.log(`File ${path} has been changed`);

    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(data);
      const { content: content, data: frontMatter } = matter(data);
      console.log(frontMatter);
      console.log(content);
      
      if (frontMatter.draft === 'true') {
        return;
      }

      // Post.upsert({
      //   filename: path,
      //   title: frontMatter.title,


    });
  });

  watcher.on('rename', (oldPath, newPath) => {
    console.log(`File ${oldPath} has been renamed to ${newPath}`);
  });
}
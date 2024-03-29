import Watcher from 'watcher';
import matter from 'gray-matter';
import fs from 'fs';
import { Post } from '../models/post.model.js';

export default function watch() {
  const watcher = new Watcher(process.env.POSTS_PATH || '.', {
    renameDetection: true,
    persistent: true
  });

  watcher.on('change', path => {
    console.log(`File ${path} has been changed`);

    fs.readFile(path, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(data);
      const { content: content, data: frontMatter } = matter(data);
      // console.log(frontMatter);
      // console.log(content);
      
      if (frontMatter.draft === 'true') {
        return;
      }

      // Replace all Obsidian format images with <img> tags
      const obsidianImageRegex = /!\[\[(.*?)\]\]/g;
      let newContent = content.replace(obsidianImageRegex, match => {
        const image = match.substring(3, match.length - 2);
        return `<img src="${process.env.SERVER_DOMAIN + '/' + image}" />`;
      });

      // Check if the first line is an <img> tag
      const imgRegex = /<img src="([^"]*)" \/>/;
      const firstLine = newContent.substring(0, newContent.indexOf('\n'));
      const match = firstLine.match(imgRegex);

      // Strip the thumbnail image from the content if it exists
      if (match) {
        newContent = newContent.substring(newContent.indexOf('\n') + 1, newContent.length);
        
        // Strip all newlines until we hit some content
        while (newContent[0] === '\n') {
          newContent = newContent.substring(1, newContent.length);
        }
      }
      
      // Get the filename of the post
      const filename = path.split('\\').pop();

      // Update the post in the database
      try {
        await Post.upsert({
          filename: filename,
          title: frontMatter.title,
          author: frontMatter.author,
          description: frontMatter.description,
          content: newContent,
          thumbnail: match ? match[1] : null
        });
      } catch (error) {
        console.error(error);
        return;
      }

      console.log(`Post ${filename} has been updated`);
    });
  });

  watcher.on('rename', async (oldPath, newPath) => {
    console.log(`File ${oldPath} has been renamed to ${newPath}`);

    const oldFilename = oldPath.split('\\').pop();
    const newFilename = newPath.split('\\').pop();
    
    await Post.update({ filename: newFilename }, { where: { filename: oldFilename } });
  });

  watcher.on('unlink', async path => {
    console.log(`File ${path} has been removed`);

    const filename = path.split('\\').pop();
    await Post.destroy({ where: { filename: filename } });

    console.log(`Post ${filename} has been deleted`);
  })
}
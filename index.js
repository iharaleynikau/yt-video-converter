import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import ytdl from 'ytdl-core';
import { createWriteStream } from 'fs';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  app.use('/', express.static(join(__dirname, 'client', 'dist')));

  app.get('*', (_, res) => {
    res.sendFile(resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.post('/convert', async (req, res) => {
  const link = req.body.link;

  const title = await ytdl.getInfo(link).then(info => {
    return info.videoDetails.title;
  });

  ytdl(link, {
    quality: 'highestaudio',
    filter: 'audioonly'
  }).pipe(
    createWriteStream(`${title}.mp3`.split('/').join(' '))
      .on('error', err => {
        console.log(err);
        res.send('Error: ' + err.message);
      })
      .on('finish', () => {
        res.status(200).send('Downloaded!');
      })
  );
});

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => console.log('\x1b[1m', `\nServer has been started on port ${PORT}\n`));

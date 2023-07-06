import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import next from 'next';
import path from 'path';
import fs from 'fs';
import https from 'https';
import RedisServer from './services/redis';

dotenv.config();

const { PORT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const dev = true;
function resolve(p: string) {
  return path.resolve(__dirname, p);
}
const app = next({ dev });
const handle = app.getRequestHandler();

const connectString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const options = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt')
};


app.prepare().then(() => {
  const server = express();
  if (dev) {
    server.use(morgan('dev'));
  } else {
    server.use(morgan('tiny'));
    server.use(helmet());
    server.use(compression());
    server.use(express.static(resolve('src')));
  }
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // init db

  mongoose
    .connect(connectString, {
      user: DB_USER,
      pass: DB_PASS,
      maxPoolSize: 50,
    })
  // routes
  RedisServer.getInstance();
  server.use(express.static(path.join(__dirname, 'public')));


  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Server is started: http://localhost:${PORT}`);
  });
  
  https.createServer(options, server).listen(PORT, () => {
    console.log(`Server is started: http://localhost:${PORT}`);
  });
});
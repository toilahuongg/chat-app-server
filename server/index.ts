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
import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import RedisServer from './services/redis';
import userRouter from './routers/user.route';

dotenv.config();

const { PORT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, NODE_ENV } = process.env;

const dev = NODE_ENV === 'development';
console.log(dev)
function resolve(p: string) {
  return path.resolve(__dirname, p);
}
const app = next({ dev });
const handle = app.getRequestHandler();

const connectString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const httpsOptions = {
  key: fs.readFileSync('./certification/cert.key'),
  cert: fs.readFileSync('./certification/cert.pem')
  }


app.prepare().then(async () => {
  const server = express();
  const httpsServer = https.createServer(httpsOptions, server)
  const io = new Server(httpsServer);
  const pubClient = createClient({ url: "redis://localhost:6379" });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
  });

  io.on("connection", (socket) => {
    console.log("Client id connected "+socket.id)
    socket.on('message', msg => {
      io.send(socket.id+': '+msg);
    })
  });
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
  RedisServer.getInstance();
  // routes
  server.use(express.static(path.join(__dirname, 'public')));
  server.use(userRouter)
  
  server.all('*', (req, res) => {
    return handle(req, res);
  });


  httpsServer.listen(PORT, () => {
    console.log(`Server is started: https://localhost:${PORT}`);
  });
  
});
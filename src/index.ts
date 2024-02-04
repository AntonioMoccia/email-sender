import { config } from "dotenv";
config();
import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import dns from "dns";
import { database } from "./data-sources";
import cors from "cors";
import v1 from "@routers/v1/router";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      auth: any;
      providers: any;
    }
  }
}

const app: Application = express();

app.use(cors());
async function InitDatabase() {
  try {
    await mongoose.connect("mongodb://root:example@localhost:27017/email_sender?authSource=admin")

    console.log('connected');
  } catch (e) {
    console.log(e);
  }
}
InitDatabase();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/v1", v1);

const hosts: string[] = ["WP016.ekd.local"];

app.listen(5000, () => {
  console.log(`http://localhost:5000`);
});

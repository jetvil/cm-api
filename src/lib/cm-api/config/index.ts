/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

import createIndexRouter from "../routes";
import { actions, methodTypes } from "../routes/types";

export default class JetvilCMS {
  private client: PrismaClient;
  constructor(client: PrismaClient | undefined = undefined) {
    this.client = client;
  }

  public setClient = async (client: PrismaClient) => {
    this.client = client;
  };

  public router = (client: PrismaClient | undefined = undefined) => {
    if (!this.client && !client) {
      throw new Error("No client provided");
    }

    const prismaClient: PrismaClient = this.client ?? client;
    const expressRouter = createIndexRouter({ client: prismaClient });
    return expressRouter;
  };
  public customRouter = ({
    client = undefined,
    schemas = [],
    methods = Object.keys(actions),
  }: {
    client?: PrismaClient;
    methods?: Array<string>;
    schemas?: Array<string>;
  }) => {
    if (!this.client && !client) {
      throw new Error("No client provided");
    }
    const convertedMethods: Array<methodTypes> = Object.keys(actions).filter((key) =>
      methods.includes(key),
    ) as Array<methodTypes>;
    const prismaClient: PrismaClient = this.client ?? client;
    const expressRouter = createIndexRouter({ client: prismaClient, schemas, methods: convertedMethods });
    return expressRouter;
  };
}

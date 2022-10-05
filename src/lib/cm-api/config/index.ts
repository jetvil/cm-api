/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { getPrismaSchemas } from "../data";

import createIndexRouter from "../routes";
import { actions, methodTypes, middlewareType } from "../routes/types";

export default class JetvilCMS {
  private client: PrismaClient;
  constructor(client: PrismaClient | undefined = undefined) {
    this.client = client;
  }

  public setClient = async (client: PrismaClient) => {
    this.client = client;
  };

  public router = ({
    client = undefined,
    schemas = getPrismaSchemas(client ?? this.client),
    methods = Object.keys(actions),
    middleware = [],
  }: {
    client?: PrismaClient;
    methods?: Array<string>;
    schemas?: Array<string>;
    middleware?: middlewareType;
  } = {}) => {
    if (!this.client && !client) {
      throw new Error("No client provided");
    }
    const convertedMethods: Array<methodTypes> = Object.keys(actions).filter((key) =>
      methods.includes(key),
    ) as Array<methodTypes>;
    const prismaClient: PrismaClient = this.client ?? client;
    const expressRouter = createIndexRouter({
      client: prismaClient,
      schemas,
      methods: convertedMethods,
      middleware: middleware,
    });
    return expressRouter;
  };
}

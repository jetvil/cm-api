/* eslint-disable no-console */
import { isFalsy } from "@jetvil/types";
import { PrismaClient } from "@prisma/client";
import { getPrismaSchemas } from "../data";

import createIndexRouter from "../routes";
import { actionTypes, httpMappers, methodTypes, middlewareType, schemaConfigType } from "../routes/types";
import { logger } from "./logger";

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
    global = {
      schemas: getPrismaSchemas(client ?? this.client),
      actions: [],
      methods: Object.keys(httpMappers) as Array<methodTypes>,
      middleware: [],
    },
    config = {},
    verbose = false,
  }: {
    client?: PrismaClient;
    global: {
      methods?: Array<methodTypes>;
      actions?: Array<actionTypes>;
      schemas?: Array<string>;
      middleware?: middlewareType;
    };
    config?: schemaConfigType;
    verbose?: boolean;
  }) => {
    const prismaClient: PrismaClient = this.client ?? client;
    if (isFalsy(prismaClient)) {
      throw new Error("No client provided");
    }
    const convertedMethods: Array<methodTypes> = Object.keys(httpMappers).filter((key) =>
      global.methods?.includes(key as methodTypes),
    ) as Array<methodTypes>;
    logger.info("Creating Index router...", verbose);
    const expressRouter = createIndexRouter({
      client: prismaClient,
      global: {
        methods: convertedMethods,
        actions: global.actions,
        schemas: global.schemas,
        middleware: global.middleware,
      },
      config,
      verbose,
      // schemas,
      // methods: convertedMethods,
      // middleware: middleware,
      // actions,
    });
    return expressRouter;
  };
}

/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { logger } from "../config/logger";
import { getPrismaSchemas } from "../data";
import createSchemaRouter from "./schemaRouter";
import { actionTypes, httpMappers, methodTypes, middlewareType, schemaConfigType } from "./types";

const createIndexRouter = ({
  client,
  global: {
    methods = Object.keys(httpMappers) as Array<methodTypes>,
    actions = [] as Array<actionTypes>,
    schemas = getPrismaSchemas(client),
    middleware = [],
  },
  config = {},
  verbose,
}: {
  client: PrismaClient;
  global: {
    methods?: Array<methodTypes>;
    actions?: Array<actionTypes>;
    schemas?: Array<string>;
    middleware?: middlewareType;
  };
  config?: schemaConfigType;
  verbose: boolean;
}) => {
  const router: Router = Router();
  // schemas ??= getPrismaSchemas(client);

  router.use((_req, _res, next) => {
    _res.header("X-Powered-By", "Express-Jetvil");
    return next();
  });

  // find if there is a config for the schema and if not, use the global config
  const configs = Object.keys(config).map((schema) => {
    if (!schemas.includes(schema)) {
      throw new Error(`Schema ${schema} not found in Prisma client`);
    }
    return { [schema]: config[schema] };
  });

  console.log("configs", configs);

  logger.info("Creating Schema routers...", verbose);
  schemas.forEach((schemaKey: string) => {
    const schemaConfig = configs.find((config) => Object.keys(config)[0] === schemaKey);
    const localConfig = {
      [schemaKey]: {
        methods: schemaConfig?.[schemaKey]?.methods || methods,
        actions: schemaConfig?.[schemaKey]?.actions || actions,
        middleware: schemaConfig?.[schemaKey]?.middleware || middleware,
      },
    };

    const subRouter = createSchemaRouter({
      client,
      schema: schemaKey,
      methods: localConfig[schemaKey].methods,
      middleware: localConfig[schemaKey].middleware,
      actions: localConfig[schemaKey].actions,
      verbose,
    });
    router.use(subRouter);
  });
  return router;
};

export default createIndexRouter;

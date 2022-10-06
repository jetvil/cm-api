/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { logger } from "../config/logger";
import { getPrismaSchemas } from "../data";
import createSchemaRouter from "./schemaRouter";
import { actions, methodTypes, middlewareType } from "./types";

const createIndexRouter = ({
  client,
  methods = Object.keys(actions) as Array<methodTypes>,
  schemas = getPrismaSchemas(client),
  middleware = [],
  verbose,
}: {
  client: PrismaClient;
  methods?: Array<methodTypes>;
  schemas?: Array<string>;
  middleware?: middlewareType;
  verbose: boolean;
}) => {
  const router: Router = Router();
  schemas ??= getPrismaSchemas(client);

  router.use((_req, _res, next) => {
    _res.header("CM-Powered-By", "Jetvil");
    return next();
  });

  logger.info("Creating Schema routers...", verbose);
  schemas.forEach((schemaKey: string) => {
    const subRouter = createSchemaRouter({
      client,
      schema: schemaKey,
      methods,
      middleware,
      verbose,
    });
    router.use(subRouter);
  });
  return router;
};

export default createIndexRouter;

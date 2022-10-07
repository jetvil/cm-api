/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { logger } from "../config/logger";
import { getPrismaSchemas } from "../data";
import createSchemaRouter from "./schemaRouter";
import { actionTypes, httpMappers, methodTypes, middlewareType } from "./types";

const createIndexRouter = ({
  client,
  methods = Object.keys(httpMappers) as Array<methodTypes>,
  actions = [{ methods: Object.keys(httpMappers), schemas: getPrismaSchemas(client) }] as Array<
    Record<string, { methods?: Array<methodTypes>; actions?: Array<actionTypes> }>
  >,
  schemas = getPrismaSchemas(client),
  middleware = [],
  verbose,
}: {
  client: PrismaClient;
  methods?: Array<methodTypes>;
  actions?: Array<Record<string, { methods?: Array<methodTypes>; actions?: Array<actionTypes> }>>;
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
      actions,
    });
    router.use(subRouter);
  });
  return router;
};

export default createIndexRouter;

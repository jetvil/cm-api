import { isTruthyExtended, isFalsy } from "@jetvil/types";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { logger } from "../config/logger";
import { getPrismaFilter, getPrismaMethod } from "../data/prismaUtils";
import { httpMappers, functionType, methodTypes, middlewareType, actionTypes } from "./types";

const createSchemaRouter = ({
  client,
  schema,
  methods,
  middleware,
  verbose,
}: {
  client: PrismaClient;
  schema: string;
  methods: Array<methodTypes>;
  actions: Array<actionTypes>;
  middleware: middlewareType;
  verbose: boolean;
}) => {
  logger.info(`Creating router for schema:: ${schema}...`, verbose);
  const router: Router = Router();
  const routes: Array<{ method: methodTypes; url: string; handler: functionType }> = [];

  logger.info(`Creating routes for schema:: ${schema}...`, verbose);
  methods.forEach((method: methodTypes) => {
    if (isFalsy(httpMappers[method])) {
      logger.error(`Method:: ${method} is not supported!`, verbose);
      return;
    }

    const route = {
      method: method,
      url: "/" + schema + httpMappers[method],
      handler: async (req: any, res: any) => {
        try {
          const prismaMethod = getPrismaMethod(method);
          const func = client[schema][prismaMethod];
          const filter = getPrismaFilter(method);

          const data: object = isTruthyExtended(req.body)
            ? req.body
            : isTruthyExtended(req.params)
            ? req.params
            : isTruthyExtended(req.query)
            ? req.query
            : undefined;
          if (isFalsy(data)) {
            throw new Error("No data provided");
          }
          const result = await func({ [filter]: data });
          return res.json(result);
        } catch (error: any) {
          logger.error(error, verbose);
          res.status(500).json({ error: error.message });
        }
      },
    };

    logger.info(`Adding route for method:: ${method} on schema:: ${schema}...`, verbose);
    routes.push(route);
  });

  routes.push({
    method: "get",
    url: `/${schema}s`,
    handler: async (_req: any, _res: any) => {
      try {
        const filters: Array<Record<string, any>> = Object.keys(_req.query).map((key) => {
          if (key.includes("-")) {
            const splitted: Array<string> = key.split("-");
            const field: string = splitted[0];
            const operator: string = splitted[1];
            return { [field]: { [operator]: _req.query[key] } };
          } else {
            return { [key]: _req.query[key] };
          }
        });
        const where = filters.reduce((acc: any, filter) => {
          const key = Object.keys(filter)[0];
          const value = filter[key];
          return { ...acc, [key]: value };
        }, {});

        const result = await client[schema].findMany({ where });
        return _res.json(result);
      } catch (error: any) {
        logger.error(error, verbose);
        return _res.status(500).json({ error: error.message });
      }
    },
  });

  logger.info(`Adding routes to router for schema:: ${schema}...`, verbose);

  const schemaArray = middleware?.filter((m) => isFalsy(m?.schemas?.length) || m?.schemas?.includes(schema));
  routes.forEach((route) => {
    const methodArray = schemaArray?.filter((m) => isFalsy(m?.methods?.length) || m?.methods?.includes(route.method));

    router[route.method](route.url, ...(methodArray.map((m) => m.handler) as any), route.handler);
  });
  return router;
};

export default createSchemaRouter;

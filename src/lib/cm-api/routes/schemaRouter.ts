/* eslint-disable no-console */
import isFalsy from "@jetvil/types/dist/lib/validate/types/isFalsy";
import isTruthyExtended from "@jetvil/types/dist/lib/validate/types/isTruthyExtended";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { getPrismaFilter, getPrismaMethod } from "../data/prismaUtils";
import { actions, functionType, methodTypes, middlewareType } from "./types";

const createSchemaRouter = ({
  client,
  schema,
  methods,
  middleware,
}: {
  client: PrismaClient;
  schema: string;
  methods: Array<methodTypes>;
  middleware: middlewareType;
}) => {
  const router: Router = Router();
  const routes: Array<{ method: methodTypes; url: string; handler: functionType }> = [];
  methods.forEach((method: methodTypes) => {
    const route = {
      method: method as methodTypes,
      url: "/" + schema + actions[method as methodTypes],
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
          console.error(error);
          res.status(500).json({ error: error.message });
        }
      },
    };
    routes.push(route);
  });

  routes.push({
    method: "get",
    url: `/${schema}s`,
    handler: async (_req: any, _res: any) => {
      try {
        const result = await client[schema].findMany();
        return _res.json(result);
      } catch (error: any) {
        console.log(error);
        return _res.status(500).json({ error: error.message });
      }
    },
  });
  routes.forEach((route) => {
    const schemaArray = middleware?.filter((m) => isFalsy(m?.schemas?.length) || m?.schemas?.includes(schema));
    const methodArray = schemaArray?.filter((m) => isFalsy(m?.methods?.length) || m?.methods?.includes(route.method));

    router[route.method](route.url, ...(methodArray.map((m) => m.handler) as any), route.handler);
  });
  return router;
};

export default createSchemaRouter;

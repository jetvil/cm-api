import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { getPrismaFilter, getPrismaMethod } from "../data/prismaUtils";
import { actions, functionType, methodTypes } from "./types";

const createSchemaRouter = ({
  client,
  schema,
  methods,
}: {
  client: PrismaClient;
  schema: string;
  methods: Array<methodTypes>;
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
          console.log("req.body", req.body);
          console.log("req.params", req.params);
          console.log("req.query", req.query);
          console.log({ [filter]: req.body || req.params || req.query });
          const result = await func({ [filter]: req.body || req.params || req.query });
          return res.json(result);
        } catch (error: any) {
          console.log(error);
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
    router[route.method](route.url, route.handler);
  });
  return router;
};

export default createSchemaRouter;

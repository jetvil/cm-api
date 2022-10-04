/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { getPrismaSchemas } from "../data";
import createSchemaRouter from "./schemaRouter";
import { actions, methodTypes } from "./types";

const createIndexRouter = ({
  client,
  methods = Object.keys(actions) as Array<methodTypes>,
  schemas = getPrismaSchemas(client),
}: {
  client: PrismaClient;
  methods?: Array<methodTypes>;
  schemas?: Array<string>;
}) => {
  const router: Router = Router();
  schemas ??= getPrismaSchemas(client);

  schemas.forEach((schemaKey: string) => {
    const subRouter = createSchemaRouter({ client: client, schema: schemaKey, methods });
    router.use(subRouter);
  });
  return router;
};

export default createIndexRouter;

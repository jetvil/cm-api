/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

export const handlePrismaClient = async (client: PrismaClient) => {
  const conn = await client.$connect();
  console.log(conn);
  // ... you will write your Prisma Client queries here
  const schemas = Object.keys(client).filter((key) => false === key.startsWith("_") && false === key.startsWith("$"));
  console.log(schemas);
  const results = await Promise.all(
    schemas.map(async (schema: string) => {
      const result: Array<any> = await (client as Record<string, any>)[schema].findMany();
      return result;
    }),
  );
  console.log(results);
  return client;
};

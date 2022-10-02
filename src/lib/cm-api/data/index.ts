/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

export const getPrismaSchemas = (client: PrismaClient) => {
  return Object.keys(client).filter((key) => false === key.startsWith("_") && false === key.startsWith("$"));
};

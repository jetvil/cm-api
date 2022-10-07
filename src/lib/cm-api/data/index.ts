/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { actions, actionTypes, methodTypes } from "../routes/types";

export const getPrismaSchemas = (client: PrismaClient): Array<string> => {
  return Object.keys(client).filter((key) => false === key.startsWith("_") && false === key.startsWith("$"));
};

export const getCorrespondingHTTPMethod = (action: actionTypes): methodTypes => {
  return actions[action];
};

import { methodTypes } from "../routes/types";

export const getPrismaMethod = (method: methodTypes) => {
  const prismaMethod = {
    post: "create",
    get: "findUnique",
    put: "update",
    delete: "delete",
    patch: "update",
  };
  return prismaMethod[method];
};

export const getPrismaFilter = (method: methodTypes) => {
  const prismaFilter = {
    post: "data",
    get: "where",
    put: "data",
    delete: "where",
    patch: "data",
  };
  return prismaFilter[method];
};

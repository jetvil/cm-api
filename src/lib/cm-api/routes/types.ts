import { NextFunction, Request, Response } from "express";

export type methodTypes = "get" | "post" | "put" | "delete" | "patch";
export type actionTypes =
  | "create"
  | "createMany"
  | "update"
  | "updateMany"
  | "read"
  | "readMany"
  | "delete"
  | "deleteMany"
  | "find"
  | "findMany"
  | "findFirst"
  | "upsert"
  | "aggregate"
  | "count"
  | "filter"
  | "filterMany";
export type functionType = (req: Request, res: Response) => void | Promise<void>;
export type middlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
export type middlewareType = Array<{
  methods?: Array<methodTypes>;
  handler?: middlewareFunction;
  schemas?: Array<string>;
}>;
export type schemaMiddlewareType = Array<{
  methods?: Array<methodTypes>;
  handler: middlewareFunction;
}>;
export type routeConfigType = {
  methods?: Array<methodTypes>;
  actions?: Array<actionTypes>;
  schemas?: Array<string>;
  middleware?: schemaMiddlewareType;
};
export type schemaConfigType = Record<string, routeConfigType>;
export const httpMappers: Record<methodTypes, any> = {
  post: "/",
  get: "/:id",
  put: "/:id",
  delete: "/:id",
  patch: "/:id",
};
export const actions: Record<actionTypes, methodTypes> = {
  read: "get",
  readMany: "get",
  create: "post",
  createMany: "post",
  update: "put",
  updateMany: "put",
  delete: "delete",
  deleteMany: "delete",
  find: "get",
  findMany: "get",
  upsert: "put",
  aggregate: "get",
  count: "get",
  findFirst: "get",
  filter: "get",
  filterMany: "get",
};

export type routeTypes = {
  method: methodTypes;
  url: string;
  handler: functionType;
};

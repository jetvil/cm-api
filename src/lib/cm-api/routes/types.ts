import { NextFunction, Request, Response } from "express";

export type methodTypes = "get" | "post" | "put" | "delete" | "patch";
export type actionTypes =
  | "create"
  | "update"
  | "read"
  | "delete"
  | "findUnique"
  | "findMany"
  | "findFirst"
  | "updateMany"
  | "deleteMany"
  | "createMany"
  | "upsert"
  | "aggregate"
  | "count";
export type functionType = (req: Request, res: Response) => void | Promise<void>;
export type middlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type middlewareType = Array<{
  methods?: Array<methodTypes>;
  handler?: middlewareFunction;
  schemas?: Array<string>;
}>;

export const httpMappers: Record<methodTypes, any> = {
  post: "/",
  get: "/:id",
  put: "/:id",
  delete: "/:id",
  patch: "/:id",
};

export const actions: Record<actionTypes, methodTypes> = {
  create: "post",
  update: "put",
  read: "get",
  delete: "delete",
  findMany: "get",
  findUnique: "get",
  upsert: "put",
  aggregate: "get",
  count: "get",
  findFirst: "get",
  updateMany: "put",
  deleteMany: "delete",
  createMany: "post",
};

export type routeTypes = {
  method: methodTypes;
  url: string;
  handler: functionType;
};

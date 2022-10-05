import { NextFunction, Request, Response } from "express";

export type methodTypes = "get" | "post" | "put" | "delete" | "patch";
export type functionType = (req: Request, res: Response) => void | Promise<void>;
export type middlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type middlewareType = Array<{
  methods?: Array<methodTypes>;
  handler?: middlewareFunction;
  schemas?: Array<string>;
}>;

export const actions: Record<methodTypes, any> = {
  post: "/",
  get: "/:id",
  put: "/:id",
  delete: "/:id",
  patch: "/:id",
};

export type routeTypes = {
  method: methodTypes;
  url: string;
  handler: functionType;
};

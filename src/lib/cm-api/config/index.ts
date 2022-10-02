/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
const actions = {
  create: "/",
  read: "/:id",
  update: "/:id",
  delete: "/:id",
};
import { Router } from "express";
import { getPrismaSchemas } from "../data";
// create routes for all the controllers
const router = Router();

export default class JetvilCMS {
  private client: PrismaClient;
  constructor(client: PrismaClient | undefined = undefined) {
    this.client = client;
  }

  public setClient = async (client: PrismaClient) => {
    this.client = client;
  };

  private getMethod = (action: string) =>
    action === "read" ? "get" : action === "create" ? "post" : action === "update" ? "put" : "delete";

  public router = (client: PrismaClient | undefined = undefined) => {
    // this.client ??= client;
    if (!this.client && client) {
      throw new Error("No client provided");
    }
    const prismaClient = this.client ?? client;
    console.log("CLIENT:::", prismaClient);
    const schemas = getPrismaSchemas(prismaClient);
    console.log("SCHEMAS:::", schemas);

    schemas.forEach((schemaKey: string) => {
      // const controllerRoutes = schemas[schemaKey];
      const routes: (string | ((_req: any, _res: any) => void))[][] = [];
      Object.keys(actions).forEach((action) => {
        const route = [
          action,
          "/" + schemaKey + (actions as any)[action],
          (_req: any, _res: any) => {
            return _res.send(`Hello ${schemaKey} ${action} ${_req.params.id ? `with id: ${_req.params.id}` : ""}`);
          },
        ];
        console.log(route);
        routes.push(route);
      });

      routes.push(["read", `/${schemaKey}s`, (_req: any, _res: any) => _res.send(`Hello ${schemaKey}s`)]);

      routes.forEach((route) => {
        console.info(`Adding route: ${this.getMethod(route[0] as any)} ${route[1]}`);
        // console.info(`Route has schema: `, controllerRoutes.schema);
        // Object.keys(controllerRoutes.schema).forEach((key) => {
        //   console.info(`Schema has key: ${key} with type: ${controllerRoutes.schema[key]}`);
        // });
        router[this.getMethod(route[0] as string)](route[1] as string, route[2] as (_req: any, _res: any) => void);
      });
    });
    return router;
  };
}

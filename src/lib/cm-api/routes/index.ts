/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
// create routes for all the controllers
const router = Router();

const actions = {
  create: "/",
  read: "/:id",
  update: "/:id",
  delete: "/:id",
};
const controllers: Record<string, Record<string, Record<string, string | StringConstructor | NumberConstructor>>> = {
  user: {
    schema: {
      id: String,
      name: String,
      email: String,
      password: String,
      team: "ref:team",
    },
  },
  post: {
    schema: {
      id: Number,
      title: String,
      content: String,
      author: "ref:user",
    },
  },
  team: {
    schema: {
      id: Number,
      name: String,
      members: "ref:user[]",
    },
  },
};

const getMethod = (action: string) =>
  action === "read" ? "get" : action === "create" ? "post" : action === "update" ? "put" : "delete";

console.log(process.argv);
Object.keys(controllers).forEach((controllerKey: string) => {
  const controllerRoutes = controllers[controllerKey];
  const routes: (string | ((_req: any, _res: any) => void))[][] = [];
  Object.keys(actions).forEach((action) => {
    const route = [
      action,
      "/" + controllerKey + (actions as any)[action],
      (_req: any, _res: any) => {
        return _res.send(`Hello ${controllerKey} ${action} ${_req.params.id ? `with id: ${_req.params.id}` : ""}`);
      },
    ];
    console.log(route);
    routes.push(route);
  });

  routes.push(["read", `/${controllerKey}s`, (_req: any, _res: any) => _res.send(`Hello ${controllerKey}s`)]);

  routes.forEach((route) => {
    console.info(`Adding route: ${getMethod(route[0] as any)} ${route[1]}`);
    console.info(`Route has schema: `, controllerRoutes.schema);
    Object.keys(controllerRoutes.schema).forEach((key) => {
      console.info(`Schema has key: ${key} with type: ${controllerRoutes.schema[key]}`);
    });
    router[getMethod(route[0] as string)](route[1] as string, route[2] as (_req: any, _res: any) => void);
  });
});

export default router;

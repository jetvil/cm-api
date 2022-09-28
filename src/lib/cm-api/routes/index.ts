/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
// create routes for all the controllers
const router = express.Router();
const controllers: any = {
  user: {
    create: "/",
    read: "/:id",
    update: "/:id",
    delete: "/:id",
  },
  post: {
    create: "/",
    read: "/:id",
    update: "/:id",
    delete: "/:id",
  },
};
const getMethod = (action: string) =>
  action === "read" ? "get" : action === "create" ? "post" : action === "update" ? "put" : "delete";

Object.keys(controllers).forEach((controller) => {
  const controllerRoutes: any = controllers[controller];
  const routes: (string | ((_req: any, _res: any) => void))[][] = [];
  Object.keys(controllerRoutes).forEach((action) => {
    // for each action, create a route and make an object like: ['/user/:id', (req, res) => {}]
    const route = [
      action,
      "/" + controller + controllerRoutes[action],
      (_req: any, _res: any) => {
        console.log("hello from " + controller + " " + action + _req?.params?.id);
        return _res.send("hello from " + controller + " " + action + _req?.params?.id);
      },
    ];
    // add the route to the routes array
    routes.push(route);

    // add the route to the express router

    // router.get('/user/:id', (req, res) => {})
  });
  routes.forEach((route) => {
    router[getMethod(route[0] as string)](route[1] as string, route[2] as (_req: any, _res: any) => void);
  });
});

export default router;

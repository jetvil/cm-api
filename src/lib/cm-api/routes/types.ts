export type methodTypes = "get" | "post" | "put" | "delete" | "patch";
export type functionType = (req: any, res: any) => void | Promise<void>;

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

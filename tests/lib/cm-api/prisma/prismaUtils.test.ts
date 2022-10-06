import { getPrismaMethod } from "../../../../src/lib/cm-api/data/prismaUtils";
import { getPrismaFilter } from "../../../../src/lib/cm-api/data/prismaUtils";
describe("PrismaUtils", () => {
  describe("getPrismaMethod", () => {
    it("should return the correct prisma method for get", () => {
      expect(getPrismaMethod("get")).toBe("findUnique");
    });
    it("should return the correct prisma method for post", () => {
      expect(getPrismaMethod("post")).toBe("create");
    });
    it("should return the correct prisma method for put", () => {
      expect(getPrismaMethod("put")).toBe("update");
    });
    it("should return the correct prisma method for delete", () => {
      expect(getPrismaMethod("delete")).toBe("delete");
    });
    it("should return the correct prisma method for patch", () => {
      expect(getPrismaMethod("patch")).toBe("update");
    });
  });
  describe("getPrismaFilter", () => {
    it("should return the correct prisma filter for get", () => {
      expect(getPrismaFilter("get")).toBe("where");
    });
    it("should return the correct prisma filter for post", () => {
      expect(getPrismaFilter("post")).toBe("data");
    });
    it("should return the correct prisma filter for put", () => {
      expect(getPrismaFilter("put")).toBe("data");
    });
    it("should return the correct prisma filter for delete", () => {
      expect(getPrismaFilter("delete")).toBe("where");
    });
    it("should return the correct prisma filter for patch", () => {
      expect(getPrismaFilter("patch")).toBe("data");
    });
  });
});

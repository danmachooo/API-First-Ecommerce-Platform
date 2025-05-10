import { ResponseBuilder } from "./response.util";

describe("ResponseBuilder", () => {
  describe("success", () => {
    it("should create a success response", () => {
      const message = "Operation successful";
      const data = { id: "1" };
      const response = ResponseBuilder.success(message, data);

      expect(response).toEqual({
        success: true,
        message,
        data,
      });
    });

    it("should create a success response without data", () => {
      const message = "Operation successful";
      const response = ResponseBuilder.success(message);

      expect(response).toEqual({
        success: true,
        message,
        data: undefined,
      });
    });
  });
});

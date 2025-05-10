import { Logger } from "./logger";

describe("Logger", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log info messages", () => {
    Logger.info("Test message", "TestContext");

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("INFO [TestContext] Test message")
    );
  });

  it("should log error messages", () => {
    Logger.error("Error message", "TestContext");

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("ERROR [TestContext] Error message")
    );
  });
});

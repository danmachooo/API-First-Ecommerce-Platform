// This file contains setup code that will be executed before each test
import prismaMock from "./src/__mocks__/prisma.mock";
import redisClientMock from "./src/__mocks__/redis.mocks";

// Mock modules
jest.mock("./src/lib/prisma/redis.lib", () => {
  return {
    __esModule: true,
    default: redisClientMock,
  };
});

jest.mock("./src/lib/prisma/prisma.lib", () => {
  return {
    __esModule: true,
    default: prismaMock,
  };
});

// Clean up mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// container.ts
import { container } from "tsyringe";
import { ConfigService } from "../../config/config.service";
import { AuthController } from "./auth.controller";
import { AuthRepo } from "./auth.repo";
import { AuthService } from "./auth.service";
import { ICryptoService, BcryptCryptoService } from "./crypto.service";
import { ISessionStrategy, JwtSessionStrategy } from "./session.strategy";

// Register dependencies
container.register<ConfigService>("ConfigService", { useClass: ConfigService });
container.register<AuthRepo>("AuthRepo", { useClass: AuthRepo });
container.register<ICryptoService>("ICryptoService", {
  useClass: BcryptCryptoService,
});

container.register<ISessionStrategy>("ISessionStrategy", {
  useFactory: (c) =>
    new JwtSessionStrategy(
      c.resolve<AuthService>("AuthService"),
      c.resolve<ConfigService>("ConfigService")
    ),
});

container.register<AuthService>("AuthService", {
  useFactory: (c) =>
    new AuthService(
      c.resolve<AuthRepo>("AuthRepo"),
      c.resolve<ICryptoService>("ICryptoService"),
      c.resolve<ISessionStrategy>("ISessionStrategy")
    ),
});

container.register<AuthController>(AuthController, {
  useFactory: (c) =>
    new AuthController(
      c.resolve<AuthService>("AuthService"),
      c.resolve<ICryptoService>("ICryptoService"),
      c.resolve<ISessionStrategy>("ISessionStrategy")
    ),
});

export { container };

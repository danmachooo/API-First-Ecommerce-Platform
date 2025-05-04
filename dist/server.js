"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 3000;
const baseUrl = process.env.BASE_URL || "http://localhost:";
const test = "This file is loaded"; // Should work if types.d.ts is loaded
console.log(typeof test);
app_1.default.listen(PORT, () => {
    console.log(`Server running on ${baseUrl}${PORT}`);
});

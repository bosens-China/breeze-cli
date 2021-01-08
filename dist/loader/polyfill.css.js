"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier_1 = __importDefault(require("prettier"));
exports.default = (content) => {
    const code = prettier_1.default.format(content, { parser: 'css' });
    return code;
};
//# sourceMappingURL=polyfill.css.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = exports.css = exports.js = void 0;
const prettier_1 = __importDefault(require("prettier"));
const js = (content) => {
    const code = prettier_1.default.format(content, { parser: 'babel' });
    return code;
};
exports.js = js;
const css = (content) => {
    const code = prettier_1.default.format(content, { parser: 'css' });
    return code;
};
exports.css = css;
const html = (content) => {
    const code = prettier_1.default.format(content, { parser: 'html' });
    return code;
};
exports.html = html;
//# sourceMappingURL=format.js.map
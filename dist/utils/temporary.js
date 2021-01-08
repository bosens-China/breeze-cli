"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class Temporary {
    constructor() {
        this.set = new Set();
    }
    async write(view, code) {
        const dir = path_1.default.dirname(view);
        const str = `b${uuid_1.v4()}.html`;
        const p = path_1.default.join(dir, str);
        await fs_extra_1.default.outputFile(p, code);
        this.set.add(p);
        return p;
    }
    async delete() {
        const all = [...this.set.keys()].map((f) => {
            return fs_extra_1.default.remove(f);
        });
        await Promise.all(all);
    }
}
exports.default = new Temporary();
//# sourceMappingURL=temporary.js.map
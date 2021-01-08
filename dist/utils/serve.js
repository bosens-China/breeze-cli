"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSequentialPort = void 0;
const get_port_1 = __importDefault(require("get-port"));
/**
 * 从默认端口开始递增对比
 *
 * @param {number} [port=8080]
 */
const getSequentialPort = async (port = 8080) => {
    let p = port;
    for (;;) {
        const contrast = await get_port_1.default({ port: p });
        if (contrast === p) {
            return p;
        }
        p += 1;
    }
};
exports.getSequentialPort = getSequentialPort;
//# sourceMappingURL=serve.js.map
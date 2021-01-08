"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFile = void 0;
const rollup_1 = require("rollup");
const rollup_config_1 = require("./rollup.config");
const fs_1 = require("../../utils/fs");
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * 思路如下，首先将code文件生成到用户所在的node_modules目录下，之后发生执行完成删除对应文件
 *
 * @param {string} code
 * @param {string} [format='umd']
 * @param {string} [name]
 */
async function build(code, format = 'umd', name) {
    const route = fs_1.getTemporaryDocuments();
    const filePath = await fs_1.writeFile(code);
    return buildFile(filePath, route, format, name);
}
async function buildFile(filePath, writePath, format = 'umd', name) {
    const bundle = await rollup_1.rollup(rollup_config_1.inputOptions(filePath));
    const { output } = await bundle.generate(rollup_config_1.outputOptions(writePath, format, name));
    // 查找文件
    const file = output.find((f) => fs_1.isPathIdentical(f.fileName, writePath));
    await bundle.close();
    await Promise.all([fs_extra_1.default.remove(filePath), fs_extra_1.default.remove(writePath)]);
    return file?.code;
}
exports.buildFile = buildFile;
exports.default = build;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identicalName = exports.proGlob = exports.equalPaths = exports.getFileName = exports.getAbsolutePath = void 0;
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const getAbsolutePath = (p, root = process.cwd()) => {
    return path_1.default.isAbsolute(p) ? p : path_1.default.join(root, p);
};
exports.getAbsolutePath = getAbsolutePath;
/**
 * 根据路径返回一个文件名称，包含后缀
 *
 * @param {string} file
 */
const getFileName = (file) => {
    return path_1.default.parse(file).base;
};
exports.getFileName = getFileName;
/**
 * 判断路径是否相同
 *
 * @param {string} p1
 * @param {string} p2
 * @return {*}
 */
const equalPaths = (p1, p2) => {
    return p1.replace(/\\/g, '/') === p2.replace(/\\/g, '/');
};
exports.equalPaths = equalPaths;
// 返回public下的所有文件
let publicFile = [];
const proGlob = () => {
    return new Promise((resolve) => {
        if (publicFile.length) {
            return resolve(publicFile);
        }
        glob_1.default('public/**/*', (er, files) => {
            if (er) {
                return resolve([]);
            }
            const arr = (files || []).map((item) => item.replace(/\\/g, '/'));
            publicFile = arr;
            return resolve(arr);
        });
    });
};
exports.proGlob = proGlob;
// 对比文件名是否相同
const identicalName = (strArr, file) => {
    const str = file.replace(/\\/g, '/').split('/').pop();
    return !!strArr.find((f) => str && f.includes(str));
};
exports.identicalName = identicalName;
//# sourceMappingURL=utils.js.map
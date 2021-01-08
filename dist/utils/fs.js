"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPathIdentical = exports.isFileExists = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * 判断文件是否存在
 *
 * @param {string} file
 * @return {*}
 */
const isFileExists = (file) => {
    return fs_extra_1.default
        .access(file, fs_extra_1.default.constants.R_OK | fs_extra_1.default.constants.W_OK)
        .then(() => true)
        .catch(() => false);
};
exports.isFileExists = isFileExists;
/**
 * 对比fileName是否相同
 *
 * @param {string} path1
 * @param {string} path2
 * @return {*}
 */
const isPathIdentical = (path1, path2) => {
    return path_1.default.basename(path1) === path_1.default.basename(path2);
};
exports.isPathIdentical = isPathIdentical;
//# sourceMappingURL=fs.js.map
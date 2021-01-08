#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = __importDefault(require("../build"));
const utils_1 = require("../build/utils");
const fs_1 = require("../utils/fs");
const name = process.argv[2];
const isDev = name === 'serve';
// 读取用户配置文件
const getConfigFile = async () => {
    const configPath = utils_1.getAbsolutePath('breeze.config.js');
    if (await fs_1.isFileExists(configPath)) {
        return Promise.resolve().then(() => __importStar(require(configPath))).then(({ default: obj }) => obj);
    }
};
async function App() {
    const config = await getConfigFile();
    await build_1.default(config, isDev);
}
App();
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputOptions = exports.inputOptions = void 0;
const typescript_config_1 = __importDefault(require("./typescript.config"));
const rollup_plugin_typescript2_1 = __importDefault(require("rollup-plugin-typescript2"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const inputOptions = (filePath) => {
    return {
        input: filePath,
        onwarn: () => {
            return;
        },
        plugins: [
            rollup_plugin_typescript2_1.default({
                tsconfigOverride: typescript_config_1.default(filePath),
                check: false,
                cwd: __dirname,
            }),
            plugin_commonjs_1.default(),
        ],
    };
};
exports.inputOptions = inputOptions;
const outputOptions = (outputPath, format, name) => ({
    format,
    name,
    file: outputPath,
});
exports.outputOptions = outputOptions;
//# sourceMappingURL=rollup.config.js.map
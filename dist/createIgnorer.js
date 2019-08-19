"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var ignore_1 = __importDefault(require("ignore"));
exports.default = (function (directory, filename) {
    if (filename === void 0) { filename = ".prettierignore"; }
    var file = path_1.join(directory, filename);
    if (fs_1.existsSync(file)) {
        var text = fs_1.readFileSync(file, "utf8");
        return ignore_1.default()
            .add(text)
            .createFilter();
    }
    return function () { return true; };
});

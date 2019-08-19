"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var execa_1 = __importDefault(require("execa"));
var util_1 = require("util");
exports.rootDirectory = null;
exports.detect = function (directory) {
    if (fs_1.existsSync(path_1.resolve(directory, ".git"))) {
        exports.rootDirectory = directory;
        return directory;
    }
    else {
        return null;
    }
};
exports.runGit = function (directory, args) {
    return execa_1.default.sync("git", args, {
        cwd: directory,
    });
};
//找到用来比较的commit
//并输出短的hash
exports.getSinceRevision = function (directory) {
    try {
        var revision = "HEAD";
        return exports.runGit(directory, ["rev-parse", "--short", revision]).stdout.trim();
    }
    catch (error) {
        if (/HEAD/.test(error.message)) {
            return null;
        }
        throw error;
    }
};
var getLines = function (execaResult) {
    return execaResult.stdout.split("\n");
};
exports.getChangedFiles = function (directory, revision, staged) {
    if (staged === void 0) { staged = true; }
    return getLines(exports.runGit(directory, [
        "diff",
        "--name-only",
        staged ? "--cached" : null,
        "--diff-filter=ACMRTUB",
        revision,
    ].filter(util_1.isString))).slice();
};
exports.stageFile = function (directory, file) {
    exports.runGit(directory, ["add", file]);
};

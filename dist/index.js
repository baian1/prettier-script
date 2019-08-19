"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var git = __importStar(require("./git"));
var createIgnorer_1 = __importDefault(require("./createIgnorer"));
var processFiles_1 = __importDefault(require("./processFiles"));
var chalk_1 = __importDefault(require("chalk"));
var log = console.log;
exports.default = (function (currentDirectory) {
    if (!git.detect(currentDirectory)) {
        return {
            success: false,
            errors: ["can not find .git"],
        };
    }
    var directory = git.rootDirectory;
    var revision = git.getSinceRevision(directory);
    if (revision === null) {
        return {
            success: false,
            errors: ["can not find revision"],
        };
    }
    var prettyIgnore = createIgnorer_1.default(directory);
    var stagedChangedFiles = git
        .getChangedFiles(directory, revision)
        .filter(prettyIgnore);
    log("Found " + stagedChangedFiles.length + " changed files.");
    var changedFiles = git
        .getChangedFiles(directory, revision, false)
        .filter(prettyIgnore);
    var failReasons = new Set();
    processFiles_1.default(directory, stagedChangedFiles, {
        onWriteFile: function (file) {
            log(file + " is fixed.");
            git.stageFile(directory, file);
        },
        onCheckFile: function (file, isFormatted) {
            log("check " + file + ":" + (isFormatted ? chalk_1.default.blueBright("success") : chalk_1.default.redBright("fail")));
        },
        onError: function (file, err) {
            if (err.message.match(/No parser/) !== null) {
                failReasons.add("Can't parser " + file + ",you should add " + file + " to ignore");
            }
            else {
                failReasons.add(err.message);
            }
        },
    });
    return {
        success: failReasons.size === 0,
        errors: Array.from(failReasons),
    };
});

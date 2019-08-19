"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var prettier = __importStar(require("prettier"));
var path_1 = require("path");
exports.default = (function (directory, files, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.check, check = _c === void 0 ? true : _c, _d = _b.onExamineFile, onExamineFile = _d === void 0 ? undefined : _d, _e = _b.onCheckFile, onCheckFile = _e === void 0 ? undefined : _e, _f = _b.onWriteFile, onWriteFile = _f === void 0 ? undefined : _f, _g = _b.onError, onError = _g === void 0 ? undefined : _g;
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var relative = files_1[_i];
        onExamineFile && onExamineFile(relative);
        var file = path_1.join(directory, relative);
        var options = Object.assign({}, prettier.resolveConfig.sync(file, {
            editorconfig: true,
        }), { filepath: file });
        var input = fs_1.readFileSync(file, "utf8");
        try {
            if (check) {
                var isFormatted = prettier.check(input, options);
                onCheckFile && onCheckFile(relative, isFormatted);
                if (isFormatted) {
                    continue;
                }
            }
            var output = prettier.format(input, options);
            if (output !== input) {
                fs_1.writeFileSync(file, output);
                onWriteFile && onWriteFile(relative);
            }
        }
        catch (e) {
            onError && onError(relative, e);
        }
    }
});

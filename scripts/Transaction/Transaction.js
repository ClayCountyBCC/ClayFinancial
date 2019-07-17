(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../lib/react/umd/react.development"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const React = require("../../lib/react/umd/react.development");
    const Transact = () => {
        return (React.createElement("div", null, "Hey there"));
    };
    exports.default = Transact;
});
//# sourceMappingURL=Transaction.js.map
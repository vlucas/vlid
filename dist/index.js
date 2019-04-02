parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"CjX8":[function(require,module,exports) {
module.exports={GENERIC_ERROR:"Did not pass validation",NUMBER_BASE:"$1 is not a number",NUMBER_RULE_MIN:"Number $1 must be larger than or equal to $2",NUMBER_RULE_MAX:"Number $1 must be less than or equal to $2"};
},{}],"dBk+":[function(require,module,exports) {
var r=require("./lang/en");function n(n){var t=r[n];if(void 0===t)throw new Error("Missing translation for key "+n);for(var o=arguments.length,a=new Array(o>1?o-1:0),i=1;i<o;i++)a[i-1]=arguments[i];return e(t,a)}function e(r,n){return n.reduce(function(r,n,e){return r.replace("$"+(e+1),n)},r)}module.exports={t:n,format:e};
},{"./lang/en":"CjX8"}],"JQWj":[function(require,module,exports) {
var r=require("./i18n"),n=r.t,e=n("GENERIC_ERROR");module.exports=function(){var r=[],n="$1 failed validation";return{_base:function(){},message:function(r){if(!r)return n;n=r},required:function(){return this.rule(function(r){return null!=r&&""!==r})},rule:function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e;return r.push({run:n,message:t}),this},validateSync:function(n){this._base();var e=r.map(function(r){var e="function"==typeof r.message?r.message(n):r.message;return r.run(n)||new Error(e)}),t=e.filter(function(r){return r instanceof Error});return{isValid:e.every(function(r){return!0===r}),errors:t}}}};
},{"./i18n":"dBk+"}],"z4f6":[function(require,module,exports) {
var n=require("./i18n"),r=n.t;module.exports=function(){return{_base:function(){return this.rule(function(n){return"number"==typeof n},function(n){return r("NUMBER_BASE",n)})},min:function(n){return this.rule(function(r){return r>=n},function(t){return r("NUMBER_RULE_MIN",t,n)})},max:function(n){return this.rule(function(r){return r<=n},function(t){return r("NUMBER_RULE_MAX",t,n)})}}};
},{"./i18n":"dBk+"}],"xwr3":[function(require,module,exports) {
var t=/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;module.exports=function(){return{_base:function(){return this.rule(function(t){return"string"==typeof t})},alphanum:function(){return this.regex(/^[a-zA-Z0-9]+$/)},email:function(){return this.rule(function(n){if(!n)return!1;if(n.length>254)return!1;if(!t.test(n))return!1;var r=n.split("@");return!(r[0].length>64)&&!r[1].split(".").some(function(t){return t.length>63})})},min:function(t){return this.rule(function(n){return n.length>=t})},max:function(t){return this.rule(function(n){return n.length<=t})},regex:function(t){return this.rule(function(n){return t.test(n)})},url:function(t){return this.rule(function(t){return!!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(t)})}}};
},{}],"Focm":[function(require,module,exports) {
function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}var n=require("./vBase"),r=require("./vNumber"),e=require("./vString");function o(t){return Object.assign(Object.create(n()),t)}module.exports={any:function(){return o({})},number:function(){return o(r())},string:function(){return o(e())},validateSync:function(n,r){if("object"===t(r))Object.prototype.toString.call(r);return n.validateSync(r)}};
},{"./vBase":"JQWj","./vNumber":"z4f6","./vString":"xwr3"}]},{},["Focm"], null)
//# sourceMappingURL=/index.js.map
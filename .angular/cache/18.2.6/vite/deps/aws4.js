import {
  __commonJS
} from "./chunk-EIB7IA3J.js";

// node_modules/url/node_modules/punycode/punycode.js
var require_punycode = __commonJS({
  "node_modules/url/node_modules/punycode/punycode.js"(exports, module) {
    (function(root) {
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = typeof module == "object" && module && !module.nodeType && module;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
      function error(type) {
        throw RangeError(errors[type]);
      }
      function map(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [], counter = 0, length = string.length, value, extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      function ucs2encode(array) {
        return map(array, function(value) {
          var output = "";
          if (value > 65535) {
            value -= 65536;
            output += stringFromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          output += stringFromCharCode(value);
          return output;
        }).join("");
      }
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      function decode(input) {
        var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i, w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error("overflow");
            }
            i += digit * w;
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return ucs2encode(output);
      }
      function encode(input) {
        var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n = initialN;
        delta = 0;
        bias = initialBias;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n) {
              for (q = delta, k = base; ; k += base) {
                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }
      function toUnicode(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      function toASCII(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "1.3.2",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define("punycode", function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    })(exports);
  }
});

// node_modules/querystring/decode.js
var require_decode = __commonJS({
  "node_modules/querystring/decode.js"(exports, module) {
    "use strict";
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = "";
        }
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
      return obj;
    };
  }
});

// node_modules/querystring/encode.js
var require_encode = __commonJS({
  "node_modules/querystring/encode.js"(exports, module) {
    "use strict";
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case "string":
          return v;
        case "boolean":
          return v ? "true" : "false";
        case "number":
          return isFinite(v) ? v : "";
        default:
          return "";
      }
    };
    module.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }
      if (!name) return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
  }
});

// node_modules/querystring/index.js
var require_querystring = __commonJS({
  "node_modules/querystring/index.js"(exports) {
    "use strict";
    exports.decode = exports.parse = require_decode();
    exports.encode = exports.stringify = require_encode();
  }
});

// node_modules/url/url.js
var require_url = __commonJS({
  "node_modules/url/url.js"(exports) {
    var punycode = require_punycode();
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    exports.Url = Url;
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    var hostEndingChars = ["/", "?", "#"];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var hostlessProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring = require_querystring();
    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && isObject(url) && url instanceof Url) return url;
      var u = new Url();
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }
    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (!isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }
      var rest = url;
      rest = rest.trim();
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
        }
        if (hostEnd === -1) hostEnd = rest.length;
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          var domainArray = this.hostname.split(".");
          var newOut = [];
          for (var i = 0; i < domainArray.length; ++i) {
            var s = domainArray[i];
            newOut.push(s.match(/[^A-Za-z0-9_-]/) ? "xn--" + punycode.encode(s) : s);
          }
          this.hostname = newOut.join(".");
        }
        var p = this.port ? ":" + this.port : "";
        var h = this.hostname || "";
        this.host = h + p;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest) this.pathname = rest;
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p = this.pathname || "";
        var s = this.search || "";
        this.path = p + s;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (isString(obj)) obj = urlParse(obj);
      if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
      return obj.format();
    }
    Url.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && isObject(this.query) && Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":") protocol += ":";
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/") pathname = "/" + pathname;
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#") hash = "#" + hash;
      if (search && search.charAt(0) !== "?") search = "?" + search;
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source) return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }
    Url.prototype.resolveObject = function(relative) {
      if (isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url();
      Object.keys(this).forEach(function(k) {
        result[k] = this[k];
      }, this);
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        Object.keys(relative).forEach(function(k) {
          if (k !== "protocol") result[k] = relative[k];
        });
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.path = result.pathname = "/";
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          Object.keys(relative).forEach(function(k) {
            result[k] = relative[k];
          });
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift())) ;
          if (!relative.host) relative.host = "";
          if (!relative.hostname) relative.hostname = "";
          if (relPath[0] !== "") relPath.unshift("");
          if (relPath.length < 2) relPath.unshift("");
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p = result.pathname || "";
          var s = result.search || "";
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "") srcPath[0] = result.host;
          else srcPath.unshift(result.host);
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "") relPath[0] = relative.host;
            else relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!isNullOrUndefined(relative.search)) {
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (!isNull(result.pathname) || !isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last == ".") {
          srcPath.splice(i, 1);
        } else if (last === "..") {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join("/");
      }
      if (!isNull(result.pathname) || !isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) this.hostname = host;
    };
    function isString(arg) {
      return typeof arg === "string";
    }
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    function isNull(arg) {
      return arg === null;
    }
    function isNullOrUndefined(arg) {
      return arg == null;
    }
  }
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/aws4/lru.js
var require_lru = __commonJS({
  "node_modules/aws4/lru.js"(exports, module) {
    module.exports = function(size) {
      return new LruCache(size);
    };
    function LruCache(size) {
      this.capacity = size | 0;
      this.map = /* @__PURE__ */ Object.create(null);
      this.list = new DoublyLinkedList();
    }
    LruCache.prototype.get = function(key) {
      var node = this.map[key];
      if (node == null) return void 0;
      this.used(node);
      return node.val;
    };
    LruCache.prototype.set = function(key, val) {
      var node = this.map[key];
      if (node != null) {
        node.val = val;
      } else {
        if (!this.capacity) this.prune();
        if (!this.capacity) return false;
        node = new DoublyLinkedNode(key, val);
        this.map[key] = node;
        this.capacity--;
      }
      this.used(node);
      return true;
    };
    LruCache.prototype.used = function(node) {
      this.list.moveToFront(node);
    };
    LruCache.prototype.prune = function() {
      var node = this.list.pop();
      if (node != null) {
        delete this.map[node.key];
        this.capacity++;
      }
    };
    function DoublyLinkedList() {
      this.firstNode = null;
      this.lastNode = null;
    }
    DoublyLinkedList.prototype.moveToFront = function(node) {
      if (this.firstNode == node) return;
      this.remove(node);
      if (this.firstNode == null) {
        this.firstNode = node;
        this.lastNode = node;
        node.prev = null;
        node.next = null;
      } else {
        node.prev = null;
        node.next = this.firstNode;
        node.next.prev = node;
        this.firstNode = node;
      }
    };
    DoublyLinkedList.prototype.pop = function() {
      var lastNode = this.lastNode;
      if (lastNode != null) {
        this.remove(lastNode);
      }
      return lastNode;
    };
    DoublyLinkedList.prototype.remove = function(node) {
      if (this.firstNode == node) {
        this.firstNode = node.next;
      } else if (node.prev != null) {
        node.prev.next = node.next;
      }
      if (this.lastNode == node) {
        this.lastNode = node.prev;
      } else if (node.next != null) {
        node.next.prev = node.prev;
      }
    };
    function DoublyLinkedNode(key, val) {
      this.key = key;
      this.val = val;
      this.prev = null;
      this.next = null;
    }
  }
});

// node_modules/aws4/aws4.js
var require_aws4 = __commonJS({
  "node_modules/aws4/aws4.js"(exports) {
    var aws4 = exports;
    var url = require_url();
    var querystring = require_querystring();
    var crypto = require_crypto();
    var lru = require_lru();
    var credentialsCache = lru(1e3);
    function hmac(key, string, encoding) {
      return crypto.createHmac("sha256", key).update(string, "utf8").digest(encoding);
    }
    function hash(string, encoding) {
      return crypto.createHash("sha256").update(string, "utf8").digest(encoding);
    }
    function encodeRfc3986(urlEncodedString) {
      return urlEncodedString.replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    function encodeRfc3986Full(str) {
      return encodeRfc3986(encodeURIComponent(str));
    }
    var HEADERS_TO_IGNORE = {
      "authorization": true,
      "connection": true,
      "x-amzn-trace-id": true,
      "user-agent": true,
      "expect": true,
      "presigned-expires": true,
      "range": true
    };
    function RequestSigner(request, credentials) {
      if (typeof request === "string") request = url.parse(request);
      var headers = request.headers = Object.assign({}, request.headers || {}), hostParts = (!this.service || !this.region) && this.matchHost(request.hostname || request.host || headers.Host || headers.host);
      this.request = request;
      this.credentials = credentials || this.defaultCredentials();
      this.service = request.service || hostParts[0] || "";
      this.region = request.region || hostParts[1] || "us-east-1";
      if (this.service === "email") this.service = "ses";
      if (!request.method && request.body) request.method = "POST";
      if (!headers.Host && !headers.host) {
        headers.Host = request.hostname || request.host || this.createHost();
        if (request.port) headers.Host += ":" + request.port;
      }
      if (!request.hostname && !request.host) request.hostname = headers.Host || headers.host;
      this.isCodeCommitGit = this.service === "codecommit" && request.method === "GIT";
      this.extraHeadersToIgnore = request.extraHeadersToIgnore || /* @__PURE__ */ Object.create(null);
      this.extraHeadersToInclude = request.extraHeadersToInclude || /* @__PURE__ */ Object.create(null);
    }
    RequestSigner.prototype.matchHost = function(host) {
      var match = (host || "").match(/([^\.]{1,63})\.(?:([^\.]{0,63})\.)?amazonaws\.com(\.cn)?$/);
      var hostParts = (match || []).slice(1, 3);
      if (hostParts[1] === "es" || hostParts[1] === "aoss") hostParts = hostParts.reverse();
      if (hostParts[1] == "s3") {
        hostParts[0] = "s3";
        hostParts[1] = "us-east-1";
      } else {
        for (var i = 0; i < 2; i++) {
          if (/^s3-/.test(hostParts[i])) {
            hostParts[1] = hostParts[i].slice(3);
            hostParts[0] = "s3";
            break;
          }
        }
      }
      return hostParts;
    };
    RequestSigner.prototype.isSingleRegion = function() {
      if (["s3", "sdb"].indexOf(this.service) >= 0 && this.region === "us-east-1") return true;
      return ["cloudfront", "ls", "route53", "iam", "importexport", "sts"].indexOf(this.service) >= 0;
    };
    RequestSigner.prototype.createHost = function() {
      var region = this.isSingleRegion() ? "" : "." + this.region, subdomain = this.service === "ses" ? "email" : this.service;
      return subdomain + region + ".amazonaws.com";
    };
    RequestSigner.prototype.prepareRequest = function() {
      this.parsePath();
      var request = this.request, headers = request.headers, query;
      if (request.signQuery) {
        this.parsedPath.query = query = this.parsedPath.query || {};
        if (this.credentials.sessionToken) query["X-Amz-Security-Token"] = this.credentials.sessionToken;
        if (this.service === "s3" && !query["X-Amz-Expires"]) query["X-Amz-Expires"] = 86400;
        if (query["X-Amz-Date"]) this.datetime = query["X-Amz-Date"];
        else query["X-Amz-Date"] = this.getDateTime();
        query["X-Amz-Algorithm"] = "AWS4-HMAC-SHA256";
        query["X-Amz-Credential"] = this.credentials.accessKeyId + "/" + this.credentialString();
        query["X-Amz-SignedHeaders"] = this.signedHeaders();
      } else {
        if (!request.doNotModifyHeaders && !this.isCodeCommitGit) {
          if (request.body && !headers["Content-Type"] && !headers["content-type"]) headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
          if (request.body && !headers["Content-Length"] && !headers["content-length"]) headers["Content-Length"] = Buffer.byteLength(request.body);
          if (this.credentials.sessionToken && !headers["X-Amz-Security-Token"] && !headers["x-amz-security-token"]) headers["X-Amz-Security-Token"] = this.credentials.sessionToken;
          if (this.service === "s3" && !headers["X-Amz-Content-Sha256"] && !headers["x-amz-content-sha256"]) headers["X-Amz-Content-Sha256"] = hash(this.request.body || "", "hex");
          if (headers["X-Amz-Date"] || headers["x-amz-date"]) this.datetime = headers["X-Amz-Date"] || headers["x-amz-date"];
          else headers["X-Amz-Date"] = this.getDateTime();
        }
        delete headers.Authorization;
        delete headers.authorization;
      }
    };
    RequestSigner.prototype.sign = function() {
      if (!this.parsedPath) this.prepareRequest();
      if (this.request.signQuery) {
        this.parsedPath.query["X-Amz-Signature"] = this.signature();
      } else {
        this.request.headers.Authorization = this.authHeader();
      }
      this.request.path = this.formatPath();
      return this.request;
    };
    RequestSigner.prototype.getDateTime = function() {
      if (!this.datetime) {
        var headers = this.request.headers, date = new Date(headers.Date || headers.date || /* @__PURE__ */ new Date());
        this.datetime = date.toISOString().replace(/[:\-]|\.\d{3}/g, "");
        if (this.isCodeCommitGit) this.datetime = this.datetime.slice(0, -1);
      }
      return this.datetime;
    };
    RequestSigner.prototype.getDate = function() {
      return this.getDateTime().substr(0, 8);
    };
    RequestSigner.prototype.authHeader = function() {
      return ["AWS4-HMAC-SHA256 Credential=" + this.credentials.accessKeyId + "/" + this.credentialString(), "SignedHeaders=" + this.signedHeaders(), "Signature=" + this.signature()].join(", ");
    };
    RequestSigner.prototype.signature = function() {
      var date = this.getDate(), cacheKey = [this.credentials.secretAccessKey, date, this.region, this.service].join(), kDate, kRegion, kService, kCredentials = credentialsCache.get(cacheKey);
      if (!kCredentials) {
        kDate = hmac("AWS4" + this.credentials.secretAccessKey, date);
        kRegion = hmac(kDate, this.region);
        kService = hmac(kRegion, this.service);
        kCredentials = hmac(kService, "aws4_request");
        credentialsCache.set(cacheKey, kCredentials);
      }
      return hmac(kCredentials, this.stringToSign(), "hex");
    };
    RequestSigner.prototype.stringToSign = function() {
      return ["AWS4-HMAC-SHA256", this.getDateTime(), this.credentialString(), hash(this.canonicalString(), "hex")].join("\n");
    };
    RequestSigner.prototype.canonicalString = function() {
      if (!this.parsedPath) this.prepareRequest();
      var pathStr = this.parsedPath.path, query = this.parsedPath.query, headers = this.request.headers, queryStr = "", normalizePath = this.service !== "s3", decodePath = this.service === "s3" || this.request.doNotEncodePath, decodeSlashesInPath = this.service === "s3", firstValOnly = this.service === "s3", bodyHash;
      if (this.service === "s3" && this.request.signQuery) {
        bodyHash = "UNSIGNED-PAYLOAD";
      } else if (this.isCodeCommitGit) {
        bodyHash = "";
      } else {
        bodyHash = headers["X-Amz-Content-Sha256"] || headers["x-amz-content-sha256"] || hash(this.request.body || "", "hex");
      }
      if (query) {
        var reducedQuery = Object.keys(query).reduce(function(obj, key) {
          if (!key) return obj;
          obj[encodeRfc3986Full(key)] = !Array.isArray(query[key]) ? query[key] : firstValOnly ? query[key][0] : query[key];
          return obj;
        }, {});
        var encodedQueryPieces = [];
        Object.keys(reducedQuery).sort().forEach(function(key) {
          if (!Array.isArray(reducedQuery[key])) {
            encodedQueryPieces.push(key + "=" + encodeRfc3986Full(reducedQuery[key]));
          } else {
            reducedQuery[key].map(encodeRfc3986Full).sort().forEach(function(val) {
              encodedQueryPieces.push(key + "=" + val);
            });
          }
        });
        queryStr = encodedQueryPieces.join("&");
      }
      if (pathStr !== "/") {
        if (normalizePath) pathStr = pathStr.replace(/\/{2,}/g, "/");
        pathStr = pathStr.split("/").reduce(function(path, piece) {
          if (normalizePath && piece === "..") {
            path.pop();
          } else if (!normalizePath || piece !== ".") {
            if (decodePath) piece = decodeURIComponent(piece.replace(/\+/g, " "));
            path.push(encodeRfc3986Full(piece));
          }
          return path;
        }, []).join("/");
        if (pathStr[0] !== "/") pathStr = "/" + pathStr;
        if (decodeSlashesInPath) pathStr = pathStr.replace(/%2F/g, "/");
      }
      return [this.request.method || "GET", pathStr, queryStr, this.canonicalHeaders() + "\n", this.signedHeaders(), bodyHash].join("\n");
    };
    RequestSigner.prototype.filterHeaders = function() {
      var headers = this.request.headers, extraHeadersToInclude = this.extraHeadersToInclude, extraHeadersToIgnore = this.extraHeadersToIgnore;
      this.filteredHeaders = Object.keys(headers).map(function(key) {
        return [key.toLowerCase(), headers[key]];
      }).filter(function(entry) {
        return extraHeadersToInclude[entry[0]] || HEADERS_TO_IGNORE[entry[0]] == null && !extraHeadersToIgnore[entry[0]];
      }).sort(function(a, b) {
        return a[0] < b[0] ? -1 : 1;
      });
    };
    RequestSigner.prototype.canonicalHeaders = function() {
      if (!this.filteredHeaders) this.filterHeaders();
      return this.filteredHeaders.map(function(entry) {
        return entry[0] + ":" + entry[1].toString().trim().replace(/\s+/g, " ");
      }).join("\n");
    };
    RequestSigner.prototype.signedHeaders = function() {
      if (!this.filteredHeaders) this.filterHeaders();
      return this.filteredHeaders.map(function(entry) {
        return entry[0];
      }).join(";");
    };
    RequestSigner.prototype.credentialString = function() {
      return [this.getDate(), this.region, this.service, "aws4_request"].join("/");
    };
    RequestSigner.prototype.defaultCredentials = function() {
      var env = process.env;
      return {
        accessKeyId: env.AWS_ACCESS_KEY_ID || env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY || env.AWS_SECRET_KEY,
        sessionToken: env.AWS_SESSION_TOKEN
      };
    };
    RequestSigner.prototype.parsePath = function() {
      var path = this.request.path || "/";
      if (/[^0-9A-Za-z;,/?:@&=+$\-_.!~*'()#%]/.test(path)) {
        path = encodeURI(decodeURI(path));
      }
      var queryIx = path.indexOf("?"), query = null;
      if (queryIx >= 0) {
        query = querystring.parse(path.slice(queryIx + 1));
        path = path.slice(0, queryIx);
      }
      this.parsedPath = {
        path,
        query
      };
    };
    RequestSigner.prototype.formatPath = function() {
      var path = this.parsedPath.path, query = this.parsedPath.query;
      if (!query) return path;
      if (query[""] != null) delete query[""];
      return path + "?" + encodeRfc3986(querystring.stringify(query));
    };
    aws4.RequestSigner = RequestSigner;
    aws4.sign = function(request, credentials) {
      return new RequestSigner(request, credentials).sign();
    };
  }
});
export default require_aws4();
/*! Bundled license information:

punycode/punycode.js:
  (*! https://mths.be/punycode v1.3.2 by @mathias *)
*/
//# sourceMappingURL=aws4.js.map

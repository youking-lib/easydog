(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.easydog = {}));
}(this, function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function (key) {
      return fn(obj[key], key);
    });
  }
  function normalizePath(path) {
    var _path$split = path.split('/'),
        _path$split2 = _slicedToArray(_path$split, 2),
        ns = _path$split2[0],
        key = _path$split2[1];

    return {
      ns: ns,
      key: key
    };
  }
  function compose() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    if (fns.length === 0) {
      return function (arg) {
        return arg;
      };
    }

    if (fns.length === 1) {
      return fns[0];
    }

    return fns.reduce(function (a, b) {
      return function () {
        return a(b.apply(void 0, arguments));
      };
    });
  }
  function noop() {}
  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
  function proxyGetter(target, key, source, sourceKey) {
    sharedPropertyDefinition.get = function () {
      return source[sourceKey];
    };

    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  var Store =
  /*#__PURE__*/
  function () {
    function Store() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Store);

      _defineProperty(this, "_dispatch", function (_ref) {
        var module = _ref.module,
            actionName = _ref.actionName,
            setState = _ref.setState;
        var action = module[actionName];

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return action.call.apply(action, [module, setState].concat(args));
      });

      _defineProperty(this, "dispatch", function (path) {
        var _normalizePath = normalizePath(path),
            ns = _normalizePath.ns,
            key = _normalizePath.key;

        ns = _this._module[ns];

        if (!ns) {
          return;
        }

        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        _this._dispatch.apply(_this, [{
          module: ns,
          actionName: key,
          setState: ns._setState
        }].concat(args));
      });

      _defineProperty(this, "mapActions", function (map) {
        var res = {};
        forEachValue(map, function (path, fkey) {
          var fn;

          if (typeof path === 'function') {
            fn = function fn() {
              for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
              }

              path.apply(void 0, [_this.dispatch].concat(args));
            };
          } else {
            fn = function fn() {
              for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
              }

              _this.dispatch.apply(_this, [path].concat(args));
            };
          }

          res[fkey] = fn;
        });
        return res;
      });

      _defineProperty(this, "mapStates", function (map) {
        var res = {};
        forEachValue(map, function (path, fkey) {
          var _normalizePath2 = normalizePath(path),
              ns = _normalizePath2.ns,
              key = _normalizePath2.key;

          var m = _this._module[ns];

          if (!m) {
            return;
          }

          proxyGetter(res, fkey, m.state, key);
        });
        return res;
      });

      this._state = {};
      this._module = {};
      [].concat(options.modules).forEach(function (m) {
        _this.setModule(new m(_this));
      });
    }

    _createClass(Store, [{
      key: "setModule",
      value: function setModule(m) {
        var ns = m.namespace;
        this._module[ns] = m;
        Object.defineProperty(this._state, ns, {
          get: function get() {
            return m.state;
          }
        });
      }
    }, {
      key: "getState",
      value: function getState() {
        return this._state;
      }
    }]);

    return Store;
  }();

  var Module =
  /*#__PURE__*/
  function () {
    function Module(_store, namespace) {
      var _this = this;

      _classCallCheck(this, Module);

      _defineProperty(this, "_setState", function (state) {
        Object.assign(_this.state, state);
      });

      if ((this instanceof Module ? this.constructor : void 0) === Module) {
        throw new Error('Module 类只能继承后调用');
      }

      this._store = _store;
      this.state = {};
      this.namespace = namespace || (this instanceof Module ? this.constructor : void 0).name;
    }

    _createClass(Module, [{
      key: "dispatch",
      value: function dispatch(path) {
        var _this$_store;

        if (path.indexOf('/') === -1) {
          return this._store._dispatch({
            module: this,
            actionName: path,
            setState: this._setState
          });
        } // dispath 其他 module 的 action


        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return (_this$_store = this._store).dispatch.apply(_this$_store, [path].concat(args));
      }
    }]);

    return Module;
  }();

  function createStore(options) {
    return new Store(options);
  }
  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    return function (createStore) {
      return function () {
        var store = createStore.apply(void 0, arguments);

        var dispatch = function dispatch() {
          throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
        };

        var api = {
          getState: store.getState,
          dispatch: dispatch
        };
        var chain = middlewares.map(function (m) {
          return m(api);
        });
        store.dispatch = compose.apply(void 0, _toConsumableArray(chain))(store.dispatch);
        return store;
      };
    };
  }

  exports.createStore = createStore;
  exports.applyMiddleware = applyMiddleware;
  exports.Module = Module;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

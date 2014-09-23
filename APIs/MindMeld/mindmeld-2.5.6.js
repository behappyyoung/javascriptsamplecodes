var Faye = (function() {
    'use strict';

    var Faye = {
        VERSION:          '1.0.1',

        BAYEUX_VERSION:   '1.0',
        ID_LENGTH:        160,
        JSONP_CALLBACK:   'jsonpcallback',
        CONNECTION_TYPES: ['long-polling', 'cross-origin-long-polling', 'callback-polling', 'websocket', 'eventsource', 'in-process'],

        MANDATORY_CONNECTION_TYPES: ['long-polling', 'callback-polling', 'in-process'],

        ENV: (typeof window !== 'undefined') ? window : global,

        extend: function(dest, source, overwrite) {
            if (!source) return dest;
            for (var key in source) {
                if (!source.hasOwnProperty(key)) continue;
                if (dest.hasOwnProperty(key) && overwrite === false) continue;
                if (dest[key] !== source[key])
                    dest[key] = source[key];
            }
            return dest;
        },

        random: function(bitlength) {
            bitlength = bitlength || this.ID_LENGTH;
            return csprng(bitlength, 36);
        },

        clientIdFromMessages: function(messages) {
            var connect = this.filter([].concat(messages), function(message) {
                return message.channel === '/meta/connect';
            });
            return connect[0] && connect[0].clientId;
        },

        copyObject: function(object) {
            var clone, i, key;
            if (object instanceof Array) {
                clone = [];
                i = object.length;
                while (i--) clone[i] = Faye.copyObject(object[i]);
                return clone;
            } else if (typeof object === 'object') {
                clone = (object === null) ? null : {};
                for (key in object) clone[key] = Faye.copyObject(object[key]);
                return clone;
            } else {
                return object;
            }
        },

        commonElement: function(lista, listb) {
            for (var i = 0, n = lista.length; i < n; i++) {
                if (this.indexOf(listb, lista[i]) !== -1)
                    return lista[i];
            }
            return null;
        },

        indexOf: function(list, needle) {
            if (list.indexOf) return list.indexOf(needle);

            for (var i = 0, n = list.length; i < n; i++) {
                if (list[i] === needle) return i;
            }
            return -1;
        },

        map: function(object, callback, context) {
            if (object.map) return object.map(callback, context);
            var result = [];

            if (object instanceof Array) {
                for (var i = 0, n = object.length; i < n; i++) {
                    result.push(callback.call(context || null, object[i], i));
                }
            } else {
                for (var key in object) {
                    if (!object.hasOwnProperty(key)) continue;
                    result.push(callback.call(context || null, key, object[key]));
                }
            }
            return result;
        },

        filter: function(array, callback, context) {
            if (array.filter) return array.filter(callback, context);
            var result = [];
            for (var i = 0, n = array.length; i < n; i++) {
                if (callback.call(context || null, array[i], i))
                    result.push(array[i]);
            }
            return result;
        },

        asyncEach: function(list, iterator, callback, context) {
            var n       = list.length,
                i       = -1,
                calls   = 0,
                looping = false;

            var iterate = function() {
                calls -= 1;
                i += 1;
                if (i === n) return callback && callback.call(context);
                iterator(list[i], resume);
            };

            var loop = function() {
                if (looping) return;
                looping = true;
                while (calls > 0) iterate();
                looping = false;
            };

            var resume = function() {
                calls += 1;
                loop();
            };
            resume();
        },

        // http://assanka.net/content/tech/2009/09/02/json2-js-vs-prototype/
        toJSON: function(object) {
            if (!this.stringify) return JSON.stringify(object);

            return this.stringify(object, function(key, value) {
                return (this[key] instanceof Array) ? this[key] : value;
            });
        }
    };

    if (typeof module !== 'undefined')
        module.exports = Faye;
    else if (typeof window !== 'undefined')
        window.Faye = Faye;

    Faye.Class = function(parent, methods) {
        if (typeof parent !== 'function') {
            methods = parent;
            parent  = Object;
        }

        var klass = function() {
            if (!this.initialize) return this;
            return this.initialize.apply(this, arguments) || this;
        };

        var bridge = function() {};
        bridge.prototype = parent.prototype;

        klass.prototype = new bridge();
        Faye.extend(klass.prototype, methods);

        return klass;
    };

    (function() {
        var EventEmitter = Faye.EventEmitter = function() {};

        /*
         Copyright Joyent, Inc. and other Node contributors. All rights reserved.
         Permission is hereby granted, free of charge, to any person obtaining a copy of
         this software and associated documentation files (the "Software"), to deal in
         the Software without restriction, including without limitation the rights to
         use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
         of the Software, and to permit persons to whom the Software is furnished to do
         so, subject to the following conditions:

         The above copyright notice and this permission notice shall be included in all
         copies or substantial portions of the Software.

         THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
         SOFTWARE.
         */

        var isArray = typeof Array.isArray === 'function'
                ? Array.isArray
                : function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]'
            }
            ;
        function indexOf (xs, x) {
            if (xs.indexOf) return xs.indexOf(x);
            for (var i = 0; i < xs.length; i++) {
                if (x === xs[i]) return i;
            }
            return -1;
        }


        EventEmitter.prototype.emit = function(type) {
            // If there is no 'error' event listener then throw.
            if (type === 'error') {
                if (!this._events || !this._events.error ||
                    (isArray(this._events.error) && !this._events.error.length))
                {
                    if (arguments[1] instanceof Error) {
                        throw arguments[1]; // Unhandled 'error' event
                    } else {
                        throw new Error("Uncaught, unspecified 'error' event.");
                    }
                    return false;
                }
            }

            if (!this._events) return false;
            var handler = this._events[type];
            if (!handler) return false;

            if (typeof handler == 'function') {
                switch (arguments.length) {
                    // fast cases
                    case 1:
                        handler.call(this);
                        break;
                    case 2:
                        handler.call(this, arguments[1]);
                        break;
                    case 3:
                        handler.call(this, arguments[1], arguments[2]);
                        break;
                    // slower
                    default:
                        var args = Array.prototype.slice.call(arguments, 1);
                        handler.apply(this, args);
                }
                return true;

            } else if (isArray(handler)) {
                var args = Array.prototype.slice.call(arguments, 1);

                var listeners = handler.slice();
                for (var i = 0, l = listeners.length; i < l; i++) {
                    listeners[i].apply(this, args);
                }
                return true;

            } else {
                return false;
            }
        };

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
        EventEmitter.prototype.addListener = function(type, listener) {
            if ('function' !== typeof listener) {
                throw new Error('addListener only takes instances of Function');
            }

            if (!this._events) this._events = {};

            // To avoid recursion in the case that type == "newListeners"! Before
            // adding it to the listeners, first emit "newListeners".
            this.emit('newListener', type, listener);

            if (!this._events[type]) {
                // Optimize the case of one listener. Don't need the extra array object.
                this._events[type] = listener;
            } else if (isArray(this._events[type])) {
                // If we've already got an array, just append.
                this._events[type].push(listener);
            } else {
                // Adding the second element, need to change to array.
                this._events[type] = [this._events[type], listener];
            }

            return this;
        };

        EventEmitter.prototype.on = EventEmitter.prototype.addListener;

        EventEmitter.prototype.once = function(type, listener) {
            var self = this;
            self.on(type, function g() {
                self.removeListener(type, g);
                listener.apply(this, arguments);
            });

            return this;
        };

        EventEmitter.prototype.removeListener = function(type, listener) {
            if ('function' !== typeof listener) {
                throw new Error('removeListener only takes instances of Function');
            }

            // does not use listeners(), so no side effect of creating _events[type]
            if (!this._events || !this._events[type]) return this;

            var list = this._events[type];

            if (isArray(list)) {
                var i = indexOf(list, listener);
                if (i < 0) return this;
                list.splice(i, 1);
                if (list.length == 0)
                    delete this._events[type];
            } else if (this._events[type] === listener) {
                delete this._events[type];
            }

            return this;
        };

        EventEmitter.prototype.removeAllListeners = function(type) {
            if (arguments.length === 0) {
                this._events = {};
                return this;
            }

            // does not use listeners(), so no side effect of creating _events[type]
            if (type && this._events && this._events[type]) this._events[type] = null;
            return this;
        };

        EventEmitter.prototype.listeners = function(type) {
            if (!this._events) this._events = {};
            if (!this._events[type]) this._events[type] = [];
            if (!isArray(this._events[type])) {
                this._events[type] = [this._events[type]];
            }
            return this._events[type];
        };

    })();

    Faye.Namespace = Faye.Class({
        initialize: function() {
            this._used = {};
        },

        exists: function(id) {
            return this._used.hasOwnProperty(id);
        },

        generate: function() {
            var name = Faye.random();
            while (this._used.hasOwnProperty(name))
                name = Faye.random();
            return this._used[name] = name;
        },

        release: function(id) {
            delete this._used[id];
        }
    });

    (function() {
        'use strict';

        var timeout = setTimeout;

        var defer;
        if (typeof setImmediate === 'function')
            defer = function(fn) { setImmediate(fn) };
        else if (typeof process === 'object' && process.nextTick)
            defer = function(fn) { process.nextTick(fn) };
        else
            defer = function(fn) { timeout(fn, 0) };

        var PENDING   = 0,
            FULFILLED = 1,
            REJECTED  = 2;

        var RETURN = function(x) { return x },
            THROW  = function(x) { throw x  };

        var Promise = function(task) {
            this._state     = PENDING;
            this._callbacks = [];
            this._errbacks  = [];

            if (typeof task !== 'function') return;
            var self = this;

            task(function(value)  { fulfill(self, value) },
                function(reason) { reject(self, reason) });
        };

        Promise.prototype.then = function(callback, errback) {
            var next = {}, self = this;

            next.promise = new Promise(function(fulfill, reject) {
                next.fulfill = fulfill;
                next.reject  = reject;

                registerCallback(self, callback, next);
                registerErrback(self, errback, next);
            });
            return next.promise;
        };

        var registerCallback = function(promise, callback, next) {
            if (typeof callback !== 'function') callback = RETURN;
            var handler = function(value) { invoke(callback, value, next) };
            if (promise._state === PENDING) {
                promise._callbacks.push(handler);
            } else if (promise._state === FULFILLED) {
                handler(promise._value);
            }
        };

        var registerErrback = function(promise, errback, next) {
            if (typeof errback !== 'function') errback = THROW;
            var handler = function(reason) { invoke(errback, reason, next) };
            if (promise._state === PENDING) {
                promise._errbacks.push(handler);
            } else if (promise._state === REJECTED) {
                handler(promise._reason);
            }
        };

        var invoke = function(fn, value, next) {
            defer(function() { _invoke(fn, value, next) });
        };

        var _invoke = function(fn, value, next) {
            var called = false, outcome, type, then;

            try {
                outcome = fn(value);
                type    = typeof outcome;
                then    = outcome !== null && (type === 'function' || type === 'object') && outcome.then;

                if (outcome === next.promise)
                    return next.reject(new TypeError('Recursive promise chain detected'));

                if (typeof then !== 'function') return next.fulfill(outcome);

                then.call(outcome, function(v) {
                    if (called) return;
                    called = true;
                    _invoke(RETURN, v, next);
                }, function(r) {
                    if (called) return;
                    called = true;
                    next.reject(r);
                });

            } catch (error) {
                if (called) return;
                called = true;
                next.reject(error);
            }
        };

        var fulfill = Promise.fulfill = Promise.resolve = function(promise, value) {
            if (promise._state !== PENDING) return;

            promise._state    = FULFILLED;
            promise._value    = value;
            promise._errbacks = [];

            var callbacks = promise._callbacks, cb;
            while (cb = callbacks.shift()) cb(value);
        };

        var reject = Promise.reject = function(promise, reason) {
            if (promise._state !== PENDING) return;

            promise._state     = REJECTED;
            promise._reason    = reason;
            promise._callbacks = [];

            var errbacks = promise._errbacks, eb;
            while (eb = errbacks.shift()) eb(reason);
        };

        Promise.defer = defer;

        Promise.deferred = Promise.pending = function() {
            var tuple = {};

            tuple.promise = new Promise(function(fulfill, reject) {
                tuple.fulfill = tuple.resolve = fulfill;
                tuple.reject  = reject;
            });
            return tuple;
        };

        Promise.fulfilled = Promise.resolved = function(value) {
            return new Promise(function(fulfill, reject) { fulfill(value) });
        };

        Promise.rejected = function(reason) {
            return new Promise(function(fulfill, reject) { reject(reason) });
        };

        if (typeof Faye === 'undefined')
            module.exports = Promise;
        else
            Faye.Promise = Promise;

    })();

    Faye.Set = Faye.Class({
        initialize: function() {
            this._index = {};
        },

        add: function(item) {
            var key = (item.id !== undefined) ? item.id : item;
            if (this._index.hasOwnProperty(key)) return false;
            this._index[key] = item;
            return true;
        },

        forEach: function(block, context) {
            for (var key in this._index) {
                if (this._index.hasOwnProperty(key))
                    block.call(context, this._index[key]);
            }
        },

        isEmpty: function() {
            for (var key in this._index) {
                if (this._index.hasOwnProperty(key)) return false;
            }
            return true;
        },

        member: function(item) {
            for (var key in this._index) {
                if (this._index[key] === item) return true;
            }
            return false;
        },

        remove: function(item) {
            var key = (item.id !== undefined) ? item.id : item;
            var removed = this._index[key];
            delete this._index[key];
            return removed;
        },

        toArray: function() {
            var array = [];
            this.forEach(function(item) { array.push(item) });
            return array;
        }
    });

    Faye.URI = {
        isURI: function(uri) {
            return uri && uri.protocol && uri.host && uri.path;
        },

        isSameOrigin: function(uri) {
            var location = Faye.ENV.location;
            return uri.protocol === location.protocol &&
                uri.hostname === location.hostname &&
                uri.port     === location.port;
        },

        parse: function(url) {
            if (typeof url !== 'string') return url;
            var uri = {}, parts, query, pairs, i, n, data;

            var consume = function(name, pattern) {
                url = url.replace(pattern, function(match) {
                    uri[name] = match;
                    return '';
                });
                uri[name] = uri[name] || '';
            };

            consume('protocol', /^[a-z]+\:/i);
            consume('host',     /^\/\/[^\/\?#]+/);

            if (!/^\//.test(url) && !uri.host)
                url = Faye.ENV.location.pathname.replace(/[^\/]*$/, '') + url;

            consume('pathname', /^[^\?#]*/);
            consume('search',   /^\?[^#]*/);
            consume('hash',     /^#.*/);

            uri.protocol = uri.protocol || Faye.ENV.location.protocol;

            if (uri.host) {
                uri.host     = uri.host.substr(2);
                parts        = uri.host.split(':');
                uri.hostname = parts[0];
                uri.port     = parts[1] || '';
            } else {
                uri.host     = Faye.ENV.location.host;
                uri.hostname = Faye.ENV.location.hostname;
                uri.port     = Faye.ENV.location.port;
            }

            uri.pathname = uri.pathname || '/';
            uri.path = uri.pathname + uri.search;

            query = uri.search.replace(/^\?/, '');
            pairs = query ? query.split('&') : [];
            data  = {};

            for (i = 0, n = pairs.length; i < n; i++) {
                parts = pairs[i].split('=');
                data[decodeURIComponent(parts[0] || '')] = decodeURIComponent(parts[1] || '');
            }

            uri.query = data;

            uri.href = this.stringify(uri);
            return uri;
        },

        stringify: function(uri) {
            var string = uri.protocol + '//' + uri.hostname;
            if (uri.port) string += ':' + uri.port;
            string += uri.pathname + this.queryString(uri.query) + (uri.hash || '');
            return string;
        },

        queryString: function(query) {
            var pairs = [];
            for (var key in query) {
                if (!query.hasOwnProperty(key)) continue;
                pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
            }
            if (pairs.length === 0) return '';
            return '?' + pairs.join('&');
        }
    };

    Faye.Error = Faye.Class({
        initialize: function(code, params, message) {
            this.code    = code;
            this.params  = Array.prototype.slice.call(params);
            this.message = message;
        },

        toString: function() {
            return this.code + ':' +
                this.params.join(',') + ':' +
                this.message;
        }
    });

    Faye.Error.parse = function(message) {
        message = message || '';
        if (!Faye.Grammar.ERROR.test(message)) return new this(null, [], message);

        var parts   = message.split(':'),
            code    = parseInt(parts[0]),
            params  = parts[1].split(','),
            message = parts[2];

        return new this(code, params, message);
    };




    Faye.Error.versionMismatch = function() {
        return new this(300, arguments, 'Version mismatch').toString();
    };

    Faye.Error.conntypeMismatch = function() {
        return new this(301, arguments, 'Connection types not supported').toString();
    };

    Faye.Error.extMismatch = function() {
        return new this(302, arguments, 'Extension mismatch').toString();
    };

    Faye.Error.badRequest = function() {
        return new this(400, arguments, 'Bad request').toString();
    };

    Faye.Error.clientUnknown = function() {
        return new this(401, arguments, 'Unknown client').toString();
    };

    Faye.Error.parameterMissing = function() {
        return new this(402, arguments, 'Missing required parameter').toString();
    };

    Faye.Error.channelForbidden = function() {
        return new this(403, arguments, 'Forbidden channel').toString();
    };

    Faye.Error.channelUnknown = function() {
        return new this(404, arguments, 'Unknown channel').toString();
    };

    Faye.Error.channelInvalid = function() {
        return new this(405, arguments, 'Invalid channel').toString();
    };

    Faye.Error.extUnknown = function() {
        return new this(406, arguments, 'Unknown extension').toString();
    };

    Faye.Error.publishFailed = function() {
        return new this(407, arguments, 'Failed to publish').toString();
    };

    Faye.Error.serverError = function() {
        return new this(500, arguments, 'Internal server error').toString();
    };


    Faye.Deferrable = {
        then: function(callback, errback) {
            var self = this;
            if (!this._promise)
                this._promise = new Faye.Promise(function(fulfill, reject) {
                    self._fulfill = fulfill;
                    self._reject  = reject;
                });

            if (arguments.length === 0)
                return this._promise;
            else
                return this._promise.then(callback, errback);
        },

        callback: function(callback, context) {
            return this.then(function(value) { callback.call(context, value) });
        },

        errback: function(callback, context) {
            return this.then(null, function(reason) { callback.call(context, reason) });
        },

        timeout: function(seconds, message) {
            this.then();
            var self = this;
            this._timer = Faye.ENV.setTimeout(function() {
                self._reject(message);
            }, seconds * 1000);
        },

        setDeferredStatus: function(status, value) {
            if (this._timer) Faye.ENV.clearTimeout(this._timer);

            var promise = this.then();

            if (status === 'succeeded')
                this._fulfill(value);
            else if (status === 'failed')
                this._reject(value);
            else
                delete this._promise;
        }
    };

    Faye.Publisher = {
        countListeners: function(eventType) {
            return this.listeners(eventType).length;
        },

        bind: function(eventType, listener, context) {
            var slice   = Array.prototype.slice,
                handler = function() { listener.apply(context, slice.call(arguments)) };

            this._listeners = this._listeners || [];
            this._listeners.push([eventType, listener, context, handler]);
            return this.on(eventType, handler);
        },

        unbind: function(eventType, listener, context) {
            this._listeners = this._listeners || [];
            var n = this._listeners.length, tuple;

            while (n--) {
                tuple = this._listeners[n];
                if (tuple[0] !== eventType) continue;
                if (listener && (tuple[1] !== listener || tuple[2] !== context)) continue;
                this._listeners.splice(n, 1);
                this.removeListener(eventType, tuple[3]);
            }
        }
    };

    Faye.extend(Faye.Publisher, Faye.EventEmitter.prototype);
    Faye.Publisher.trigger = Faye.Publisher.emit;

    Faye.Timeouts = {
        addTimeout: function(name, delay, callback, context) {
            this._timeouts = this._timeouts || {};
            if (this._timeouts.hasOwnProperty(name)) return;
            var self = this;
            this._timeouts[name] = Faye.ENV.setTimeout(function() {
                delete self._timeouts[name];
                callback.call(context);
            }, 1000 * delay);
        },

        removeTimeout: function(name) {
            this._timeouts = this._timeouts || {};
            var timeout = this._timeouts[name];
            if (!timeout) return;
            clearTimeout(timeout);
            delete this._timeouts[name];
        },

        removeAllTimeouts: function() {
            this._timeouts = this._timeouts || {};
            for (var name in this._timeouts) this.removeTimeout(name);
        }
    };

    Faye.Logging = {
        LOG_LEVELS: {
            fatal:  4,
            error:  3,
            warn:   2,
            info:   1,
            debug:  0
        },

        writeLog: function(messageArgs, level) {
            if (!Faye.logger) return;

            var messageArgs = Array.prototype.slice.apply(messageArgs),
                banner      = '[Faye',
                klass       = this.className,

                message = messageArgs.shift().replace(/\?/g, function() {
                    try {
                        return Faye.toJSON(messageArgs.shift());
                    } catch (e) {
                        return '[Object]';
                    }
                });

            for (var key in Faye) {
                if (klass) continue;
                if (typeof Faye[key] !== 'function') continue;
                if (this instanceof Faye[key]) klass = key;
            }
            if (klass) banner += '.' + klass;
            banner += '] ';

            if (typeof Faye.logger[level] === 'function')
                Faye.logger[level](banner + message);
            else if (typeof Faye.logger === 'function')
                Faye.logger(banner + message);
        }
    };

    (function() {
        for (var key in Faye.Logging.LOG_LEVELS)
            (function(level, value) {
                Faye.Logging[level] = function() {
                    this.writeLog(arguments, level);
                };
            })(key, Faye.Logging.LOG_LEVELS[key]);
    })();

    Faye.Grammar = {
        CHANNEL_NAME:     /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
        CHANNEL_PATTERN:  /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
        ERROR:            /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
        VERSION:          /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
    };

    Faye.Extensible = {
        addExtension: function(extension) {
            this._extensions = this._extensions || [];
            this._extensions.push(extension);
            if (extension.added) extension.added(this);
        },

        removeExtension: function(extension) {
            if (!this._extensions) return;
            var i = this._extensions.length;
            while (i--) {
                if (this._extensions[i] !== extension) continue;
                this._extensions.splice(i,1);
                if (extension.removed) extension.removed(this);
            }
        },

        pipeThroughExtensions: function(stage, message, request, callback, context) {
            this.debug('Passing through ? extensions: ?', stage, message);

            if (!this._extensions) return callback.call(context, message);
            var extensions = this._extensions.slice();

            var pipe = function(message) {
                if (!message) return callback.call(context, message);

                var extension = extensions.shift();
                if (!extension) return callback.call(context, message);

                var fn = extension[stage];
                if (!fn) return pipe(message);

                if (fn.length >= 3) extension[stage](message, request, pipe);
                else                extension[stage](message, pipe);
            };
            pipe(message);
        }
    };

    Faye.extend(Faye.Extensible, Faye.Logging);

    Faye.Channel = Faye.Class({
        initialize: function(name) {
            this.id = this.name = name;
        },

        push: function(message) {
            this.trigger('message', message);
        },

        isUnused: function() {
            return this.countListeners('message') === 0;
        }
    });

    Faye.extend(Faye.Channel.prototype, Faye.Publisher);

    Faye.extend(Faye.Channel, {
        HANDSHAKE:    '/meta/handshake',
        CONNECT:      '/meta/connect',
        SUBSCRIBE:    '/meta/subscribe',
        UNSUBSCRIBE:  '/meta/unsubscribe',
        DISCONNECT:   '/meta/disconnect',

        META:         'meta',
        SERVICE:      'service',

        expand: function(name) {
            var segments = this.parse(name),
                channels = ['/**', name];

            var copy = segments.slice();
            copy[copy.length - 1] = '*';
            channels.push(this.unparse(copy));

            for (var i = 1, n = segments.length; i < n; i++) {
                copy = segments.slice(0, i);
                copy.push('**');
                channels.push(this.unparse(copy));
            }

            return channels;
        },

        isValid: function(name) {
            return Faye.Grammar.CHANNEL_NAME.test(name) ||
                Faye.Grammar.CHANNEL_PATTERN.test(name);
        },

        parse: function(name) {
            if (!this.isValid(name)) return null;
            return name.split('/').slice(1);
        },

        unparse: function(segments) {
            return '/' + segments.join('/');
        },

        isMeta: function(name) {
            var segments = this.parse(name);
            return segments ? (segments[0] === this.META) : null;
        },

        isService: function(name) {
            var segments = this.parse(name);
            return segments ? (segments[0] === this.SERVICE) : null;
        },

        isSubscribable: function(name) {
            if (!this.isValid(name)) return null;
            return !this.isMeta(name) && !this.isService(name);
        },

        Set: Faye.Class({
            initialize: function() {
                this._channels = {};
            },

            getKeys: function() {
                var keys = [];
                for (var key in this._channels) keys.push(key);
                return keys;
            },

            remove: function(name) {
                delete this._channels[name];
            },

            hasSubscription: function(name) {
                return this._channels.hasOwnProperty(name);
            },

            subscribe: function(names, callback, context) {
                if (!callback) return;
                var name;
                for (var i = 0, n = names.length; i < n; i++) {
                    name = names[i];
                    var channel = this._channels[name] = this._channels[name] || new Faye.Channel(name);
                    channel.bind('message', callback, context);
                }
            },

            unsubscribe: function(name, callback, context) {
                var channel = this._channels[name];
                if (!channel) return false;
                channel.unbind('message', callback, context);

                if (channel.isUnused()) {
                    this.remove(name);
                    return true;
                } else {
                    return false;
                }
            },

            distributeMessage: function(message) {
                var channels = Faye.Channel.expand(message.channel);

                for (var i = 0, n = channels.length; i < n; i++) {
                    var channel = this._channels[channels[i]];
                    if (channel) channel.trigger('message', message.data);
                }
            }
        })
    });

    Faye.Envelope = Faye.Class({
        initialize: function(message, timeout) {
            this.id      = message.id;
            this.message = message;

            if (timeout !== undefined) this.timeout(timeout / 1000, false);
        }
    });

    Faye.extend(Faye.Envelope.prototype, Faye.Deferrable);

    Faye.Publication = Faye.Class(Faye.Deferrable);

    Faye.Subscription = Faye.Class({
        initialize: function(client, channels, callback, context) {
            this._client    = client;
            this._channels  = channels;
            this._callback  = callback;
            this._context     = context;
            this._cancelled = false;
        },

        cancel: function() {
            if (this._cancelled) return;
            this._client.unsubscribe(this._channels, this._callback, this._context);
            this._cancelled = true;
        },

        unsubscribe: function() {
            this.cancel();
        }
    });

    Faye.extend(Faye.Subscription.prototype, Faye.Deferrable);

    Faye.Client = Faye.Class({
        UNCONNECTED:          1,
        CONNECTING:           2,
        CONNECTED:            3,
        DISCONNECTED:         4,

        HANDSHAKE:            'handshake',
        RETRY:                'retry',
        NONE:                 'none',

        CONNECTION_TIMEOUT:   60,
        DEFAULT_RETRY:        5,
        MAX_REQUEST_SIZE:     2048,

        DEFAULT_ENDPOINT:     '/bayeux',
        INTERVAL:             0,

        initialize: function(endpoint, options) {
            this.info('New client created for ?', endpoint);

            this._options   = options || {};
            this.endpoint   = Faye.URI.parse(endpoint || this.DEFAULT_ENDPOINT);
            this.endpoints  = this._options.endpoints || {};
            this.transports = {};
            this.cookies    = Faye.CookieJar && new Faye.CookieJar();
            this.headers    = {};
            this.ca         = this._options.ca;
            this._disabled  = [];
            this._retry     = this._options.retry || this.DEFAULT_RETRY;

            for (var key in this.endpoints)
                this.endpoints[key] = Faye.URI.parse(this.endpoints[key]);

            this.maxRequestSize = this.MAX_REQUEST_SIZE;

            this._state     = this.UNCONNECTED;
            this._channels  = new Faye.Channel.Set();
            this._messageId = 0;

            this._responseCallbacks = {};

            this._advice = {
                reconnect: this.RETRY,
                interval:  1000 * (this._options.interval || this.INTERVAL),
                timeout:   1000 * (this._options.timeout  || this.CONNECTION_TIMEOUT)
            };

            if (Faye.Event && Faye.ENV.onbeforeunload !== undefined)
                Faye.Event.on(Faye.ENV, 'beforeunload', function() {
                    if (Faye.indexOf(this._disabled, 'autodisconnect') < 0)
                        this.disconnect();
                }, this);
        },

        disable: function(feature) {
            this._disabled.push(feature);
        },

        setHeader: function(name, value) {
            this.headers[name] = value;
        },

        // Request
        // MUST include:  * channel
        //                * version
        //                * supportedConnectionTypes
        // MAY include:   * minimumVersion
        //                * ext
        //                * id
        //
        // Success Response                             Failed Response
        // MUST include:  * channel                     MUST include:  * channel
        //                * version                                    * successful
        //                * supportedConnectionTypes                   * error
        //                * clientId                    MAY include:   * supportedConnectionTypes
        //                * successful                                 * advice
        // MAY include:   * minimumVersion                             * version
        //                * advice                                     * minimumVersion
        //                * ext                                        * ext
        //                * id                                         * id
        //                * authSuccessful
        handshake: function(callback, context) {
            if (this._advice.reconnect === this.NONE) return;
            if (this._state !== this.UNCONNECTED) return;

            this._state = this.CONNECTING;
            var self = this;

            this.info('Initiating handshake with ?', Faye.URI.stringify(this.endpoint));
            this._selectTransport(Faye.MANDATORY_CONNECTION_TYPES);

            this._send({
                channel:                  Faye.Channel.HANDSHAKE,
                version:                  Faye.BAYEUX_VERSION,
                supportedConnectionTypes: [this._transport.connectionType]

            }, function(response) {

                if (response.successful) {
                    this._state     = this.CONNECTED;
                    this._clientId  = response.clientId;

                    this._selectTransport(response.supportedConnectionTypes);

                    this.info('Handshake successful: ?', this._clientId);

                    this.subscribe(this._channels.getKeys(), true);
                    if (callback) Faye.Promise.defer(function() { callback.call(context) });

                } else {
                    this.info('Handshake unsuccessful');
                    Faye.ENV.setTimeout(function() { self.handshake(callback, context) }, this._advice.interval);
                    this._state = this.UNCONNECTED;
                }
            }, this);
        },

        // Request                              Response
        // MUST include:  * channel             MUST include:  * channel
        //                * clientId                           * successful
        //                * connectionType                     * clientId
        // MAY include:   * ext                 MAY include:   * error
        //                * id                                 * advice
        //                                                     * ext
        //                                                     * id
        //                                                     * timestamp
        connect: function(callback, context) {
            if (this._advice.reconnect === this.NONE) return;
            if (this._state === this.DISCONNECTED) return;

            if (this._state === this.UNCONNECTED)
                return this.handshake(function() { this.connect(callback, context) }, this);

            this.callback(callback, context);
            if (this._state !== this.CONNECTED) return;

            this.info('Calling deferred actions for ?', this._clientId);
            this.setDeferredStatus('succeeded');
            this.setDeferredStatus('unknown');

            if (this._connectRequest) return;
            this._connectRequest = true;

            this.info('Initiating connection for ?', this._clientId);

            this._send({
                channel:        Faye.Channel.CONNECT,
                clientId:       this._clientId,
                connectionType: this._transport.connectionType

            }, this._cycleConnection, this);
        },

        // Request                              Response
        // MUST include:  * channel             MUST include:  * channel
        //                * clientId                           * successful
        // MAY include:   * ext                                * clientId
        //                * id                  MAY include:   * error
        //                                                     * ext
        //                                                     * id
        disconnect: function() {
            if (this._state !== this.CONNECTED) return;
            this._state = this.DISCONNECTED;

            this.info('Disconnecting ?', this._clientId);

            this._send({
                channel:  Faye.Channel.DISCONNECT,
                clientId: this._clientId

            }, function(response) {
                if (!response.successful) return;
                this._transport.close();
                delete this._transport;
            }, this);

            this.info('Clearing channel listeners for ?', this._clientId);
            this._channels = new Faye.Channel.Set();
        },

        // Request                              Response
        // MUST include:  * channel             MUST include:  * channel
        //                * clientId                           * successful
        //                * subscription                       * clientId
        // MAY include:   * ext                                * subscription
        //                * id                  MAY include:   * error
        //                                                     * advice
        //                                                     * ext
        //                                                     * id
        //                                                     * timestamp
        subscribe: function(channel, callback, context) {
            if (channel instanceof Array)
                return Faye.map(channel, function(c) {
                    return this.subscribe(c, callback, context);
                }, this);

            var subscription = new Faye.Subscription(this, channel, callback, context),
                force        = (callback === true),
                hasSubscribe = this._channels.hasSubscription(channel);

            if (hasSubscribe && !force) {
                this._channels.subscribe([channel], callback, context);
                subscription.setDeferredStatus('succeeded');
                return subscription;
            }

            this.connect(function() {
                this.info('Client ? attempting to subscribe to ?', this._clientId, channel);
                if (!force) this._channels.subscribe([channel], callback, context);

                this._send({
                    channel:      Faye.Channel.SUBSCRIBE,
                    clientId:     this._clientId,
                    subscription: channel

                }, function(response) {
                    if (!response.successful) {
                        subscription.setDeferredStatus('failed', Faye.Error.parse(response.error));
                        return this._channels.unsubscribe(channel, callback, context);
                    }

                    var channels = [].concat(response.subscription);
                    this.info('Subscription acknowledged for ? to ?', this._clientId, channels);
                    subscription.setDeferredStatus('succeeded');
                }, this);
            }, this);

            return subscription;
        },

        // Request                              Response
        // MUST include:  * channel             MUST include:  * channel
        //                * clientId                           * successful
        //                * subscription                       * clientId
        // MAY include:   * ext                                * subscription
        //                * id                  MAY include:   * error
        //                                                     * advice
        //                                                     * ext
        //                                                     * id
        //                                                     * timestamp
        unsubscribe: function(channel, callback, context) {
            if (channel instanceof Array)
                return Faye.map(channel, function(c) {
                    return this.unsubscribe(c, callback, context);
                }, this);

            var dead = this._channels.unsubscribe(channel, callback, context);
            if (!dead) return;

            this.connect(function() {
                this.info('Client ? attempting to unsubscribe from ?', this._clientId, channel);

                this._send({
                    channel:      Faye.Channel.UNSUBSCRIBE,
                    clientId:     this._clientId,
                    subscription: channel

                }, function(response) {
                    if (!response.successful) return;

                    var channels = [].concat(response.subscription);
                    this.info('Unsubscription acknowledged for ? from ?', this._clientId, channels);
                }, this);
            }, this);
        },

        // Request                              Response
        // MUST include:  * channel             MUST include:  * channel
        //                * data                               * successful
        // MAY include:   * clientId            MAY include:   * id
        //                * id                                 * error
        //                * ext                                * ext
        publish: function(channel, data) {
            var publication = new Faye.Publication();

            this.connect(function() {
                this.info('Client ? queueing published message to ?: ?', this._clientId, channel, data);

                this._send({
                    channel:  channel,
                    data:     data,
                    clientId: this._clientId

                }, function(response) {
                    if (response.successful)
                        publication.setDeferredStatus('succeeded');
                    else
                        publication.setDeferredStatus('failed', Faye.Error.parse(response.error));
                }, this);
            }, this);

            return publication;
        },

        receiveMessage: function(message) {
            var id = message.id, timeout, callback;

            if (message.successful !== undefined) {
                callback = this._responseCallbacks[id];
                delete this._responseCallbacks[id];
            }

            this.pipeThroughExtensions('incoming', message, null, function(message) {
                if (!message) return;

                if (message.advice) this._handleAdvice(message.advice);
                this._deliverMessage(message);

                if (callback) callback[0].call(callback[1], message);
            }, this);

            if (this._transportUp === true) return;
            this._transportUp = true;
            this.trigger('transport:up');
        },

        messageError: function(messages, immediate) {
            var retry = this._retry,
                self  = this,
                id, message, timeout;

            for (var i = 0, n = messages.length; i < n; i++) {
                message = messages[i];
                id      = message.id;

                if (immediate)
                    this._transportSend(message);
                else
                    Faye.ENV.setTimeout(function() { self._transportSend(message) }, retry * 1000);
            }

            if (immediate || this._transportUp === false) return;
            this._transportUp = false;
            this.trigger('transport:down');
        },

        _selectTransport: function(transportTypes) {
            Faye.Transport.get(this, transportTypes, this._disabled, function(transport) {
                this.debug('Selected ? transport for ?', transport.connectionType, Faye.URI.stringify(transport.endpoint));

                if (transport === this._transport) return;
                if (this._transport) this._transport.close();

                this._transport = transport;
            }, this);
        },

        _send: function(message, callback, context) {
            if (!this._transport) return;
            message.id = message.id || this._generateMessageId();

            this.pipeThroughExtensions('outgoing', message, null, function(message) {
                if (!message) return;
                if (callback) this._responseCallbacks[message.id] = [callback, context];
                this._transportSend(message);
            }, this);
        },

        _transportSend: function(message) {
            if (!this._transport) return;

            var timeout  = 1.2 * (this._advice.timeout || this._retry * 1000),
                envelope = new Faye.Envelope(message, timeout);

            envelope.errback(function(immediate) {
                this.messageError([message], immediate);
            }, this);

            this._transport.send(envelope);
        },

        _generateMessageId: function() {
            this._messageId += 1;
            if (this._messageId >= Math.pow(2,32)) this._messageId = 0;
            return this._messageId.toString(36);
        },

        _handleAdvice: function(advice) {
            Faye.extend(this._advice, advice);

            if (this._advice.reconnect === this.HANDSHAKE && this._state !== this.DISCONNECTED) {
                this._state    = this.UNCONNECTED;
                this._clientId = null;
                this._cycleConnection();
            }
        },

        _deliverMessage: function(message) {
            if (!message.channel || message.data === undefined) return;
            this.info('Client ? calling listeners for ? with ?', this._clientId, message.channel, message.data);
            this._channels.distributeMessage(message);
        },

        _cycleConnection: function() {
            if (this._connectRequest) {
                this._connectRequest = null;
                this.info('Closed connection for ?', this._clientId);
            }
            var self = this;
            Faye.ENV.setTimeout(function() { self.connect() }, this._advice.interval);
        }
    });

    Faye.extend(Faye.Client.prototype, Faye.Deferrable);
    Faye.extend(Faye.Client.prototype, Faye.Publisher);
    Faye.extend(Faye.Client.prototype, Faye.Logging);
    Faye.extend(Faye.Client.prototype, Faye.Extensible);

    Faye.Transport = Faye.extend(Faye.Class({
        MAX_DELAY: 0,
        batching:  true,

        initialize: function(client, endpoint) {
            this._client  = client;
            this.endpoint = endpoint;
            this._outbox  = [];
        },

        close: function() {},

        encode: function(envelopes) {
            return '';
        },

        send: function(envelope) {
            var message = envelope.message;

            this.debug('Client ? sending message to ?: ?',
                this._client._clientId, Faye.URI.stringify(this.endpoint), message);

            if (!this.batching) return this.request([envelope]);

            this._outbox.push(envelope);

            if (message.channel === Faye.Channel.HANDSHAKE)
                return this.addTimeout('publish', 0.01, this.flush, this);

            if (message.channel === Faye.Channel.CONNECT)
                this._connectMessage = message;

            this.flushLargeBatch();
            this.addTimeout('publish', this.MAX_DELAY, this.flush, this);
        },

        flush: function() {
            this.removeTimeout('publish');

            if (this._outbox.length > 1 && this._connectMessage)
                this._connectMessage.advice = {timeout: 0};

            this.request(this._outbox);

            this._connectMessage = null;
            this._outbox = [];
        },

        flushLargeBatch: function() {
            var string = this.encode(this._outbox);
            if (string.length < this._client.maxRequestSize) return;
            var last = this._outbox.pop();
            this.flush();
            if (last) this._outbox.push(last);
        },

        receive: function(envelopes, responses) {
            var n = envelopes.length;
            while (n--) envelopes[n].setDeferredStatus('succeeded');

            responses = [].concat(responses);

            this.debug('Client ? received from ?: ?',
                this._client._clientId, Faye.URI.stringify(this.endpoint), responses);

            for (var i = 0, n = responses.length; i < n; i++)
                this._client.receiveMessage(responses[i]);
        },

        handleError: function(envelopes, immediate) {
            var n = envelopes.length;
            while (n--) envelopes[n].setDeferredStatus('failed', immediate);
        },

        _getCookies: function() {
            var cookies = this._client.cookies;
            if (!cookies) return '';

            return cookies.getCookies({
                domain: this.endpoint.hostname,
                path:   this.endpoint.path,
                secure: this.endpoint.protocol === 'https:'
            }).toValueString();
        },

        _storeCookies: function(setCookie) {
            if (!setCookie || !this._client.cookies) return;
            setCookie = [].concat(setCookie);
            var cookie;

            for (var i = 0, n = setCookie.length; i < n; i++) {
                cookie = this._client.cookies.setCookie(setCookie[i]);
                cookie = cookie[0] || cookie;
                cookie.domain = cookie.domain || this.endpoint.hostname;
            }
        }

    }), {
        get: function(client, allowed, disabled, callback, context) {
            var endpoint = client.endpoint;

            Faye.asyncEach(this._transports, function(pair, resume) {
                var connType     = pair[0], klass = pair[1],
                    connEndpoint = client.endpoints[connType] || endpoint;

                if (Faye.indexOf(disabled, connType) >= 0)
                    return resume();

                if (Faye.indexOf(allowed, connType) < 0) {
                    klass.isUsable(client, connEndpoint, function() {});
                    return resume();
                }

                klass.isUsable(client, connEndpoint, function(isUsable) {
                    if (!isUsable) return resume();
                    var transport = klass.hasOwnProperty('create') ? klass.create(client, connEndpoint) : new klass(client, connEndpoint);
                    callback.call(context, transport);
                });
            }, function() {
                throw new Error('Could not find a usable connection type for ' + Faye.URI.stringify(endpoint));
            });
        },

        register: function(type, klass) {
            this._transports.push([type, klass]);
            klass.prototype.connectionType = type;
        },

        _transports: []
    });

    Faye.extend(Faye.Transport.prototype, Faye.Logging);
    Faye.extend(Faye.Transport.prototype, Faye.Timeouts);

    Faye.Event = {
        _registry: [],

        on: function(element, eventName, callback, context) {
            var wrapped = function() { callback.call(context) };

            if (element.addEventListener)
                element.addEventListener(eventName, wrapped, false);
            else
                element.attachEvent('on' + eventName, wrapped);

            this._registry.push({
                _element:   element,
                _type:      eventName,
                _callback:  callback,
                _context:     context,
                _handler:   wrapped
            });
        },

        detach: function(element, eventName, callback, context) {
            var i = this._registry.length, register;
            while (i--) {
                register = this._registry[i];

                if ((element    && element    !== register._element)   ||
                    (eventName  && eventName  !== register._type)      ||
                    (callback   && callback   !== register._callback)  ||
                    (context      && context      !== register._context))
                    continue;

                if (register._element.removeEventListener)
                    register._element.removeEventListener(register._type, register._handler, false);
                else
                    register._element.detachEvent('on' + register._type, register._handler);

                this._registry.splice(i,1);
                register = null;
            }
        }
    };

    if (Faye.ENV.onunload !== undefined) Faye.Event.on(Faye.ENV, 'unload', Faye.Event.detach, Faye.Event);

    /*
     json2.js
     2013-05-26

     Public Domain.

     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

     See http://www.JSON.org/js.html


     This code should be minified before deployment.
     See http://javascript.crockford.com/jsmin.html

     USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
     NOT CONTROL.


     This file creates a global JSON object containing two methods: stringify
     and parse.

     JSON.stringify(value, replacer, space)
     value       any JavaScript value, usually an object or array.

     replacer    an optional parameter that determines how object
     values are stringified for objects. It can be a
     function or an array of strings.

     space       an optional parameter that specifies the indentation
     of nested structures. If it is omitted, the text will
     be packed without extra whitespace. If it is a number,
     it will specify the number of spaces to indent at each
     level. If it is a string (such as '\t' or '&nbsp;'),
     it contains the characters used to indent at each level.

     This method produces a JSON text from a JavaScript value.

     When an object value is found, if the object contains a toJSON
     method, its toJSON method will be called and the result will be
     stringified. A toJSON method does not serialize: it returns the
     value represented by the name/value pair that should be serialized,
     or undefined if nothing should be serialized. The toJSON method
     will be passed the key associated with the value, and this will be
     bound to the value

     For example, this would serialize Dates as ISO strings.

     Date.prototype.toJSON = function (key) {
     function f(n) {
     // Format integers to have at least two digits.
     return n < 10 ? '0' + n : n;
     }

     return this.getUTCFullYear()   + '-' +
     f(this.getUTCMonth() + 1) + '-' +
     f(this.getUTCDate())      + 'T' +
     f(this.getUTCHours())     + ':' +
     f(this.getUTCMinutes())   + ':' +
     f(this.getUTCSeconds())   + 'Z';
     };

     You can provide an optional replacer method. It will be passed the
     key and value of each member, with this bound to the containing
     object. The value that is returned from your method will be
     serialized. If your method returns undefined, then the member will
     be excluded from the serialization.

     If the replacer parameter is an array of strings, then it will be
     used to select the members to be serialized. It filters the results
     such that only members with keys listed in the replacer array are
     stringified.

     Values that do not have JSON representations, such as undefined or
     functions, will not be serialized. Such values in objects will be
     dropped; in arrays they will be replaced with null. You can use
     a replacer function to replace those with JSON values.
     JSON.stringify(undefined) returns undefined.

     The optional space parameter produces a stringification of the
     value that is filled with line breaks and indentation to make it
     easier to read.

     If the space parameter is a non-empty string, then that string will
     be used for indentation. If the space parameter is a number, then
     the indentation will be that many spaces.

     Example:

     text = JSON.stringify(['e', {pluribus: 'unum'}]);
     // text is '["e",{"pluribus":"unum"}]'


     text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
     // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

     text = JSON.stringify([new Date()], function (key, value) {
     return this[key] instanceof Date ?
     'Date(' + this[key] + ')' : value;
     });
     // text is '["Date(---current time---)"]'


     JSON.parse(text, reviver)
     This method parses a JSON text to produce an object or array.
     It can throw a SyntaxError exception.

     The optional reviver parameter is a function that can filter and
     transform the results. It receives each of the keys and values,
     and its return value is used instead of the original value.
     If it returns what it received, then the structure is not modified.
     If it returns undefined then the member is deleted.

     Example:

     // Parse the text. Values that look like ISO date strings will
     // be converted to Date objects.

     myData = JSON.parse(text, function (key, value) {
     var a;
     if (typeof value === 'string') {
     a =
     /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
     if (a) {
     return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
     +a[5], +a[6]));
     }
     }
     return value;
     });

     myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
     var d;
     if (typeof value === 'string' &&
     value.slice(0, 5) === 'Date(' &&
     value.slice(-1) === ')') {
     d = new Date(value.slice(5, -1));
     if (d) {
     return d;
     }
     }
     return value;
     });


     This is a reference implementation. You are free to copy, modify, or
     redistribute.
     */

    /*jslint evil: true, regexp: true */

    /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
     call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
     getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
     lastIndex, length, parse, prototype, push, replace, slice, stringify,
     test, toJSON, toString, valueOf
     */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

    if (typeof JSON !== 'object') {
        JSON = {};
    }

    (function () {
        'use strict';

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                    : null;
            };

            String.prototype.toJSON      =
                Number.prototype.toJSON  =
                    Boolean.prototype.toJSON = function () {
                        return this.valueOf();
                    };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {

// Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

// What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                    return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

                case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

// Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

// Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                        v = partial.length === 0
                            ? '[]'
                            : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

// If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

// Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                    v = partial.length === 0
                        ? '{}'
                        : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

// If the JSON object does not yet have a stringify method, give it one.

        Faye.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };

        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = Faye.stringify;
        }

// If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function'
                        ? walk({'': j}, '')
                        : j;
                }

// If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            };
        }
    }());

    Faye.Transport.WebSocket = Faye.extend(Faye.Class(Faye.Transport, {
        UNCONNECTED:  1,
        CONNECTING:   2,
        CONNECTED:    3,

        batching:     false,

        isUsable: function(callback, context) {
            this.callback(function() { callback.call(context, true) });
            this.errback(function() { callback.call(context, false) });
            this.connect();
        },

        request: function(envelopes) {
            this._pending = this._pending || new Faye.Set();
            for (var i = 0, n = envelopes.length; i < n; i++) this._pending.add(envelopes[i]);

            this.callback(function(socket) {
                if (!socket) return;
                var messages = Faye.map(envelopes, function(e) { return e.message });
                socket.send(Faye.toJSON(messages));
            }, this);
            this.connect();
        },

        connect: function() {
            if (Faye.Transport.WebSocket._unloaded) return;

            this._state = this._state || this.UNCONNECTED;
            if (this._state !== this.UNCONNECTED) return;
            this._state = this.CONNECTING;

            var socket = this._createSocket();
            if (!socket) return this.setDeferredStatus('failed');

            var self = this;

            socket.onopen = function() {
                if (socket.headers) self._storeCookies(socket.headers['set-cookie']);
                self._socket = socket;
                self._state = self.CONNECTED;
                self._everConnected = true;
                self._ping();
                self.setDeferredStatus('succeeded', socket);
            };

            var closed = false;
            socket.onclose = socket.onerror = function() {
                if (closed) return;
                closed = true;

                var wasConnected = (self._state === self.CONNECTED);
                socket.onopen = socket.onclose = socket.onerror = socket.onmessage = null;

                delete self._socket;
                self._state = self.UNCONNECTED;
                self.removeTimeout('ping');
                self.setDeferredStatus('unknown');

                var pending = self._pending ? self._pending.toArray() : [];
                delete self._pending;

                if (wasConnected) {
                    self.handleError(pending, true);
                } else if (self._everConnected) {
                    self.handleError(pending);
                } else {
                    self.setDeferredStatus('failed');
                }
            };

            socket.onmessage = function(event) {
                var messages  = JSON.parse(event.data),
                    envelopes = [],
                    envelope;

                if (!messages) return;
                messages = [].concat(messages);

                for (var i = 0, n = messages.length; i < n; i++) {
                    if (messages[i].successful === undefined) continue;
                    envelope = self._pending.remove(messages[i]);
                    if (envelope) envelopes.push(envelope);
                }
                self.receive(envelopes, messages);
            };
        },

        close: function() {
            if (!this._socket) return;
            this._socket.close();
        },

        _createSocket: function() {
            var url     = Faye.Transport.WebSocket.getSocketUrl(this.endpoint),
                options = {headers: Faye.copyObject(this._client.headers), ca: this._client.ca};

            options.headers['Cookie'] = this._getCookies();

            if (Faye.WebSocket)        return new Faye.WebSocket.Client(url, [], options);
            if (Faye.ENV.MozWebSocket) return new MozWebSocket(url);
            if (Faye.ENV.WebSocket)    return new WebSocket(url);
        },

        _ping: function() {
            if (!this._socket) return;
            this._socket.send('[]');
            this.addTimeout('ping', this._client._advice.timeout/2000, this._ping, this);
        }

    }), {
        PROTOCOLS: {
            'http:':  'ws:',
            'https:': 'wss:'
        },

        create: function(client, endpoint) {
            var sockets = client.transports.websocket = client.transports.websocket || {};
            sockets[endpoint.href] = sockets[endpoint.href] || new this(client, endpoint);
            return sockets[endpoint.href];
        },

        getSocketUrl: function(endpoint) {
            endpoint = Faye.copyObject(endpoint);
            endpoint.protocol = this.PROTOCOLS[endpoint.protocol];
            return Faye.URI.stringify(endpoint);
        },

        isUsable: function(client, endpoint, callback, context) {
            this.create(client, endpoint).isUsable(callback, context);
        }
    });

    Faye.extend(Faye.Transport.WebSocket.prototype, Faye.Deferrable);
    Faye.Transport.register('websocket', Faye.Transport.WebSocket);

    if (Faye.Event)
        Faye.Event.on(Faye.ENV, 'beforeunload', function() {
            Faye.Transport.WebSocket._unloaded = true;
        });

    Faye.Transport.EventSource = Faye.extend(Faye.Class(Faye.Transport, {
        initialize: function(client, endpoint) {
            Faye.Transport.prototype.initialize.call(this, client, endpoint);
            if (!Faye.ENV.EventSource) return this.setDeferredStatus('failed');

            this._xhr = new Faye.Transport.XHR(client, endpoint);

            endpoint = Faye.copyObject(endpoint);
            endpoint.pathname += '/' + client._clientId;

            var socket = new EventSource(Faye.URI.stringify(endpoint)),
                self   = this;

            socket.onopen = function() {
                self._everConnected = true;
                self.setDeferredStatus('succeeded');
            };

            socket.onerror = function() {
                if (self._everConnected) {
                    self._client.messageError([]);
                } else {
                    self.setDeferredStatus('failed');
                    socket.close();
                }
            };

            socket.onmessage = function(event) {
                self.receive([], JSON.parse(event.data));
            };

            this._socket = socket;
        },

        close: function() {
            if (!this._socket) return;
            this._socket.onopen = this._socket.onerror = this._socket.onmessage = null;
            this._socket.close();
            delete this._socket;
        },

        isUsable: function(callback, context) {
            this.callback(function() { callback.call(context, true) });
            this.errback(function() { callback.call(context, false) });
        },

        encode: function(envelopes) {
            return this._xhr.encode(envelopes);
        },

        request: function(envelopes) {
            this._xhr.request(envelopes);
        }

    }), {
        isUsable: function(client, endpoint, callback, context) {
            var id = client._clientId;
            if (!id) return callback.call(context, false);

            Faye.Transport.XHR.isUsable(client, endpoint, function(usable) {
                if (!usable) return callback.call(context, false);
                this.create(client, endpoint).isUsable(callback, context);
            }, this);
        },

        create: function(client, endpoint) {
            var sockets = client.transports.eventsource = client.transports.eventsource || {},
                id      = client._clientId;

            endpoint = Faye.copyObject(endpoint);
            endpoint.pathname += '/' + (id || '');
            var url = Faye.URI.stringify(endpoint);

            sockets[url] = sockets[url] || new this(client, endpoint);
            return sockets[url];
        }
    });

    Faye.extend(Faye.Transport.EventSource.prototype, Faye.Deferrable);
    Faye.Transport.register('eventsource', Faye.Transport.EventSource);

    Faye.Transport.XHR = Faye.extend(Faye.Class(Faye.Transport, {
        encode: function(envelopes) {
            var messages = Faye.map(envelopes, function(e) { return e.message });
            return Faye.toJSON(messages);
        },

        request: function(envelopes) {
            var path = this.endpoint.path,
                xhr  = Faye.ENV.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest(),
                self = this;

            xhr.open('POST', path, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Pragma', 'no-cache');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            var headers = this._client.headers;
            for (var key in headers) {
                if (!headers.hasOwnProperty(key)) continue;
                xhr.setRequestHeader(key, headers[key]);
            }

            var abort = function() { xhr.abort() };
            Faye.Event.on(Faye.ENV, 'beforeunload', abort);

            xhr.onreadystatechange = function() {
                if (!xhr || xhr.readyState !== 4) return;

                var parsedMessage = null,
                    status        = xhr.status,
                    text          = xhr.responseText,
                    successful    = (status >= 200 && status < 300) || status === 304 || status === 1223;

                Faye.Event.detach(Faye.ENV, 'beforeunload', abort);
                xhr.onreadystatechange = function() {};
                xhr = null;

                if (!successful) return self.handleError(envelopes);

                try {
                    parsedMessage = JSON.parse(text);
                } catch (e) {}

                if (parsedMessage)
                    self.receive(envelopes, parsedMessage);
                else
                    self.handleError(envelopes);
            };

            xhr.send(this.encode(envelopes));
        }
    }), {
        isUsable: function(client, endpoint, callback, context) {
            callback.call(context, Faye.URI.isSameOrigin(endpoint));
        }
    });

    Faye.Transport.register('long-polling', Faye.Transport.XHR);

    Faye.Transport.CORS = Faye.extend(Faye.Class(Faye.Transport, {
        encode: function(envelopes) {
            var messages = Faye.map(envelopes, function(e) { return e.message });
            return 'message=' + encodeURIComponent(Faye.toJSON(messages));
        },

        request: function(envelopes) {
            var xhrClass = Faye.ENV.XDomainRequest ? XDomainRequest : XMLHttpRequest,
                xhr      = new xhrClass(),
                headers  = this._client.headers,
                self     = this,
                key;

            xhr.open('POST', Faye.URI.stringify(this.endpoint), true);

            if (xhr.setRequestHeader) {
                xhr.setRequestHeader('Pragma', 'no-cache');
                for (key in headers) {
                    if (!headers.hasOwnProperty(key)) continue;
                    xhr.setRequestHeader(key, headers[key]);
                }
            }

            var cleanUp = function() {
                if (!xhr) return false;
                xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onprogress = null;
                xhr = null;
            };

            xhr.onload = function() {
                var parsedMessage = null;
                try {
                    parsedMessage = JSON.parse(xhr.responseText);
                } catch (e) {}

                cleanUp();

                if (parsedMessage)
                    self.receive(envelopes, parsedMessage);
                else
                    self.handleError(envelopes);
            };

            xhr.onerror = xhr.ontimeout = function() {
                cleanUp();
                self.handleError(envelopes);
            };

            xhr.onprogress = function() {};
            xhr.send(this.encode(envelopes));
        }
    }), {
        isUsable: function(client, endpoint, callback, context) {
            if (Faye.URI.isSameOrigin(endpoint))
                return callback.call(context, false);

            if (Faye.ENV.XDomainRequest)
                return callback.call(context, endpoint.protocol === Faye.ENV.location.protocol);

            if (Faye.ENV.XMLHttpRequest) {
                var xhr = new Faye.ENV.XMLHttpRequest();
                return callback.call(context, xhr.withCredentials !== undefined);
            }
            return callback.call(context, false);
        }
    });

    Faye.Transport.register('cross-origin-long-polling', Faye.Transport.CORS);

    Faye.Transport.JSONP = Faye.extend(Faye.Class(Faye.Transport, {
        encode: function(envelopes) {
            var messages = Faye.map(envelopes, function(e) { return e.message });
            var url = Faye.copyObject(this.endpoint);
            url.query.message = Faye.toJSON(messages);
            url.query.jsonp   = '__jsonp' + Faye.Transport.JSONP._cbCount + '__';
            return Faye.URI.stringify(url);
        },

        request: function(envelopes) {
            var messages     = Faye.map(envelopes, function(e) { return e.message }),
                head         = document.getElementsByTagName('head')[0],
                script       = document.createElement('script'),
                callbackName = Faye.Transport.JSONP.getCallbackName(),
                endpoint     = Faye.copyObject(this.endpoint),
                self         = this;

            endpoint.query.message = Faye.toJSON(messages);
            endpoint.query.jsonp   = callbackName;

            Faye.ENV[callbackName] = function(data) {
                if (!Faye.ENV[callbackName]) return false;
                Faye.ENV[callbackName] = undefined;
                try { delete Faye.ENV[callbackName] } catch (e) {}
                script.parentNode.removeChild(script);
                self.receive(envelopes, data);
            };

            script.type = 'text/javascript';
            script.src  = Faye.URI.stringify(endpoint);
            head.appendChild(script);
        }
    }), {
        _cbCount: 0,

        getCallbackName: function() {
            this._cbCount += 1;
            return '__jsonp' + this._cbCount + '__';
        },

        isUsable: function(client, endpoint, callback, context) {
            callback.call(context, true);
        }
    });

    Faye.Transport.register('callback-polling', Faye.Transport.JSONP);
    return Faye;

})();
;(function () {


/**
 * Inlining type fn
 */
var type = function (val) {
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (typeof val === 'object' && val && typeof val.length === 'number') {
    try {
      if (typeof val.callee === 'function') return 'arguments';
    } catch (ex) {
      if (ex instanceof TypeError) {
        return 'arguments';
      }
    }
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

/**
 * jQuery's serialization fns, adapted
 * ajax's were buggy, so going back to the source.
 */

var r20 = /%20/g,
	rbracket = /\[\]$/;

function buildParams( prefix, obj, add ) {
	var name;

	if ( type(obj) === 'array' ) {
		// Serialize array item.
		obj.forEach(function( v, i ) {
			if ( rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + '[' + ( typeof v === 'object' ? i : '' ) + ']',
					v,
					add
				);
			}
		});

	} else if ( type( obj ) === 'object' ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + '[' + name + ']', obj[ name ], add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
var param = function( a ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
      // XXX: We want the double equals here, since that's what jQuery used.
			value = type(value) === 'function' ? value() : ( value == null ? '' : value );
			s[ s.length ] = encodeURIComponent( key ) + '=' + encodeURIComponent( value );
		};

	for ( prefix in a ) {
		buildParams( prefix, a[ prefix ], add );
	}

	// Return the resulting serialization
	return s.join( '&' ).replace( r20, '+' );
};




/**
 * Adapted from https://github.com/ForbesLindesay/ajax
 * Removed the require/module code.
 */


var jsonpID = 0,
    document = window.document,
    key,
    name,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = 'application/json',
    htmlType = 'text/html',
    blankRE = /^\s*$/

var ajax = function(options){
  var settings = extend({}, options || {})
  for (key in ajax.settings) if (settings[key] === undefined) settings[key] = ajax.settings[key]

  ajaxStart(settings)

  if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
    RegExp.$2 != window.location.host

  var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
  if (dataType == 'jsonp' || hasPlaceholder) {
    if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
    return ajax.JSONP(settings)
  }

  if (!settings.url) settings.url = window.location.toString()
  serializeData(settings)

  var mime = settings.accepts[dataType],
      baseHeaders = { },
      protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
      xhr = ajax.settings.xhr(), abortTimeout

  if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
  if (mime) {
    baseHeaders['Accept'] = mime
    if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
    xhr.overrideMimeType && xhr.overrideMimeType(mime)
  }
  if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
    baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
  settings.headers = extend(baseHeaders, settings.headers || {})

  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      clearTimeout(abortTimeout)
      var result, error = false
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
        dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
        result = xhr.responseText

        try {
          if (dataType == 'script')    (1,eval)(result)
          else if (dataType == 'xml')  result = xhr.responseXML
          else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
        } catch (e) { error = e }

        if (error) ajaxError(error, 'parsererror', xhr, settings)
        else ajaxSuccess(result, xhr, settings)
      } else {
        ajaxError(null, 'error', xhr, settings)
      }
    }
  }

  var async = 'async' in settings ? settings.async : true
  xhr.open(settings.type, settings.url, async)

  for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

  if (ajaxBeforeSend(xhr, settings) === false) {
    xhr.abort()
    return false
  }

  if (settings.timeout > 0) abortTimeout = setTimeout(function(){
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, settings)
    }, settings.timeout)

  // avoid sending empty string (#319)
  xhr.send(settings.data ? settings.data : null)
  return xhr
}


// trigger a custom event and return false if it was cancelled
function triggerAndReturn(context, eventName, data) {
  //todo: Fire off some events
  //var event = $.Event(eventName)
  //$(context).trigger(event, data)
  return true;//!event.defaultPrevented
}

// trigger an Ajax "global" event
function triggerGlobal(settings, context, eventName, data) {
  if (settings.global) return triggerAndReturn(context || document, eventName, data)
}

// Number of active Ajax requests
ajax.active = 0

function ajaxStart(settings) {
  if (settings.global && ajax.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
}
function ajaxStop(settings) {
  if (settings.global && !(--ajax.active)) triggerGlobal(settings, null, 'ajaxStop')
}

// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
function ajaxBeforeSend(xhr, settings) {
  var context = settings.context
  if (settings.beforeSend.call(context, xhr, settings) === false ||
      triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
    return false

  triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
}
function ajaxSuccess(data, xhr, settings) {
  var context = settings.context, status = 'success'
  settings.success.call(context, data, status, xhr)
  triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
  ajaxComplete(status, xhr, settings)
}
// type: "timeout", "error", "abort", "parsererror"
function ajaxError(error, type, xhr, settings) {
  var context = settings.context
  settings.error.call(context, xhr, type, error)
  triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
  ajaxComplete(type, xhr, settings)
}
// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
function ajaxComplete(status, xhr, settings) {
  var context = settings.context
  settings.complete.call(context, xhr, status)
  triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
  ajaxStop(settings)
}

// Empty function, used as default callback
function empty() {}

ajax.JSONP = function(options){
  if (!('type' in options)) return ajax(options)

  var callbackName = 'jsonp' + (++jsonpID),
    script = document.createElement('script'),
    abort = function(){
      //todo: remove script
      //$(script).remove()
      if (callbackName in window) window[callbackName] = empty
      ajaxComplete('abort', xhr, options)
    },
    xhr = { abort: abort }, abortTimeout,
    head = document.getElementsByTagName("head")[0]
      || document.documentElement

  if (options.error) script.onerror = function() {
    xhr.abort()
    options.error()
  }

  window[callbackName] = function(data){
    clearTimeout(abortTimeout)
      //todo: remove script
      //$(script).remove()
    delete window[callbackName]
    ajaxSuccess(data, xhr, options)
  }

  serializeData(options)
  script.src = options.url.replace(/=\?/, '=' + callbackName)

  // Use insertBefore instead of appendChild to circumvent an IE6 bug.
  // This arises when a base node is used (see jQuery bugs #2709 and #4378).
  head.insertBefore(script, head.firstChild);

  if (options.timeout > 0) abortTimeout = setTimeout(function(){
      xhr.abort()
      ajaxComplete('timeout', xhr, options)
    }, options.timeout)

  return xhr
}

ajax.settings = {
  // Default type of request
  type: 'GET',
  // Callback that is executed before request
  beforeSend: empty,
  // Callback that is executed if the request succeeds
  success: empty,
  // Callback that is executed the the server drops error
  error: empty,
  // Callback that is executed on request complete (both: error and success)
  complete: empty,
  // The context for the callbacks
  context: null,
  // Whether to trigger "global" Ajax events
  global: true,
  // Transport
  xhr: function () {
    return new window.XMLHttpRequest()
  },
  // MIME types mapping
  accepts: {
    script: 'text/javascript, application/javascript',
    json:   jsonType,
    xml:    'application/xml, text/xml',
    html:   htmlType,
    text:   'text/plain'
  },
  // Whether the request is to another domain
  crossDomain: false,
  // Default timeout
  timeout: 0
}

function mimeToDataType(mime) {
  return mime && ( mime == htmlType ? 'html' :
    mime == jsonType ? 'json' :
    scriptTypeRE.test(mime) ? 'script' :
    xmlTypeRE.test(mime) && 'xml' ) || 'text'
}

function appendQuery(url, query) {
  return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}

// serialize payload and append it to the URL for GET requests
function serializeData(options) {
  if (type(options.data) === 'object') options.data = param(options.data)
  if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
    options.url = appendQuery(options.url, options.data)
}

ajax.get = function(url, success){ return ajax({ url: url, success: success }) }

ajax.post = function(url, data, success, dataType){
  if (type(data) === 'function') dataType = dataType || success, success = data, data = null
  return ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType })
}

ajax.getJSON = function(url, success){
  return ajax({ url: url, success: success, dataType: 'json' })
}

var escape = encodeURIComponent

function extend(target) {
  var slice = Array.prototype.slice;
  slice.call(arguments, 1).forEach(function(source) {
    for (key in source)
      if (source[key] !== undefined)
        target[key] = source[key]
  })
  return target
}

window.ajax = ajax;

})();

/* global window, ajax, Faye */

/**
 * MM is the primary interface to all MindMeld JavaScript SDK functionality. Call {@link MM#init} before anything
 * else. Next obtain a token via {@link MM#getToken} to start making API calls.
 *
 * @namespace
 */
var MM = ( function (window, ajax, Faye) {

    var MM = window.MM = window.MM || {};

    /**
     * MindMeld SDK Version
     *
     * @type {string}
     * @static
     * @private
     */
    Object.defineProperty(MM, 'version', {
        value: '2.5.6',
        writable: false
    });
    

    var _isFunction = function(f) {
        return 'function' === typeof f;
    };

    var _isWindow = function( obj ) {
        return obj != null && obj === obj.window;
    };

    var _isPlainObject = function( obj ) {
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if ( typeof obj !== "object" || obj.nodeType || _isWindow( obj ) ) {
            return false;
        }

        if ( obj.constructor &&
            !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    };

    var _extend = function() {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && ! _isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( _isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && _isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = _extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    var _isEmptyObject = function (obj) {
  		var name;
  		for (name in obj ) {
  			return false;
  		}
  		return true;
  	};



    var _onDocumentReady = function(f) {
      if (window.document.readyState === 'complete' ||
        window.document.readyState === 'interactive') {
          f();
      } else {
        window.document.onreadystatechange = function () {
          if (window.document.readyState === 'interactive') {
            f();
          }
        };
      }
    };

    /**
     *
     * MindMeld configuration settings
     *
     * @type {object}
     * @property {string}   cleanUrl - URL for MindMeld API
     * @property {string}   fayeClientUrl - URL for MindMeld API Push Server
     * @property {string}   appid - Developer's MindMeld application id
     * @property {function} onInit - Callback called when SDK is initialized
     * @private
     */
    MM.config = {
        cleanUrl: 'https://mindmeldv2.expectlabs.com/',
        fayeClientUrl: 'https://push-west-prod-a.expectlabs.com:443/faye'
    };

    /**
     * Internal functions used by MindMeld SDK
     *
     * @memberOf MM
     * @namespace
     * @private
     */
    MM.Internal = _extend({}, {

        /**
         * Perform any initialization here that can be done before the DOM loads.
         *
         * @memberOf MM.Internal
         */
        setup: function () {
            MM.activeSessionId = null;
            MM.activeUserId = null;
        },

        /**
         * Perform any initialization here that should be done after the DOM loads.
         *
         * @memberOf MM.Internal
         */
        onReady: function () {
            MM.Internal.initializeModels();

            // Initializes push event handler with faye server URL
            MM.Internal.EventHandler.init(MM.config.fayeClientUrl);

            // Call the onInit handler.
            MM.Util.testAndCall(MM.config.onInit);
        },

        /**
         * Initialize app, user, and session models
         *
         * @memberOf MM.Internal
         */
        initializeModels: function () {
            // App Model
            _extend(MM, new MM.models.App());
            MM.documents = new MM.models.AppDocumentList();

            // User Models
            MM.activeUser = new MM.models.ActiveUser();
            MM.activeUser.sessions = new MM.models.SessionList();

            // Session Models
            MM.activeSession = new MM.models.ActiveSession();
            MM.activeSession.textentries = new MM.models.TextEntryList();
            MM.activeSession.entities = new MM.models.EntityList();
            MM.activeSession.articles = new MM.models.ArticleList();
            MM.activeSession.documents = new MM.models.SessionDocumentList();
            MM.activeSession.activities = new MM.models.ActivityList();
            MM.activeSession.liveusers = new MM.models.LiveUserList();
            MM.activeSession.invitedusers = new MM.models.InvitedUserList();
        },

        /**
         * Clears active user data from local storage
         *
         * @memberOf MM.Internal
         */
        clearUserData: function () {
            MM.activeUser.clearAllData();
            MM.activeUser.sessions.clearAllData();
        },

        /**
         * Clears active session data
         *
         * @memberOf MM.Internal
         */
        clearSessionData: function () {
            MM.activeSession.clearAllData();
            MM.activeSession.textentries.clearAllData();
            MM.activeSession.entities.clearAllData();
            MM.activeSession.articles.clearAllData();
            MM.activeSession.documents.clearAllData();
            MM.activeSession.activities.clearAllData();
            MM.activeSession.liveusers.clearAllData();
            MM.activeSession.invitedusers.clearAllData();
        },

        /**
         * This method overrides the methods and properties of a given class with the
         * methods and properties specified in the overrides object.
         *
         * @memberOf MM.Internal
         */
        override: function (origclass, overrides) {
            _extend(origclass.prototype, overrides);
        },

        /**
         * Factory to create new object with the properties and methods specified in the
         * overrides object that inherits from the superclass object.
         *
         * @memberOf MM.Internal
         * @param {Object} superclass
         * @param {Object} overrides
         */
        createSubclass: function (superclass, overrides) {
            var objectConstructor = Object.prototype.constructor;
            var subclass = overrides.constructor;
            var F = function () {
                },
                subclassProto,
                superclassProto = superclass.prototype;
            F.prototype = superclassProto;
            subclassProto = subclass.prototype = new F();
            subclassProto.constructor = subclass;
            subclass.superclass = superclassProto;
            if (superclassProto.constructor === objectConstructor) {
                superclassProto.constructor = superclass;
            }
            subclassProto.superclass = subclassProto.supr = function () {
                return superclassProto;
            };
            subclassProto.proto = subclassProto;
            MM.Internal.override(subclass, overrides);
            return subclass;
        },

        /**
         * Utility method to print a log message.
         *
         * @memberOf MM.Internal
         * @param {string} msg message to log to console
         */
        log: function (msg) {
            window.console && window.console.log(msg);
        },

        /**
         * Event handler service initializes connection with Faye push server, initiates and maintains
         * subscriptions to various channels, and registers/dispatches both default and user-defined events
         *
         * @memberOf MM.Internal
         * @namespace
         * @private
         */
        EventHandler: {

            /**
             * Reference to faye client instance
             *
             * @type {Faye}
             * @memberOf MM.Internal.EventHandler
             */
            fayeClient: null,

            // Dictionary mapping app|user|session channels to Faye channel object
            /**
             * @description Dictionary mapping app|user|session channels to Faye channel object
             * @type {Object.<string, Faye>}
             * @memberOf MM.Internal.EventHandler
             */
            fayeSubscriptions: {},

            /**
             * Dictionary for single event on specific channel
             *
             * @example
             * namedEventHandlers = {
                '/:appid/session/:sessionid': {
                    'textentriesUpdate': (FN onAnySessionEvent)
                 }
             }
             * @memberOf MM.Internal.EventHandler
             */
            namedEventHandlers: {},

            /**
             * Dictionary for event handlers for all events on an app channel
             *
             * @example
             * appChannelHandlers = {
                    '/:appid/:appid': (FN onAnyAppEvent)
                }
             */
            appChannelHandlers: {},

            /**
             * @description Dictionary for event handlers for all events on a user channel
             * @example
             * userChannelHandlers = {
                    '/:appid/user/:userid': (FN onAnyUserEvent)
                }
             */
            userChannelHandlers: {},

            /**
             * Dictionary for event handlers for all events on a session channel
             *
             * @example
             * sessionChannelHandlers = {
                    '/:appid/session/:sessionid': (FN onAnySessionEvent)
                }
             */
            sessionChannelHandlers: {},

            /**
             * Initializes connection with Faye server
             *
             * @param {string} url url of MindMeld push API server
             */
            init: function (url) {
                this.fayeClient = new Faye.Client(url, {
                    'timeout': 120
                });

                var clientAuth = {
                    outgoing: function(message, callback) {
                        if (message.channel !== '/meta/subscribe') {
                            return callback(message);
                        }
                        if (!message.ext) {
                            message.ext = {};
                        }
                        message.ext.authToken = MM.token;
                        callback(message);

                    }
                };

                this.fayeClient.addExtension(clientAuth);
            },

            /**
             * Object specifying channel type and channel string
             *
             * @typedef {Object} ChannelConfig
             * @property {string} type type of channel (e.g., app, user, or session)
             * @property {string} channel full channel string (e.g., '/:appid/user/:userid')
             */

            /**
             * Event configuration object containing an event channel, handler, and event name
             *
             * @typedef     {Object}    EventConfig
             * @property    {string}    name    name of the event
             * @property    {function}  handler event handler
             * @property    {ChannelConfig}    channelConfig object specifying channel type and channel string
             */

            /**
             * Given an event config object, which contains event channel, event handler, and either a subscribeAll flag
             * or a specific event name, registers for either the given event or all the events on the channel
             *
             * @param {EventConfig} updateEventConfig config object specifying how which event to subscribe to
             * @param {function} onSuccess called when successfully subscribed to event
             * @param {function} onError called when there was an error subscribing to an event
             */
            subscribe: function (updateEventConfig, onSuccess, onError) {
                var self = MM.Internal.EventHandler;
                var channel = updateEventConfig.channelConfig.channel;
                var channelType = updateEventConfig.channelConfig.type;
                var channelSubscriptionExists = true;

                // Start new faye subscription if none exists
                if (this.fayeSubscriptions[channel] === undefined) {
                    channelSubscriptionExists = false;
                    var channelHandler = function (event) {

                        if (self.namedEventHandlers[channel] !== undefined) {
                            MM.Util.testAndCall(self.namedEventHandlers[channel][event.event], event.payload);
                        }
                        switch (channelType) {
                            case 'app':
                                MM.Util.testAndCall(self.appChannelHandlers[channel], event);
                                break;

                            case 'session':
                                MM.Util.testAndCall(self.sessionChannelHandlers[channel], event);
                                break;

                            case 'user':
                                MM.Util.testAndCall(self.userChannelHandlers[channel], event);
                                break;
                        }
                    };
                    // subscribe to channel
                    var channelSubscription = self.fayeClient.subscribe(channel, channelHandler);
                    self.fayeSubscriptions[channel] = channelSubscription;
                    channelSubscription.then(
                        function () {
                            if (MM.config.debug){
                                MM.Internal.log("SUCCESSFULLY CONNECTED TO CHANNEL: " + updateEventConfig.channel);
                            }
                            MM.Util.testAndCall(onSuccess);
                        },
                        function (error) {
                            MM.Internal.log("COULD NOT CONNECT TO CHANNEL: " + updateEventConfig.channel + '. Error: ' + error.message);
                            MM.Util.testAndCall(onError, error);
                        }
                    );
                }

                // Call onSuccess callback if we already have a valid subscription to the channel
                if (channelSubscriptionExists) {
                    MM.Util.testAndCall(onSuccess, channel);
                }

                var handler = updateEventConfig.handler;
                if (updateEventConfig.subscribeAll) {
                    switch (channelType) {
                        case 'app':
                            self.appChannelHandlers[channel] = handler;
                            break;

                        case 'session':
                            self.sessionChannelHandlers[channel] = handler;
                            break;

                        case 'user':
                            self.userChannelHandlers[channel] = handler;
                            break;
                    }
                }
                else {
                    if (self.namedEventHandlers[channel] === undefined) {
                        self.namedEventHandlers[channel] = {};
                    }
                    self.namedEventHandlers[channel][updateEventConfig.name] = handler;

                }
            },

            /**
             * Unsubscribes from an event. If there are no more handler's for events on the specified Faye channel,
             * unsubscribe from the Faye channel as well
             *
             * @param {EventConfig} updateEventConfig config object specifying how which event to unsubscribe from
             */
            unsubscribe: function (updateEventConfig) {
                var self = MM.Internal.EventHandler;
                var channel = updateEventConfig.channelConfig.channel;
                var channelType = updateEventConfig.channelConfig.type;
                if (updateEventConfig.subscribeAll) {
                    switch (channelType) {
                        case 'app':
                            delete self.appChannelHandlers[channel];
                            break;

                        case 'session':
                            delete self.sessionChannelHandlers[channel];
                            break;

                        case 'user':
                            delete self.userChannelHandlers[channel];
                            break;
                    }
                }
                else {
                    if (this.namedEventHandlers[channel] !== undefined) {
                        delete self.namedEventHandlers[channel][updateEventConfig.name];
                        if (_isEmptyObject(self.namedEventHandlers[channel])) {
                            delete self.namedEventHandlers[channel];
                        }
                    }
                }

                var shouldCancelSubscription = false;
                var hasNamedEventsOnChannel = self.namedEventHandlers[channel] !== undefined;
                if (! hasNamedEventsOnChannel) {
                    switch (channelType) {
                        case 'app':
                            shouldCancelSubscription = self.appChannelHandlers[channel] === undefined;
                            break;

                        case 'session':
                            shouldCancelSubscription = self.sessionChannelHandlers[channel] === undefined;
                            break;

                        case 'user':
                            shouldCancelSubscription = self.userChannelHandlers[channel] === undefined;
                            break;
                    }
                }

                if (shouldCancelSubscription) {
                    var fayeSubscription = self.fayeSubscriptions[channel];
                    if (fayeSubscription) {
                        fayeSubscription.cancel();
                        delete this.fayeSubscriptions[channel];
                    }
                }
            },

            /**
             * Unsubscribes from all custom events and subscribeAll events on specified channel
             *
             * @param {string} channel full channel string
             * @param {string} channelType channel type (e.g., app, user, session)
             */
            clearAllEventsForChannel: function (channel, channelType) {
                var self = MM.Internal.EventHandler;
                delete self.namedEventHandlers[channel];
                switch (channelType) {
                    case 'app':
                        delete self.appChannelHandlers[channel];
                        break;

                    case 'session':
                        delete self.sessionChannelHandlers[channel];
                        break;

                    case 'user':
                        delete self.userChannelHandlers[channel];
                        break;
                }

                var fayeSubscription = self.fayeSubscriptions[channel];
                if (fayeSubscription) {
                    fayeSubscription.cancel();
                    delete self.fayeSubscriptions[channel];
                }

                if(MM.config.debug) {
                    MM.Internal.log('Cleared all event handlers on ' + channel + ' channel');
                }
            }
        },

        /**
         * Contains common functionality for custom events on all channels. The {@link MM},
         * {@link MM.activeUser}, and {@link MM.activeSession} {@link Model}'s are the only
         * objects that use this mixin
         *
         * @mixin CustomEventHandlers
         */
        customEventHandlers: {
            /**
             * The NamedEventCallBack is used when subscribing to a specific event on a channel, as opposed
             * to subscribing to all events on a channel
             *
             * @callback NamedEventCallBack
             * @param {EventPayload} payload
             */

            /**
             * The AllEventsCallback is used when subscribing to every event on a given channel. The callback
             * takes an 'event' parameter object that contains the event name and the event payload
             *
             * @callback AllEventsCallback
             * @param {Object} eventObject event object received from push server
             * @param {string} eventObject.event    name of the event
             * @param {EventPayload} eventObject.payload    payload from the event
             */

            /**
             * Payload received from MindMeld push server. The payload may be either a string containing
             * a message about the event or a JSON object containing arbitrary data
             *
             * @typedef {(string | Object)} EventPayload
             */


            /**
             * Publish a new custom event
             *
             * @param {string} event event name
             * @param {EventPayload} payload payload for event
             * @instance
             * @memberOf CustomEventHandlers
             */
            _publish: function (event, payload) {
                var eventData = {
                    name: event,
                    payload: payload
                };

                var path = this.path() + '/events';

                this.makeModelRequest('POST', path, eventData);
            },

            /**
             * Uses {@link MM.Internal.EventHandler} to subscribe to a custom event
             *
             * @param eventName {string} name of event to subscribe to
             * @param eventHandler  {NamedEventCallBack} callback for when event is fired
             * @param onSuccess {function} callback for when subscription is successful
             * @param onError   {function} callback for when there is an error subscribing
             * @instance
             * @memberOf CustomEventHandlers
             */
            _subscribe: function (eventName, eventHandler, onSuccess, onError) {
                var eventConfig = {
                    name: eventName,
                    handler: eventHandler,
                    subscribeAll: false
                };
                eventConfig.channelConfig = this.getChannelConfig();

                MM.Internal.EventHandler.subscribe(eventConfig, onSuccess, onError);
            },

            /**
             * Unsubscribe from a named event
             *
             * @param {string} eventName name of event to subscribe from
             * @instance
             * @memberOf CustomEventHandlers
             */
            _unsubscribe: function (eventName) {
                var eventConfig = {
                    name: eventName,
                    subscribeAll: false
                };
                eventConfig.channelConfig = this.getChannelConfig();
                MM.Internal.EventHandler.unsubscribe(eventConfig);
            },

            /**
             * Subscribes to every event on this object's channel
             *
             * @param {AllEventsCallback} eventHandler callback for when an event on this object's channel is fired
             * @param onSuccess {function=} callback for when subscription is successful
             * @param onError   {function=} callback for when there is an error subscribing
             * @instance
             * @memberOf CustomEventHandlers
             */
            _subscribeAll: function (eventHandler, onSuccess, onError) {
                var eventConfig = {
                    subscribeAll: true,
                    handler: eventHandler
                };
                eventConfig.channelConfig = this.getChannelConfig();
                MM.Internal.EventHandler.subscribe(eventConfig, onSuccess, onError);
            },

            /**
             * Unsubscribe from all events on this object's channel
             *
             * @instance
             * @memberOf CustomEventHandlers
             */
            _unsubscribeAll: function () {
                var eventConfig = {
                    subscribeAll: true
                };
                eventConfig.channelConfig = this.getChannelConfig();
                MM.Internal.EventHandler.unsubscribe(eventConfig);
            }
        }
    });


    // Apply the API methods to the MindMeld API object
    _extend(MM, {

        /**
         *  This method will initialize the MindMeld SDK and must be called before any other
         *  calls to the MM SDK
         *
         * @param {Object} config configuration parameters containing developers' application id and
         *                  onInit callback
         *
         * @param {string} config.appid application id for this MindMeld application
         * @param {function} config.onInit callback for when MindMeld SDK is initialized
         * @memberOf MM
         * @instance
         *
         * @example
         *
         var mindMeldConfig = {
            appid: '<appid>',
            onInit: onMindMeldInit
         };

         function onMindMeldInit () {
            // MindMeld SDK Initialized
         }
         */
        init: function (config) {
            var defaultConfig = MM.config;

            // Allow user to override defaults
            //noinspection JSCheckFunctionSignatures
            MM.config = _extend({}, defaultConfig, config);

            // $(window.document).ready(function () {
            _onDocumentReady(function () {
              MM.Internal.onReady();
            });

        },

        /**
         * Requests a new admin or user token from the API and stores it locally. This token is automatically
         * used for all subsequent requests to the API. If we successfully obtain a token, {@link MM#getToken}
         * automatically calls {@link MM#setActiveUserID} with the appropriate user id
         *
         * @param {Object} credentials credentials for obtaining an API token.
         * Please refer to [documentation here](https://developer.expectlabs.com/docs/authentication) for details
         * @param onSuccess {function=} callback for when token obtained successfully
         * @param onError   {function=} callback for when there was an error obtaining token
         * @memberOf MM
         * @instance
         *
         *
         * @example <caption> Example code to get a token </caption>
         *
         var credentials = {...}; // admin credentials, simple user credentials, or user credentials
         MM.getToken(credentials, onGetToken);

         function onGetToken (result) {
            var token = result.token;
         }

         * @example <caption> Example credentials to get an admin token </caption>
         *
         var adminCredentials = {
            appsecret: '<appsecret>'
         };

         * @example <caption> Example credentials to get a simple user token </caption>
         *
         var simpleUserCredentials = {
            appsecret: '<appsecret>',
            simple: {
                userid: 'einstein79',
                name: 'Albert Einstein'
            }
         }

         * @example <caption> Example credentials to get a user token </caption>
         *
         var fbUserId = 'Facebook User Id';
         var fbAuthToken = 'Facebook User Token';
         var userCredentials = {
             facebook: {
                userid: fbUserId,
                token: fbAuthToken
             }
         };
         *
         */
        getToken: function (credentials, onSuccess, onError) {
            var headers = {'X-MindMeld-Appid': MM.config.appid}; // included on every token request
            var isAdminToken = false;
            var params = null;
            if (credentials.facebook || credentials.anonymous) { // User token
                params = {
                    credentials: credentials
                };
                params = JSON.stringify(params);
            }
            else if (credentials.appsecret && credentials.simple) {
                headers['X-MindMeld-Appsecret'] = credentials.appsecret;
                params = {
                    credentials: {'simple': credentials.simple}
                };
                params = JSON.stringify(params);
            }
            else if (credentials.appsecret) { // Admin token
                headers['X-MindMeld-Appsecret'] = credentials.appsecret;
                isAdminToken = true;
            }
            else { // Invalid credentials passed in
                var error = {
                    code: 14,
                    type: 'CredentialsInvalid',
                    message: 'A valid appsecret or either simple or facebook credentials are required.'
                };
                MM.Util.testAndCall(onError, error);
                return;
            }

            MM.callApi('POST', 'tokens', params, onTokenSuccess, onError, headers);

            // Sets MM.token on success
            function onTokenSuccess(response) {
                if (response.data && response.data.token) {
                    MM.token = response.data.token;
                    if (isAdminToken) {
                        // The admin user id is not returned when requesting a new token
                        // It can be found in the app object's 'ownerid' field
                        MM.get( null,
                            function (appResponse) {
                                var adminId = appResponse.data.ownerid;
                                MM.setActiveUserID(adminId);
                                MM.Util.testAndCall(onSuccess, response.data);
                            },
                            function (error) {
                                MM.Util.testAndCall(onError, error);
                            }
                        );
                    }
                    else {
                        // The user id is returned when requesting a new user token
                        if (response.data.user && response.data.user.userid) {
                            MM.setActiveUserID(response.data.user.userid);
                            MM.Util.testAndCall(onSuccess, response.data);
                        }
                    }
                }
                else {
                    MM.Util.testAndCall(onError, response);
                }
            }
        },

        /**
         * Revokes the current API token. Note that subsequent calls to the MindMeld API will not
         * work until a new token is obtained
         *
         * @param onSuccess {function=} callback for when token is successfully revoked
         * @param onError {function=} callback for when there was an error revoking token
         * @memberOf MM
         * @instance
         *
         * @example
         *
         function revokeTokenExample () {
            // First, get a token. In this example, we are getting an admin token
            var credentials = {
                appsecret: '<appsecret>'
            };
            MM.getToken(credentials, onGetToken);
         }
         function onGetToken () {
            // Now that we have a token, try an API request
            MM.get(null, onGetApplicationInfo);
         }
         function onGetApplicationInfo (result) {
            // Request succeeds because we have a token
            var applicationInfo = result.data;
            // Now, let's revoke the token
            MM.revokeToken (onRevokeToken);
         }
         function onRevokeToken () {
            // Now that we have revoked the token, try an API Request
            MM.get(null, onGetApplicationInfo, onGetApplicationError);
         }
         function onGetApplicationError (error) {
            console.log('Call failed. Error code ' + error.code + ': ' + error.message);
            // "Call failed. Error code 8: No token parameter was included in the api request"
         }
         */
        revokeToken: function (onSuccess, onError) {
            MM.callApi('DELETE', 'token/' + MM.token, null, onRevokeTokenSuccess, onError);

            // Clears MM.token on success
            function onRevokeTokenSuccess(response) {
                if (MM.config.debug) {
                    MM.Internal.log('SUCCESSFULLY REVOKED TOKEN: ' + MM.token);
                }
                MM.token = '';
                if (response.data) {
                    MM.Util.testAndCall(onSuccess, response);
                }
                else {
                    MM.Util.testAndCall(onError, response);
                }
            }
        },

        /**
         * Sets the active session to a specified session id. {@link MM#setActiveSessionID} also tries to fetch the session
         * object and clears all event handlers from the previous session. You must call setActiveSessionID before calling
         * any of the functions in the {@link MM.activeSession} namespace
         *
         * @param {string} sessionid session id to set active session to
         * @param onSuccess {APISuccessCallback=} callback for when session data was successfully fetched
         * @param onError   {APIErrorCallback=} callback for when there was an error fetching session data
         * @memberOf MM
         * @instance
         *
         * @example
         *
         function testSetActiveSessionID () {
            MM.setActiveSessionID('<session id>');
         }
         */
        setActiveSessionID: function (sessionid, onSuccess, onError) {
            var sessionEventChannel = MM.config.appid + '/session/' + MM.activeSessionId;
            MM.Internal.EventHandler.clearAllEventsForChannel(sessionEventChannel, 'session');
            MM.activeSessionId = sessionid;
            MM.Internal.clearSessionData();
            MM.activeSession.get(null, onSuccess, onError);
        },

        /**
         * Deprecated function for setting active session id. Use {@link MM#setActiveSessionID} instead
         *
         * @memberOf MM
         * @instance
         * @deprecated
         * @private
         */
        setActiveSession: function (sessionid, onSuccess, onError) {
            MM.setActiveSessionID(sessionid, onSuccess, onError);
        },

        /**
         * Sets the active user to a specified user id. {@link MM#setActiveUserID} also tries to fetch the user object
         * and clears all event handlers from the previous user. {@link MM#setActiveUserID} is automatically called
         * after successfully calling {@link MM#getToken}. You should only to call this method if you are using an
         * admin token and want to impersonate other users, or if you call {@link MM#setToken} with an existing token
         * and already know the corresponding user id
         *
         * @param {string} userid
         * @param onSuccess {APISuccessCallback=} callback for when user data successfully fetched
         * @param onError   {APIErrorCallback=} callback for when there was an error fetching user data
         * @memberOf MM
         * @instance
         *
         * @example
         *
         var userToken = '<known user token>';
         MM.setToken(userToken, onTokenValid);

         function onTokenValid () {
            MM.setActiveUserID('<known mindmeld user  id>', onGetUserInfo);
         }
         function onGetUserInfo (response) {
            var userInfo = response.data;
         }
         */
        setActiveUserID: function (userid, onSuccess, onError) {
            var userEventChannel = MM.config.appid + '/user/' + MM.activeUserId;
            MM.Internal.EventHandler.clearAllEventsForChannel(userEventChannel, 'user');
            MM.activeUserId = userid;
            MM.Internal.clearUserData();
            MM.activeUser.get(null, onSuccess, onError);
        },

        /**
         * Deprecated function for setting active user id. Use {@link MM#setActiveUserID} instead
         *
         * @memberOf MM
         * @instance
         * @deprecated
         * @private
         */
        setActiveUser: function (userid, onSuccess, onError) {
            MM.setActiveUserID(userid, onSuccess, onError);
        },

        /**
         * Set the MM token directly instead of calling {@link MM#getToken}. This function also
         * provides valid/invalid callbacks to determine if the given token is valid or not.
         * Regardless of the token being valid, {@link MM#setToken} always sets the token
         * used by MM. Unlike {@link MM#getToken}, {@link MM#setToken} does not automatically
         * call {@link MM#setActiveUserID}
         *
         * @param {string} token token to be used by SDK
         * @param {function=} onTokenValid callback for when given token is valid
         * @param {function=} onTokenInvalid callback for when given token is invalid
         * @memberOf MM
         * @instance
         *
         * @example
         *
         function setToken () {
            MM.setToken('<token>', onTokenValid, onTokenInvalid);
         }
         function onTokenValid () {
            // token is valid
         }
         function onTokenInvalid () {
            // token is invalid
         }
         */
        setToken: function (token, onTokenValid, onTokenInvalid) {
            MM.token = token;
            MM.get(null,
                function onTokenSuccess () {
                    MM.Util.testAndCall(onTokenValid);
                },
                function onTokenError () {
                    MM.Util.testAndCall(onTokenInvalid);
                }
            );
        },

        /**
         * The APISuccessCallback handles successful responses from the API. Every response from the MindMeld API conforms
         * to the same format
         *
         * @callback APISuccessCallback
         * @param {Object} result result object containing response from the API
         * @param {(Object | Array)} result.data data returned from the API. For object endpoints (e.g., "/user/:userid"), data is an Object,
         * but for collection endpoints (e.g., "/documents"), data is an Array of Objects
         * @param {Object} result.request contains information about the request made
         * @param {string} result.timestamp timestamp of the request
         * @param {number} result.responsetime amount of time the API call took in seconds
         * @param {string} result.etag  ETag for request. Please refer to our [documentation here](https://developer.expectlabs.com/docs/sendingRequest) for more information on ETags
         */

        /**
         * The APIErrorCallback handles unsuccessful response from the API. Every error response from the api conforms
         * to the same format
         *
         * @callback APIErrorCallback
         * @param {Object} error error object containing information about an API Error
         * @param {number} error.code API error code
         * @param {string} error.message API error message
         * @param {string} error.type API error type
         */

        /**
         * A QueryParamGetter is user-defined function that return a {@link QueryParameters} object. It is used
         * when setting up onUpdate() handlers for collections with push updates (e.g., {@link MM.activeUser.sessions},
         * {@link MM.activeSession.textentries}, or {@link MM.activeSession.documents}). When a push event is fired for
         * the collection, the SDK automatically makes a get() request to update the collection. A {@link QueryParamGetter}
         * is used to specify the parameters used in that automatic get() request.
         *
         * @typedef {function} QueryParamGetter
         *
         * @returns {QueryParameters} A {@link QueryParameters} object used to make a get() request after a
         * collection's push event fires
         */

        /**
         * A QueryParameter Object has one or more fields that allow you to narrow down the list of
         * items returned from a collection. A QueryParameter object looks like the following:
         *
         * @example
         * var queryParams = {
         *      query: "san francisco", // return items that match the string 'san francisco'
         *      start: 4,   // return items starting at the 4th index
         *      limit: 10,  // limit the number of returned items to 10
         *      since: "last Monday",   // return items created since last Monday
         *      until: "yesterday"     // return items that were crated before yesterday
         * }
         *
         * @typedef {Object} QueryParameters
         * @property {string=} query search query string to retrieve specific objects that match the query. See the
         * documentation on [search query syntax](https://developer.expectlabs.com/docs/searchQuerySyntax)
         * for more information
         * @property {number=} start The index of the first object in the returned list of objects. This can
         * be used for paging through large collections of objects.
         * @property {number=} limit The maximum number of individual objects to be returned in the response.
         * If not specified, the default is 10. The maximum allowed value is 50.
         * @property {(number|string)=} since A Unix timestamp or
         * [strtotime](http://php.net/manual/en/function.strtotime.php) date value that specifies the
         * start of a range of time-based data. Only objects created after this timestamp will be
         * returned in the response.
         * @property {(number|string)=} until A Unix timestamp or
         * [strtotime](http://php.net/manual/en/function.strtotime.php) date value that specifies the end
         * of a range of time-based data. Only objects created before this timestamp will be
         * returned in the response.
         */

        /**
         * Makes a call directly to the MindMeld API. This method can be used to make calls to any path of
         * the MindMeld API that are not part of the namespaces
         *
         * @param {string}                          method      HTTP method to use for API call ('GET', 'POST', or 'DELETE')
         * @param {string}                          path        API endpoint path (e.g., 'session/:sessionid/textentries')
         * @param {QueryParameters=}                params      Parameters to be sent to MindMeld API. Params are URL
         * encoded for GET and DELETE requests
         *                                                      and are sent as POST data for POST requests
         * @param {APISuccessCallback=}             success     A callback function to be called if the API request succeeds.
         * The function receives one argument containing the data returned from the server
         * @param {APIErrorCallback=}               error       A callback function to be called if the API request fails.
         * The function receives one argument, the error message returned from the server
         * @memberOf MM
         * @instance
         *
         * @example <caption> Example GET request
         * to the
         * [session text entries endpoint](https://developer.expectlabs.com/docs/endpointSession#getSessionSessionidTextentries)
         * </caption>
         *
         function callAPI () {
            MM.callApi('GET', 'session/47978/textentries', null, onGetTextEntries);
         }
         function onGetTextEntries (response) {
            var responseData = response.data;
         }

         * @example <caption> Example POST request to the application's
         * [publish event endpoint](https://developer.expectlabs.com/docs/endpointApp#postEvents) </caption>
         *
         function callAPI () {
            var eventData = {
                name: 'custom event name',
                payload: 'test payload'
            };
            MM.callApi('POST', 'events', eventData, onPublishEvent);
         }
         function onPublishEvent (response) {
            var responseData = response.data;
         }
         */
        callApi: function (method, path, params, success, error, headers) {
            var modSince = false;
            if (params && params['if-modified-since']) {
                modSince = true;
                delete params['if-modified-since'];
            }

            headers = headers || {'X-MINDMELD-ACCESS-TOKEN': MM.token};
            var fullUrl = MM.config.cleanUrl + path;
            if (MM.config.debug) {
                MM.Internal.log('Calling MindMeld API with: ' + method +
                    ' and URL: ' + fullUrl +
                    ' and Params: ' + JSON.stringify(params));
            }
            // Now call the API using AJAX.
            ajax({
                type: method,
                url: fullUrl,
                data: params,
                dataType: 'json',
                headers: headers,
                ifModified: modSince,
                success: function (result, status) {
                    if (MM.config.debug) {
                        MM.Internal.log('The MindMeld request returned: ' + JSON.stringify(result));
                    }
                    if (status === 'notmodified') {
                        MM.Util.testAndCall(error, status);
                    }
                    else if (result) {
                        if (result.data) {
                            MM.Util.testAndCall(success, result);
                        }
                        else if (result.error) {
                            MM.Util.testAndCall(error, result.error);
                        }
                    }
                    else {
                        MM.Util.testAndCall(error, result);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    var text = 'Ajax Request Error: ' + 'XMLHTTPRequestObject status: (' + xhr.status + ', ' + xhr.statusText + '), ' +
                        'text status: (' + textStatus + '), error thrown: (' + errorThrown + ')';
                    MM.Internal.log('The MindMeld AJAX request failed with the error: ' + text);
                    MM.Internal.log(xhr.responseText);
                    MM.Internal.log(xhr.getAllResponseHeaders());
                    var errorObj = {
                        code: 0,
                        type: 'Failed Ajax Request',
                        message: ''+errorThrown
                    };
                    MM.Util.testAndCall(error, errorObj);
                }
            });
        }
    });

    /**
     * Collection MindMeld object models
     *
     * @namespace
     * @memberOf MM
     * @private
     */
    MM.models = {};

    MM.models.Model = MM.Internal.createSubclass(Object, {
        /**
         * Object specifying a location object containing a latitude and longitude
         *
         * @example
         * location = {
         *  latitude: 33.53,
         *  longitude: -7.59
         * }
         *
         * @typedef {Object} Location
         * @property {number} latitude latitude of the location
         * @property {number} longitude longitude of the location
         */

        /**
         * Constructor for Model class
         *
         * @constructs Model
         * @classdesc This is the base class for all the API objects. This is where the functionality for getting and pushing
         * data to the API is located. This class is never used directly, however; it's always one of the child classes that
         * is used (e.g., ActiveUser, TextEntryList)
         * @private
         */
        constructor: function () {
            this.result = null;
            this.shouldPersist = true;
            this.updateHandler = null;
            this.eTag = null;
        },

        /**
         * Write object data to [localstorage](http://www.w3schools.com/html/html5_webstorage.asp) (if available)
         *
         * @memberOf Model
         * @instance
         * @private
         */
        backupData: function () {
            if (MM.support.localStorage) {
                try { // some devices may not have enough space
                    window.localStorage[this.localStoragePath()] = JSON.stringify(this.result);
                } catch (e) {}
            }
        },

        /**
         * Clears both stored result data and localStorage data
         *
         * @memberOf Model
         * @instance
         * @private
         */
        clearAllData: function () {
            this.result = null;
            this.clearLocalData();
        },

        /**
         * Clears local storage data
         *
         * @memberOf Model
         * @instance
         * @private
         */
        clearLocalData: function () {
            if (MM.support.localStorage) {
                window.localStorage.removeItem(this.localStoragePath());
            }
        },


        /**
         * Internal method for Model class used by every Model to reload all data
         * from the MindMeld API for this object
         *
         * @param {Object=} params optional query parameters when GET-ing collection
         * @param {function=} onSuccess callback for when GET-ing data from collection was successful
         * @param {function=} onFail callback for when GET-ing data from collection failed
         * @memberOf Model
         * @private
         * @instance
         */
        _get: function (params, onSuccess, onFail) {
            this.makeModelRequest('GET', this.path(), params, onGetSuccess, onFail);

            var updateHandler = this.updateHandler; // Closures FTW
            // Call onUpdate handler before callback if specified
            function onGetSuccess(response) {
                MM.Util.testAndCall(updateHandler, response);
                MM.Util.testAndCall(onSuccess, response);
            }
        },

        /**
         * Restores data from local storage
         *
         * @param {function=} onSuccess callback for when object data was successfully restored from localstorage
         * @param {function=} onFail callback for when restoring object data from localstorage failed
         * @memberOf Model
         * @instance
         * @private
         */
        restore: function (onSuccess, onFail) {
            if (MM.support.localStorage) {
                var storedData = window.localStorage[this.localStoragePath()];
                if (storedData) {
                    storedData = JSON.parse(storedData);
                    if (storedData) {
                        this.result = storedData;
                        MM.Util.testAndCall(onSuccess);
                        return;
                    }
                }
            }
            MM.Util.testAndCall(onFail);
        },

        /**
         * Internal helper function returns the data portion of the response from a GET request
         *
         * @returns {?Object}
         * @memberOf Model
         * @instance
         */
        _json: function () {
            if (this.result && this.result.data) {
                return this.result.data;
            }
            else {
                return null;
            }
        },

        /**
         * Use {@link MM#callApi} to GET, POST, or DELETE data. {@link Model#makeModelRequest} (by default) saves data returned from
         * GET requests to localstorage. It also records the ETag returned from the API responses. Note, this is an internal
         * function, and not needed to use the SDK
         *
         * @param {string} method HTTP method to use for API call
         * @param {string} path API endpoint path
         * @param {Object=} params query parameters or data to be sent API
         * @param {APISuccessCallback=} success callback for when {@link Model} request is successful
         * @param {APIErrorCallback=} error callback for when there is an error with {@link Model} request
         * @private
         * @memberOf Model
         * @instance
         */
        makeModelRequest: function (method, path, params, success, error) {
            var me = this;
            var callback = function (result) {
                if (result.request && result.request.method && result.request.method.toUpperCase() === 'GET') {
                    me.result = result;
                    if (me.shouldPersist) {
                        me.backupData();
                    }
                    if (result.etag) {
                        me.eTag = result.etag;
                    }
                }
                if (result.data) {
                    MM.Util.testAndCall(success, result);
                }
                else {
                    MM.Util.testAndCall(error, result);
                }
            };
            var headers = {'X-MINDMELD-ACCESS-TOKEN': MM.token};
            if (params) {
                if (params['if-none-match'] && this.eTag !== null) {
                    headers['if-none-match'] = this.eTag;
                    delete params['if-none-match'];
                }
            }
            MM.callApi(method, path, params, callback, error, headers);
        },

        /**
         * Obtains the channel config for this object, using this model's channelType field.
         *
         * @private
         * @memberOf Model
         * @instance
         * @returns {ChannelConfig} channelConfig object specifying channel type and full channel string
         */
        getChannelConfig: function () {
            var channelConfig = {};
            var channelString = '/' + MM.config.appid;
            switch (this.channelType) {
                case 'app':
                    channelConfig.type = this.channelType;
                    channelConfig.channel = channelString;
                    break;

                case 'session':
                    channelConfig.type = this.channelType;
                    channelConfig.channel = channelString + '/session/' + MM.activeSessionId;
                    break;

                case 'user':
                    channelConfig.type = this.channelType;
                    channelConfig.channel = channelString + '/user/' + MM.activeUserId;
                    break;
            }
            return channelConfig;
        },

        /**
         * Internal function that sets this model's onUpdate handler. If no handler is passed in
         * onUpdate unsubscribes from push events
         *
         * @param {?NamedEventCallBack} updateHandler callback for when this {@link Model}'s collection updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {function=} getQueryParams user-defined function that returns custom query parameters
         * when automatically calling this model's get() onUpdate
         * @memberOf Model
         * @instance
         */
        _onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this.updateHandler = updateHandler;
            if (this.updateEventName && this.channelType) {
                var eventConfig = {
                    name: this.updateEventName,
                    subscribeAll: false
                };
                eventConfig.channelConfig = this.getChannelConfig();
                if (updateHandler) {
                    var self = this;
                    eventConfig.handler = function () { // Closures strike again!
                        var customQueryParams = null;
                        if (_isFunction(getQueryParams)) {
                           customQueryParams = getQueryParams();
                        }
                        self.get(customQueryParams);
                    };
                    MM.Internal.EventHandler.subscribe(eventConfig, onSuccess, onError);
                }
                else {
                    MM.Internal.EventHandler.unsubscribe(eventConfig);
                }
            }
            else {
                MM.Util.testAndCall(onError);
            }
        },

        /**
         * Returns this {@link Model}'s unique local storage path.
         *
         * @private
         * @memberOf Model
         * @instance
         * @returns {string}
         */
        localStoragePath: function () {
            return '';
        },

        /**
         * Returns this {@link Model}'s unique API endpoint path
         *
         * @private
         * @memberOf Model
         * @instance
         * @returns {string}
         */
        path: function () {
            return '';
        }
    });

    MM.models.App = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * Constructor for App
         *
         * @constructs App
         * @classdesc The App class represents the data for the current application. It can be accessed via
         * 'MM'. The global MM object is an instance of class App and has access to all the same methods
         * as each of the other {@link Model} classes. The App object is used to fetch data for the current
         * app and publish / subscribe to app channel events.
         * @augments Model
         * @private
         */
        constructor: function () {
            MM.models.App.superclass.constructor.apply(this, arguments);
            _extend(this, MM.Internal.customEventHandlers); // adds support for custom events on app channel
        },
        localStoragePath: function () {
            return 'MM.app';
        },
        path: function () {
            return('');
        },
        /**
         * Helper function returns the JSON data for the current application. You must have called {@link MM#get}
         * first, before {@link MM#json} returns any data.
         *
         *
         * @returns {Object}
         * @memberOf MM
         * @instance
         *
         * @example
         *
         function getApplicationInfo () {
            MM.get(null, onGetApplicationInfo);
         }
         function onGetApplicationInfo () {
            var applicationInfo = MM.json();
            // MM.json() returns a JSON object containing data received from MM.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the app object's onUpdate handler. Pass null as the updateHandler parameter to
         * deregister a previously set updateHandler. If the updateHandler has been set, it
         * is automatically called when application info is fetched (e.g. {@link MM#get})
         *
         * @param {APISuccessCallback=} updateHandler callback for when the app object updates
         * @memberOf MM
         * @instance
         *
         * @example
         *
         function getApplicationInfo () {
            MM.onUpdate(onGetApplicationInfo); // Set the updateHandler
            MM.get(); // Fetch application info
         }
         function onGetApplicationInfo (response) {
            var applicationInfo = response.data;
         }
         */
        onUpdate: function (updateHandler) {
            this._onUpdate(updateHandler, null, null);
        },
        /**
         * Get information about the application. User privileges
         * allow access to basic application information. Admin privileges allow access
         * to extended information about the application. Note that, if an onUpdate handler
         * has already been specified for this object, the onUpdate handler will be invoked
         * first, followed by any specified 'onSuccess' callback.
         * @param {QueryParameters=} params query parameters when fetching the application object
         * @param {APISuccessCallback=} onSuccess callback for when getting application data was successful
         * @param {APIErrorCallback=} onFail callback for when getting application data failed
         * @memberOf MM
         * @instance
         *
         * @example
         *
         function getApplicationInfo () {
            MM.get(null, onGetApplicationInfo);
         }
         function onGetApplicationInfo (response) {
            var applicationInfo = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(null, onSuccess, onFail);
        },
        /**
         * Update application information. This function requires an admin token
         *
         * @param {Object} appData
         * @param {APISuccessCallback=} onSuccess
         * @param {APISuccessCallback=} onFail
         * @memberOf MM
         * @private
         * @instance
         */
        post: function (appData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), appData, onSuccess, onFail);
        },
        /**
         * Publish a new, custom event on the app channel
         *
         * @param {string} event event name
         * @param {EventPayload=} payload payload for event
         * @memberOf MM
         * @instance
         *
         * @example <caption> Code snippet to subscribe and publish a
         * custom event on the application channel </caption>
         *
         function publishEvent() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on application channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent' with the payload containing the string
            // 'custom payload'
            MM.publish('testEvent', 'custom payload');
         }
         function onTestEvent (payload) {
            // the payload parameter is 'custom payload'
            console.log('Received testEvent with payload: ' + payload);
         }
         */
        publish: function (event, payload) {
            this._publish(event, payload);
        },
        /**
         * Subscribe to a custom event on the app channel
         *
         * @param eventName {string} name of event to subscribe to
         * @param eventHandler  {NamedEventCallBack} callback for when event is fired
         * @param onSuccess {function=} callback for when subscription is successful
         * @param onError   {function=} callback for when there is an error subscribing
         * @memberOf MM
         * @instance
         *
         * @example <caption> Code snippet to subscribe and publish a
         * custom event on the application channel </caption>
         *
         function publishEvent() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on application channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent' with the payload containing the string
            // 'custom payload'
            MM.publish('testEvent', 'custom payload');
         }
         function onTestEvent (payload) {
            // the payload parameter is 'custom payload'
            console.log('Received testEvent with payload: ' + payload);
         }
         */
        subscribe: function (eventName, eventHandler, onSuccess, onError) {
            this._subscribe(eventName, eventHandler, onSuccess, onError);
        },
        /**
         * Unsubscribe from a custom event on the app channel
         *
         * @param {string} eventName name of event to subscribe from
         * @instance
         * @memberOf MM
         *
         * @example
         *
         function unsubscribeExample() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on application channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent'
            MM.publish('testEvent');
         }
         function onTestEvent (payload) {
            // onTestEvent will be called once after 'testEvent' is published
            console.log('received test event');
            // Now unsubscribe from 'testEvent'
            MM.unsubscribe('testEvent');
            // Publish 'testEvent' again
            MM.publish('testEvent');
            // Since we unsubscribed, onTestEvent won't be called anymore
         }
         */
        unsubscribe: function (eventName) {
            this._unsubscribe(eventName);
        },
        /**
         * Subscribes to every event on the app channel
         *
         * @param {AllEventsCallback} eventHandler callback for when an event on the app channel is fired
         * @param onSuccess {function=} callback for when subscription is successful
         * @param onError   {function=} callback for when there is an error subscribing
         * @instance
         * @memberOf MM
         *
         * @example
         *
         function subscribeAllExample () {
            MM.subscribeAll(onApplicationChannelEvent, onSubscribeApplicationChannel);
         }
         function onSubscribeApplicationChannel () {
            MM.publish('eventA', 'payloadA');
            MM.publish('eventB', 'payloadB');
         }
         function onApplicationChannelEvent (eventObject) {
            var eventName = eventObject.event;
            var eventPayload = eventObject.payload;
            console.log('Received event ' + eventName +
                ' with payload ' + eventPayload);
            // Received event eventA with payload payloadA
            // Received event eventB with payload payloadB
         }
         */
        subscribeAll: function (eventHandler, onSuccess, onError) {
            this._subscribeAll(eventHandler, onSuccess, onError);
        },
        /**
         * Unsubscribe from all events on the app channel
         *
         * @instance
         * @memberOf MM
         *
         * @example
         *
         function unsubscribeAllExample () {
            // First subscribe to all events on app channel
            MM.subscribeAll(onApplicationEvent, onSubscribeApplicationChannel);
         }
         function onSubscribeApplicationChannel () {
            // publish the event 'testEvent'
            MM.publish('testEvent');
         }
         function onApplicationEvent (eventObject) {
            var eventName = eventObject.event;
            console.log('Received event ' + eventName);
            // Now unsubscribe from application events
            MM.unsubscribeAll();
            MM.publish('testEvent');
            // onApplicationEvent won't be called because we are unsubscribed
            // from all application level events
         }
         */
        unsubscribeAll: function () {
            this._unsubscribeAll();
        },
        channelType: 'app'
    });

    MM.models.ActiveUser = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeUser is a namespace that represents the currently active user. It can only be used after
         * {@link MM#setActiveUserID} has been called. All API calls requiring a user's context use the activeUser's
         * userid. This namespace provides methods to subscribe to user's push events and interface to the
         * user's session list via {@link MM.activeUser.sessions}
         *
         * @namespace MM.activeUser
         * @memberOf MM
         */
        constructor: function () {
            MM.models.ActiveUser.superclass.constructor.apply(this, arguments);
            _extend(this, MM.Internal.customEventHandlers); // adds support for custom events on user channel
        },
        localStoragePath: function () {
            return 'MM.activeUser';
        },
        path: function () {
            return('user/' + MM.activeUserId);
        },
        /**
         * Helper function returns the JSON data for the activeUser object
         *
         * @returns {Object}
         * @memberOf MM.activeUser
         * @instance
         *
         * @example
         *
         function getUserInfo () {
            MM.activeUser.get(null, onGetUserInfo);
         }
         function onGetUserInfo () {
            var userInfo = MM.activeUser.json();
            // MM.activeUser.json() returns a JSON object containing
            // data received from MM.activeUser.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeUser's onUpdate handler. Pass null as the updateHandler parameter to
         * deregister a previously set updateHandler. If the updateHandler has been set, it
         * is automatically called when active user info is fetched (e.g. {@link MM.activeUser#get})
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeUser object updates
         * @memberOf MM.activeUser
         * @instance
         *
         * @example
         *
         function getUserInfo () {
            MM.activeUser.onUpdate(onGetUserInfo); // Set the updateHandler
            MM.activeUser.get(); // Fetch active user info
         }
         function onGetUserInfo (response) {
            var userInfo = response.data;
         }
         */
        onUpdate: function (updateHandler) {
            this._onUpdate(updateHandler, null, null);
        },
        /**
         * Get information about the user with the specified userid. For a token with user privileges,
         * the request will only allow access for the user associated with the token. For a token
         * with admin privileges, this request is permitted for any user of the app.
         *
         * @param {QueryParameters=} params query parameters when fetching the user object
         * @param {APISuccessCallback=} onSuccess callback for when getting user data was successful
         * @param {APIErrorCallback=} onFail callback for when getting user data failed
         * @memberOf MM.activeUser
         * @instance
         *
         * @example
         *
         function getUserInfo () {
            MM.activeUser.get(null, onGetUserInfo);
         }
         function onGetUserInfo (response) {
            var userInfo = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(null, onSuccess, onFail);
        },
        /**
         * Modify information about the active user
         *
         * @param {Object} userInfo Object containing updated user data. Currently, this function permits
         * the 'location' attribute for the user to be updated. Please see User endpoints documentation
         * [here](https://developer.expectlabs.com/docs/endpointUser#postUserUserid) for more info
         * @param {Location} userInfo.location location object containing lat/long
         * @param {APISuccessCallback=} onSuccess callback for when updating user info was successful
         * @param {APIErrorCallback=} onFail callback for when updating user info failed
         * @memberOf MM.activeUser
         * @instance
         *
         * @example
         *
         function updateUserLocation () {
            var newUserInfo = {
                location: {
                    latitude: 33.53,
                    longitude: -7.59
                }
            };
            MM.activeUser.post(newUserInfo, onUpdateUserInfo);
         }
         function onUpdateUserInfo (response) {
            // User location updated
         }
         */
        post: function (userInfo, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), userInfo, onSuccess, onFail);
        },
        /**
         * Set the user's location. This is a shortcut for setting a user's latitude and longitude
         * without having to create a params object when using {@link MM.activeUser.post}.
         *
         * @param {number} latitude new latitude of active user
         * @param {number} longitude new latitude of active user
         * @param {APISuccessCallback=} onSuccess callback for when updating user info was successful
         * @param {APIErrorCallback=} onFail callback for when updating user info failed
         * @memberOf MM.activeUser
         * @instance
         *
         * @example
         *
         function setLocationExample () {
            MM.activeUser.setLocation(22, 88, onSetLocation);
         }

         function onSetLocation (response) {
            // User location updated
         }
         */
        setLocation: function (latitude, longitude, onSuccess, onFail) {
            var newUserInfo = {
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
            };

            MM.activeUser.post(newUserInfo, onSuccess, onFail);
        },
        /**
         * Publish a new, custom event on the active user's channel
         *
         * @param {string} event event name
         * @param {EventPayload=} payload payload for event
         * @memberOf MM.activeUser
         * @instance
         *
         * @example <caption> Code snippet to subscribe and publish a
         * custom event on the active user's channel </caption>
         *
         function publishEvent() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.activeUser.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on user channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent' with the payload containing the string
            // 'custom payload'
            MM.activeUser.publish('testEvent', 'custom payload');
         }
         function onTestEvent (payload) {
            // the payload parameter is 'custom payload'
            console.log('Received testEvent with payload: ' + payload);
         }
         */
        publish: function (event, payload) {
            this._publish(event, payload);
        },
        /**
         * Subscribe to a custom event on the active user's channel
         *
         * @param eventName {string} name of event to subscribe to
         * @param eventHandler  {NamedEventCallBack} callback for when event is fired
         * @param onSuccess {function=} callback for when subscription is successful
         * @param onError   {function=} callback for when there is an error subscribing
         * @memberOf MM.activeUser
         * @instance
         *
         * @example <caption> Code snippet to subscribe and publish a
         * custom event on the active user's channel </caption>
         *
         function publishEvent() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.activeUser.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on user channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent' with the payload containing the string
            // 'custom payload'
            MM.activeUser.publish('testEvent', 'custom payload');
         }
         function onTestEvent (payload) {
            // the payload parameter is 'custom payload'
            console.log('Received testEvent with payload: ' + payload);
         }
         */
        subscribe: function (eventName, eventHandler, onSuccess, onError) {
            this._subscribe(eventName, eventHandler, onSuccess, onError);
        },
        /**
         * Unsubscribe from a custom event on the active user's channel
         *
         * @param {string} eventName name of event to subscribe from
         * @instance
         * @memberOf MM.activeUser
         *
         * @example
         *
         function unsubscribeExample() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.activeUser.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on user channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent'
            MM.activeUser.publish('testEvent');
         }
         function onTestEvent (payload) {
            // onTestEvent will be called once after 'testEvent' is published
            console.log('received test event');
            // Now unsubscribe from 'testEvent'
            MM.activeUser.unsubscribe('testEvent');
            // Publish 'testEvent' again
            MM.activeUser.publish('testEvent');
            // Since we unsubscribed, onTestEvent won't be called anymore
         }
         */
        unsubscribe: function (eventName) {
            this._unsubscribe(eventName);
        },
        /**
         * Subscribes to every event on the active user's channel
         *
         * @param {AllEventsCallback} eventHandler callback for when an event on the user channel is fired
         * @param onSuccess {function=} callback for when subscription is successful
         * @param onError   {function=} callback for when there is an error subscribing
         * @instance
         * @memberOf MM.activeUser
         *
         * @example
         *
         function subscribeAllExample () {
            MM.activeUser.subscribeAll(onUserChannelEvent, onSubscribeUserChannel);
         }
         function onSubscribeUserChannel () {
            MM.activeUser.publish('eventA', 'payloadA');
            MM.activeUser.publish('eventB', 'payloadB');
         }
         function onUserChannelEvent (eventObject) {
            var eventName = eventObject.event;
            var eventPayload = eventObject.payload;
            console.log('Received event ' + eventName +
                ' with payload ' + eventPayload);
            // Received event eventA with payload payloadA
            // Received event eventB with payload payloadB
         }
         */
        subscribeAll: function (eventHandler, onSuccess, onError) {
            this._subscribeAll(eventHandler, onSuccess, onError);
        },
        /**
         * Unsubscribe from all events on the active user's channel
         *
         * @instance
         * @memberOf MM.activeUser
         *
         * @example
         *
         function unsubscribeAllExample () {
            // First subscribe to all events on active user channel
            MM.activeUser.subscribeAll(onUserChannelEvent, onSubscribeUserChannel);
         }
         function onSubscribeUserChannel () {
            // publish the event 'testEvent'
            MM.activeUser.publish('testEvent');
         }
         function onUserChannelEvent (eventObject) {
            var eventName = eventObject.event;
            console.log('Received event ' + eventName);
            // Now unsubscribe from user channel events
            MM.activeUser.unsubscribeAll();
            MM.activeUser.publish('testEvent');
            // onUserChannelEvent won't be called because we are unsubscribed
            // from all user channel events
         }
         */
        unsubscribeAll: function () {
            this._unsubscribeAll();
        },
        channelType: 'user'
    });

    MM.models.SessionList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeUser.sessions represents the user's sessions collection in the MindMeld API.
         *
         * @namespace MM.activeUser.sessions
         * @memberOf MM.activeUser
         */
        constructor: function () {
            MM.models.SessionList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeUser.sessions';
        },
        path: function () {
            return('user/' + MM.activeUserId + '/sessions');
        },
        /**
         * Helper function returns the JSON data for the sessions collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeUser.sessions
         * @instance
         *
         * @example
         *
         function getSessions () {
            MM.activeUser.sessions.get(null, onGetSessions);
         }
         function onGetSessions (response) {
            var sessions = MM.activeUser.sessions.json();
            // MM.activeUser.sessions.json() returns a JSON object
            // containing data received from MM.activeUser.sessions.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeUser.session's onUpdate handler. If no handler is passed in, onUpdate unsubscribes from push events
         *
         * @param {APISuccessCallback=} updateHandler callback for when the active user's session list updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @memberOf MM.activeUser.sessions
         * @instance
         *
         * @example <caption> Setting the onUpdate handler, creating a new session, and
         * obtaining the latest session list </caption>
         *
         function sessionsOnUpdateExample () {
            // set the onUpdate handler for the sessions list
            MM.activeUser.sessions.onUpdate(
                onSessionsUpdate,
                onSubscribedToSessionsUpdates,
                onSubscribeToSessionUpdatesError,
                getSessionListParams
            );
         }
         function onSubscribedToSessionsUpdates () {
            // successfully subscribed to updates to the user's sessions list
            // now, create a new session
            createNewSession();
         }
         function onSubscribeToSessionUpdatesError () {
            console.log('error subscribing to session list updates');
         }
         function getSessionListParams () {
            // When the session list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onSessionsUpdate () {
            // there was an update to the sessions list
            var sessions = MM.activeUser.sessions.json();
            // sessions contains the latest list of sessions
         }
         function createNewSession () {
            var newSessionData = {
                name: 'new session name',
                privacymode: 'inviteonly'
            };
            MM.activeUser.sessions.post(newSessionData);
         }
         *
         * @example <caption> Deregistering the onUpdate handler </caption>
         *
         function deregisterSessionListOnUpdate () {
            MM.activeUser.sessions.onUpdate(null);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler, onSuccess, onError, getQueryParams);
        },
        /**
         * Get the list of sessions that can be accessed by the specified user. A request made with a user token is permitted
         * to get the session list for only the user associated with the token. A request made with an admin token
         * can get the session list for any user of your application.
         *
         * @param {QueryParameters=} params A {@link QueryParameters} object allowing you to filter the sessions returned.
         * See documentation [here](https://developer.expectlabs.com/docs/endpointUser#getUserUseridSessions) for more details
         * @param {APISuccessCallback=} onSuccess callback for when getting the session list was successful
         * @param {APIErrorCallback=} onFail callback for when getting the session list failed
         * @memberOf MM.activeUser.sessions
         * @instance
         *
         * @example
         *
         function getSessions () {
            MM.activeUser.sessions.get(null, onGetSessions);
         }
         function onGetSessions (response) {
            var sessions = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Creates a new session for currently active user. This will create a new session, and the specified
         * user will be set as the session organizer, as indicated by the 'organizer' attribute of the session object.
         * A request made with a user token is permitted to post to the session list for only the user associated
         * with the token. A request made with an admin token is permitted to create a new session on behalf
         * of any user of the application.
         *
         * @param {Object} sessionInfo Object containing new session data. Please refer to documentation for creating sessions
         * [here](https://developer.expectlabs.com/docs/endpointUser#postUserUseridSessions) for more info
         * @param {string} sessionInfo.name name of the new session
         * @param {string} sessionInfo.privacymode the privacy mode for the session. The supported privacy modes
         * are 'friendsonly', 'inviteonly', and 'public'.  Sessions that are 'inviteonly' can be accessed only
         * by the session organizer and any user on the inviteduser list for the session. Sessions that
         * are 'friendsonly' can be accessed by users who are in the friends collection of the session
         * organizer. Sessions that are 'public' can be accessed by all users of your application.
         * @param {APISuccessCallback=} onSuccess callback for when creating new session was successful
         * @param {APIErrorCallback=} onFail callback for when creating new session failed
         * @memberOf MM.activeUser.sessions
         * @instance
         *
         * @example
         *
         function createNewSession () {
            var newSessionData = {
                name: 'new session name',
                privacymode: 'inviteonly'
            };
            MM.activeUser.sessions.post(newSessionData, onCreateNewSession);
         }
         function onCreateNewSession (result) {
            console.log(result);
         }
         */
        post: function (sessionInfo, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), sessionInfo, onSuccess, onFail);
        },
        /**
         * Delete a session from the application and the user's session list
         *
         * @param {string} sessionid id of the session to delete
         * @param {APISuccessCallback=} onSuccess callback for when deleting object was successful
         * @param {APIErrorCallback=} onFail callback for when deleting object failed
         * @memberOf MM.activeUser.sessions
         * @instance
         *
         * @example
         *
         function deleteSession () {
            MM.activeUser.sessions.delete('72798', onSessionDeleted);
         }
         function onSessionDeleted (response) {
            // session deleted
         }
         */
        delete: function (sessionid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', 'session/' + sessionid, null, onSuccess, onFail);
        },
        channelType: 'user',
        updateEventName: 'sessionsUpdate'
    });

    MM.models.TextEntryList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.textentries represents the TextEntries collection in the MindMeld API. The history
         * of TextEntry objects posted to the Session objects that can be accessed by the User.
         *
         * @namespace MM.activeSession.textentries
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.TextEntryList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.textentries';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/textentries');
        },
        /**
         * Helper function returns the JSON data for the textentries collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.textentries
         * @instance
         *
         * @example
         *
         function getTextEntries () {
            MM.activeSession.textentries.get(null, onGetTextEntries);
         }
         function onGetTextEntries (response) {
            var textentries = MM.activeSession.textentries.json();
            // MM.activeSession.textentries.json() returns a JSON object
            // containing data received from MM.activeSession.textentries.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession.textentries' onUpdate handler. If no handler is passed in,
         * onUpdate unsubscribes from push events
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's text entry list updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @memberOf MM.activeSession.textentries
         * @instance
         *
         * @example <caption> Setting the onUpdate handler, creating a new text entry, and
         * obtaining the latest text entry list </caption>
         *
         function textEntriesOnUpdateExample () {
            // set the onUpdate handler for the text entries list
            MM.activeSession.textentries.onUpdate(
                onTextEntriesUpdate,
                onSubscribedToTextEntriesUpdates,
                onSubscribeToTextEntryUpdatesError,
                getTextEntryListParams
            );
         }
         function onSubscribedToTextEntriesUpdates () {
            // successfully subscribed to updates to the session's textentries list
            // now, create a new text entry
            createNewTextEntry();
         }
         function onSubscribeToTextEntryUpdatesError () {
            console.log('error subscribing to textentries list updates');
         }
         function getTextEntryListParams () {
            // When the textentries list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onTextEntriesUpdate () {
            // there was an update to the textentries list
            var textentries = MM.activeSession.textentries.json();
            // textentries contains the latest list of textentries
         }
         function createNewTextEntry () {
            var textEntryData = {
                text: 'my new text segment',
                type: 'voice-spoken',
                weight: 1.0,
                language: 'eng'
            };
            MM.activeSession.textentries.post(textEntryData);
         }
         *
         * @example <caption> Deregistering the onUpdate handler </caption>
         *
         function deregisterTextEntriesOnUpdate () {
            MM.activeSession.textentries.onUpdate(null);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler,  onSuccess, onError, getQueryParams);
        },
        /**
         * Get the history of text entries that are associated with the specified session.
         * Each text entry is a segment of human-language text that is analyzed to infer
         * the context associated with this session. This endpoint can be used to retrieve
         * and search across the full history of text entries that have been posted to this
         * session. A request with a user token can access this collection only if the
         * associated user is permitted to access the session object itself. A request
         * with an admin token can access this collection for any session associated
         * with your application.
         *
         * @param {QueryParameters=} params A {@link QueryParameters} object allowing you to filter the text entries returned.
         * See documentation [here](https://developer.expectlabs.com/docs/endpointSession#getSessionSessionidTextentries) for more details
         * @param {APISuccessCallback=} onSuccess callback for when getting the text entry list was successful
         * @param {APIErrorCallback=} onFail callback for when getting the text entry list failed
         * @memberOf MM.activeSession.textentries
         * @instance
         *
         * @example
         *
         function getTextEntries () {
            MM.activeSession.textentries.get(null, onGetTextEntries);
         }
         function onGetTextEntries (response) {
            var textentries = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Create a new text entry for the specified session. A text entry is a segment of human-language
         * text that will be analyzed to model the context of the current session. A text segment
         * typically represents information that a user has written, read, spoken or heard. A text
         * entry exists at a specific point in time, and it can be assigned a numerical weight indicating
         * its relative importance in the overall contextual stream. Typical text entries are one or two
         * sentences in length; the maximum size for a single text entry is 5000 characters. Once created,
         * textentry objects can be deleted but not modified.
         *
         * @param {Object} textEntryData            Object containing new text entry data.
         * @param {string} textEntryData.text       A segment of human-language text containing contextual information
         *                                          about the session. This string is typically one or two sentences but
         *                                          can be as long as 5000 characters. This text will be analyzed to
         *                                          understand the semantic concepts pertinent to the session over time.
         * @param {string} textEntryData.type       A short string that can be used to categorize text entries into
         *                                          different buckets. You may choose to categorize text entries based on
         *                                          the content the user has written, read, spoken or heard. For example,
         *                                          possible 'type' values could be 'email-written', 'email-read',
         *                                          'sms-written', 'sms-read', 'post-written', 'post-read', 'tweet-written',
         *                                          'tweet-read', 'voice-spoken', 'voice-heard', etc. Subsequent searches
         *                                          on the textentries collection can use this 'type' field to filter
         *                                          textentries by type.
         * @param {number} textEntryData.weight     A decimal number between 0 and 1 indicating the relative importance
         *                                          of this text entry in the overall history of text entries for the
         *                                          session. A value of 0 indicates that this text entry will be ignored
         *                                          in modeling the context of the session. A value of 1 indicates that
         *                                          any contextual information  contained in the text entry will have the
         *                                          maximum amount of influence over document ranking and recommendations.
         * @param {String} [textEntryData.language] An [ISO 629-2 language code](http://en.wikipedia.org/wiki/List_of_ISO_639-2_codes)
         *                                          for the language of the text. If this parameter is omitted, the API will
         *                                          attempt to determine the language.
         * @param {APISuccessCallback=} onSuccess   callback for when creating new session was successful
         * @param {APIErrorCallback=} onFail        callback for when creating new session failed
         * @memberOf MM.activeSession.textentries
         * @instance
         *
         * @example
         *
         function createNewTextEntry () {
            var textEntryData = {
                text: 'my new text segment',
                type: 'voice-spoken',
                weight: 1.0,
                language: 'eng'
            };
            MM.activeSession.textentries.post(textEntryData, onCreateNewTextEntry);
         }
         function onCreateNewTextEntry (response) {
            // new text entry posted
         }
         */
        post: function (textEntryData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), textEntryData, onSuccess, onFail);
        },
        /**
         * Delete a text entry from the active session
         *
         * @param {string} textentryid id of the text entry to delete
         * @param {APISuccessCallback=} onSuccess callback for when deleting the text entry was successful
         * @param {APIErrorCallback=} onFail callback for when deleting the text entry failed
         * @memberOf MM.activeSession.textentries
         * @instance
         *
         * @example
         *
         function deleteTextEntry () {
            MM.activeSession.textentries.delete('76643', onTextEntryDeleted);
         }
         function onTextEntryDeleted (response) {
            // text entry deleted
         }
         */
        delete: function (textentryid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', 'textentry/' + textentryid, null, onSuccess, onFail);
        },
        channelType: 'session',
        updateEventName: 'textentriesUpdate'
    });

    MM.models.EntityList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.entities represents the Entities collection in the MindMeld API. The history of
         * Entity objects, which are derived from TextEntries or directly posted to the Session
         * objects that can be accessed by the User
         *
         * @namespace MM.activeSession.entities
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.EntityList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.entities';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/entities');
        },
        /**
         * Helper function returns the JSON data for the entities collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.entities
         * @instance
         *
         * @example
         *
         function getEntities () {
            MM.activeSession.entities.get(null, onGetEntities);
         }
         function onGetEntities () {
            var entities =  MM.activeSession.entities.json();
            // MM.activeSession.entities.json() returns a JSON object
            // containing data received from MM.activeSession.entities.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession.entities' onUpdate handler. If no handler is passed in,
         * onUpdate unsubscribes from push events
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's entity list updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @memberOf MM.activeSession.entities
         * @instance
         *
         * @example <caption> Setting the onUpdate handler, creating a new entity, and
         * obtaining the latest entity list </caption>
         *
         function entitiesOnUpdateExample () {
            // set the onUpdate handler for the entities list
            MM.activeSession.entities.onUpdate(
                onEntitiesUpdate,
                onSubscribedToEntitiesUpdates,
                onSubscribeToEntitiesUpdatesError,
                getEntityListParams
            );
         }
         function onSubscribedToEntitiesUpdates () {
            // successfully subscribed to updates to the session's entities list
            // now, create a new entity
            createEntity();
         }
         function onSubscribeToEntitiesUpdatesError () {
            console.log('error subscribing to entity list updates');
         }
         function getEntityListParams () {
            // When the entity list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onEntitiesUpdate () {
            // there was an update to the entities list
            var entities = MM.activeSession.entities.json();
            // entities contains the latest list of entities
         }
         function createEntity () {
            var newEntityData = {
                text: 'Diplo',
                entitytype: 'person',
                score: 0.9
            };
            MM.activeSession.entities.post(newEntityData, onCreateNewEntity);
         }
         *
         * @example <caption> Deregistering the onUpdate handler </caption>
         *
         function deregisterEntitiesOnUpdate () {
            MM.activeSession.entities.onUpdate(null);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler,  onSuccess, onError, getQueryParams);
        },
        /**
         * Get the history of entities that are associated with the specified session. Each
         * entity represents an individual logical concept that occurs at a point in time
         * during a session. For example, an entity could be a proper noun, such as the
         * name of a person or company, or it could also be any noun phrase representing
         * a distinct concept. Entities can be posted directly to a session or be
         * automatically derived from posted text entries. This endpoint can be used to
         * retrieve and search across the full history of entities associated with this
         * session. A request with a user token can access this collection only if the associated
         * user is permitted to access the session object itself. A request with an admin
         * token can access this collection for any session associated with your application.
         *
         * @param {QueryParameters=} params A {@link QueryParameters} object allowing you to filter the entities returned.
         * See documentation [here](https://developer.expectlabs.com/docs/endpointSession#getSessionSessionidEntities) for more details
         * @param {APISuccessCallback=} onSuccess callback for when getting the entity list was successful
         * @param {APIErrorCallback=} onFail callback for when getting the entity list failed
         * @memberOf MM.activeSession.entities
         * @instance
         *
         * @example
         *
         function getEntities () {
            MM.activeSession.entities.get(null, onGetEntities);
         }
         function onGetEntities (response) {
            var entities =  response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Adds a new entity to the active session. Each entity represents an individual
         * logical concept that occurs at a point in time during the session. For example,
         * an entity can be a proper noun, such as the name of a person or place
         * (e.g. 'Barack Obama', 'Paris'), or it could be a noun phrase representing a distinct
         * concept (e.g. 'minestrone soup'). Entities are automatically derived from submitted
         * text entries, however this endpoint can be used to explicitly post entities to a session.
         * Refer to documentation [here](https://developer.expectlabs.com/docs/endpointSession#postSessionSessionidEntities)
         * for more information
         *
         *
         * @param {Object} entityData Object containing new entity data
         * @param {string} entityData.text The text of the entity. This is typically a proper
         * noun or a noun phrase representing a distinct logical concept. For example,
         * "Winston Churchill", "great wall of china", "Citizen Kane", "baseball playoffs", etc.
         * @param {string} entityData.entitytype A short string that can be used to categorize entities
         * by type. This can be an arbitrary string that can be used in subsequent searches on
         * the entities collection to filter entities by type. There are several entitytype
         * values, however, that the MindMeld platform uses. They are listed
         * [here](https://developer.expectlabs.com/docs/reservedEntityTypes)
         * @param {number} entityData.score A decimal number between 0 and 1 indicating the relative importance of
         * this entity in the overall context of the session. A value of 0 indicates that this entity has no
         * impact on the session context. A value of 1 indicates that this entity is very important
         * in interpreting the overall context of the session and therefore also important in
         * determining search ranking and recommendations.
         * @param {APISuccessCallback=} onSuccess callback for when creating new entity was successful
         * @param {APIErrorCallback=} onFail callback for when creating new entity failed
         * @memberOf MM.activeSession.entities
         * @instance
         *
         * @example
         *
         function createEntity () {
            var newEntityData = {
                text: 'Diplo',
                entitytype: 'person',
                score: 0.9
            };
            MM.activeSession.entities.post(newEntityData, onCreateNewEntity);
         }
         function onCreateNewEntity () {
            // New entity created
         }
         */
        post: function (entityData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), entityData, onSuccess, onFail);
        },
        /**
         * Delete an entity from the active session
         *
         * @param {string} entityid id of the entity to delete
         * @param {APISuccessCallback=} onSuccess callback for when deleting the entity was successful
         * @param {APIErrorCallback=} onFail callback for when deleting the entity failed
         * @memberOf MM.activeSession.entities
         * @instance
         *
         * @example
         *
         function deleteEntity () {
            MM.activeSession.entities.delete('<entity id>', onEntityDeleted);
         }
         function onEntityDeleted () {
            // entity deleted
         }
         */
        delete: function (entityid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', 'entity/' + entityid, null, onSuccess, onFail);
        },
        channelType: 'session',
        updateEventName: 'entitiesUpdate'
    });

    MM.models.ArticleList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.articles represents the Articles collection in the MindMeld API. This searchable collection
         * contains Article objects that are relevant to the contextual history of the active session
         * (Available for Enterprise developer accounts only).
         *
         * @namespace MM.activeSession.articles
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.ArticleList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.articles';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/articles');
        },
        /**
         * Helper function returns the JSON data for the articles collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.articles
         * @instance
         *
         * @example
         *
         function getArticles () {
            MM.activeSession.articles.get(null, onGetArticles);
         }
         function onGetArticles () {
            var articles =  MM.activeSession.articles.json();
            // MM.activeSession.articles.json() returns a JSON object
            // containing data received from MM.activeSession.articles.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession's articles' onUpdate handler. Pass null as the updateHandler parameter to
         * deregister a previously set updateHandler. Note that there are no push events for the articles
         * collection so it must be polled instead. The update handler will be called automatically when
         * calling {@link MM.activeSession.articles#get}
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's article list updates.
         *
         * @memberOf MM.activeSession.articles
         * @instance
         *
         * @example
         *
         function getArticles () {
            MM.activeSession.articles.onUpdate(onGetArticles); // Set the updateHandler
            MM.activeSession.articles.get(); // Fetch articles
         }
         function onGetArticles (response) {
            var articles = response.data;
            console.log(articles);
         }
         */
        onUpdate: function (updateHandler) {
            this._onUpdate(updateHandler, null, null);
        },
        /**
         * Get a list of articles from third-party data sources that are relevant to the context
         * of the session. Articles typically include web pages, images, videos, and documents
         * from data sources on the Internet. For example, articles might include pages from
         * Wikipedia, videos from YouTube, or local business listings from Yelp. When enabled,
         * relevant articles are automatically identified based on the contextual history of
         * the session. Article sources can be configured for each application. A request with
         * a user token can retrieve articles only if the associated user is permitted to access
         * the session object itself. A request with an admin token can retrieve articles for
         * any session associated with your application. Custom configuration of article
         * sources is available for Enterprise developer accounts only.
         *
         *
         * @param {QueryParameters=} params A {@link QueryParameters} object allowing you to filter the articles returned.
         * See documentation [here](https://developer.expectlabs.com/docs/endpointSession#getSessionSessionidArticles) for more details
         * For this function, the following additional parameters are also available:
         * @param {(string[]|string)=} params.entityids An array of entityid values or a single entityid value
         * If specified, only articles related to the specified entities will be returned in the response.
         * @param {number=} params.numentities The number of most recent entities to include in the request. If specified,
         * only articles related to the specified number of most recent entities will be returned in the response.
         * @param {(string[]|string)=} params.textentryids An array of textentryid values or a single textentryid
         * value. If specified, only articles related to the specified text entries will be returned in the response
         * @param {APISuccessCallback=} onSuccess callback for when getting the article list was successful
         * @param {APIErrorCallback=} onFail callback for when getting the article list failed
         * @memberOf MM.activeSession.articles
         * @instance
         *
         * @example
         *
         function getArticles () {
            var queryParams = {
                limit: 5, // only return 5 articles
                entityids: "[54321, 432432]" // only return articles related to these 2 entities
                                             // note that the entityids array is a JSON string
            };
            MM.activeSession.articles.get(queryParams, onGetArticles);
         }
         function onGetArticles (response) {
            var articles = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        }
    });

    MM.models.SessionDocumentList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.documents represents the Documents collection related to a session in the MindMeld API.
         * The searchable corpus of Document objects that are contextually related to the Session.
         *
         * @namespace MM.activeSession.documents
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.SessionDocumentList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.documents';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/documents');
        },
        /**
         * Helper function returns the JSON data for the session documents collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.documents
         * @instance
         *
         * @example
         *
         function getDocuments () {
            MM.activeSession.documents.get(null, onGetDocuments);
         }
         function onGetDocuments () {
            var documents = MM.activeSession.documents.json();
            // MM.activeSession.documents.json() returns a JSON object
            // containing data received from MM.activeSession.documents.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession's documents' onUpdate handler. Pass null as the updateHandler parameter to
         * deregister a previously set updateHandler.
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's document list updates.
         * @memberOf MM.activeSession.documents
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @instance
         *
         * @example
         *
         function documentsOnUpdateExample () {
            // set the onUpdate handler for the documents list
            MM.activeSession.documents.onUpdate(
                onDocumentsUpdate,
                onSubscribedToDocumentsUpdates,
                onSubscribeToDocumentsUpdatesError,
                getDocumentsListParams
            );
         }
         function onSubscribedToDocumentsUpdates () {
            // successfully subscribed to updates to the session's document list
            // now, post a text entry
            createTextEntry();
         }
         function onSubscribeToDocumentsUpdatesError () {
            console.log('error subscribing to document list updates');
         }
         function getDocumentsListParams () {
            // When the document list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onDocumentsUpdate () {
            // there was an update to the documents list
            var documents = MM.activeSession.documents.json();
            // documents contains the latest list of documents
         }

         function createTextEntry () {
            var textEntryData = {
                text: 'What was the episode where Elaine is banned from the soup shop?',
                type: 'text',
                weight: 1.0
            };
            MM.activeSession.textentries.post(textEntryData);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler,  onSuccess, onError, getQueryParams);
        },
        /**
         * Get and search across all documents indexed for your application. In addition to providing
         * faceted search and filtering across your collection of documents, this endpoint also provides
         * the capability to deliver relevant document results based on the contextual history of your
         * session. A request with a user token can retrieve documents only if the associated user is
         * permitted to access the session object itself. A request with an admin token can retrieve
         * documents for any session associated with your application.
         *
         *
         * @param {QueryParameters=} params A {@link QueryParameters} object allowing you to filter the documents returned.
         * See documentation [here](https://developer.expectlabs.com/docs/endpointSession#getSessionSessionidDocuments)
         * for more details
         * For this function, the following additional parameters are also available:
         * @param {(string[]|string)=} params.entityids An array of entityid values or a single entityid value.
         * If specified, only documents related to the specified entities will be returned in the response.
         * @param {number=} params.numentities The number of most recent entities to include in the request. If
         * specified, only documents related to the specified number of most recent entities will be returned
         * in the response.
         * @param {(string[]|string)=} params.textentryids An array of textentryid values or a single textentryid
         * value. If specified, only documents related to the specified text entries will be returned in the response
         * @param {string=} params.query A search query string to retrieve specific
         * objects that match the query. See the documentation on [search query
         * syntax](https://developer.expectlabs.com/docs/customRankingFactors)
         * for more information.
         * @param {string=} params.document-ranking-factors A JSON string containing custom factors that will be
         * used to rank the documents returned by this request. Read the section on
         * [custom ranking factors](https://developer.expectlabs.com/docs/customRankingFactors) to learn more about how you can adjust the search ranking factors to customize the document results for your application.
         * @param {(number|string)=} params.history-since A Unix timestamp or
         * [strtotime](http://php.net/manual/en/function.strtotime.php) date value that specifies the beginning of
         * the contextual history time window that will be used to influence the document results. Any contextual
         * data uploaded prior to the start of this window will be ignored in the calculation to determine
         * contextually relevant document results. If not specified, the value defaults to the latest contextual
         * history of the session.
         * @param {(number|string)=} params.history-until A Unix timestamp or
         * [strtotime](http://php.net/manual/en/function.strtotime.php) date value that specifies the end of the
         * contextual history time window that will be used to influence the document results. Any contextual
         * data uploaded after the end of this window will be ignored in the calculation to determine contextually
         * relevant document results. If not specified, the value defaults to the latest contextual history of the session
         * @param {number=} params.start The index of the first object in the
         * returned list of objects. This can be used for paging through large
         * collections of objects.
         * @param {number=} params.limit The maximum number of individual objects
         * to be returned in the response. If not specified, the default is 10. The
         * maximum allowed value is 50.
         * @param {(number|string)=} params.since A Unix timestamp or
         * [strtotime](http://php.net/manual/en/function.strtotime.php) date value
         * that specifies the start of a range of time-based data. Only documents
         * with publication date after this timestamp will be returned in the
         * response.
         * @param {(number|string)=} params.until A Unix timestamp or
         * [strtotime](http://php.net/manual/en/function.strtotime.php) date value
         * that specifies the end of a range of time-based data. Only documents
         * with publication date before this timestamp will be returned in the
         * response.
         * @param {APISuccessCallback=} onSuccess callback for when getting the session document list was successful
         * @param {APIErrorCallback=} onFail callback for when getting the session document list failed
         * @memberOf MM.activeSession.documents
         * @instance
         *
         * @example
         *
         function getDocuments () {
            var queryParams = {
                numentities: 4
            };
            // add custom ranking factors to this query
            queryParams['document-ranking-factors'] = {
                recency: 0.5,
                popularity: 0.7,
                relevance: 0,
                proximity: 0.2,
                customrank1: 0.3
            };
            queryParams['history-since'] = 'yesterday';
            MM.activeSession.documents.get(queryParams, onGetDocuments);
         }
         function onGetDocuments (response) {
            var documents = response.data;
            console.log(documents);
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        channelType: 'session',
        updateEventName: 'documentsUpdate'
    });


    MM.models.AppDocumentList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.documents represents the whole Documents collection that are part of a
         * particular application. These Documents are not related to a particular Session.
         *
         * @namespace MM.documents
         * @memberOf MM
         */
        constructor: function () {
            MM.models.AppDocumentList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.documents';
        },
        path: function () {
            return('documents');
        },
        /**
         * Helper function returns the JSON data from the application's document collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.documents
         * @instance
         *
         * @example
         *
         function getDocuments () {
            MM.documents.onUpdate(onGetDocuments);
            MM.documents.get();
         }
         function onGetDocuments () {
            var documents = MM.documents.json();
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the MM documents' onUpdate handler. Pass null as the updateHandler parameter to
         * deregister a previously set updateHandler. Note that there are no push events for the documents
         * collection so it must be polled instead. The update handler will be called automatically when
         * calling {@link MM.documents#get}
         *
         * @param {APISuccessCallback=} updateHandler callback for when the app's document list updates.
         * @memberOf MM.documents
         * @instance
         *
         * @example
         *
         function getDocuments () {
            MM.documents.onUpdate(onGetDocuments);
            MM.documents.get();
         }
         function onGetDocuments () {
            var documents = MM.documents.json();
            console.log(documents);
         }
         */
        onUpdate: function (updateHandler) {
            this._onUpdate(updateHandler, null, null);
        },
        /**
         * Get and search across all documents indexed for your application. This endpoint will let you access
         * all documents that have been crawled from your website as well as all documents that you have posted
         * to the documents collection for this application. User privileges do not permit access to this
         * object; admin privileges are required
         *
         *
         * @param {QueryParameters=} params A {@link QueryParameters} object allowing you to filter the documents returned.
         * See documentation [here](https://developer.expectlabs.com/docs/endpointApp#getDocuments) for more details. For
         * this function, the following additional parameters are also available:
         * @param {string=} params.document-ranking-factors A JSON string containing custom factors that will be
         * used to rank the documents returned by this request. Read the section on
         * [custom ranking factors](https://developer.expectlabs.com/docs/customRankingFactors) to learn more about
         * how you can adjust the search ranking factors to customize the document results for your application
         * @param {APISuccessCallback=} onSuccess callback for when getting the application document list was successful
         * @param {APIErrorCallback=} onFail callback for when getting the application document list failed
         * @memberOf MM.documents
         * @instance
         *
         * @example
         *
         function getDocuments () {
            var queryParams = {
                query: 'san francisco' // get documents matching the string 'san francisco'
            };
            // add custom ranking factors to this query
            queryParams['document-ranking-factors'] = {
                recency: 0.5,
                popularity: 0.7,
                relevance: 0,
                proximity: 0.2,
                customrank1: 0.3
            };
            MM.documents.get(queryParams, onGetDocuments);
         }
         function onGetDocuments (response) {
            var documents = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Upload a document to the application. This requires an admin token
         *
         * @param {Object} document object containing document data. The only required parameters are 'title'
         * and 'originurl'. Please see Document documentation
         * [here](https://developer.expectlabs.com/docs/endpointApp#postDocuments) for more info
         * @param {string} document.title The title of the document
         * @param {string} document.originurl The fully qualified link to the webpage containing the
         * original document. Note that this url will be stored, but not returned in subsequent GET
         * requests to this document object. Instead, the 'originurl' field value will contain a
         * wrapper url which, when loaded in a browser, will record a page view for this document
         * and then redirect to the originurl value provided here. This mechanism enables the view
         * count to be tracked and used to influence the document ranking calculation
         *
         * @param {string=} document.description A short text description of the contents of the document
         * @param {string=} document.text The full text contents of the document
         * @param {string=} document.sections The text from the header sections of the document. This
         * includes any text contained in the h1, h2, h3, h4 and h5 tags, if your document is a webpage
         * @param {number=} document.pubdate The Unix timestamp reflecting the date when this document
         * was originally published
         * @param {string=} document.language The 3-letter [ISO-639-2](http://en.wikipedia.org/wiki/List_of_ISO_639-2_codes)
         * language code indicating the language of this document (e.g. 'eng', 'spa', 'ger', etc.)
         * @param {Object=} document.image An object specifying information about an image related to the document
         * @param {string=} document.image.url The URL for the image associated with this document
         * @param {string=} document.image.thumburl The URL for a small-format image, if available. This is typically
         * a thumbnail of a larger image and it should have a maximum dimension of around 500 pixels or less
         * @param {number=} document.image.width The width of the full image in pixels
         * @param {number=} document.image.height The height of the full image in pixels
         * @param {Object=} document.source An object specifying information about the source of this document
         * @param {string=} document.source.name A text string suitable for display containing the name of the source
         * of the document (e.g. 'The New York Times')
         * @param {string=} document.source.url The website for the document source homepage (e.g. 'www.nyt.com')
         * @param {string=} document.source.icon The url for an icon, typically a favicon, representing the source
         * @param {Location=} document.location The location associated with this document
         * @param {number=} document.customrank1 A custom numerical rank value that can be used in the document ranking
         * calculation. See the documentation on
         * [custom ranking factors](https://developer.expectlabs.com/docs/customRankingFactors) for more information
         * @param {number=} document.customrank2 A custom numerical rank value that can be used in the document ranking
         * calculation. See the documentation on
         * [custom ranking factors](https://developer.expectlabs.com/docs/customRankingFactors) for more information
         * @param {number=} document.customrank3 A custom numerical rank value that can be used in the document ranking
         * calculation. See the documentation on
         * [custom ranking factors](https://developer.expectlabs.com/docs/customRankingFactors) for more information
         *
         * @param {APISuccessCallback=} onSuccess callback for when posting data to collection was successful
         * @param {APIErrorCallback=} onFail callback for when posting data to collection failed
         * @memberOf MM.documents
         * @instance
         *
         * @example
         *
         function addDocument () {
            var newDocumentData = {
                title: 'new document title',
                originurl: 'www.expectlabs.com'
            };
            MM.documents.post(newDocumentData, onDocumentAdded);
         }
         function onDocumentAdded () {
            // new document added
         }
         */
        post: function (documentData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), documentData, onSuccess, onFail);
        },
        /**
         * Delete a document from the application. This requires an admin token
         *
         * @param {string} documentid id of the document to delete
         * @param {APISuccessCallback=} onSuccess callback for when deleting object was successful
         * @param {APIErrorCallback=} onFail callback for when deleting object failed
         * @memberOf MM.documents
         * @instance
         *
         * @example
         *
         function deleteDocument () {
            MM.documents.delete('381c21d853faf6db58a0ab7d7d12e604', onDocumentDeleted);
         }
         function onDocumentDeleted (response) {
            // document with documentid response.data.documentid deleted
         }
         */
        delete: function (documentid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', 'document/' + documentid, null, onSuccess, onFail);
        }
    });

    MM.models.LiveUserList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.liveusers represents the LiveUsers collection in the MindMeld API. The list
         * of User objects who are currently using the Session
         *
         * @namespace MM.activeSession.liveusers
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.LiveUserList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.liveusers';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/liveusers');
        },
        /**
         * Helper function returns the JSON data for the live users list
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.liveusers
         * @instance
         *
         * @example
         *
         function getLiveUsers () {
            MM.activeSession.liveusers.get(null, onGetLiveUsers);
         }
         function onGetLiveUsers () {
            var liveUsers = MM.activeSession.liveusers.json();
            // MM.activeSession.liveusers.json() returns a JSON object
            // containing data received from MM.activeSession.liveusers.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession.liveusers' onUpdate handler. If no handler is passed in,
         * onUpdate unsubscribes from push events
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's live users list updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @memberOf MM.activeSession.liveusers
         * @instance
         *
         * @example <caption> Setting the onUpdate handler, creating a new activity, and
         * obtaining the latest activities list </caption>
         *
         function liveUsersOnUpdateExample () {
            // set the onUpdate handler for the liveusers list
            MM.activeSession.liveusers.onUpdate(
                onLiveUsersUpdate,
                onSubscribedToLiveUsersUpdates,
                onSubscribeToLiveUserUpdatesError,
                getLiveUserListParams
            );
         }
         function onSubscribedToLiveUsersUpdates () {
            // successfully subscribed to updates to the session's liveusers list
            console.log('subscribed');
            // now, add a live user
            addLiveUser();
         }
         function onSubscribeToLiveUserUpdatesError () {
            console.log('error subscribing to live user list updates');
         }
         function getLiveUserListParams () {
            // When the live user list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onLiveUsersUpdate () {
            // there was an update to the liveusers list
            var liveusers = MM.activeSession.liveusers.json();
            console.log(liveusers);
            // liveusers contains the latest list of liveusers
         }
         function addLiveUser () {
            var liveUserData = {
                userid: '365'
            };
            MM.activeSession.liveusers.post(liveUserData);
         }
         *
         * @example <caption> Deregistering the onUpdate handler </caption>
         *
         function deregisterLiveUsersOnUpdate () {
            MM.activeSession.liveusers.onUpdate(null);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler,  onSuccess, onError, getQueryParams);
        },
        /**
         * Get the list of users that are currently active users of the specified session. A request with a
         * user token can get the liveusers list only if the associated user is permitted to access the session
         * object itself. A request with an admin token can get the liveusers list for any session associated
         * with your application.
         *
         * @param {QueryParameters=} params query parameters when fetching the live user list
         * @param {APISuccessCallback=} onSuccess callback for when getting live user list was successful
         * @param {APIErrorCallback=} onFail callback for when getting live user list failed
         * @memberOf MM.activeSession.liveusers
         * @instance
         *
         * @example
         *
         function getLiveUsers () {
            MM.activeSession.liveusers.get(null, onGetLiveUsers);
         }
         function onGetLiveUsers (response) {
            var liveUsers = response.data;
            console.log(liveUsers);
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Adds a new user to the list of active users for the active session
         *
         * @param {Object} newLiveUserData object specifying userid of user to be added to live user list
         * @param {string} newLiveUserData.userid The MindMeld userid for the user to add to the liveusers list for the session
         * @param {APISuccessCallback=} onSuccess callback for when adding live user was successful
         * @param {APIErrorCallback=} onFail callback for when adding live user failed
         * @memberOf MM.activeSession.liveusers
         * @instance
         *
         * @example
         *
         function addLiveUser () {
            var liveUserData = {
                userid: '365'
            };
            MM.activeSession.liveusers.post(liveUserData, onLiveUserAdded);
         }
         function onLiveUserAdded (response) {
            // New live user added
         }
         */
        post: function (newLiveUserData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), newLiveUserData, onSuccess, onFail);
        },
        /**
         * Deletes a user from the list of active users for the active session
         *
         * @param {string} liveuserid id of the user to remove from active user list
         * @param {APISuccessCallback=} onSuccess callback for when removing user from active users list was successful
         * @param {APIErrorCallback=} onFail callback for when removing user from active users list failed
         * @memberOf MM.activeSession.liveusers
         * @instance
         *
         * @example
         *
         function removeLiveUser () {
            MM.activeSession.liveusers.delete('365', onLiveUserRemoved);
         }
         function onLiveUserRemoved () {
            // live user removed
         }
         */
        delete: function (liveuserid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', this.path() + '/' + liveuserid, null, onSuccess, onFail);
        },
        channelType: 'session',
        updateEventName: 'liveusersUpdate'
    });

    MM.models.InvitedUserList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.invitedusers represents the InvitedUsers collection in the MindMeld API.
         * The list of User objects who have been invited to join the Session.
         *
         * @namespace MM.activeSession.invitedusers
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.InvitedUserList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.invitedusers';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/invitedusers');
        },
        /**
         * Helper function returns the JSON data for the invited users list
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.invitedusers
         * @instance
         *
         * @example
         *
         function getInvitedUsers () {
            MM.activeSession.invitedusers.get(null, onGetInvitedUsers);
         }
         function onGetInvitedUsers (response) {
            var invitedUsers = MM.activeSession.invitedusers.json();
            // MM.activeSession.invitedusers.json() returns a JSON object
            // containing data received from MM.activeSession.invitedusers.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession.invitedusers' onUpdate handler. If no handler is passed in,
         * onUpdate unsubscribes from push events
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's invited users list updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @memberOf MM.activeSession.invitedusers
         * @instance
         *
         * @example <caption> Setting the onUpdate handler, adding a new invited user, and
         * obtaining the latest invited users list </caption>
         *
         function invitedUsersOnUpdateExample () {
            // set the onUpdate handler for the invitedusers list
            MM.activeSession.invitedusers.onUpdate(
                onInvitedUsersUpdate,
                onSubscribedToInvitedUsersUpdates,
                onSubscribeToInvitedUserUpdatesError,
                getInvitedUserListParams
            );
         }
         function onSubscribedToInvitedUsersUpdates () {
            // successfully subscribed to updates to the session's invitedusers list
            // now, invite a new user
            inviteNewUser();
         }
         function onSubscribeToInvitedUserUpdatesError () {
            console.log('error subscribing to invited user list updates');
         }
         function getInvitedUserListParams () {
            // When the invited user list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onInvitedUsersUpdate () {
            // there was an update to the invitedusers list
            var invitedusers = MM.activeSession.invitedusers.json();
            // invitedusers contains the latest list of invitedusers
         }
         function inviteNewUser () {
            var newInvitedUserData = {
                provider: 'simple',
                userid: 'einstein79',
                name: 'Albert Einstein'
            };
            MM.activeSession.invitedusers.post(newInvitedUserData);
         }
         *
         * @example <caption> Deregistering the onUpdate handler </caption>
         *
         function deregisterInvitedUsersOnUpdate () {
            MM.activeSession.invitedusers.onUpdate(null);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler,  onSuccess, onError, getQueryParams);
        },
        /**
         * Get the list of users that have been added to the invitedusers collection for this session. A request
         * with a user token can get the invitedusers list only if the associated user is permitted to access the
         * session object itself. A request with an admin token can get the invitedusers list for any session
         * associated with your application.
         *
         * @param {QueryParameters=} params query parameters when fetching the invited user list
         * @param {APISuccessCallback=} onSuccess callback for when getting invited user list was successful
         * @param {APIErrorCallback=} onFail callback for when getting invited user list failed
         * @memberOf MM.activeSession.invitedusers
         * @instance
         *
         * @example
         *
         function getInvitedUsers () {
            MM.activeSession.invitedusers.get(null, onGetInvitedUsers);
         }
         function onGetInvitedUsers (response) {
            var invitedUsers = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Invite a new user to the active session
         *
         * @param {Object} newInvitedUserData object specifying userid of user to be added to active session
         * @param {string} newInvitedUserData.provider The name of the authentication provider that you are using in your
         * application. This should be 'simple' for Simple User Authentication. For third-party authentication,
         * this should be the name of the third-party provider, such as 'facebook'
         * @param {string} newInvitedUserData.userid The userid for the user to invite. This should be the user
         * id value provided by your authentication service. This should not be the MindMeld userid
         * @param {string} newInvitedUserData.name The name of the user to invite
         * @param {APISuccessCallback=} onSuccess callback for when adding user to session was successful
         * @param {APIErrorCallback=} onFail callback for when adding live user to session failed
         * @memberOf MM.activeSession.invitedusers
         * @instance
         *
         * @example
         *
         function inviteUser () {
            var newInvitedUserData = {
                provider: 'simple',
                userid: 'einstein79',
                name: 'Albert Einstein'
            };
            MM.activeSession.invitedusers.post(newInvitedUserData, onInviteNewUser);
         }
         function onInviteNewUser (response) {
            // New user invited to session
         }
         */
        post: function (newInvitedUserData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), newInvitedUserData, onSuccess, onFail);
        },
        /**
         * Uninvite the specified user from the specified session
         *
         * @param {string} inviteduserid The MindMeld userid of the user to remove from invited user list
         * @param {APISuccessCallback=} onSuccess callback for when removing a user from the session was successful
         * @param {APIErrorCallback=} onFail callback for when removing a user from the session failed
         * @memberOf MM.activeSession.invitedusers
         * @instance
         *
         * @example
         *
         function removeUserFromSession () {
            MM.activeSession.invitedusers.delete('<mindmeld user id>', onRemoveUserFromSession);
         }
         function onRemoveUserFromSession (response) {
            // invited user removed from session
         }
         */
        delete: function (inviteduserid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', this.path() + '/' + inviteduserid, null, onSuccess, onFail);
        },
        channelType: 'session',
        updateEventName: 'invitedusersUpdate'
    });

    MM.models.ActivityList = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * MM.activeSession.activities represents the Activities collection in the MindMeld API. This collection captures
         * the history of user actions and other non-text contextual signals associated with the active session
         *
         * @namespace MM.activeSession.activities
         * @memberOf MM.activeSession
         */
        constructor: function () {
            MM.models.ActivityList.superclass.constructor.apply(this, arguments);
        },
        localStoragePath: function () {
            return 'MM.activeSession.activities';
        },
        path: function () {
            return('session/' + MM.activeSessionId + '/activities');
        },
        /**
         * Helper function returns the JSON data for the activities collection
         *
         * @returns {Array.<Object>}
         * @memberOf MM.activeSession.activities
         * @instance
         *
         * @example
         *
         function getActivities () {
            MM.activeSession.activities.get(null, onGetActivities);
         }
         function onGetActivities () {
            var activities =  MM.activeSession.activities.json();
            // MM.activeSession.activities.json() returns a JSON object
            // containing data received from MM.activeSession.activities.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession's activities' onUpdate handler. The onUpdate handler is called once
         * there is an update to the active session's activities list AND the latest
         * activities list is fetched successfully. If no updateHandler is passed in,
         * {@link MM.activeSession.activities#onUpdate} unsubscribes from push events.
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession's activity list updates
         * @param {function=} onSuccess callback for when subscription to onUpdate event succeeds
         * @param {function=} onError callback for when subscription to onUpdate event fails
         * @param {QueryParamGetter=} getQueryParams custom function used to determine {@link QueryParameters} used to
         * in get() request when collection updates
         * @memberOf MM.activeSession.activities
         * @instance
         *
         * @example <caption> Setting the onUpdate handler, creating a new activity, and
         * obtaining the latest activities list </caption>
         *
         function activitiesOnUpdateExample () {
            // set the onUpdate handler for the activities list
            MM.activeSession.activities.onUpdate(
                onActivitiesUpdate,
                onSubscribedToActivitiesUpdates,
                onSubscribeToActivityUpdatesError,
                getActivitiesParams
            );
         }
         function onSubscribedToActivitiesUpdates () {
            // successfully subscribed to updates to the session's activities list
            // now, create a new activity
            createNewActivity();
         }
         function onSubscribeToActivityUpdatesError () {
            console.log('error subscribing to activity list updates');
         }
         function getActivitiesParams () {
            // When the activity list updates, only fetch 5 objects
            return {
                limit: 5
            };
         }
         function onActivitiesUpdate () {
            // there was an update to the activities list
            var activities = MM.activeSession.activities.json();
            // activities contains the latest list of activities
         }
         function createNewActivity () {
            var newActivityData = {
                activitytype: 'status update',
                title: 'hello world'
            };
            MM.activeSession.activities.post(newActivityData);
         }
         *
         * @example <caption> Deregistering the onUpdate handler </caption>
         *
         function deregisterActivitiesOnUpdate () {
            MM.activeSession.activities.onUpdate(null);
         }
         */
        onUpdate: function (updateHandler, onSuccess, onError, getQueryParams) {
            this._onUpdate(updateHandler,  onSuccess, onError, getQueryParams);
        },
        /**
         * Get and search through the activity stream for the specified session. The activity stream is designed to
         * capture non-text contextual signals important to your application. For example, the activity stream could
         * be used keep track of the location history for a given user; it could be used to log the time when a user
         * joins or leaves a session; or it could be used to track when users select certain documents, articles or
         * entities. Currently, the activites collection provides a consistent data representation to capture and search
         * through a history of non-text contextual signals. As we enhance the MindMeld Platform in the coming months,
         * we will add capabilities to recognize patterns and make recommendations based on commonly observed
         * activity histories. A request with a user token can retrieve activites only if the associated user
         * is permitted to access the session object itself. A request with an admin token can retrieve activites
         * for any session associated with your application.
         *
         * @param {QueryParameters=} params query parameters when fetching the activities list
         * @param {APISuccessCallback=} onSuccess callback for when getting activities list was successful
         * @param {APIErrorCallback=} onFail callback for when getting activities list failed
         * @memberOf MM.activeSession.activities
         * @instance
         *
         * @example
         *
         function getActivities () {
            MM.activeSession.activities.get(null, onGetActivities);
         }
         function onGetActivities (response) {
            var activities = response.data;
            console.log(activities);
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(params, onSuccess, onFail);
        },
        /**
         * Adds a new activity to the activity stream of the active session. The activity
         * stream is designed to capture non-text contextual signals important to your
         * application. This endpoint can be used to create new activities when your
         * users take specific actions in your app
         *
         * @param {Object} activityData Object containing new activity data.
         * @param {string} activityData.activitytype A short string
         * identifying the type of activity this object represents. For example, if the activity
         * corresponds to a user selecting an entity, this attribute could be set to 'select entity'.
         * If the activity is an update in user status, such as joining or leaving a session,
         * this attribute could be 'user status update'
         * @param {string} activityData.title A short text string that can be displayed as the title for the activity
         * @param {Location=} activityData.location A location object containing the longitude and
         * latitude coordinates associated with the activity. This can be used to keep track
         * of location history for a user
         * @param {string=} activityData.documentid The id of a document, if any, associated with the activity
         * @param {string=} activityData.articleid The id of an article, if any, associated with the activity
         * @param {string=} activityData.entityid The id of an entity, if any, associated with the activity
         * @param {string=} activityData.textentryid The id of a textentry, if any, associated with the activity
         * @param {APISuccessCallback=} onSuccess callback for when creating new activity was successful
         * @param {APIErrorCallback=} onFail callback for when creating new activity failed
         * @memberOf MM.activeSession.activities
         * @instance
         *
         * @example
         *
         function createNewActivity () {
            var newActivityData = {
                activitytype: 'status update',
                title: 'hello world'
            };
            MM.activeSession.activities.post(newActivityData, onCreateNewActivity);
         }
         function onCreateNewActivity () {
            // New activity created
         }
         */
        post: function (activityData, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), activityData, onSuccess, onFail);
        },
        /**
         * Delete an activity from the active session
         *
         * @param {string} activityid id of the activity to delete
         * @param {APISuccessCallback=} onSuccess callback for when deleting the activity was successful
         * @param {APIErrorCallback=} onFail callback for when deleting the activity failed
         * @memberOf MM.activeSession.activities
         * @instance
         *
         * @example
         *
         function deleteActivity () {
            MM.activeSession.activities.delete('<activity id>', onActivityDeleted);
         }
         function onActivityDeleted () {
            // activity deleted
         }
         */
        delete: function (activityid, onSuccess, onFail) {
            this.makeModelRequest('DELETE', 'activity/' + activityid, null, onSuccess, onFail);
        },
        channelType: 'session',
        updateEventName: 'activitiesUpdate'
    });

    MM.models.ActiveSession = MM.Internal.createSubclass(MM.models.Model, {
        /**
         * The MM.activeSession object represents the currently active session. It can only be used after
         * {@link MM#setActiveSessionID} has been called. This object is a container for capturing a history of contextual
         * information for one or more users interacting with an application. The activeSession contains
         * several child object collections that can be used to upload contextual information and
         * display relevant search results to your users. The activeSession object is also used to
         * publish / subscribe session-level push events
         *
         * @namespace MM.activeSession
         * @memberOf MM
         */
        constructor: function () {
            MM.models.ActiveSession.superclass.constructor.apply(this, arguments);
            var session = this;

            /**
             * A session's listener is automatically configured to post text entries with type 'speech' and weight of 1.0
             * when it receives a final {@link ListenerResult} object. Use {@link MM.activeSession#setListenerConfig} to
             * register callbacks. Before using a Listener, check that it is supported with {@link MM.support}.
             *
             * @name listener
             * @memberOf MM.activeSession
             * @type {MM.Listener}
             * @instance
             * @example
             if (MM.support.speechRecognition) {
                 MM.activeSession.setListenerConfig({
                     onResult: function(result) {
                         // update UI
                     }
                 });
                 MM.activeSession.listener.start();
             }
             */
            var listener = this.listener = new MM.Listener({
                interimResults: true,
                onResult: function(result, resultIndex, results, event) {
                    // post a text entry for finalized results
                    if (result.final) {
                        postListenerResult(result.transcript);
                    }
                    // notify handler
                    MM.Util.testAndCallThis(session._onListenerResult, session.listener, result, resultIndex, results, event);
                },
                onStart: function(event) {
                    MM.Util.testAndCallThis(session._onListenerStart, session.listener, event);
                },
                onEnd: function(event) {
                    // Add last result if it was not final
                    var results = this.results;
                    var lastResult = null;
                    if (results.length > 0) {
                        lastResult = results[results.length - 1];
                        if (!lastResult.final) {
                            postListenerResult(lastResult.transcript);
                        }
                    }
                    MM.Util.testAndCallThis(session._onListenerEnd, session.listener, event);
                },
                onError: function(error) {
                    MM.Util.testAndCallThis(session._onListenerError, session.listener, error);
                }
            });

            function getEffectiveLang () {
                var language = '';
                if (listener.lang !== '') {
                    language = listener.lang;
                } else if (typeof window.document !== 'undefined' && window.document.documentElement !== null && window.document.documentElement.lang !== '') {
                    // attempt to retrieve from html element
                    language = window.document.documentElement.lang;
                }
                return language;
            }
            function postListenerResult (transcript) {
                var textEntryData = {
                    text: transcript,
                    type: 'speech',
                    weight: 1.0
                };
                var lang = getEffectiveLang();
                if (lang.length) {
                    textEntryData.language = MM.Listener.convertLanguageToISO6392(lang);
                }
                session.textentries.post(textEntryData, function(response) {
                    MM.Util.testAndCallThis(session._onTextEntryPosted, session.listener, response);
                });
            }
            _extend(this, MM.Internal.customEventHandlers); // adds support for custom events on session channel
        },
        localStoragePath: function () {
            return 'MM.activeSession';
        },
        path: function () {
            return('session/' + MM.activeSessionId);
        },
        /**
         * Helper function returns the JSON data for the activeSession object
         *
         * @returns {Object}
         * @memberOf MM.activeSession
         * @instance
         *
         * @example
         *
         function getSessionInfo () {
            MM.activeSession.get(null, onGetSessionInfo);
         }
         function onGetSessionInfo () {
            var sessionInfo = MM.activeSession.json();
            // MM.activeSession.json() returns a JSON object containing data received from MM.activeSession.get()
         }
         */
        json: function () {
            return this._json();
        },
        /**
         * Sets the activeSession's onUpdate handler. Pass null as the updateHandler parameter to
         * deregister a previously set updateHandler. If the updateHandler has been set, it
         * is automatically called when active session info is fetched (e.g. {@link MM.activeSession#get})
         *
         * @param {APISuccessCallback=} updateHandler callback for when the activeSession object updates
         * @memberOf MM.activeSession
         * @instance
         *
         * @example
         *
         function getSessionInfo () {
            MM.activeSession.onUpdate(onGetSessionInfo); // Set the updateHandler
            MM.activeSession.get(); // Fetch active session info
         }
         function onGetSessionInfo (response) {
            var sessionInfo = response.data;
            console.log(sessionInfo);
         }
         */
        onUpdate: function (updateHandler) {
            this._onUpdate(updateHandler,  null, null);
        },
        /**
         * Sets the listener configuration of the active session. Pass null for callback fields to remove previous callbacks.
         * See {@link MM.Listener#setConfig} for more details.
         *
         * @param {ListenerConfig} config an object containing listener configuration properties
         * @memberOf MM.activeSession
         * @instance
         */
        setListenerConfig: function (config) {
            var configProperties = {
                onResult: '_onListenerResult',
                onStart: '_onListenerStart',
                onEnd: '_onListenerEnd',
                onError: '_onListenerError',
                onTextEntryPosted: '_onTextEntryPosted'
            };

            for (var configProperty in configProperties) { // only look at safe properties
                if (config.hasOwnProperty(configProperty)) { // only update property if it is in the config object
                    this[configProperties[configProperty]] = config[configProperty];
                    delete config[configProperty]; // remove from config
                }
            }

            this.listener.setConfig(config); // pass other configuration settings to listener
        },
        /**
         * Get information about the active session. User privileges may allow access to this object
         * depending on the privacymode of the session:
         * If the privacymode is 'public', a user token will allow access.
         * If the privacymode is 'friendsonly', a user token will allow access only if the user is in the friends collection of the session organizer.
         * If the privacymode is 'inviteonly', a user token will allow access only if the user is on the invitedusers list associated with this session.
         * If the user token belongs to the session organizer, it will be allowed to access the session.
         * Admin privileges allow access to all sessions associated with your application.
         * @param {QueryParameters=} params query parameters when fetching the session object
         * @param {APISuccessCallback=} onSuccess callback for when getting session data was successful
         * @param {APIErrorCallback=} onFail callback for when getting session data failed
         * @memberOf MM.activeSession
         * @instance
         *
         * @example
         *
         function getSessionInfo () {
            MM.activeSession.get(null, onGetSessionInfo);
         }
         function onGetSessionInfo (response) {
            var sessionInfo = response.data;
         }
         */
        get: function (params, onSuccess, onFail) {
            this._get(null, onSuccess, onFail);
        },
        /**
         * Updates information about the ActiveSession
         *
         * @param {Object} sessionInfo Object containing updated session data. The only fields
         * that can be updated are 'name' and 'privacymode'. Please see the Session endpoints
         * documentation [here](https://developer.expectlabs.com/docs/endpointSession#postSessionSessionid)
         * for more info
         * @param {string=} sessionInfo.name updated name of active session
         * @param {string=} sessionInfo.privacymode update privacy mode of the active session. The supported privacy modes
         * are 'friendsonly', 'inviteonly', and 'public'
         *
         * @param {APISuccessCallback=} onSuccess callback for when updating session info was successful
         * @param {APIErrorCallback=} onFail callback for when updating session info failed
         * @memberOf MM.activeSession
         * @instance
         *
         * @example
         *
         function updateSessionInfo () {
            var newSessionData = {
                name: 'updated session name',
                privacymode: 'public' // privacy mode will be updated to 'public'
            };
            MM.activeSession.post(newSessionData, onUpdateSessionSuccess);
         }
         function onUpdateSessionSuccess () {
            // Session data updated
         }
         */
        post: function (sessionInfo, onSuccess, onFail) {
            this.makeModelRequest('POST', this.path(), sessionInfo, onSuccess, onFail);
        },
        /**
         * Publish a new, custom event on the active session's channel
         *
         * @param {string} event event name
         * @param {EventPayload=} payload payload for event
         * @memberOf MM.activeSession
         * @instance
         *
         * @example <caption> Code snippet to subscribe and publish a
         * custom event on the active session's channel </caption>
         *
         function publishEvent() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.activeSession.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on session channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent' with the payload containing the string
            // 'custom payload'
            MM.activeSession.publish('testEvent', 'custom payload');
         }
         function onTestEvent (payload) {
            // the payload parameter is 'custom payload'
            console.log('Received testEvent with payload: ' + payload);
         }
         */
        publish: function (event, payload) {
            this._publish(event, payload);
        },
        /**
         * Subscribe to a custom event on the active session's channel
         *
         * @param eventName {string} name of event to subscribe to
         * @param eventHandler  {NamedEventCallBack} callback for when event is fired
         * @param onSuccess {function=} callback for when subscription is successful
         * @param onError   {function=} callback for when there is an error subscribing
         * @memberOf MM.activeSession
         * @instance
         *
         * @example <caption> Code snippet to subscribe and publish a
         * custom event on the active session's channel </caption>
         *
         function publishEvent() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.activeSession.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on session channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent' with the payload containing the string
            // 'custom payload'
            MM.activeSession.publish('testEvent', 'custom payload');
         }
         function onTestEvent (payload) {
            // the payload parameter is 'custom payload'
            console.log('Received testEvent with payload: ' + payload);
         }
         */
        subscribe: function (eventName, eventHandler, onSuccess, onError) {
            this._subscribe(eventName, eventHandler, onSuccess, onError);
        },
        /**
         * Unsubscribe from a custom event on the active session's channel
         *
         * @param {string} eventName name of event to subscribe from
         * @instance
         * @memberOf MM.activeSession
         *
         * @example
         *
         function unsubscribeExample() {
            // First subscribe to an event. In this case we are
            // subscribing to an event named 'testEvent'
            MM.activeSession.subscribe('testEvent', onTestEvent, onTestEventSubscribed);
         }
         function onTestEventSubscribed () {
            console.log('Successfully subscribed to testEvent on session channel');
            // Now that we have successfully subscribed to the 'testEvent' event,
            // publish a 'testEvent'
            MM.activeSession.publish('testEvent');
         }
         function onTestEvent (payload) {
            // onTestEvent will be called once after 'testEvent' is published
            console.log('received test event');
            // Now unsubscribe from 'testEvent'
            MM.activeSession.unsubscribe('testEvent');
            // Publish 'testEvent' again
            MM.activeSession.publish('testEvent');
            // Since we unsubscribed, onTestEvent won't be called anymore
         }
         */
        unsubscribe: function (eventName) {
            this._unsubscribe(eventName);
        },
        /**
         * Subscribes to every event on the active session's channel
         *
         * @param {AllEventsCallback} eventHandler callback for when an event on the active session's channel is fired
         * @param onSuccess {function=} callback for when subscription is successful
         * @param onError   {function=} callback for when there is an error subscribing
         * @instance
         * @memberOf MM.activeSession
         *
         * @example
         *
         function subscribeAllExample () {
            MM.activeSession.subscribeAll(onSessionChannelEvent, onSubscribeSessionChannel);
         }
         function onSubscribeSessionChannel () {
            MM.activeSession.publish('eventA', 'payloadA');
            MM.activeSession.publish('eventB', 'payloadB');
         }
         function onSessionChannelEvent (eventObject) {
            var eventName = eventObject.event;
            var eventPayload = eventObject.payload;
            console.log('Received event ' + eventName +
                ' with payload ' + eventPayload);
            // Received event eventA with payload payloadA
            // Received event eventB with payload payloadB
         }
         */
        subscribeAll: function (eventHandler, onSuccess, onError) {
            this._subscribeAll(eventHandler, onSuccess, onError);
        },
        /**
         * Unsubscribe from all events on the active session's channel
         *
         * @instance
         * @memberOf MM.activeSession
         *
         * @example
         *
         function unsubscribeAllExample () {
            // First subscribe to all events on active session channel
            MM.activeSession.subscribeAll(onSessionChannelEvent, onSubscribeSessionChannel);
         }
         function onSubscribeSessionChannel () {
            // publish the event 'testEvent'
            MM.activeSession.publish('testEvent');
         }
         function onSessionChannelEvent (eventObject) {
            var eventName = eventObject.event;
            console.log('Received event ' + eventName);
            // Now unsubscribe from session channel events
            MM.activeSession.unsubscribeAll();
            MM.activeSession.publish('testEvent');
            // onSessionChannelEvent won't be called because we are unsubscribed
            // from all session channel events
         }
         */
        unsubscribeAll: function () {
            this._unsubscribeAll();
        },
        channelType: 'session'
    });

    /**
     * The Util namespace which contains utility methods
     *
     * @memberOf MM
     * @namespace
     * @private
     */
    MM.Util = _extend({}, {

        /**
         * Tests whether given parameter is a function, and if so calls it
         *
         * @param {?function} func object to test if it is a function
         * @memberOf MM.Util
         *
         * @example
         var func = function(arg1, arg2) {
            console.log('Argument 1: ' + arg1);
            console.log('Argument 2: ' + arg2);
         };

         MM.Util.testAndCall(func, 'a', 'b');
         // Argument 1: a
         // Argument 2: b

         */
        testAndCall: function (func) {
            if(_isFunction(func)){
                // args will be the arguments to be passed to func
                // arguments[0] is a reference to func, so we call
                // slice to remove it from the arguments list
                var args = Array.prototype.slice.call(arguments, 1);
                func.apply(this, args);
            }
        },

        /**
         * Tests whether given parameter is a function, and if so calls it
         * with a given 'this' value
         *
         * @param {?function} func object to test if it is a function
         * @param {Object} thisArg value for 'this' when func is called
         * @memberOf MM.Util
         *
         * @example
         var func = function(arg1, arg2) {
            console.log('This.prop: ' + this.prop);
            console.log('Argument 1: ' + arg1);
            console.log('Argument 2: ' + arg2);
         };

         var self = {
            prop: 'property'
         };

         MM.Util.testAndCallThis(func, self, 'a', 'b');
         // This.prop: property
         // Argument 1: a
         // Argument 2: b
         */
        testAndCallThis: function (func, thisArg) {
            if(_isFunction(func)){
                // args will be the arguments to be passed to func
                // arguments[0] is a reference to func, so we call
                // slice to remove it from the arguments list
                var args = Array.prototype.slice.call(arguments, 2);
                func.apply(thisArg, args);
            }
        }
    });

    MM.Listener = (function () {
        var Listener = MM.Internal.createSubclass(Object, {
            /**
             * An object representing the text result from the speech recognition API.
             *
             * @typedef  {Object}  ListenerResult
             * @property {string}  transcript the text of the speech that was processed
             * @property {boolean} final      indicates whether the result is final or interim
             */

            /**
             * An object representing the configuration of a {@link MM.Listener}
             *
             * @typedef  {Object}  ListenerConfig
             * @property {boolean} [continuous=false]        whether the listener should continue listening until stop() is called.
             *                                               If false, recording will continue until the speech recognition provider
             *                                               recognizes a sufficient pause in speech.
             * @property {boolean} [interimResults=false]    whether the listener should provide interim results
             * @property {string} [lang=""]                  the 'Simple language sub tag' or 'Language-Region tag' of the [BCP 47](http://tools.ietf.org/html/bcp47)
             *                                               code for the language the listener should recognize (e.g. 'ko' for Korean,
             *                                               'en-US' for American English, and 'de-DE' for German). When set to the empty
             *                                               string "" or unspecified, the listener attempts to use the lang attribute
             *                                               of the root html element (document.documentElement.lang). A "language-not-supported"
             *                                               error will be thrown for unsupported languages. Language support depends on
             *                                               the browser. For Chrome, no official list of supported languages exists.
             *                                               There is however, a good unofficial list in this question on
             *                                               [Stack Overflow](http://stackoverflow.com/questions/14257598/what-are-language-codes-for-voice-recognition-languages-in-chromes-implementati).
             * @property {ListenerResultCallback} [onResult] the callback that will process listener results. This property must be
             *                                               provided when creating a new {@link MM.Listener}.
             * @property {function} [onStart=null]           the event handler which is called when a listening session begins.
             * @property {function} [onEnd=null]             the event handler which is called when a listening session ends.
             * @property {function} [onError=null]           the event handler which is called when errors are received.
             * @property {APISuccessCallback} [onTextEntryPosted=null] the event handler which is called when text entries are posted.
             *                                                         Note: This is only called when using the activeSession's listener
             */

            /**
             * The ListenerResultCallback handles results from the Speech Recognition API. A ListenerResultCallback should at
             * minimum handle the result parameter.
             *
             * @callback ListenerResultCallback
             * @param {ListenerResult} result result object containing speech recognition result
             * @param {number} resultIndex the index of the provided result in the results array
             * @param {Array} results an array of {@link ListenerResult} objects received during the current speech recognition session
             * @param {Event} event the original event received from the underlying SpeechRecognition instance
             */

            /**
             * Constructor for Listener class
             *
             * @constructs MM.Listener
             * @param {ListenerConfig} config an object containing the listener's configuration properties. Any properties that
             *                         are omitted default to either null or false.
             *
             * @classdesc This is the class for the MindMeld speech recognition API. Before using a Listener, check that it
             *            is supported with {@link MM.support}. Currently the known browsers which support MM.Listener are
             *            Google Chrome for Desktop (versions 25+) and Android (versions 31+). The MM.Listener class relies
             *            upon the speech recognition portion of the Web Speech API (https://dvcs.w3.org/hg/speech-api/raw-file/tip/webspeechapi.html)
             *            which has not yet been implemented by all major browsers. Note that listening won't work when accessing
             *            locally hosted JavaScript and HTML. Speech recognition is only supported when your JavaScript and
             *            HTML are served from a web server.
             *
             * @property {boolean} listening      indicates whether or not the listener is active. Readonly.
             * @property {Array} results          array of {@link ListenerResult} objects received during the current or most
             *                                    recent listening session. Readonly.
             * @property {boolean} interimResults indicates whether or not interimResults are enabled. Defaults to false.
             * @property {boolean} continuous     indicates whether or not continuous recognition is enabled. Defaults to false.
             * @property {string} lang            the 'Simple language sub tag' or 'Language-Region tag' of the [BCP 47](http://tools.ietf.org/html/bcp47)
             *                                    code for the language the listener should recognize (e.g. 'ko' for Korean, 'en-US'
             *                                    for American English, and 'de-DE' for German). When set to the empty string "" or
             *                                    unspecified, the listener attempts to use the lang attribute of the root html
             *                                    element (document.documentElement.lang). A "language-not-supported" error will
             *                                    be thrown for unsupported languages. Language support depends on the browser. For
             *                                    Chrome, no official list of supported languages exists. There is however, a good
             *                                    unofficial list in this question on
             *                                    [Stack Overflow](http://stackoverflow.com/questions/14257598/what-are-language-codes-for-voice-recognition-languages-in-chromes-implementati).
             *
             * @example
             function postTextEntry(text) {
                 MM.activeSession.textentries.post({
                     text: text,
                     type: 'speech',
                     weight: 1.0
                 });
             }

             if (MM.support.speechRecognition) {
                 var myListener = new MM.Listener({
                     continuous: true,
                     interimResults: true,
                     lang: 'es-ES' // listen for European Spanish
                     onResult: function(result) {
                         if (result.final) {
                             // post text entry for final results
                             postTextEntry(result.transcript);

                             // update UI to show final result
                         } else {
                             // update UI to show interim result
                         }
                     },
                     onStart: function(event) {
                         // update ui to show listening
                     },
                     onEnd: function(event) {
                         var results = this.results;
                         var lastResult = null;
                         if (results.length > 0) {
                             lastResult = results[results.length - 1];
                         }

                         if (!lastResult.final) { // wasn't final when last received onResult
                             // post for the last result
                             postTextEntry(lastResult.transcript);
                             // update UI to show final result
                         }
                     },
                     onError: function(event) {
                         console.log('listener encountered error: ' + event.error);
                         // notify user of error if applicable
                     }
                 });
                 myListener.start();
             }
             */
            constructor: function(config) {
                this.setConfig(config);
            },
            /**
             * Sets the listener object's configuration. Pass null for callback fields to deregister previous callbacks.
             *
             * @param {ListenerConfig} config an object containing the listener's configuration properties
             * @memberOf MM.Listener
             * @instance
             */
            setConfig: function(config) {
                var configProperties = {
                    onResult: '_onResult',
                    onStart: '_onStart',
                    onEnd: '_onEnd',
                    onError: '_onError',
                    onTextEntryPosted: '_onTextEntryPosted',
                    continuous: 'continuous',
                    interimResults: 'interimResults',
                    lang: 'lang'
                };

                for (var configProperty in configProperties) { // only look at safe properties
                    if (config.hasOwnProperty(configProperty)) { // only update property if it is in the config object
                        this[configProperties[configProperty]] = config[configProperty];
                    }
                }
            },
            /**
             * The time the listener last begin listening. Defaults to 0.
             *
             * @memberOf MM.Listener
             * @instance
             * @private
             */
            _lastStartTime: 0,
            /**
             * Starts a speech recognition session. The onResult callback will begin receiving results as the user's speech
             * is recognized.
             *
             * @throws When speech recognition is not supported in the browser, an error is thrown.
             * @memberOf MM.Listener
             * @instance
             */
            start: function() {
                if (!MM.support.speechRecognition) {
                    MM.Internal.log('Speech recognition is not supported');
                    throw new Error('Speech recognition is not supported');
                }

                var listener = this;
                if (Date.now() - listener._lastStartTime < 1000) {
                    // TODO(jj): should we throw an error here, or call onError?
                    return;
                }

                var abortTimeout = 0;
                function setAbortTimeout() {
                    window.clearTimeout(abortTimeout);
                    abortTimeout = window.setTimeout(function() {
                        recognizer.abort();
                    }, 2000); // abort if the recognition fails to call onEnd (chrome bug hack)
                }

                var recognizer = this._recognizer;
                if (typeof recognizer === 'undefined') {
                    recognizer = this._recognizer = new window.SpeechRecognition();
                    recognizer.onresult = function(event) {
                        var result = {
                            final: false,
                            transcript: ''
                        };
                        var resultIndex = event.resultIndex;
                        var results = listener._results;

                        for (var i = event.resultIndex; i < event.results.length; ++i) {
                            var transcript = event.results[i][0].transcript;

                            if (event.results[i].isFinal) {
                                result.final = true;
                                result.transcript = transcript;
                                break;
                            } else {
                                result.transcript += transcript; // collapse multiple pending results into one
                            }
                        }
                        results[resultIndex] = result;

                        if (abortTimeout != 0) {
                            setAbortTimeout();
                        }

                        MM.Util.testAndCallThis(listener._onResult, listener, result, resultIndex, results, event);
                    };
                    recognizer.onstart = function(event) {
                        listener._listening = true;
                        listener._lastStartTime = Date.now();
                        MM.Util.testAndCallThis(listener._onStart, listener, event);
                    };
                    recognizer.onend = function(event) {
                        window.clearTimeout(abortTimeout);
                        abortTimeout = 0;
                        listener._listening = false;
                        MM.Util.testAndCallThis(listener._onEnd, listener, event);
                    };
                    recognizer.onerror = function(event) {
                        MM.Util.testAndCallThis(listener._onError, listener, event);
                    };
                    recognizer.onaudioend = function(/* event <-- ignored */) {
                        if (!recognizer.continuous) {
                            setAbortTimeout();
                        }
                    };
                }
                recognizer.continuous = this.continuous;
                recognizer.interimResults = this.interimResults;
                var lang = (function () {
                    var language = '';
                    if (listener.lang !== '') {
                        language = listener.lang;
                    } else if (typeof window.document !== 'undefined' && window.document.documentElement !== null && window.document.documentElement.lang !== '') {
                        // attempt to retrieve from html element
                        language = window.document.documentElement.lang;
                    }
                    return language;
                })();
                recognizer.lang = lang;
                listener._results = []; // clear previous results

                recognizer.start();
            },
            /**
             * Stops the active speech recognition session. One more result may be send to the onResult callback.
             *
             * @memberOf MM.Listener
             * @instance
             */
            stop: function() {
                if (this._recognizer) {
                    this._recognizer.stop();
                }
            },
            /**
             * Cancels the active speech recognition session. No further results will be sent to the onResult callback.
             *
             * @memberOf MM.Listener
             * @instance
             */
            cancel: function() {
                if (this._recognizer) {
                    this._recognizer.abort();
                }
            }
        });


        Listener.prototype._listening = false;
        Listener.prototype._results = [];
        Listener.prototype.continuous = false;
        Listener.prototype.lang = "";
        Listener.prototype.interimResults = false;
        Object.defineProperties(Listener.prototype, {
            listening: {
                get: function() {
                    return this._listening;
                }
            },
            results: {
                get: function() {
                    return JSON.parse(JSON.stringify(this._results));
                }
            }
        });

        var languageTags6391To6392 = {'ab':'abk','aa':'aar','af':'afr','sq':'sqi','am':'amh','ar':'ara','an':'arg','hy':'hye','as':'asm','ae':'ave','ay':'aym','az':'aze','ba':'bak','eu':'eus','be':'bel','bn':'ben','bh':'bih','bi':'bis','bs':'bos','br':'bre','bg':'bul','my':'mya','ca':'cat','ch':'cha','ce':'che','zh':'zho','cu':'chu','cv':'chv','kw':'cor','co':'cos','hr':'hrv','cs':'ces','da':'dan','dv':'div','nl':'nld','dz':'dzo','en':'eng','eo':'epo','et':'est','fo':'fao','fj':'fij','fi':'fin','fr':'fra','gd':'gla','gl':'glg','ka':'kat','de':'deu','el':'ell','gn':'grn','gu':'guj','ht':'hat','ha':'hau','he':'heb','hz':'her','hi':'hin','ho':'hmo','hu':'hun','is':'isl','io':'ido','id':'ind','ia':'ina','ie':'ile','iu':'iku','ik':'ipk','ga':'gle','it':'ita','ja':'jpn','jv':'jav','kl':'kal','kn':'kan','ks':'kas','kk':'kaz','km':'khm','ki':'kik','rw':'kin','ky':'kir','kv':'kom','ko':'kor','kj':'kua','ku':'kur','lo':'lao','la':'lat','lv':'lav','li':'lim','ln':'lin','lt':'lit','lb':'ltz','mk':'mkd','mg':'mlg','ms':'msa','ml':'mal','mt':'mlt','gv':'glv','mi':'mri','mr':'mar','mh':'mah','mo':'mol','mn':'mon','na':'nau','nv':'nav','nd':'nde','nr':'nbl','ng':'ndo','ne':'nep','se':'sme','no':'nor','nb':'nob','nn':'nno','ny':'nya','oc':'oci','or':'ori','om':'orm','os':'oss','pi':'pli','pa':'pan','fa':'fas','pl':'pol','pt':'por','ps':'pus','qu':'que','rm':'roh','ro':'ron','rn':'run','ru':'rus','sm':'smo','sg':'sag','sa':'san','sc':'srd','sr':'srp','sn':'sna','ii':'iii','sd':'snd','si':'sin','sk':'slk','sl':'slv','so':'som','st':'sot','es':'spa','su':'sun','sw':'swa','ss':'ssw','sv':'swe','tl':'tgl','ty':'tah','tg':'tgk','ta':'tam','tt':'tat','te':'tel','th':'tha','bo':'bod','ti':'tir','to':'ton','ts':'tso','tn':'tsn','tr':'tur','tk':'tuk','tw':'twi','ug':'uig','uk':'ukr','ur':'urd','uz':'uzb','vi':'vie','vo':'vol','wa':'wln','cy':'cym','fy':'fry','wo':'wol','xh':'xho','yi':'yid','yo':'yor','za':'zha','zu':'zul'}

        /**
         * Converts language name or tag to the [ISO 639-2](http://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) language
         * code. If the language is unknown, the first three characters of lang parameter are returned.
         *
         * @param {String} lang an [ISO 639-1](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code, for example 'en-US'.
         * @return {String} an [ISO 639-2](http://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) language code, for example 'eng'
         *
         * @method
         * @memberOf MM.Listener
         * @name convertLanguageToISO6392
         */
        Listener.convertLanguageToISO6392 = function(lang) {
            var key = lang.substring(0, 2);
            var result = languageTags6391To6392[key]; // attempt to lookup the 639-2 tag
            if (typeof result === 'undefined') {
                result = lang.substring(0, 3); // use first 3 letters if language is unknown
            }

            return result;
        };

        return Listener;
    })();

    /**
     * An overview of features supported in the browser.
     *
     * @memberOf MM
     * @namespace
     *
     * @property {boolean} speechRecognition whether speech recognition is supported in the current browser
     * @property {boolean} localStorage      whether local storage is supported in the current browser
     */
    MM.support = (function(window) {
        var support = {};

        var localStorage = false;
        var speechRecognition = false;

        Object.defineProperties(support, {
            localStorage: {
                get: function() { return localStorage; }
            },
            speechRecognition: {
                get: function() { return speechRecognition; }
            }
        });
        try {
            speechRecognition = (function(window) {
                'use strict';
                window = window || {};
                var SpeechRecognition = window.webkitSpeechRecognition ||
    //                window.mozSpeechRecognition || // TODO: add these as they become supported, and update MM.Listener docs
    //                window.msSpeechRecognition ||
    //                window.oSpeechRecognition ||
                    window.SpeechRecognition;
                window.SpeechRecognition = SpeechRecognition; // now we can use one!
                return (typeof(SpeechRecognition) !== 'undefined');
            })(window);
        } catch (e) {
            // TODO: maybe add something here?
        }
        try {
            localStorage = (function(window) {
                'use strict';
                window = window || {};
                return (typeof(window.Storage) !== 'undefined');
            })(window);
        } catch (e) {
            // TODO: maybe add something here?
        }

        return support;
    })(window);


    // Setup MM SDK
    MM.Internal.setup();
    return MM;

}(window, ajax, Faye));

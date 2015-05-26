var sw33t = {
    debug: false,
    // specPath: in sw33t/spec in the root folder
    specPath: 'sw33t/spec/',
    specSuffix: '.spec',
    // testPath: in sw33t/tests in the root folder
    testPath: 'sw33t/tests/',
    testSuffix: '.tests',
    useJSON: false,

    /**
     * Logs a message to the console if sw33t is in debug mode.
     *
     * @param {string} message: The message to log to the console window
     */
    log: function(message) {
        if (sw33t.debug) {
            console.log(message);
        }
    },

    /**
     * Runs the sw33t brain and parses a spec.
     *
     * @param {object|string} spec: the spec object to parse or a string to the filepath
     * @param {object|string} test: the spec object to run or a string to the filepath
     * @param {bool} defaults: optional parameter to use default filepaths before the given strings (defaults to false)
     */
    run: function(spec, test, defaults) {
        var aspec = {};
        var atests = {};
        if (spec === undefined && test === undefined) {
            throw 'Automated testing is currently unsupported.';
        }

        if (defaults === undefined) {
            defaults = true;
        }

        if (typeof spec === 'string') {
            var specstring = "";
            if (defaults) {
                specstring = "../../" + sw33t.specPath + spec + sw33t.specSuffix;
            }

            if (sw33t.useJSON) {
                specstring += ".json";
            }

            aspec = require(specstring);

            if (test === undefined) {
                var teststring = "";
                if (defaults) {
                    teststring = "../../" + sw33t.testPath + spec + sw33t.testSuffix;
                }

                atests = require(teststring);
            }
        } else if (typeof spec === 'object') {
            aspec = spec;
        }

        if (typeof test === 'string') {
            var teststring = "";
            if (defaults) {
                teststring = sw33t.testPath + test + sw33t.testSuffix;
            }

            atests = require(teststring);
        } else if (typeof test === 'object') {
            atests = test;
        }

        //in case the same spec is being tested, clone the object
        sw33t.think(extend(true, {}, aspec), atests);
    },

    /**
     * Starts recursively testing with provided objects
     *
     * @param {object} spec: The spec to test wtih
     * @param {object} tests: an object containing named tests called in the spec
     */
    think: function(spec, tests) {
        sw33t.log('Start Tests');
        var subjects = {};
        describe('[sw33t Tests]', function() {
            sw33t.describes(subjects, spec, tests);
        });
    },

    /**
     * Recursive method that reads the spec and tests if necesarry
     *
     * @param {object} subjects: an object passed down the chain containing the test subjects
     * @param {object} spec: the spec being tested
     * @param {object} tests: an object containing named tests called in the spec
     */
    describes: function(subjects, spec, tests) {
        // Extend subjects

        if (spec.mixin !== undefined) {
            sw33t.log('Mixing into the spec');
            if (typeof spec.mixin === 'function') {
                spec = extend(true, {}, spec, spec.mixin(subjects));
            } else {
                spec = extend(true, {}, spec, spec.mixin);
            }

            delete spec.mixin;
        }

        if (spec.subjects !== undefined) {
            sw33t.log('Extend subjects');
            if (typeof spec.subjects === 'function') {
                subjects = extend(true, {}, subjects, spec.subjects(subjects));
            } else {
                subjects = extend(true, {}, subjects, spec.subjects);
            }

            delete spec.subjects;
        }

        sw33t.log('Describe..');
        each(spec, function(key, value) {
            if (key === 'tests') {
                sw33t.log('Creating Tests..');
                // Process tests
                each(value, function(test_key, test_value) {
                    sw33t.log('Created test: ' + test_key);

                    // Clone subjects
                    var test_subjects = extend(true, {}, subjects);
                    // Extend subjects
                    if (test_value.subjects !== undefined) {
                        sw33t.log('Extending test subjects');
                        if (typeof test_value.subjects === "function") {
                            test_value.subjects = test_value.subjects(test_subjects);
                        }

                        test_subjects = extend(true, test_subjects, test_value.subjects);
                    }

                    // Create Tests
                    var it_verbose = test_key;
                    if (test_value.note !== undefined)
                        it_verbose += ' [\x1B[35m' + test_value.note + '\x1B[39m]';

                    if (test_value.alias !== undefined)
                        test_key = test_value.alias;

                    // Check if expects is a function
                    if (typeof test_value.expects === "function") {
                        test_value.expects = test_value.expects(test_subjects);
                    }

                    it(it_verbose, function() {
                        tests[test_key](test_subjects, test_value.expects);
                    });
                });
            } else {
                sw33t.log('Process more describes [' + key + ']');
                // Process describes
                describe(key, function() {
                    sw33t.describes(subjects, value, tests);
                });
            }
        });
    }
};

/**
 * A function used to repeat over elements in an array/object
 *
 * @param {object} obj: the object or array to test
 * @param {function} callback: a callback to be called on each object in the list
 * @param {object[]} args: arguments to be passed to the callback
 */
function each(obj, callback, args) {
    var value, i = 0,
        length = obj.length,
        isArray = (obj instanceof Array);

    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.apply(obj[i], args);

                if (value === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
}

/**
 * Extends an object with other objects
 */
function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object"
        },
        jQuery = {
            isFunction: function(obj) {
                return jQuery.type(obj) === "function"
            },
            isArray: Array.isArray ||
                function(obj) {
                    return jQuery.type(obj) === "array"
                },
            isWindow: function(obj) {
                return obj != null && obj == obj.window
            },
            isNumeric: function(obj) {
                return !isNaN(parseFloat(obj)) && isFinite(obj)
            },
            type: function(obj) {
                return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
            },
            isPlainObject: function(obj) {
                if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
                    return false
                }
                try {
                    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false
                    }
                } catch (e) {
                    return false
                }
                var key;
                for (key in obj) {}
                return key === undefined || hasOwn.call(obj, key)
            }
        };
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {}
    }
    if (length === i) {
        target = this;
        --i;
    }
    for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue
                }
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : []
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
                    // WARNING: RECURSION
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

module.exports = sw33t;
Sw33t
=========

Sw33t is an npm module used to sweeten the testing experience. Sw33t works with mocha to streamline the testing process and organize your files. Simply define your testing objects, the variables you want to test and Sw33t does the rest!

Installing Sw33t
---------------------------------
>npm install Sw33tjs

Using Sw33t
=========
The basics
---------------------------------
Sw33t can be used by either directly passing in specs and tests or by specifying filepaths to these files. A spec is a nested collection of tests you would like to perform and subjects you would like to perform these on. An example spec can look like:

	{
		subjects: {
			currentPath: null,
			currentTest: null
		},
		"Path A": {
			subjects: {
				currentPath: "A"
			},
			tests: {
				"Test 1": {
					subjects: {
						currentTest: "1"
					},
					expects: {
						path: "A",
						test: "1"
					}
				},
				"Test 2": {
					subjects: {
						currentTest: "1"
					},
					expects: {
						path: "A",
						test: "2"
					}
				}
			}
		},
		"Path B": {
			subjects: {
				currentPath: "B"
			},
			tests: {
				"Test 1": {
					subjects: {
						currentTest: "1"
					},
					expects: {
						path: "B",
						test: "1"
					}
				},
				"Test 2": {
					subjects: {
						currentTest: "1"
					},
					expects: {
						path: "B",
						test: "2"
					}
				}
			}
		}
	}

This spec has two paths (A & B) and two tests (1 & 2). To run these tests, we need to provide Sw33t with a tests object. Our test object for this example would look like the following:

	{
		"Test 1": function(subjects, expects) {
			assert.equal(subjects.currentPath, expects.path);
			assert.equal(subjects.currentTest, expects.test);
		},
		"Test 2": function(subjects, expects) {
			assert.equal(subjects.currentPath, expects.path);
			assert.equal(subjects.currentTest, expects.test);
		}
	}

Now to run our code! In this example, we're assuming our spec is contained in the spec variable and test is in our test variable.

    var Sw33t = require('Sw33tjs');

    // Define our spec and tests
    ...

    // Run Sw33t
    Sw33t.run(spec, test);

This is pretty simple, but we can skim our tests down even more!

Using Aliases
---------------------------------
In our last example, we only had to define two tests to run one test. However, we reused some code in our tests object. With Sw33t, we can tell all our tests to use the same method. This is called an alias.

In all our test definitions in the spec, we need to add the following line:
	alias: "runTest",
So as an example, Path A Test 1 will look like:

	"Test 1": {
		subjects: {
			currentTest: "1"
		},
		alias: "runTest",
		expects: {
			path: "A",
			test: "1"
		}
	},

Next, let's modify our test object a bit. Lets' take out the "Test 2" object and rename "Test 1" to "runTest".

	{
		"runTest": function(subjects, expects){
			assert.equal(subjects.currentPath, expects.path);
			assert.equal(subjects.currentTest, expects.test);
		}
	}

That's it! Now all your tests should be using the same test to check the same conditions. This can be particularily useful when you have quite a few tests checking the same variables. We've cut down a lot of code but let's see if we can reduce it even further...

Mixing it up
---------------------------------
In our last example, we cut down the code by using aliases. This can be a great way to cut down code, but our spec still reused a bit of code for our tests. Sw33t has another feature that allows you to reuse tests and paths throughout your code. This is called a mixin and is simple to define! Let's modify our spec to mix in some tests.

	var tests = function(subjects) {
		return {
			tests: {
				"Test 1": {
					subjects: {
						currentTest: "1"
					},
					alias: "runTest",
					expects: {
						path: subjects.currentPath,
						test: "1"
					}
				},
				"Test 2": {
					subjects: {
						currentTest: "1"
					},
					alias: "runTest",
					expects: {
						path: subjects.currentPath,
						test: "2"
					}
				}
			}
		}
	};

	var spec = {
		"Path A": {
			subjects: {
				currentPath: "A"
			},
			mixin: tests
		},
		"Path B": {
			subjects: {
				currentPath: "B"
			},
			mixin: tests
		}
	};

With mixins, we can pass either an object containing more paths or a function that accepts subjects as a parameter to help calculate expects. In this instance, we created a function to make sure our expects.path was always the correct path, regardless of where it was being mixed in.

Mixins aren't the only thing that can be passed subjects. You can also pass expects and even subjects themselves the subjects object to make your specs powerful yet simple.

Contributing
=========
Contributing to Sw33t is pretty simple! Just submit a pull request and we'll take a look at it. Our code conventions are as follows:

* We use spaces instead of tabs. Tab size should be 4 spaces.
* camelCase everything!
* Follow JSDocs for documentation. Every method on the Sw33t object should be documented.

Questions
=========
Feel free to tweet @cosrnos with any questions about this module!
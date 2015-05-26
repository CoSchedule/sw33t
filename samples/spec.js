module.exports = {
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
};
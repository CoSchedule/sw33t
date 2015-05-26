module.exports = {
	"Test 1": function(subjects, expects) {
		assert.equal(subjects.currentPath, expects.path);
		assert.equal(subjects.currentTest, expects.test);
	},
	"Test 2": function(subjects, expects) {
		assert.equal(subjects.currentPath, expects.path);
		assert.equal(subjects.currentTest, expects.test);
	}
};
var sw33t = require('./sw33t');
var assert = require('chai').assert;

var spec = {
	subjects: {
		the_subject: {}
	},
	"Name of subject": {
		"Parent 1": {
			subjects: {
				the_subject: {
					Age: 21
				}
			},
			tests: {
				"should be `Alex`": {
					subjects: {
						the_subject: {
							Name: "Alex"
						}
					},
					note: "sample",
					alias: "nameTest",
					expects: {
						equal: "Alex"
					}
				},
				"should be `Sarah`": {
					subjects: {
						the_subject: {
							Name: "Sarah"
						}
					},
					note: "sample",
					alias: "nameTest",
					expects: {
						equal: "Sarah"
					}
				},
				"should be `21`": {
					alias: "ageTest",
					expects: {
						equal: 21
					}
				}
			}
		},
		"Parent 2": {
			tests: {
				"should be `Alex`": {
					subjects: {
						the_subject: {
							Name: "Alex"
						}
					},
					note: "sample",
					alias: "nameTest",
					expects: {
						equal: "Alex"
					}
				},
				"should be `Sarah`": {
					subjects: {
						the_subject: {
							Name: "Sarah"
						}
					},
					note: "sample",
					alias: "nameTest",
					expects: {
						equal: "Sarah"
					}
				},
				"should be `21`": {
					alias: "ageTest",
					expects: {
						equal: 21
					}
				}
			}
		}
	}
};

var tests = {
	"nameTest": function(subject, expects) {
		assert.equal(subject.the_subject.Name, expects.equal);
	},
	"ageTest": function(subject, expects) {
		assert.equal(subject.the_subject.Age, expects.equal);
	}
};

sw33t.run(spec, tests);
// This is alightweight bridge between smoke and Screw.Unit
// it shadows mocking and stubbing onto the matchers to make them available within tests
Screw.Matchers.mock = function(m) {
	return new Smoke.Mock(m);
};

Screw.Matchers.stub = function(obj,attr) {
	return new Smoke.Stub(obj,attr);
};

Screw.Unit(function() {
  before(function() {
    Smoke.reset();
  });

	after(function() {
    Smoke.checkExpectations();
  });
});

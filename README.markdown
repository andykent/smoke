Smoke
=====
Smoke is a JavaScript mocking and stubbing framework. It has a familiar RSpec style interface and whilst it is perfectly capable of being used as a free-standing tool it is currently most useful when used in conjunction with the screw-unit testing framework.

Getting Started (With Screw.Unit)
---------------------------------
See `spec/suite.html` and the test file `screw_integration_spec.js` for lots of real world usage examples.

but you will need to include the Smoke files and you can get straight to work using the mock() and spec() methods...

	foo = {bar: function(attribute){return 'hello'}, baz:'goodbye'};
	stub(foo, 'baz').and_return('hi!');
	myMock = mock('test');
	myMock.should_receive('foo').at_least('once').and_return('hello');
	expect(foo.baz).to(equal, 'hi!');

Getting Started (Free Standing)
-------------------------------
Include the library files in your document...

	<!-- require smoke -->
	<script src="../lib/smoke.mock.js"></script>
	<script src="../lib/smoke.stub.js"></script>

Create your stubs...

	foo = {bar: function(attribute){return 'hello'}, baz:'goodbye'};
	new Smoke.Stub(foo,'baz').and_return('baz');
	new Smoke.Stub(foo,'bar()').and_return('???');

Create your mocks...

	var myMock = new Smoke.Mock('test');

Create your expectations...

	myMock.should_receive('foo').exactly(3, 'times').and_return('bar');

Check you expectations...

	Smoke.checkExpectations();

Contact
-------
Please send patches, comments or suggestions to andrew.d.kent@gmail.com
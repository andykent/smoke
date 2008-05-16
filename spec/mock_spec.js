Screw.Unit(function() {
	describe("mocking", function() {	
		describe("basics", function() {					
			it("allows stubbing directly on mock objects", function() {
				mockObj = mock().stub('bar()').and_return('bar');
				expect(mockObj.bar()).to(equal, 'bar');
			});
		
			it("should check an exact call count", function() {
				var m = mock()
				m.should_receive('bar').exactly('twice');
				m.bar();
				m.bar();
			});
		
			it("should check a minimum call count", function() {
				var m = mock()
				m.should_receive('bar').at_least('once');
				m.bar();
			});
		
			it("should check a maximum call count", function() {
				var m = mock()
				m.should_receive('bar').at_most(2,'times');
				m.bar();
				m.bar();
			});
		
			it("should allow return values directly from mocks",function() {
				var m = mock()
				m.should_receive('bar').exactly('once').and_return('hello');
				expect(m.bar()).to(equal, 'hello');
			});
		});
	
		describe("with argument conditions", function() {					
			it("should only mock the exact method signature when with_arguments is users", function() {
				mockObj = mock()
				baz = {a:'a dummy obj'}
				mockObj.should_receive('foo').with_arguments('bar',baz).and_return('foobar'); 
				expect(mockObj.foo('bar',baz)).to(equal, 'foobar');
			});
			it("should return undefined if the arguments aren't matched", function() {
				mockObj = mock()
				mockObj.should_receive('foo').with_arguments('bar').and_return('foobar'); 
				expect(mockObj.foo('chicken')).to(equal, undefined);
			});
			it("should allow mocking multiple method signatures with different returns", function() {
				mockObj = mock()
				mockObj.should_receive('foo').with_arguments('bar').and_return('foobar'); 
				mockObj.should_receive('foo').with_arguments('mouse').and_return('cheese');
				expect(mockObj.foo('bar')).to(equal, 'foobar');
				expect(mockObj.foo('mouse')).to(equal, 'cheese');
			});
			it("should allow mocking a method signature with arguments and setting expectations", function() {
				mockObj = mock()
				mockObj.should_receive('foo').with_arguments('bar').exactly('once');
				mockObj.foo('bar')
			});
		});
		
		describe("an existing object", function() {
			before(function() {
				obj = { name: "Andy", shout: function() { return this.name.upperCase(); } }
				mockObj = mock(obj);
			});
			
			it("should leave original properties intact", function() {
				expect(mockObj.name).to(equal,'Andy');
			});
			
			it("should leave original functions intact", function() {
				expect(mockObj.shout).to(equal,'ANDY');
			});
			
			it("should add methods to allow stubbing and mocking on the objects properties");
			
			it("shouldn't break iterators")
		});
		
		describe("an objects prototype", function() {
			it("should allow mocks to be carried through to individual objects");
		});
	});
});
Screw.Unit(function() {
	describe("mocking", function() {	
		describe("basics", function() {					
			it("allows stubbing directly on mock objects", function() {
				mockObj = mock().stub('bar').and_return('baz');
				expect(mockObj.bar()).to(equal, 'baz');
			});
		
			it("should check an exact call count", function() {
				var m = mock()
				m.should_receive('bar').exactly('twice');
				m.bar();
				m.bar();
			});

      it("should fail when an expectation is called too many times", function() {
        var m = mock();
        m.should_receive('bar').exactly('once');  
        m.bar();
        m.bar();
        try {
          Smoke.checkExpectations();
          throw("exception");
        } catch(e) {
          Smoke.reset();
          expect(e).to(equal, 'expected bar() to be called exactly 1 times but it got called 2 times');
        }
      });

      it("should fail when an expectation is set and not called", function() {
        var m = mock();
        m.should_receive('bar').exactly('once');
        try {
          Smoke.checkExpectations();
          throw("exception");
        } catch(e) {
          Smoke.reset();
          expect(e).to(equal, 'expected bar() to be called exactly 1 times but it got called 0 times');
        }
      });
      
			it("should not check arguments when with_arguments is not used", function() {
				var m = mock()
				m.should_receive('bar').exactly('once');
				m.bar(1);
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
			it("should only mock the exact method signature when with_arguments is used", function() {
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
				expect(mockObj.foo('mouse')).to(equal, 'cheese');
				expect(mockObj.foo('bar')).to(equal, 'foobar');
			});
			it("should allow mocking a method signature with arguments and setting expectations", function() {
				mockObj = mock()
				mockObj.should_receive('foo').with_arguments('bar').exactly('once');
				mockObj.foo('bar')
			});
			it("should only mock the exact method signature when with_arguments is used with no arguments", function() {
        mockObj = mock();
        mockObj.should_receive('foo').with_arguments().exactly('once');
        mockObj.foo('should ignore this call');
        mockObj.foo();
			});
		});
		
		describe("added ontop of an existing object", function() {
			before(function() {
				obj = { say: "hello", shout: function() { return this.say.toUpperCase(); } }
				mockObj = mock(obj);
			});
			
			it("should leave original properties intact", function() {
				expect(mockObj.say).to(equal,'hello');
			});
			
			it("should leave original functions intact", function() {
				expect(mockObj.shout()).to(equal,'HELLO');
			});
			
			it("should add methods to allow stubbing and mocking on the objects properties", function() {
				expect(mockObj.should_receive).to_not(equal,undefined);
				expect(mockObj.stub).to_not(equal,undefined);
			});
			
			it("shouldn't break Arrays", function() {
				mockObj = mock([0,1,2,3]);
				expect(mockObj[2]).to(equal,2);
				expect(mockObj.length).to(equal,4);
			});
			
			it("should place expectations on existing methods destructively", function() {
				myMock = mock({ say: "hello", shout: function() { throw "FAIL!" } });
				myMock.should_receive('shout').exactly('once');
				myMock.shout()
			});
		});
		
		describe("anonymous functions", function() {
			before(function() {
				foo = function() { return 'bar' };
				mockObj = mock_function(foo);
			});
      
      it("should leave the original intact", function() {
        expect(foo()).to(equal,'bar');
      });
      
      it("should still execute the mock like the original", function() {
        expect(mockObj()).to(equal,'bar');
      });
      
      it("should still execute the mock like the original with arguments", function() {
        var a = function(x,y,z) { return x+y+z };
        aMock = mock_function(a)
        expect(aMock('a','b','c')).to(equal,'abc');
      });
      
      it("should allow expectations to be set as usual", function() {
        mockObj.should_receive('baz').exactly('once').and_return(1);
        mockObj.baz()
      });

      it("should allow expectations to be set on invocations of itself", function() {
        mockObj.should_be_invoked();
        mockObj();
      });
      
      it("should allow expectation rules to be set", function() {
        mockObj.should_be_invoked().exactly('twice').with_arguments('a');
        mockObj('a');
        mockObj('a');
      });
      
      it("allows passing in a name for the function as a second argument to make error messages clearer", function() {
        mock_function(foo, 'foo').should_be_invoked().exactly('once');
        try {
          Smoke.checkExpectations();
          throw("exception");
        } catch(e) {
          Smoke.reset();
          expect(e).to(equal, 'expected foo() to be called exactly 1 times but it got called 0 times');
        }
      });
		});
		
		describe("when array has been monkey-patched by js library not to be named here (grrr)", function() {
      before(function() {
        Array.prototype.remove = function() {
          alert('I like monkeys!');
        }
      });
      it("should not throw a type error when checking expectations", function() {
				var m = mock()
				m.should_receive('bar').at_least('once');
				m.bar();
				try {
				  Smoke.checkExpectations();
				} catch(e) {
  				/* Make sure we clean up to not break the rest of the tests */
  				delete(Array.prototype.remove);
				  throw e;
				}
		  });
		  after(function() {
	      delete(Array.prototype.remove);
		  });		  
		});
		
		describe("an objects prototype", function() {
			it("should allow mocks to be carried through to individual objects", function() {
				Aobj = function() {};
				Aobj.prototype = { aFunction: function() {return 'prototype function'} };
				mock(Aobj.prototype).should_receive('aFunction').exactly('twice');
				(new Aobj()).aFunction();
				(new Aobj()).aFunction();
			});
		});
	});
});
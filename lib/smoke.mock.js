// Overide these functions for custom pass/fail behaviours
Smoke.passed = function(mock){
	Smoke.passCount++;
};

Smoke.failed = function(mock, message){
	Smoke.failCount++;
	throw(message);
};

// Some helpers
Smoke.reset = function(){
	Smoke.mocks = [];
	Smoke.passCount = 0;
	Smoke.failCount = 0;
};
Smoke.reset();

Smoke.checkExpectations = function(){
	for(var i=0; i<Smoke.mocks.length; i++) Smoke.mocks[i].checkExpectations();
};

// Don't play beyond here unless you know what you're doing
Smoke.Mock = function(originalObj) {
	var obj = originalObj || {} ;
	obj._expectations = {};
	obj.stub = function(attr){
		return new Smoke.Stub(this, attr);
	};
	
	obj.should_receive = function(attr){
		var expectation = new Smoke.Mock.Expectation(this, attr);
		if(this._expectations[attr]==undefined) this._expectations[attr] = [];
		this._expectations[attr].push(expectation);
		var previousFunction = this[attr];
		var mock = this;
		if(this._expectations[attr].length>1) return expectation;
		this[attr] = function() {
		  var ret = undefined;
		  for(var i=0; i<mock._expectations[attr].length; i++) {
		    var expectation = mock._expectations[attr][i];
			  var ran = expectation.run(arguments);
			  if(ran && expectation.hasReturnValue) ret = expectation.returnValue;
		  };
			return ret;
		};
		return expectation;
	};

	obj.checkExpectations = function(){
		for(var e in this._expectations) {
			var expectations = this._expectations[e]
			for(var i=0; i < expectations.length; i++) expectations[i].check();
		};
	};
	
	Smoke.mocks.push(obj);
	return obj;
};

Smoke.MockFunction = function(originalFunction, name) {
  var name = name || 'anonymous_function';
  var originalFunction = originalFunction || function() {};
  var scope = function() { return scope.mockFunction.apply(this,arguments) };
  scope[name] = originalFunction;
  scope.mockFunction = function() { return scope[name].apply(this,arguments); };
  var mock = Smoke.Mock(scope);
  mock.should_be_invoked = function() { return mock.should_receive(name) };
  return mock;
};

Smoke.Mock.Expectation = function(mock, attr) {
	this._mock = mock;
	this._attr = attr;
	this.callCount = 0;
	this.returnValue = undefined;
	this.callerArgs = undefined;
	this.hasReturnValue = false;
};

Smoke.Mock.Expectation.prototype = {
	exactly: function(count,type){
		// type isn't used for now, it's just syntax ;)
		this.minCount = this.maxCount = undefined;
		this.exactCount = this.parseCount(count);
		return this;
	},
	at_most: function(count,type){
		this.maxCount = this.parseCount(count);
		return this;
	},
	at_least: function(count,type){
		this.minCount = this.parseCount(count);
		return this;
	},
	with_arguments: function(){
		this.callerArgs = arguments;
		return this
	},
	run: function(args){
		if(typeof(this.callerArgs) == 'undefined' || this.compareArrays(args, this.callerArgs)) {
			this.callCount+=1;
			return true;
		};
		return false
	},
	and_return: function(v){
	  this.hasReturnValue = true;
		this.returnValue = v;
	},
	check: function(){
		if(this.exactCount!=undefined) this.checkExactCount();
		if(this.minCount!=undefined) this.checkMinCount();
		if(this.maxCount!=undefined) this.checkMaxCount();
	},
	checkExactCount: function(){
		if(this.exactCount==this.callCount) Smoke.passed(this)//console.log('Mock passed!')
		else Smoke.failed(this, 'expected '+this.methodSignature()+' to be called exactly '+this.exactCount+" times but it got called "+this.callCount+' times');
	},
	checkMinCount: function(){
		if(this.minCount<=this.callCount) Smoke.passed(this);
		else Smoke.failed(this, 'expected '+this.methodSignature()+' to be called at least '+this.minCount+" times but it only got called "+this.callCount+' times');
	},
	checkMaxCount: function(){
		if(this.maxCount>=this.callCount) Smoke.passed(this);//console.log('Mock passed!')
		else Smoke.failed(this, 'expected '+this.methodSignature()+' to be called at most '+this.maxCount+" times but it actually got called "+this.callCount+' times');
	},
	methodSignature: function(){
		var a = '';
		var args = this.callerArgs || [];
		for(var i=0; i<args.length; i++) a += Smoke.print(args[i])+', ';
		a =a.slice(0,-2);
		return this._attr+'('+a+')'
	},
	parseCount: function(c){
		switch(c){
			case 'once'		: c=1; 	break;
			case 'twice'	: c=2; 	break;
		}
		return c;
	},
	compareArrays: function(a,b) {
	    if (a.length != b.length) return false;
	    for (var i = 0; i < b.length; i++) {
	        if (a[i].compare) { 
	            if (!a[i].compare(b[i])) return false;
	        }
	        if (a[i] !== b[i]) return false;
	    }
	    return true;
	}
};

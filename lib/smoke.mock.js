Smoke = {
	mocks: [],
	passCount: 0,
	failCount: 0,
	print: function(v) {
		// use the jquery print plugin if ti is available or fall back to toString();
		return (jQuery && jQuery.print) ? $.print(v) : v.toString();
	},
	checkExpectations: function(){
		for(var i=0; i<Smoke.mocks.length; i++) Smoke.mocks[i].checkExpectations();
	},
	reset: function(){
		Smoke.mocks = [];
		passCount = 0;
		failCount = 0;
	},
	passed: function(mock){
		Smoke.passCount += 0;
	},
	failed: function(mock, message){
		Smoke.failCount += 1;
		throw(message);
	}
};

Smoke.Mock = function(originalObj) {
	this._obj = originalObj || {} ;
	this._expectations = {};
	var mock = this; // closure var
	Smoke.mocks.push(mock)
};

Smoke.Mock.prototype = {
	stub: function(attr){
		return new Smoke.Stub(this, attr);
	},
	should_receive: function(attr){
		var expectation = new Smoke.Mock.Expectation(this, attr);
		if(this._expectations[attr]==undefined) this._expectations[attr] = [];
		this._expectations[attr].push(expectation);
		var e = this._expectations[attr]; // closure var
		this[attr] = function() {
			for(var i in e) {
				var result = e[i].run(arguments);
				if(result!=undefined) return result; 
			}
		};
		return expectation;
	},
	checkExpectations: function(){
		for(var e in this._expectations) {
			var expectations = this._expectations[e]
			for(var i in expectations) expectations[i].check();
		};
	},
};

Smoke.Mock.Expectation = function(mock, attr) {
	this._mock = mock;
	this._attr = attr;
	this.callCount = 0;
	this.returnValue = undefined;
	this.callerArgs = [];
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
		if(this.compareArrays(args, this.callerArgs)) {
			this.callCount+=1;
			return this.returnValue;
		};
	},
	and_return: function(v){
		this.returnValue = v
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
		var args = this.callerArgs;
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

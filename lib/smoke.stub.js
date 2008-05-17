Smoke.Stub = function(obj,attr) {
	this.obj = obj;
	this.attribute = attr;
	this.and_return(this.defaultReturn);
};

Smoke.Stub.prototype = {
	defaultReturn: null, 
	fnBracketMatch: /\(\)$/,
	property: function(p){
		this.property = p;
		this.and_return(this.defaultReturn);
		return this
	},
	method: function(f){
		this.func = f;
		this.and_return(this.defaultReturn);
		return this
	},
	and_return: function(v){
		if(Smoke.isFunction(this.obj[this.attribute])) this.and_return_as_function(v); 
		else this.and_return_as_property(v);
		return this.obj
	},
	and_return_as_property: function(v){
		this.obj[this.attribute] = v;
		return this.obj
	},
	and_return_as_function: function(v){
		this.obj[this.attribute] = function() {
			return v
		};
		return this.obj
	}
};
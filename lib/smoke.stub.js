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
		if(this.attribute.search(this.fnBracketMatch)>0) this.stubFunction(v); 
		else this.stubProperty(v);
		return this.obj
	},
	stubProperty: function(v){
		this.obj[this.attribute] = v;
	},
	stubFunction: function(v){
		this.obj[this.attribute.replace(this.fnBracketMatch,'')] = function() {
			return v
		};
	}
};
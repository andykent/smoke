Smoke = {
	print: function(v) {
		// use the jquery print plugin if it is available or fall back to toString();
		return (jQuery && jQuery.print) ? $.print(v) : v.toString();
	}
};
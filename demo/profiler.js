
function Profiler() {
	this.entries = [];
}

Profiler.prototype.begin = function (eventName) {
	this.entries[eventName] = {
		begin: getNow(),
		end: -1
	};
}

Profiler.prototype.end = function (eventName) {
	this.entries[eventName].end = getNow();
	this.entries[eventName].diff = this.entries[eventName].end - this.entries[eventName].begin;
}

Profiler.prototype.getTimes = function () {
	var list = [];
	
	for (var key in this.entries) {
		if (this.entries.hasOwnProperty(key)) {
			list[key] =  this.entries[key].diff;
		}
	}
	

	return list;
}


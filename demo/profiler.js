/* 
 * A simple profiler module.
 *
 * Usage example:
 *
 * 		Profiler.begin("render");
 * 		renderScene();
 * 		Profiler.end("render");
 * 		console.log(Profiler.getTimes());
 *
 */

var Profiler = (function () {
	// http://dvolvr.davidwaterston.com/2012/06/24/javascript-accurate-timing-is-almost-here/
	var getNow = (function() {

		// Returns the number of milliseconds elapsed since either the browser navigationStart event or
		// the UNIX epoch, depending on availability.
		// Where the browser supports 'performance' we use that as it is more accurate (microsoeconds
		// will be returned in the fractional part) and more reliable as it does not rely on the system time.
		// Where 'performance' is not available, we will fall back to Date().getTime().

		var performance = window.performance || {};

		performance.now = (function() {
			return performance.now    ||
			performance.webkitNow     ||
			performance.msNow         ||
			performance.oNow          ||
			performance.mozNow        ||
			function() { return new Date().getTime(); };
		})();

		return performance.now();

	});  


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

	return Profiler;
})();

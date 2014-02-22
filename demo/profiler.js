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

var Profiler = (function (utils) {
	// http://dvolvr.davidwaterston.com/2012/06/24/javascript-accurate-timing-is-almost-here/


	function Profiler() {
		this.entries = [];
	}

	Profiler.prototype.begin = function (eventName) {
		this.entries[eventName] = {
			begin: utils.getNow(),
			end: -1
		};
	}

	Profiler.prototype.end = function (eventName) {
		this.entries[eventName].end = utils.getNow();
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
})(Utils);


var Utils = (function ($){
    var utils = {};

    /* 
     * func(key, val, list)
     * */
    var mapmap = function (list, func) {
        var obj = {};

		for (var key in list) {
			if (!list.hasOwnProperty(key)) 
				continue;

            obj[key] = func(key, list[key], list);
		}

        return obj;
    }

    utils.mapmap = mapmap;

    return utils;
})($);

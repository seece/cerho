/*
 * The assets module stores all shaders and images. 
 * Shaders and other text based assets are stored in Assets.store.
 * Images are stored in their own object in Assets.images.
 *
 * Load assets with
 * 		Assets.queue("something.shader");
 * 		Assets.queueImage("art.jpg");
 * 		Assets.loadAll(success_callback, error_callback);
 *
 * After the success_callback has been called you can access the
 * loaded content using the objects defined above with the file
 * url as key.
 *
 * 		Assets.store["something.shader"];
 * 		Assets.images["art.jpg"];
 */

var Assets = (function ($){
	var obj = {};
	var promises = [];

    obj.audio = {};
	obj.store = {};
	obj.images = {};
	obj.fragmentshaders = {};
	obj.vertexshaders = {};

	obj.loadAll = function(callback, onerror) {
		$.when.apply($, promises).done(
			callback
			).fail(function(filename) {
				console.log("Failed to load file: ", filename);	
				onerror(filename);
			});
	}

	obj.queueImage = function(path) {
		var def = $.Deferred();

		(function(url, deferred) {
			var img = new Image();

			img.onload = function() {
				if (img.width === 0 && img.height === 0) {
					deferred.reject(url);
					return;
				}

				console.log("Loaded image ", img);

				deferred.resolve(url);
			};

			img.onerror = function() {
                console.log("Couldn't load image ", url);
				deferred.reject(url);
			};

			img.src = url;

			obj.images[url] = img;
		})(path, def);

		promises.push(def);
        console.log("Queued image ", path);
	}

	var queueAsset = function(path, map) {
		var promise = $.get(path, null, function(data, status, jqXHR) {
			map[path] = data;
			console.log("Loaded asset ", path);
		}); 

		promises.push(promise);
	}

    obj.queueAudio = function(path, statusCallback) {
        var def = $.Deferred();

        (function (url, deferred) {
            var track = new Audio(path);
            console.log("Queued audio: ", path, track);

            /* Called manually from _statusUpdater() when the
             * download has finished. */
            track.onload = function() {
                console.log("Loaded audio");
                deferred.resolve();
            };

            track.onerror = function() {
                console.log("Couldn't load audio");
                deferred.reject(url);
            };

            track._statusUpdater = function() {
                // Check buffering only when we have a proper TimeRanges object
                if (track.buffered.length > 0) {
                    var rangeId = track.buffered.length - 1;
                    var bufferedLength = track.buffered.end(rangeId);

                    if (statusCallback && typeof(statusCallback) == typeof(Function)) {
                        statusCallback(bufferedLength, track.duration);
                    }

                    if (track.duration - bufferedLength - 0.01 <= 0.0) {
                        track.onload();
                        return;
                    }
                }

                obj.audio[url] = track;
                setTimeout(track._statusUpdater, 500);
            };

            track._statusUpdater(track);
        })(path, def);

        promises.push(def);
    }

	obj.queue = function(path) {
		queueAsset(path, obj.store);
	}

	obj.queueFragmentShader = function (path) {
		queueAsset(path, obj.fragmentshaders);
	}
	
	obj.queueVertexShader = function (path) {
		queueAsset(path, obj.vertexshaders);
	}

	return obj;
})($); // pass in the jquery object to minimize global dependencies



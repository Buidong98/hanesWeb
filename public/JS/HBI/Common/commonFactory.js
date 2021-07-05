var PostDataAjax = function (url, data, callBack, timeout) {
	var tokenString = "";
	var uuid = "";
	var storeID = 0;

	$.ajax({
		url: url,
		type: "POST",
		headers: {
			"Token-String": tokenString,
			"Device-UUID": uuid,
		},

		cache: true,
		dataType: "json",
		data: data,
		processData: true,
		beforeSend: function () { },
		async: true,
		tryCount: 0,
		retryLimit: 3,

		success: function (response) {
			if (response) {
				setTimeout(function () {
					callBack(response);
				}, 10);
			} else {
				setTimeout(callBack, 10);
			}
		},

		error: function (error) {
			LoadingHide();
			// toastr.error(error.statusText);
		}
	});
};

var GetDataAjax = function (url, callBack, timeout) {
	var tokenString = "";
	var uuid = "";
	var storeID = 0;

	$.ajax({
		url: url,
		type: "GET",
		headers: {
			"Token-String": tokenString,
			"Device-UUID": uuid,
		},

		cache: true,
		dataType: "json",
		processData: true,
		beforeSend: function () { },
		async: true,
		tryCount: 0,
		retryLimit: 3,

		success: function (response) {
			if (response) {
				setTimeout(function () {
					callBack(response);
				}, 10);
			} else {
				setTimeout(callBack, 10);
			}
		},

		error: function (error) {
			LoadingHide();
			// toastr.error(error.statusText);
		}
	});
};

////////////////////////////////////////////////////////////////////////////////

(function (window, undefined) {
	'$:nomunge'; // Used by YUI compressor.

	var $ = window.jQuery || window.Cowboy || (window.Cowboy = {}),

		jq_throttle;

	$.throttle = jq_throttle = function (delay, no_trailing, callback, debounce_mode) {
		var timeout_id,

			last_exec = 0;

		if (typeof no_trailing !== 'boolean') {
			debounce_mode = callback;
			callback = no_trailing;
			no_trailing = undefined;
		}

		function wrapper() {
			var that = this,
				elapsed = +new Date() - last_exec,
				args = arguments;

			function exec() {
				last_exec = +new Date();
				callback.apply(that, args);
			};

			function clear() {
				timeout_id = undefined;
			};

			if (debounce_mode && !timeout_id) {
				exec();
			}

			timeout_id && clearTimeout(timeout_id);

			if (debounce_mode === undefined && elapsed > delay) {
				exec();

			} else if (no_trailing !== true) {

				timeout_id = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay);
			}
		};

		if ($.guid) {
			wrapper.guid = callback.guid = callback.guid || $.guid++;
		}

		return wrapper;
	};

	$.debounce = function (delay, at_begin, callback) {
		return callback === undefined
			? jq_throttle(delay, at_begin, false)
			: jq_throttle(delay, callback, at_begin !== false);
	};

})(this);

////////////////////////////////////////////////////////////////////

function LoadingShow() {
	$('.full-overlay').css({ 'z-index': 1000000, 'opacity': .5 });
	$('#mainLoadingSVG').show();
}

function LoadingHide() {
	$('.full-overlay').css({ 'z-index': -1, 'opacity': 0 });
	$('#mainLoadingSVG').hide();
}

function CheckNullOrEmpty(input, strError) {
	if (input === undefined || input.val() == null || input.val().trim() === "" || input.val().trim() == "") {
		toastr.error(strError);
		input.focus();
		return false;
	}
	return true;
}

function GetTodayDate() {
	let date = new Date().toLocaleDateString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	return date.replaceAll("/", "_")
}

// Init time
var now = new Date();
var firstDay = new Date();
var lastDay = new Date();
var currentDay = now.getDay();

// Sunday - Saturday : 0 - 6
//This week
firstDay.setDate(now.getDate() - currentDay);
lastDay.setDate(firstDay.getDate() + 6);
var thisWeek = firstDay.getDate().toString().padStart(2, "0") + '/' + (firstDay.getMonth() + 1).toString().padStart(2, "0") + '/' + firstDay.getFullYear() + ';' + lastDay.getDate().toString().padStart(2, "0") + '/' + (lastDay.getMonth() + 1).toString().padStart(2, "0") + '/' + lastDay.getFullYear();

//Last week
firstDay.setDate(firstDay.getDate() - 7);
lastDay.setDate(lastDay.getDate() - 7);
var lastWeek = firstDay.getDate().toString().padStart(2, "0") + '/' + (firstDay.getMonth() + 1).toString().padStart(2, "0") + '/' + firstDay.getFullYear() + ';' + lastDay.getDate().toString().padStart(2, "0") + '/' + (lastDay.getMonth() + 1).toString().padStart(2, "0") + '/' + lastDay.getFullYear();

//This month
var dayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
lastDay = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
var thisMonth = firstDay.getDate().toString().padStart(2, "0") + '/' + (firstDay.getMonth() + 1).toString().padStart(2, "0") + '/' + firstDay.getFullYear() + ';' + lastDay.getDate().toString().padStart(2, "0") + '/' + (lastDay.getMonth() + 1).toString().padStart(2, "0") + '/' + lastDay.getFullYear();

//Last month
lastDay.setDate(firstDay.getDate() - 1);
firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth(), 1);
var lastMonth = firstDay.getDate().toString().padStart(2, "0") + '/' + (firstDay.getMonth() + 1).toString().padStart(2, "0") + '/' + firstDay.getFullYear() + ';' + lastDay.getDate().toString().padStart(2, "0") + '/' + (lastDay.getMonth() + 1).toString().padStart(2, "0") + '/' + lastDay.getFullYear();

var Timepickers = [
    { id: 1, value: thisWeek, text: 'Tuần này' },
    { id: 2, value: lastWeek, text: 'Tuần trước' },
    { id: 3, value: thisMonth, text: 'Tháng này' },
    { id: 4, value: lastMonth, text: 'Tháng trước' },
    { id: 5, value: '5', text: 'Tùy chọn' }
]

//End init time
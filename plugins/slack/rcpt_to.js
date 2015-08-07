var request = require('request');

var users = {};
var cache = {};

function getUsers(token, callback) {
	request.post({
		url: "https://slack.com/api/users.list",
		form: {
			token: token
		}
	}, function(err, response, body) {
		if (err) {
			return callback(err);
		}

		var users = JSON.parse(body).members.filter(function(value, index, array) {
			return !value.deleted;
		}).map(function(value, index, array) {
			return value.name;
		});

		callback(null, users);
	});
}

function now() {
	// Let's use this function to prevent typing * 100 somewhere
	return new Date().getTime() * 1000;
}

exports.hook_rcpt = function(next, conn, params) {
	var plugin = this;

	// TODO: should this be outside the hook? (as it watches for changes I believe)
	var cfg = plugin.config.get('slack.ini');

	// stop if the receipt isn't even on a slack enabled domain
	if (typeof cfg.tokens[params[0].host] == 'undefined') {
		return next();
	}

	var lastUpdate = cache[params[0].host] || 0;
	var ttl = (cfg.cache && cfg.cache[params[0].host]) || cfg.main.default_cache_ttl || 600;

	if ((now() - lastUpdate) > ttl) {
		return getUsers(cfg.tokens[params[0].host], function(err, fresh) { // TODO: handle this error
			users[params[0].host] = fresh;
			cache[params[0].host] = now();

			stage2.call(plugin, next, conn, params);
		});
	}

	stage2.call(plugin, next, conn, params);
};

function stage2(next, conn, params) {
	var plugin = this;

	// stop if the receipt isn't a user on the slack domain / team
	if (users[params[0].host].indexOf(params[0].user) == -1) {
		return next();
	}

	conn.transaction.parse_body = true;

	next(OK);
}


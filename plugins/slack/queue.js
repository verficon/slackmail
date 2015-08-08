var request = require('request');

exports.register = function() {
	var plugin = this;

	plugin.load_slack_ini();
};

exports.load_slack_ini = function() {
	var plugin = this;

	plugin.cfg = plugin.config.get('slack.ini', function() {
		plugin.load_slack_ini();
	});
};

exports.hook_queue = function(next, conn) {
	var plugin = this;

	// TODO: How do we handle grouped receipts, e.g. slackuser@host and postmaster@host?

	request.post({
		url: "https://slack.com/api/chat.postMessage",
		form: {
			token: plugin.cfg.tokens[conn.transaction.rcpt_to[0].host],
			channel: '@' + conn.transaction.rcpt_to[0].user,
			username: conn.transaction.mail_from.address(),
			icon_emoji: ":envelope:",
			attachments: JSON.stringify([{
				fallback: conn.transaction.header.get('subject'),

				author_name: conn.transaction.mail_from.address(),
				title: "Subject: " + conn.transaction.header.get('subject'),

				text: conn.transaction.body.bodytext
			}])
		}
	}, function(err, response, body) {
		plugin.logdebug(body);
	});

	next(OK);
};


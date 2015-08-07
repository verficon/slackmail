var request = require('request');

exports.hook_queue = function(next, conn) {
	var plugin = this;

	// TODO: should this be outside the hook? (as it watches for changes I believe)
	var cfg = plugin.config.get('slack.ini');

	// TODO: How do we handle grouped receipts, e.g. slackuser@host and postmaster@host?

	request.post({
		url: "https://slack.com/api/chat.postMessage",
		form: {
			token: cfg.tokens[conn.transaction.rcpt_to[0].host],
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


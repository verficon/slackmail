Slackmail: e-mail integration using Haraka
------------------------------------------

Leverage team communication service Slack to get those pesky e-mails read by your employees.

Our employees kept losing their e-mail logins, could not get their e-mail configured properly and some simply didn't even know any MUA for desktop...

### Setting up / configuring

In your Harika directory install ```request```, which is a HTTP request library we depend on to save us headache:

```
npm install request
```

Then copy the ```plugins/slack``` folder in this Git repository into your Haraka ```plugins``` folder.

*Don't forget to add the plugin to your config/plugins or it won't run!*

Either copy the ```config/slack.ini``` file or create your own and fill it with:

```ini
cache_default_ttl=600 # seconds

[tokens]
# Slack API tokens
youremaildomain.com=xoxb-XXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX

[cache]
# seconds before the list of slack users is retrieved again
youremaildomain.com=1200
```

### License

Slackmail has been licensed under the MIT license. Please consult the LICENSE file for details.


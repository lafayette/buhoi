const totlog = require('totlog')

module.exports = { initialize, terminate }

function initialize () {
  const { BUHOI_SLACK, BUHOI_TELEGRAM, BUHOI_MATTERMOST, BUHOI_LOGSTASH } = process.env

  if (BUHOI_SLACK) {
    const [token, channel, icon] = BUHOI_SLACK.split(';')
    const slack = totlog.appenders.slack({ token, channel, icon })
    totlog.on('message', m => {
      if (m.level === 'error') {
        slack(m)
      }
    })
  }

  if (BUHOI_TELEGRAM) {
    const [botToken, chatId] = BUHOI_TELEGRAM.split(';')
    const telegram = totlog.appenders.telegram({ botToken, chatId })
    totlog.on('message', m => {
      if (m.level === 'error') {
        telegram(m)
      }
    })
  }

  if (BUHOI_MATTERMOST) {
    const [url, channel, username, icon] = BUHOI_MATTERMOST.split(';')
    const mattermost = totlog.appenders.mattermost({
      url,
      channel: channel || undefined,
      username: username || undefined,
      icon: icon || undefined,
    })
    totlog.on('message', m => {
      if (m.level === 'error') {
        mattermost(m)
      }
    })
  }

  if (BUHOI_LOGSTASH) {
    const logstash = totlog.appenders.logstash({ url: BUHOI_LOGSTASH })
    totlog.on('message', logstash)
  }

  return totlog
}

function terminate (log) {
}

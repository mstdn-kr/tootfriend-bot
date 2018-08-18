const dotenv = require('dotenv');
const Mastodon = require('mastodon-api');

dotenv.config();

const m = new Mastodon({
    access_token: process.env.ACCESS_TOKEN,
    api_url: process.env.API_URL
});

const notice = m.stream('streaming/user');

notice.on('message', (msg) => {
    if(msg.event === 'notification' && msg.data.type === 'follow') {
        m.post('follows', {uri: msg.data.account.acct});
    }
});
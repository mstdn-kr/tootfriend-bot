const dotenv = require('dotenv');
const Mastodon = require('mastodon-api');
const limit = require('./check-limit');

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

const tag = m.stream('streaming/hashtag', {tag: '툿친소'});

tag.on('message', async(msg) => {
    console.log(msg);
    if(msg.event === 'update' && !msg.data.in_reply_to_id && !msg.data.reblog) {
        if(await limit.check(msg.data.account.acct)) {
            await m.post(`statuses/${msg.data.id}/reblog`, {});
            limit.set(msg.data.account.acct);
        }
    }
});

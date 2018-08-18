const fs = require('fs');
const path = require('path');
const ms = require('ms');

const dayLimit = ms(process.env.DAY_LIMIT || '1d');

fs.existsSync(path.resolve(__dirname, 'data')) || fs.mkdirSync(path.resolve(__dirname, 'data'));

module.exports = {
    check(acct) {
        return new Promise((success) => {
            fs.readFile(path.resolve(__dirname, 'data', acct), (err, content) => {
                if(err) {
                    return success(true);
                }
                if(Date.now() - Number(content) >= dayLimit) {
                    return success(true);
                }
                else {
                    return success(false);
                }
            });
        });
    },
    set(acct) {
        return new Promise((success, fail) => {
            fs.writeFile(path.resolve(__dirname, 'data', acct), Date.now().toString(), (err) => {
                if(!err) {
                    success();
                }
                else {
                    fail(err);
                }
            });
        });
    }
};
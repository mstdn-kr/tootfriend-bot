const fs = require('fs');
const path = require('path');
const ms = require('ms');

const dayLimit = ms(process.env.DAY_LIMIT || '1d');
let m;

fs.existsSync(path.resolve(__dirname, 'data')) || fs.mkdirSync(path.resolve(__dirname, 'data'));

module.exports = {
    init(mstdn) {
        m = mstdn;
    },
    check(acct, id) {
        return new Promise((success) => {
            fs.readFile(path.resolve(__dirname, 'data', acct), (err, content) => {
                if(err || Date.now() - Number(content) >= dayLimit) {
                    if(acct.indexOf('@') !== -1) {
                        m.get('accounts/relationships', {id}).then((rel) => {
                            if(rel.data[0].following) {
                                success(true);
                            }
                            else {}
                            success(false);
                        });
                    }
                    else {
                        success(true);
                    }
                }
                else {
                    success(false);
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

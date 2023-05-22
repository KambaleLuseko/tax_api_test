const AccountService = require("../accounts/account.service");

async function checkAccountStatus(accountUUID) {
    if (!accountUUID) {
        return false
    }
    let closing = await AccountService.checkAccount(accountUUID);
    if (closing.toString() == 'true' || closing == true) {
        return true
    }
    return false;
}

module.exports = checkAccountStatus
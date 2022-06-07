module.exports = async (msg, state, yes, no, type) => {
    if (type == 'INTERACTION') {
        if (state) msg.deffered ? msg.editReply(yes) : msg.reply(yes);
        else msg.deffered ? msg.editReply(no) : msg.reply(no)
    } else if (type == 'MESSAGE') {
        if (state) msg.edit(yes); else msg.edit(no);
    }
}
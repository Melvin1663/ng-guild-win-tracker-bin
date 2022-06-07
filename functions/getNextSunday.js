module.exports = (today) => {
    let date = today ? today : new Date()
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()+7);
}
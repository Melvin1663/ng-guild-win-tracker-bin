module.exports = (month, year) => {
    if (!month) month = new Date().getMonth();
    if (!year) year = new Date().getFullYear();
    let d = new Date(year, month, 1);
    let getTot = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let sun = [];

    for (let i = 1; i <= getTot; i++) {
        let newDate = new Date(d.getFullYear(), d.getMonth(), i)
        if (newDate.getDay() == 0) sun.push(i);
    }
    return sun;
};
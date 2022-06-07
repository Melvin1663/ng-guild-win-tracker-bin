const config = require('../schemas/config');

module.exports = async (client) => {
    const data = await config.findOne({ guild: 'cosmic' }).catch(e => console.log(`Error when fetching config: ${e}`));
    if (!data) return console.log('Error: Something went wrong when fetching config data');
    let sunday = data.nextSundayMS;
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (Date.now() > sunday) {
        console.log('Fetching and posting data...')
        let res = await require('../util/fetch')(client);
        let nS1 = new Date(Date.now() + 604800000)
        let nS2 = new Date(`${month[nS1.getMonth()]} ${nS1.getDate()}, ${nS1.getFullYear()}`)
        if (res != 0) {
            console.log(`Something went wrong when ${res == 1 ? 'Fetching' : 'Posting'} data. Retrying in 1 hour`);
            await config.findOneAndUpdate({ retry: true });
            setInterval(async () => {
                let status = await config.findOne({ guild: 'cosmic' }).catch(e => console.log(`Error while attempting to retry fetch/post operation: ${e}`));
                if (status?.retry != true) return;
                let sRes = await require('../util/fetch')(client);
                if (!sRes || sRes != 0) return;
                await config.findOneAndUpdate({
                    retry: false,
                    nextSundayMS: nS2.getTime(),
                    nextSunday: `${month[nS1.getMonth()]} ${nS1.getDate()}, ${nS1.getFullYear()}`
                });
                console.log('Successfully fetched and posted guild data')
                require('./log')(client)
            }, 3600000)
        }
        await config.findOneAndUpdate({
            retry: false,
            nextSundayMS: nS2.getTime() + 1,
            nextSunday: `${month[nS1.getMonth()]} ${nS1.getDate()}, ${nS1.getFullYear()}`
        });
        console.log('Successfully fetched and posted guild data')
        require('./log')(client)
    } else {
        console.log(`Time left to fetch: ${sunday - Date.now()}ms`)
        setTimeout(async () => {
            console.log('Fetching and posting data...')
            let res = await require('../util/fetch')(client);
            let nS1 = new Date(Date.now() + 604800000)
            let nS2 = new Date(`${month[nS1.getMonth()]} ${nS1.getDate()}, ${nS1.getFullYear()}`)
            if (res != 0) {
                console.log(`Something went wrong when ${res == 1 ? 'Fetching' : 'Posting'} data. Retrying in 1 hour`);
                await config.findOneAndUpdate({ retry: true });
                setInterval(async () => {
                    let status = await config.findOne({ guild: 'cosmic' }).catch(e => console.log(`Error while attempting to retry fetch/post operation: ${e}`));
                    if (status?.retry != true) return;
                    let sRes = await require('../util/fetch')(client);
                    if (!sRes || sRes != 0) return;
                    await config.findOneAndUpdate({
                        retry: false,
                        nextSundayMS: nS2.getTime(),
                        nextSunday: `${month[nS1.getMonth()]} ${nS1.getDate()}, ${nS1.getFullYear()}`
                    });
                    console.log('Successfully fetched and posted guild data')
                    require('./log')(client)
                }, 3600000)
            }
            await config.findOneAndUpdate({
                retry: false,
                nextSundayMS: nS2.getTime() + 1,
                nextSunday: `${month[nS1.getMonth()]} ${nS1.getDate()}, ${nS1.getFullYear()}`
            });
            console.log('Successfully fetched and posted guild data')
            require('./log')(client)
        }, sunday - Date.now())
    }
}
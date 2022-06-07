const get = require('node-fetch2');
const tiny = require('tiny-json-http');
const dataSchema = require('../schemas/data_weeks');

module.exports = async (client) => {
    let players = {};
    let guild = await get('https://api.ngmc.co/v1/guilds/cosmic?expand=true&withStats=true', { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
    // let t = new Date(Date.now() - 604800000)
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		let t = await dataSchema.find().sort({_id:1});
		t = new Date(t[t.length-1].localeDate);
    let lastWeekData = await dataSchema.findOne({ localeDate: `${month[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}` })
    if (!lastWeekData) console.log('No Last Week Data found.')
    if (guild?.status != 200) return 1;
    guild = await guild.json();
    let res = guild.members.concat(guild.officers);
		res.push(guild.leader);
		res = {body:res};
    if (!res || !res.body) return 1;
    let values = [
        "totalWins",
        "totalKills",
        "totalDeaths",
        "wins",
        "kills",
        "deaths",
        "gxp"
    ]
    let total = {
        totalWins: 0,
        totalKills: 0,
        totalDeaths: 0,
        totalCredits: 0,
        totalLosses: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        gxp: 0,
        credits: 0,
        losses: 0,
        bw: {},
        sw: {},
        tb: {},
        cq: {},
    }
    values.forEach(v => {
        total.bw[v] = 0;
        total.sw[v] = 0;
        total.tb[v] = 0;
        total.cq[v] = 0;
    })
    res.body.forEach(player => {
        let lwStats;
        if (lastWeekData && lastWeekData.data && lastWeekData.data[player.name]) lwStats = lastWeekData?.data[player.name]
        if (!lwStats) {
            lwStats = {
                totalWins: player?.wins,
                totalKills: player?.kills,
                totalDeaths: player?.deaths,
                totalCredits: player?.statusCredits,
                totalLosses: player?.losses,
                wins: 0,
                kills: 0,
                deaths: 0,
                gxp: 0,
                credits: 0,
                losses: 0,
                bw: {},
                sw: {},
                tb: {},
                cq: {}
            }
            values.forEach(v => {
                switch (v) {
                    case 'totalWins': {
                        lwStats.bw[v] = player.extra?.bwWins;
                        lwStats.sw[v] = player.extra?.swKWins;
                        lwStats.tb[v] = player.extra?.tbWins;
                        lwStats.cq[v] = player.extra?.cqWins;
                    }; break;
                    case 'totalKills': {
                        lwStats.bw[v] = player.extra?.bwKills;
                        lwStats.sw[v] = player.extra?.swKKills;
                        lwStats.tb[v] = player.extra?.tbKills;
                        lwStats.cq[v] = player.extra?.cqKills;
                    }; break;
                    case 'totalDeaths': {
                        lwStats.bw[v] = player.extra?.bwDeaths;
                        lwStats.sw[v] = player.extra?.swDeaths;
                        lwStats.tb[v] = player.extra?.tbDeaths;
                        lwStats.cq[v] = player.extra?.cqDeaths;
                    }; break;
                    default: {
                        lwStats.bw[v] = 0;
                        lwStats.sw[v] = 0;
                        lwStats.tb[v] = 0;
                        lwStats.cq[v] = 0;
                    }
                }
            })
        }
        players[player.name] = {
            totalWins: player.wins,
            totalKills: player.kills,
            totalDeaths: player.deaths,
            totalCredits: player.statusCredits,
            totalLosses: player.losses,
            wins: player.wins - (lwStats.totalWins ?? player.wins),
            kills: player.kills - (lwStats.totalKills ?? player.kills),
            deaths: player.deaths - (lwStats.totalDeaths ?? player.deaths),
            gxp: 0,
            credits: player.statusCredits - (lwStats.totalCredits ?? player.statusCredits),
            losses: player.losses - (lwStats.totalLosses ?? player.losses),
            bw: {},
            sw: {},
            tb: {},
            cq: {}
        }

        values.forEach(v => {
            switch (v) {
                case 'totalWins': {
                    players[player.name].bw[v] = player.extra?.bwWins;
                    players[player.name].sw[v] = player.extra?.swWins;
                    players[player.name].tb[v] = player.extra?.tbWins;
                    players[player.name].cq[v] = player.extra?.cqWins;
                }; break;
                case 'totalKills': {
                    players[player.name].bw[v] = player.extra?.bwKills;
                    players[player.name].sw[v] = player.extra?.swKills;
                    players[player.name].tb[v] = player.extra?.tbKills;
                    players[player.name].cq[v] = player.extra?.cqKills;
                }; break;
                case 'totalDeaths': {
                    players[player.name].bw[v] = player.extra?.bwDeaths;
                    players[player.name].sw[v] = player.extra?.swDeaths;
                    players[player.name].tb[v] = player.extra?.tbDeaths;
                    players[player.name].cq[v] = player.extra?.cqDeaths;
                }; break;
                case 'wins': {
                    players[player.name].bw[v] = player.extra?.bwWins - (lwStats.bw?.totalWins ?? player.extra?.bwWins);
                    players[player.name].sw[v] = player.extra?.swWins - (lwStats.sw?.totalWins ?? player.extra?.swWins);
                    players[player.name].tb[v] = player.extra?.tbWins - (lwStats.tb?.totalWins ?? player.extra?.tbWins);
                    players[player.name].cq[v] = player.extra?.cqWins - (lwStats.cq?.totalWins ?? player.extra?.cqWins);
                }; break;
                case 'kills': {
                    players[player.name].bw[v] = player.extra?.bwKills - (lwStats.bw?.totalKills ?? player.extra?.bwKills);
                    players[player.name].sw[v] = player.extra?.swKills - (lwStats.sw?.totalKills ?? player.extra?.swKills);
                    players[player.name].tb[v] = player.extra?.tbKills - (lwStats.tb?.totalKills ?? player.extra?.tbKills);
                    players[player.name].cq[v] = player.extra?.cqKills - (lwStats.cq?.totalKills ?? player.extra?.cqKills);
                }; break;
                case 'deaths': {
                    players[player.name].bw[v] = player.extra?.bwDeaths - (lwStats.bw?.totalDeaths ?? player.extra?.bwDeaths);
                    players[player.name].sw[v] = player.extra?.swDeaths - (lwStats.sw?.totalDeaths ?? player.extra?.swDeaths);
                    players[player.name].tb[v] = player.extra?.tbDeaths - (lwStats.tb?.totalDeaths ?? player.extra?.tbDeaths);
                    players[player.name].cq[v] = player.extra?.cqDeaths - (lwStats.cq?.totalDeaths ?? player.extra?.cqDeaths);
                }; break;
                case 'gxp': {
                    players[player.name].bw[v] = (player.extra?.bwWins - (lwStats.bw?.totalWins ?? player.extra?.bwWins)) * 10;
                    players[player.name].sw[v] = (player.extra?.swWins - (lwStats.sw?.totalWins ?? player.extra?.swWins)) * 10;
                    players[player.name].tb[v] = (player.extra?.tbWins - (lwStats.tb?.totalWins ?? player.extra?.tbWins)) * 10;
                    players[player.name].cq[v] = (player.extra?.cqWins - (lwStats.cq?.totalWins ?? player.extra?.cqWins)) * 10;
                }
            }
        })

        players[player.name].gxp = (players[player.name].bw?.wins ?? 0 + players[player.name].sw?.wins + players[player.name].tb?.wins + players[player.name].cq?.wins) * 10;

        total.totalWins += player.wins
        total.totalKills += player.kills
        total.totalDeaths += player.deaths
        total.totalCredits += player.statusCredits
        total.totalLosses += player.losses
        total.wins += players[player.name].wins
        total.kills += players[player.name].kills
        total.deaths += players[player.name].deaths
        total.gxp += players[player.name].gxp
        total.credits += players[player.name].credits
        total.losses += players[player.name].losses

        values.forEach(v => {
            switch (v) {
                case 'totalWins': {
                    total.bw[v] += player.extra?.bwWins;
                    total.sw[v] += player.extra?.swWins;
                    total.tb[v] += player.extra?.tbWins;
                    total.cq[v] += player.extra?.cqWins;
                }; break;
                case 'totalKills': {
                    total.bw[v] += player.extra?.bwKills;
                    total.sw[v] += player.extra?.swKills;
                    total.tb[v] += player.extra?.tbKills;
                    total.cq[v] += player.extra?.cqKills;
                }; break;
                case 'totalDeaths': {
                    total.bw[v] += player.extra?.bwDeaths;
                    total.sw[v] += player.extra?.swDeaths;
                    total.tb[v] += player.extra?.tbDeaths;
                    total.cq[v] += player.extra?.cqDeaths;
                }; break;
                case 'wins': {
                    total.bw[v] += players[player.name].bw?.wins;
                    total.sw[v] += players[player.name].sw?.wins;
                    total.tb[v] += players[player.name].tb?.wins;
                    total.cq[v] += players[player.name].cq?.wins;
                }; break;
                case 'kills': {
                    total.bw[v] += players[player.name].bw?.kills;
                    total.sw[v] += players[player.name].sw?.kills;
                    total.tb[v] += players[player.name].tb?.kills;
                    total.cq[v] += players[player.name].cq?.kills;
                }; break;
                case 'deaths': {
                    total.bw[v] += players[player.name].bw?.deaths;
                    total.sw[v] += players[player.name].sw?.deaths;
                    total.tb[v] += players[player.name].tb?.deaths;
                    total.cq[v] += players[player.name].cq?.deaths;
                }; break;
                case 'gxp': {
                    total.bw[v] += players[player.name].bw?.gxp;
                    total.sw[v] += players[player.name].sw?.gxp;
                    total.tb[v] += players[player.name].tb?.gxp;
                    total.cq[v] += players[player.name].cq?.gxp;
                }
            }
        })
    })
    let postRes = await require('./post')(players, total, guild.xp)
    if (postRes != 0) return 2
    else return 0;
}
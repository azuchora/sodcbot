module.exports = {
    getAverageTime: function(dates){
        return dates
            .map((d) => module.exports.getHoursFromUTCMidnight(d))
            .reduce((p, a) => p + a) / dates.length;
    },

    getAverageTimeDeviation: function(dates, averageTime){
        return dates
            .map((d) => Math.abs(averageTime - module.exports.getHoursFromUTCMidnight(d)))
            .reduce((p, a) => p + a) / dates.length;
    },

    formatAsTime: function(timeFromMidnight){
        const floored = Math.floor(timeFromMidnight);
        const minutes = Math.floor((timeFromMidnight - floored) * 60);
        return `${(timeFromMidnight > 0 ? floored : floored + 24).toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")}`;
    },

    getHoursFromUTCMidnight: function(timestampMiliseconds){
        const utcTime = new Date(timestampMiliseconds + (new Date(timestampMiliseconds)).getTimezoneOffset() * 60 * 1000);
        const hours = utcTime.getHours() + utcTime.getMinutes() / 60;

        return hours > 12 ? hours - 24 : hours;
    },

    formatAsHours: function(timestampMiliseconds){
        return (Math.round((timestampMiliseconds / 1000 / 60 / 60) * 10) / 10);
    },

    getBedTimeSessions: function (sessions){
        const completedSessions = sessions
            .filter((s) => s.stop != 0)
            .sort((a, b) => a.start - b.start);
        
        if(completedSessions.length < 3) return [];
        const bedTimeSessions = [];

        for(let i = 1; i < completedSessions.length - 1; i++){
            const previous = completedSessions[i - 1];
            const current = completedSessions[i];
            const next = completedSessions[i + 1];
            
            const hoursSincePrevious = module.exports.formatAsHours(current.start - previous.stop);
            const hoursUntilNext = module.exports.formatAsHours(next.start - current.stop);
            
            if(hoursUntilNext > 4 && hoursUntilNext < 16 && hoursSincePrevious < 16){
                bedTimeSessions.unshift({ ...current, sleepTimeHrs: hoursUntilNext });
            }
            
        }
        
        if(bedTimeSessions.length > 2){
            return bedTimeSessions.filter(
                (s) => 
                Math.abs(
                    module.exports.getHoursFromUTCMidnight(s.stop) -
                    module.exports.getAverageTime(bedTimeSessions.map((s) => s.stop))
                ) < 4
            );
        } else {
            return bedTimeSessions;
        }
    },
    getAnalyzedBedTimeSessions: function(sessions){
        const bedTimeSessions = module.exports.getBedTimeSessions(sessions);
        if(bedTimeSessions.length < 2) return;
        
        const stopDates = bedTimeSessions.map((s) => s.stop);
        const averageStopTime = module.exports.getAverageTime(stopDates);
        const averageStopTimeDeviation = module.exports.getAverageTimeDeviation(stopDates, averageStopTime);
        
        const sortedSessions = sessions
            .slice()
            .sort((a, b) => b.start - a.start);
        
        let avgBedStart = bedTimeSessions.map(b => module.exports.getHoursFromUTCMidnight(b.start)).reduce((acc, curr) => acc + curr) / bedTimeSessions.length; 
        const startDates = sortedSessions
            .filter((s) => {
                return Math.abs(module.exports.getHoursFromUTCMidnight(s.start) - avgBedStart) <= 6;
            })
            .map((s) => s.start);

        const averageStartTime = module.exports.getAverageTime(startDates);
        const averageStartTimeDeviation = module.exports.getAverageTimeDeviation(startDates, averageStartTime);

        if(Math.abs(Math.abs(averageStartTime) - Math.abs(averageStopTime)) < 3) return null;
        // console.log(averageStartTime, averageStopTime);

        const averageSleepTime = bedTimeSessions.map((s) => s.sleepTimeHrs).reduce((a, b) => a + b) / bedTimeSessions.length;
        const minSleepTime = Math.min(...bedTimeSessions.map((s) => s.sleepTimeHrs));
        const maxSleepTime = Math.max(...bedTimeSessions.map((s) => s.sleepTimeHrs));
        
        const tzOffset = new Date().getTimezoneOffset() / -60;
        
        return {
            tzOffsetHrs: tzOffset,
            averageBedTime: module.exports.formatAsTime(averageStopTime + tzOffset),
            averageBedTimeDeviationHrs: Math.round((averageStopTimeDeviation) * 10) / 10,
            averageWakeUpTime: module.exports.formatAsTime(averageStartTime + tzOffset),
            averageWakeUpTimeDeviationHrs: Math.round(averageStartTimeDeviation * 10) / 10,
            averageSleepTimeHrs: Math.round(averageSleepTime * 10) / 10,
            minSleepTimeHrs: Math.round(minSleepTime * 10) / 10,
            maxSleepTimeHrs: Math.round(maxSleepTime * 10) / 10,
        };
    },
    
    mergeSessionsByDay: function (sessions) {
        const sessionsByDay = sessions.reduce((acc, session) => {
            const date = new Date(session.start).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(session);
            return acc;
        }, {});

        const mergedSessions = [];
        for(const date in sessionsByDay){
            const sessionsInDay = sessionsByDay[date];
            const sortedSessions = sessionsInDay.sort((a, b) => a.start - b.start); 

            let mergedSession = null;
            for(const session of sortedSessions){
                if(!mergedSession){
                    mergedSession = { start: session.start, stop: session.stop, id: [session.id], serverId: [session.serverId] };
                } else {
                    if (session.start < mergedSession.start || module.exports.getHoursFromUTCMidnight(session.start) < 3) {
                        if (session.stop > mergedSession.stop) {
                            mergedSession.stop = session.stop;
                            if(!mergedSession.serverId.includes(session.serverId)) mergedSession.serverId.push(session.serverId);
                            if(!mergedSession.id.includes(session.id)) mergedSession.id.push(session.id);
                        }
                    } else {
                        mergedSessions.push(mergedSession);
                        mergedSession = { start: session.start, stop: session.stop, id: [session.id], serverId: [session.serverId] };
                    }
                }
            }

            if(mergedSession){
                mergedSessions.push(mergedSession);
            }
        }

        mergedSessions.sort((a, b) => a.start - b.start);
        const f = mergedSessions.reduce((acc, curr) => {
            if(!acc?.length){
                acc.push(curr);
                return acc;
            }
            const prev = acc[acc.length - 1];
            const timeBetween = module.exports.formatAsHours(curr.start - prev.stop);
            if(timeBetween < 5){
                prev.stop = curr.stop;
                curr.serverId.forEach((e) => {
                    if(prev.serverId.includes(e)) return;
                    prev.serverId.push(e);
                });
                curr.id.forEach((i) => {
                    if(prev.id.includes(i)) return;
                    prev.id.push(i);
                });
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);
        // console.log(f.map((s) => {
        //     return {
        //         start: new Date(s.start),
        //         stop: new Date(s.stop),
        //         id: s.id,
        //         serverId: s.serverId,
        //     }
        // }));
        return f;
    },
}
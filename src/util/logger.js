const chalk = require('chalk');

const getTime = () => {
    let d = new Date();

    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate();
    let hours = d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours();
    let minutes = d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes();
    let seconds = d.getSeconds() < 10 ? ('0' + d.getSeconds()) : d.getSeconds();

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
/**
 * @param {'info' | 'err' | 'warn' | 'done' | undefined} style
 */
    log(string, style){
        const time = getTime();
        const styles = {
            info: { prefix: chalk.blue(`${time} [INFO]`), logFunction: console.log },
            err: { prefix: chalk.red(`${time} [ERROR]`), logFunction: console.error },
            warn: { prefix: chalk.yellow(`${time} [WARNING]`), logFunction: console.warn },
            done: { prefix: chalk.green(`${time} [SUCCES]`), logFunction: console.log },
        };
        const selectedStyle = styles[style] || { logFunction: console.log };
        selectedStyle.logFunction(`${selectedStyle.prefix || ""} ${string}`);
    }
}
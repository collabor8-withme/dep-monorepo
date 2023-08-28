const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";

function log(message: string): void {
    console.log(message);
    return undefined;
}
function warn(message: string): void {
    console.log(yellow + message + reset);
    return undefined;
}
function error(message: string): void {
    console.log(red + message + reset);
    return undefined;
}
function success(message: string): void {
    console.log(green + message + reset);
    return undefined;
}

export {
    log,
    warn,
    error,
    success
}

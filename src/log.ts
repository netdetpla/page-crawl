import moment = require("moment");

export class Log {
    private static ANSI_RESET = "\u001B[0m";
    private static ANSI_RED = "\u001B[31m";
    private static ANSI_GREEN = "\u001B[32m";
    private static ANSI_YELLOW = "\u001B[33m";
    private static ANSI_BLUE = "\u001B[34m";
    private static DEBU = "[DEBU]" + Log.ANSI_RESET;
    private static INFO = "[INFO]" + Log.ANSI_RESET;
    private static WARN = "[WARN]" + Log.ANSI_RESET;
    private static ERRO = "[ERRO]" + Log.ANSI_RESET;

    private static getDatetime(): string {
        return "[" + moment().format("YYYY-MM-DD HH:mm:ss") + "]"
    }

    static debug(content: string) {
        console.log(Log.ANSI_GREEN + Log.getDatetime() + Log.DEBU + content)
    }

    static info(content: string) {
        console.log(Log.ANSI_BLUE + Log.getDatetime() + Log.INFO + content)
    }

    static warn(content: string) {
        console.log(Log.ANSI_YELLOW + Log.getDatetime() + Log.WARN + content)
    }

    static error(content: string) {
        console.log(Log.ANSI_RED + Log.getDatetime() + Log.ERRO + content)
    }
}
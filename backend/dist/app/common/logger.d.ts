declare const log4js: any;
declare let config: {
    appenders: {
        console: {
            type: string;
        };
        file: {
            type: string;
            filename: string;
            pattern: string;
            numBackups: number;
        };
    };
    categories: {
        default: {
            appenders: string[];
            level: string;
        };
    };
};
declare const _logger: any;

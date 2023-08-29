type Config = {
    PKG_JSON_DIR: string,
    NODE_MODULES_DIR: string,
    PKG_MANAGER: string
}

declare class DepAnlz {
    constructor();
    constructor(webServer: boolean);
    webServer: boolean;
    preHook(): Config;
    coreHook(config: Config): DepGraph;
    lifeCycle(): DepGraph;
}

export {
    Config,
    DepAnlz
}
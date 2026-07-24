import {
    EMPTY_SYSTEM_INFORMATION,
    EMPTY_SYSTEM_SETTINGS_DATA,
} from "./systemSettingsConstants";

function mapSystemInformation(
    information = {}
) {
    return {
        ...EMPTY_SYSTEM_INFORMATION,

        applicationVersion:
            information.applicationVersion ??
            information.version ??
            "",

        framework:
            information.framework ??
            "",

        environment:
            information.environment ??
            "",

        database:
            information.database ??
            information.databaseProvider ??
            "",

        serverTime:
            information.serverTime ??
            "",

        uptime:
            information.uptime ??
            "",

        lastBackup:
            information.lastBackup ??
            "",

        storageUsed:
            information.storageUsed ??
            "",
    };
}

export function mapSystemSettings(
    response = {}
) {
    return {
        settings: {
            ...EMPTY_SYSTEM_SETTINGS_DATA.settings,
            ...(response.settings ??
                response),
        },

        systemInformation:
            mapSystemInformation(
                response.systemInformation ??
                response.system ??
                {}
            ),
    };
}

const appEvents = {};

function registerAppEvents(appId, eventListeners) {
    appEvents[appId] = eventListeners;
}

function dispatchAppEvents(appId, eventType, event) {
    appEvents[appId]?.[eventType]?.(event);
}

function resolveAppForFileType(type) {
    return {
        [fileTypes.DIR]: 'files',
        [fileTypes.TEXT]: 'writer',
        [fileTypes.PDF]: 'writer',
        [fileTypes.CSV]: 'writer',
        [fileTypes.IMAGE]: 'photo_view',
    }[type] || '';
}

function getCoreAppPath(name) {
    const appPath = 'core-apps/' + name;
    return {
        html: appPath + '/index.html',
        css: appPath + '/css/style.css',
        js: appPath + '/js/main.js',
    }
}

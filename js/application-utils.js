const appEvents = {};

function registerAppEvents(appId, eventListeners) {
    appEvents[appId] = eventListeners;
}

function dispatchAppEvents(appId, eventType, event) {
    appEvents[appId]?.[eventType]?.(event);
}


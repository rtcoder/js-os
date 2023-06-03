const appEvents = {};

function registerAppEvents(appId, eventListeners) {
    console.log('registerAppEvents');
    appEvents[appId] = eventListeners;
}

function dispatchAppEvents(appId, eventType, event) {
    appEvents[appId]?.[eventType]?.(event);
}


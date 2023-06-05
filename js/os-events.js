const osEventsTypes = {
    REFRESH_WINDOW: 'refreshWindow',
    OPEN_APP: 'openApp'
}
const osEvents = {};


function registerOsEvents(appId, eventListeners) {
    osEvents[appId] = eventListeners;
}

function dispatchOsEvents(eventType, data) {
    Object.keys(osEvents).forEach(appId => {
        osEvents[appId][eventType]?.(data);
    })
}

const osEventsTypes = {
    REFRESH_WINDOW: 'refreshWindow',
    OPEN_APP: 'openApp',
    CLOSE_APP: 'closeApp',
    RESIZE_WINDOW: 'resizeWindow',
    SCREEN_LOAD_END: 'screenLoadEnd'
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

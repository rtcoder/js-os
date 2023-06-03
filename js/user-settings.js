const SETTINGS = {
    theme: 'light',
    wallpapersList: [
        'pics/wallpapers/wallpaper1.jpg',
        'pics/wallpapers/wallpaper2.jpg',
        'pics/wallpapers/wallpaper3.jpg',
        'pics/wallpapers/wallpaper4.jpg',
        'pics/wallpapers/wallpaper5.jpg',
        'pics/wallpapers/wallpaper6.jpeg',
        'pics/wallpapers/wallpaper7.jpeg',
        'pics/wallpapers/wallpaper8.jpeg',
        'pics/wallpapers/wallpaper9.jpeg',
    ],
    wallpaper: {
        BG_COLOR: '#000',
        BG_IMAGE: 'url(\'../pics/wallpapers/wallpaper5.jpg\')',
        BG_SIZE: 'cover',
        BG_POSITION: 'center center',
        BG_REPEAT: 'no-repeat',
    },
    appList: {
        APP_LIST_TYPE: 'grid',
        APP_LIST_BG_COLOR: '#eee',
        APP_LIST_FONT_COLOR: '#1f1f1f',
        APP_LIST_FONT_COLOR_ACTIVE: '#fff',
        APP_LIST_ELEMENT_BG_COLOR_ACTIVE: '#4b9bff',
    },
    panel: {
        PANEL_SIZE: '70px',
        PANEL_BG_COLOR: 'rgba(0, 0, 0, 0.3)',
        PANEL_FONT_COLOR: '#000',
        PANEL_POSITION: 'bottom',
    },
    dateTime: {
        time: {
            format: 'HH:mm:ss'
        },
        date: {
            format: 'DD.MM.YYYY'
        }
    }
}
const userSettings = Object.assign({}, SETTINGS);

function saveUserSettingsToLocalStorage() {
    localStorage.setItem('js_os_user_settings', JSON.stringify(userSettings));
}

function getUserSettingsFromLocalStorage() {
    const value = localStorage.getItem('js_os_user_settings');
    if (!value) {
        return SETTINGS;
    }
    try {
        return JSON.parse(value);
    } catch {
        return SETTINGS;
    }
}

function updateUserSettingsFromLocalStorage() {
    Object.assign(userSettings,getUserSettingsFromLocalStorage());
}

function getUserSettingsValue(keyPath) {
    keyPath = keyPath.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
    keyPath = keyPath.replace(/^\./, '');           // strip a leading dot
    const keyPathArray = keyPath.split('.');
    let val = getUserSettingsFromLocalStorage();
    for (let i = 0; i < keyPathArray.length; ++i) {
        const k = keyPathArray[i];
        if (k in val) {
            val = val[k];
        } else {
            return;
        }
    }
    return val;
}

function setUserSettingsValue(keyPath, value) {
    const settings = getUserSettingsFromLocalStorage();
    updateObjProp(settings, value, keyPath);
    Object.assign(userSettings, settings);
    saveUserSettingsToLocalStorage();
}

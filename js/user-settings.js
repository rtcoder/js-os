const SETTINGS = {
    animationDuration:100,
    dirTree: [
        {
            name: 'home',
            type: fileTypes.DIR,
            tree: [
                {name: 'aaaa', type: fileTypes.FILE},
                {name: 'file1', type: fileTypes.FILE},
                {
                    name: 'info',
                    type: fileTypes.TEXT,
                    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis quam purus, a porttitor risus tincidunt a. Sed ut mattis quam. Nullam ullamcorper pretium aliquet. Duis faucibus dui in lorem mollis, vitae imperdiet libero porttitor. Duis vel faucibus metus. Vivamus consequat diam eu lacinia sagittis. Nullam ut lectus dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc orci purus, pulvinar in tristique sed, condimentum et lacus. Nam non sem lorem. Aliquam fringilla molestie nunc, vitae pretium dui interdum vitae.\n\nFusce mollis nisi massa, finibus elementum ipsum consequat at. Phasellus euismod erat vel eleifend placerat. Suspendisse aliquet, arcu vel porttitor mollis, justo justo lacinia nibh, at fringilla lectus massa fermentum lorem. Nulla vehicula mauris ut ultricies blandit. Duis consectetur sapien mauris, id tincidunt ex suscipit id. Nunc posuere convallis tempor. Suspendisse tincidunt ante a rutrum facilisis. Nunc volutpat odio quis sapien egestas feugiat.`
                },
                {name: 'file3', type: fileTypes.PDF},
                {name: 'file4', type: fileTypes.IMAGE},
                {name: 'file5', type: fileTypes.TEXT},
                {name: 'file6', type: fileTypes.CSV},
                {
                    name: 'docs',
                    type: fileTypes.DIR,
                    tree: [
                        {name: 'file1', type: fileTypes.FILE},
                        {name: 'file2', type: fileTypes.TEXT},
                        {name: 'file3', type: fileTypes.PDF},
                        {name: 'file5', type: fileTypes.TEXT},
                        {name: 'file6', type: fileTypes.CSV},
                    ]
                }
            ]
        }
    ],
    appSettings: {},
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
    return SETTINGS;
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
    Object.assign(userSettings, getUserSettingsFromLocalStorage());
}

function getUserSettingsValue(keyPath) {
    return getNestedProp(getUserSettingsFromLocalStorage(), keyPath);
}

function setUserSettingsValue(keyPath, value) {
    const settings = getUserSettingsFromLocalStorage();
    updateObjProp(settings, value, keyPath);
    Object.assign(userSettings, settings);
    saveUserSettingsToLocalStorage();
}

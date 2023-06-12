const SETTINGS = {
    animationDuration: 100,
    dirTree: [
        {
            name: 'home',
            type: fileTypes.DIR,
            tree: [
                {
                    name: 'info.txt',
                    type: fileTypes.TEXT,
                    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sagittis quam purus, a porttitor risus tincidunt a. Sed ut mattis quam. Nullam ullamcorper pretium aliquet. Duis faucibus dui in lorem mollis, vitae imperdiet libero porttitor. Duis vel faucibus metus. Vivamus consequat diam eu lacinia sagittis. Nullam ut lectus dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc orci purus, pulvinar in tristique sed, condimentum et lacus. Nam non sem lorem. Aliquam fringilla molestie nunc, vitae pretium dui interdum vitae.\n\nFusce mollis nisi massa, finibus elementum ipsum consequat at. Phasellus euismod erat vel eleifend placerat. Suspendisse aliquet, arcu vel porttitor mollis, justo justo lacinia nibh, at fringilla lectus massa fermentum lorem. Nulla vehicula mauris ut ultricies blandit. Duis consectetur sapien mauris, id tincidunt ex suscipit id. Nunc posuere convallis tempor. Suspendisse tincidunt ante a rutrum facilisis. Nunc volutpat odio quis sapien egestas feugiat.`
                },
                {
                    name: 'users-list.csv',
                    type: fileTypes.CSV,
                    content: `"LatD", "LatM", "LatS", "NS", "LonD", "LonM", "LonS", "EW", "City", "State"
   41,    5,   59, "N",   80, 39,  0, "W", "Youngstown", OH
   42, 52, 48, "N",   97, 23, 23, "W", "Yankton", SD
   46, 35, 59, "N",  120, 30, 36, "W", "Yakima", WA
   42, 16, 12, "N",   71, 48,  0, "W", "Worce,ster", MA
   43, 37, 48, "N",   89, 46, 11, "W", "Wisconsin Dells", WI
   36,  5, 59, "N",   80, 15,  0, "W", "Winston-Salem", NC
   49, 52, 48, "N",   97,  9,  0, "W", "Winnipeg", MB
   39, 11, 23, "N",   78,  9, 36, "W", "Winchester", VA
   34, 14, 24, "N",   77, 55, 11, "W", "Wilmington", NC
   39, 45,  0, "N",   75, 33,  0, "W", "Wilmington", DE
   48,  9,  0, "N",  103, 37, 12, "W", "Williston", ND
   41, 15,  0, "N",   77,  0,  0, "W", "Williamsport", PA
   37, 40, 48, "N",   82, 16, 47, "W", "Williamson", WV
   33, 54,  0, "N",   98, 29, 23, "W", "Wichita Falls", TX
   37, 41, 23, "N",   97, 20, 23, "W", "Wichita", KS
   40,  4, 11, "N",   80, 43, 12, "W", "Wheeling", WV
   26, 43, 11, "N",   80,  3,  0, "W", "West Palm Beach", FL
   47, 25, 11, "N",  120, 19, 11, "W", "Wenatchee", WA
   41, 25, 11, "N",  122, 23, 23, "W", "Weed", CA
   31, 13, 11, "N",   82, 20, 59, "W", "Waycross", GA
   44, 57, 35, "N",   89, 38, 23, "W", "Wausau", WI
   42, 21, 36, "N",   87, 49, 48, "W", "Waukegan", IL
   44, 54,  0, "N",   97,  6, 36, "W", "Watertown", SD
   43, 58, 47, "N",   75, 55, 11, "W", "Watertown", NY
   42, 30,  0, "N",   92, 20, 23, "W", "Waterloo", IA
   41, 32, 59, "N",   73,  3,  0, "W", "Waterbury", CT
   38, 53, 23, "N",   77,  1, 47, "W", "Washington", DC
   41, 50, 59, "N",   79,  8, 23, "W", "Warren", PA
   46,  4, 11, "N",  118, 19, 48, "W", "Walla Walla", WA
   31, 32, 59, "N",   97,  8, 23, "W", "Waco", TX
   38, 40, 48, "N",   87, 31, 47, "W", "Vincennes", IN
   28, 48, 35, "N",   97,  0, 36, "W", "Victoria", TX
   32, 20, 59, "N",   90, 52, 47, "W", "Vicksburg", MS
   49, 16, 12, "N",  123,  7,   12, "W", "Vancouver", BC
   41,    9,   35, "N",     81,   14,   23, "W", "Ravenna", OH`
                },
            ]
        }
    ],
    appSettings: {},
    wallpapersList: [
        'pics/wallpapers/wallpaper1.jpeg',
        'pics/wallpapers/wallpaper2.jpeg',
        'pics/wallpapers/wallpaper3.jpg',
        'pics/wallpapers/wallpaper4.jpg',
        'pics/wallpapers/wallpaper5.jpg',
        'pics/wallpapers/wallpaper6.jpeg',
        'pics/wallpapers/wallpaper7.jpeg',
        'pics/wallpapers/wallpaper8.jpeg',
        'pics/wallpapers/wallpaper9.jpeg',
    ],
    theme: {
        BG_COLOR: '#000',
        BG_IMAGE: 'url(\'../pics/wallpapers/wallpaper2.jpeg\')',
        BG_SIZE: 'cover',
        BG_POSITION: 'center center',
        BG_REPEAT: 'no-repeat',
    },
    panel: {
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

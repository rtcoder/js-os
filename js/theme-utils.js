function setTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) {
        return;
    }
    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(styleVars[key], theme[key]);
    });
    applyThemeToSettings(themeName);
    setUserSettingsValue('theme', themeName);
}

function applyThemeToSettings(themeName) {
    const theme = THEMES[themeName];
    if (!theme) {
        return;
    }

    userSettings.panel.PANEL_SIZE = theme.PANEL_SIZE;
    userSettings.panel.PANEL_BG_COLOR = theme.PANEL_BG_COLOR;
    userSettings.panel.PANEL_FONT_COLOR = theme.PANEL_FONT_COLOR;
    setPanelPosition(theme.PANEL_POSITION);

    userSettings.wallpaper.BG_COLOR = theme.BG_COLOR;
    userSettings.wallpaper.BG_IMAGE = theme.BG_IMAGE;
    userSettings.wallpaper.BG_SIZE = theme.BG_SIZE;
    userSettings.wallpaper.BG_POSITION = theme.BG_POSITION;
    userSettings.wallpaper.BG_REPEAT = theme.BG_REPEAT;

    // APPS_BTN_COLOR = theme.APPS_BTN_COLOR;
    // APPS_BTN_COLOR_ACTIVE = theme.APPS_BTN_COLOR_ACTIVE;
    // APPS_BTN_BG_COLOR_ACTIVE = theme.APPS_BTN_BG_COLOR_ACTIVE;

    userSettings.appList.APP_LIST_BG_COLOR = theme.APP_LIST_BG_COLOR;
    userSettings.appList.APP_LIST_FONT_COLOR = theme.APP_LIST_FONT_COLOR;
    userSettings.appList.APP_LIST_FONT_COLOR_ACTIVE = theme.APP_LIST_FONT_COLOR_ACTIVE;
    userSettings.appList.APP_LIST_ELEMENT_BG_COLOR_ACTIVE = theme.APP_LIST_ELEMENT_BG_COLOR_ACTIVE;

    // WINDOW_LIST_ACTIVE_ELEMENT_DOT_COLOR = theme.WINDOW_LIST_ACTIVE_ELEMENT_DOT_COLOR;
    // WINDOW_LIST_HOVERED_ELEMENT_BG_COLOR = theme.WINDOW_LIST_HOVERED_ELEMENT_BG_COLOR;
    // WINDOW_LIST_ELEMENT_TITLE_BG_COLOR = theme.WINDOW_LIST_ELEMENT_TITLE_BG_COLOR;
    // WINDOW_LIST_ELEMENT_TITLE_FONT_COLOR = theme.WINDOW_LIST_ELEMENT_TITLE_FONT_COLOR;

    // CLOSE_WINDOW_BUTTON_COLOR = theme.CLOSE_WINDOW_BUTTON_COLOR;
    // MINIMIZE_WINDOW_BUTTON_COLOR = theme.MINIMIZE_WINDOW_BUTTON_COLOR;
    // MAXIMIZE_WINDOW_BUTTON_COLOR = theme.MAXIMIZE_WINDOW_BUTTON_COLOR;
    // WINDOW_BUTTON_INACTIVE_BG_COLOR = theme.WINDOW_BUTTON_INACTIVE_BG_COLOR;
    // WINDOW_BUTTON_BORDER_COLOR = theme.WINDOW_BUTTON_BORDER_COLOR;
    // WINDOW_BUTTON_BORDER_WIDTH = theme.WINDOW_BUTTON_BORDER_WIDTH;

    // WINDOW_SHADOW = theme.WINDOW_SHADOW;
    // WINDOW_BG_COLOR = theme.WINDOW_BG_COLOR;
    // WINDOW_FONT_COLOR = theme.WINDOW_FONT_COLOR;

    saveUserSettingsToLocalStorage();
}

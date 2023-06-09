function setTheme() {
    const {theme} = userSettings;

    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(styleVars[key], theme[key]);
    });

    setPanelPosition(userSettings.panel.PANEL_POSITION);
    saveUserSettingsToLocalStorage();
}


function setPanelPosition(position) {
    const availablePosition = ['top', 'right', 'bottom', 'left'];
    if (!availablePosition.includes(position)) {
        return;
    }
    setUserSettingsValue('panel.PANEL_POSITION', position);
    const panel = document.querySelector('.panel');
    panel.classList.remove(...availablePosition);
    panel.classList.add(position);
}

function setPanelBgColorOpacity(opacity) {
    const rgb = convertRgbaStringToArray(userSettings.panel.PANEL_BG_COLOR);
    setUserSettingsValue('panel.PANEL_BG_COLOR', `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${parseFloat(opacity) / 100})`);
    document.body.style.setProperty(styleVars.PANEL_BG_COLOR, getUserSettingsValue('panel.PANEL_BG_COLOR'));
}

function setPanelBgColor(color) {
    const rgb = convertRgbaStringToArray(userSettings.panel.PANEL_BG_COLOR);
    const alpha = rgb[3];
    setUserSettingsValue('panel.PANEL_BG_COLOR', hexToRgba(color, alpha * 100));
    document.body.style.setProperty(styleVars.PANEL_BG_COLOR, getUserSettingsValue('panel.PANEL_BG_COLOR'));
}

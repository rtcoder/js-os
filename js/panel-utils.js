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


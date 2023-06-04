(() => {
    const {currentScript} = document;
    const appWindow = currentScript.parentNode;

    function hideAllSections() {
        appWindow.querySelectorAll('section').forEach(el => el.setAttribute('hidden', 'true'));
    }

    function show(selector) {
        appWindow.querySelector(selector).removeAttribute('hidden');
    }

    function hide(selector) {
        appWindow.querySelector(selector).setAttribute('hidden', 'true');
    }

    function fillFormsFromSettingsValue() {
        const rgba = convertRgbaStringToArray(userSettings.panel.PANEL_BG_COLOR);
        appWindow.querySelector('#panel-position').value = userSettings.panel.PANEL_POSITION;
        appWindow.querySelector('#panel-bg-opacity').value = rgba[3] * 100;
        appWindow.querySelector('#panel-bg-color').value = userSettings.panel.PANEL_BG_COLOR;

        appWindow.querySelector('#date-format').value = userSettings.dateTime.date.format;
        appWindow.querySelector('#time-format').value = userSettings.dateTime.time.format;

        appWindow.querySelector('#os-theme').value = userSettings.theme;
    }

    function displayWallpapers() {
        appWindow.querySelector('section[data-id="wallpaper"] .wallpapers').innerHTML =
            userSettings.wallpapersList.map(img =>
                `<div class="image" style="background-image: url(${img})" data-image="${img}"></div>`
            ).join('');
    }

    fillFormsFromSettingsValue();
    displayWallpapers();
    registerAppEvents(appWindow.getAttribute('id'), {
        'click': e => {
            const {target} = e;
            const tile = target.closest('.tile');
            if (tile) {
                let id = tile.getAttribute('data-section');
                hideAllSections();
                show(`section[data-id="${id}"]`);
                show('.top');
            }
            const backButton = target.closest('.back');
            if (backButton) {
                hideAllSections();
                show(`section[data-id="home"]`);
                hide('.top');
            }
            if (target.closest('.wallpapers')) {
                const img = target.closest('.image');
                if (img) {
                    const imgUrl = img.getAttribute('data-image');
                    const cssVal = imgUrl.startsWith('http://') || imgUrl.startsWith('https://')
                        ? `url(${imgUrl})`
                        : `url(../${imgUrl})`;

                    setUserSettingsValue('wallpaper.BG_IMAGE', cssVal);
                    document.body.style.setProperty(styleVars.BG_IMAGE, getUserSettingsValue('wallpaper.BG_IMAGE'));
                }
            }
        },
        'mousemove': e => {
            if (!e.target.closest('#panel-bg-opacity')) {
                return;
            }
            const c = userSettings.panel.PANEL_BG_COLOR;
            const rgb = c.replace(/^(rgb|rgba)\(/, '')
                .replace(/\)$/, '')
                .replace(/\s/g, '')
                .split(',');
            setUserSettingsValue('panel.PANEL_BG_COLOR', `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${parseFloat(e.target.value) / 100})`);
            document.body.style.setProperty(styleVars.PANEL_BG_COLOR, getUserSettingsValue('panel.PANEL_BG_COLOR'));
        }
    });


    appWindow.querySelector('section[data-id=wallpaper] .options #position')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_POSITION', e.target.value);
            document.body.style.setProperty(styleVars.BG_POSITION, getUserSettingsValue('wallpaper.BG_POSITION'));
        });
    appWindow.querySelector('section[data-id=wallpaper] .options #bg-repeat')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_REPEAT', e.target.value);
            document.body.style.setProperty(styleVars.BG_REPEAT, getUserSettingsValue('wallpaper.BG_REPEAT'));
        });
    appWindow.querySelector('section[data-id=wallpaper] .options #bg-size')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_SIZE', e.target.value);
            document.body.style.setProperty(styleVars.BG_SIZE, getUserSettingsValue('wallpaper.BG_SIZE'));
        });
    appWindow.querySelector('section[data-id=wallpaper] .options #bg-color')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_COLOR', e.target.value);
            document.body.style.setProperty(styleVars.BG_COLOR, getUserSettingsValue('wallpaper.BG_COLOR'));
        });

    appWindow.querySelector('#panel-bg-color').addEventListener('change', e => {
        setPanelBgColor(e.target.value);
    });

    appWindow.querySelector('#panel-bg-opacity').addEventListener('change', e => {
        setPanelBgColorOpacity(e.target.value);
    });

    appWindow.querySelector('#panel-position').addEventListener('change', e => {
        setPanelPosition(e.target.value);
    });

    appWindow.querySelector('#date-format').addEventListener('input', e => {
        setUserSettingsValue('dateTime.date.format', e.target.value);
    });
    appWindow.querySelector('#time-format').addEventListener('input', e => {
        setUserSettingsValue('dateTime.time.format', e.target.value);
    });

    appWindow.querySelector('#os-theme').addEventListener('change', e => {
        setTheme(e.target.value);
    });
})();

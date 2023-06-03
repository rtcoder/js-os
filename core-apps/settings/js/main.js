(function () {
    function hideAllSections() {
        document.querySelectorAll('#settings section').forEach(el => el.setAttribute('hidden', 'true'));
    }

    function show(selector) {
        document.querySelector(selector).removeAttribute('hidden');
    }

    function hide(selector) {
        document.querySelector(selector).setAttribute('hidden', 'true');
    }

    function fillFormsFromSettingsValue() {
        const rgba = convertRgbaStringToArray(userSettings.panel.PANEL_BG_COLOR);
        document.querySelector('#panel-position').value = userSettings.panel.PANEL_POSITION;
        document.querySelector('#panel-bg-opacity').value = rgba[3] * 100;
        document.querySelector('#panel-bg-color').value = userSettings.panel.PANEL_BG_COLOR;

        document.querySelector('#date-format').value = userSettings.dateTime.date.format;
        document.querySelector('#time-format').value = userSettings.dateTime.time.format;

        document.querySelector('#app-list-type').value = userSettings.appList.APP_LIST_TYPE;

        document.querySelector('#os-theme').value = userSettings.theme;
    }

    function displayWallpapers() {
        document.querySelector('section[data-id="wallpaper"] .wallpapers').innerHTML =
            userSettings.wallpapersList.map(img =>
                `<div class="image" style="background-image: url(${img})" data-image="${img}"></div>`
            ).join('');
    }

    fillFormsFromSettingsValue();
    displayWallpapers();
    registerAppEvents('settings', {
        'click': e => {
            const {target} = e;
            const tile = target.closest('.tile');
            if (tile) {
                let id = tile.getAttribute('data-section');
                hideAllSections();
                show(`#settings section[data-id="${id}"]`);
                show('#settings .top');
            }
            const backButton = target.closest('.back');
            if (backButton) {
                hideAllSections();
                show(`#settings section[data-id="home"]`);
                hide('#settings .top');
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


    document.querySelector('section[data-id=wallpaper] .options #position')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_POSITION', e.target.value);
            document.body.style.setProperty(styleVars.BG_POSITION, getUserSettingsValue('wallpaper.BG_POSITION'));
        });
    document.querySelector('section[data-id=wallpaper] .options #bg-repeat')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_REPEAT', e.target.value);
            document.body.style.setProperty(styleVars.BG_REPEAT, getUserSettingsValue('wallpaper.BG_REPEAT'));
        });
    document.querySelector('section[data-id=wallpaper] .options #bg-size')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_SIZE', e.target.value);
            document.body.style.setProperty(styleVars.BG_SIZE, getUserSettingsValue('wallpaper.BG_SIZE'));
        });
    document.querySelector('section[data-id=wallpaper] .options #bg-color')
        .addEventListener('change', e => {
            setUserSettingsValue('wallpaper.BG_COLOR', e.target.value);
            document.body.style.setProperty(styleVars.BG_COLOR, getUserSettingsValue('wallpaper.BG_COLOR'));
        });

    document.querySelector('#panel-bg-color').addEventListener('change', e => {
        setPanelBgColor(e.target.value);
    });

    document.querySelector('#panel-bg-opacity').addEventListener('change', e => {
        setPanelBgColorOpacity(e.target.value);
    });

    document.querySelector('#panel-position').addEventListener('change', e => {
        setPanelPosition(e.target.value);
    });

    document.querySelector('#date-format').addEventListener('input', e => {
        setUserSettingsValue('dateTime.date.format', e.target.value);
    });
    document.querySelector('#time-format').addEventListener('input', e => {
        setUserSettingsValue('dateTime.time.format', e.target.value);
    });

    document.querySelector('#os-theme').addEventListener('change', e => {
        setTheme(e.target.value);
    });

    document.querySelector('#app-list-type').addEventListener('change', e => {
        setAppListType(e.target.value);
    });
})();

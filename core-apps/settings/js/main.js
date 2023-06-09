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
        appWindow.querySelector('#panel-position').value = userSettings.panel.PANEL_POSITION;

        appWindow.querySelector('#date-format').value = userSettings.dateTime.date.format;
        appWindow.querySelector('#time-format').value = userSettings.dateTime.time.format;
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

                    setUserSettingsValue('theme.BG_IMAGE', cssVal);
                    document.body.style.setProperty(styleVars.BG_IMAGE, getUserSettingsValue('theme.BG_IMAGE'));
                }
            }
        },
    });


    appWindow.querySelector('section[data-id=wallpaper] .options #position')
        .addEventListener('change', e => {
            setUserSettingsValue('theme.BG_POSITION', e.target.value);
            document.body.style.setProperty(styleVars.BG_POSITION, getUserSettingsValue('theme.BG_POSITION'));
        });
    appWindow.querySelector('section[data-id=wallpaper] .options #bg-repeat')
        .addEventListener('change', e => {
            setUserSettingsValue('theme.BG_REPEAT', e.target.value);
            document.body.style.setProperty(styleVars.BG_REPEAT, getUserSettingsValue('theme.BG_REPEAT'));
        });
    appWindow.querySelector('section[data-id=wallpaper] .options #bg-size')
        .addEventListener('change', e => {
            setUserSettingsValue('theme.BG_SIZE', e.target.value);
            document.body.style.setProperty(styleVars.BG_SIZE, getUserSettingsValue('theme.BG_SIZE'));
        });
    appWindow.querySelector('section[data-id=wallpaper] .options #bg-color')
        .addEventListener('change', e => {
            setUserSettingsValue('theme.BG_COLOR', e.target.value);
            document.body.style.setProperty(styleVars.BG_COLOR, getUserSettingsValue('theme.BG_COLOR'));
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
})();

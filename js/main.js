const runningApps = [];
let isMouseDown = false;
const mouseDownPosition = {x: 0, y: 0};
const windowResizeMouseDown = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false
};
let isMouseDownAppTopBar = false;
const body = document.body;
const loadScreen = body.querySelector('.load-screen');
const panel = body.querySelector('.panel');
const desktop = body.querySelector('.desktop');
const appsButton = panel.querySelector('.appsButton');
const expoButton = panel.querySelector('.expo-button');
const appListContainer = panel.querySelector('.appList .list');
const appListSearchBar = panel.querySelector('.appList .search input');
const openedWindowList = panel.querySelector('.openedWindowList');
const timeContainer = body.querySelector('.widgets .time');
const dateContainer = body.querySelector('.widgets .date');
const desktopsList = desktop.querySelector('.virtual-desktops');
const desktopsListPreview = desktop.querySelector('.desktops-list .v-desktops-list');
let focusedWindow;
let activeVirtualDesktop = 'v1';
const EXPO_APP_THUMB_SIZE = 300;

function setSavedUserData() {
    updateUserSettingsFromLocalStorage();

    setTheme();
}

function timer() {
    timeContainer.innerText = dateToString(new Date(), userSettings.dateTime.time.format);
    dateContainer.innerText = dateToString(new Date(), userSettings.dateTime.date.format);
    setTimeout(timer, 1000);
}

function getAllVirtualDesktops() {
    return desktopsList.querySelectorAll(`.virtual`);
}

function getActiveVirtualDesktop() {
    return desktopsList.querySelector(`.virtual#${activeVirtualDesktop}`);
}

function getActiveVirtualPanel() {
    return openedWindowList.querySelector(`.virtual-panel[data-id="${activeVirtualDesktop}"]`);
}

function getAllVirtualPanels() {
    return openedWindowList.querySelectorAll(`.virtual-panel`);
}

function getActiveVirtualDesktopPreview() {
    return desktopsListPreview.querySelector(`.virtual-preview[data-id="${activeVirtualDesktop}"]`);
}

function getAllVirtualDesktopPreviews() {
    return desktopsListPreview.querySelectorAll(`.virtual-preview`);
}

function setActiveDesktop(id) {
    getAllVirtualDesktops().forEach(el => el.classList.remove('active'));
    getAllVirtualDesktopPreviews().forEach(el => el.classList.remove('active'));
    getAllVirtualPanels().forEach(el => el.classList.remove('active'));

    desktopsListPreview.querySelector(`.virtual-preview[data-id="${id}"]`).classList.add('active');
    desktopsList.querySelector(`.virtual#${id}`).classList.add('active');
    openedWindowList.querySelector(`.virtual-panel[data-id="${id}"]`).classList.add('active');
    ;
    activeVirtualDesktop = id;
}

function isExpoMode() {
    return body.classList.contains('expo-mode');
}

function resizeCanvasPreview(canvas) {
    const {width, height} = canvas;
    let newWidth, newHeight, ratio;
    if (width > height) {
        ratio = width / height;
        newWidth = EXPO_APP_THUMB_SIZE;
        newHeight = height / ((width / EXPO_APP_THUMB_SIZE) * ratio);
    } else {
        ratio = height / width;
        newHeight = EXPO_APP_THUMB_SIZE;
        newWidth = width / ((height / EXPO_APP_THUMB_SIZE) * ratio);
    }
    canvas.style.width = newWidth + 'px';
    canvas.style.height = newHeight + 'px';
}

function openExpoMode() {
    allWindowsOnDesktop(activeVirtualDesktop, app => {
        screenshotApp(app, canvas => resizeCanvasPreview(canvas));
    })
    body.classList.add('expo-mode');
}

function closeExpoMode() {
    body.classList.remove('expo-mode');
}

function addVirtualDesktop() {
    const randomId = makeId('virtual');
    desktopsList.appendChild(htmlToElement(`<div class="virtual" id="${randomId}"></div>`));
    desktopsListPreview.appendChild(htmlToElement(`<div class="virtual-preview" data-id="${randomId}"></div>`));
    openedWindowList.appendChild(htmlToElement(`<div class="virtual-panel" data-id="${randomId}"></div>`));
}

function initEvents() {
    registerOsEvents('main', {
        [osEventsTypes.OPEN_APP]: ({appName, args}) => {
            runApp(appName, args)
        },
        [osEventsTypes.CLOSE_APP]: ({appId}) => {
            closeApp(appId);
        },
        [osEventsTypes.SCREEN_LOAD_END]: () => {
            setTimeout(() => {
                loadScreen.classList.add('hidden');
                setTimeout(() => {
                    loadScreen.style.display = 'none';
                }, 1000);
            }, 1000);
        }
    })
    desktop.addEventListener('click', e => {
        const {target} = e;
        console.log(target);
        if (!target.closest('.appList')) {
            appsButton.classList.remove('active');
        }
        if (target.closest('.add-desktop')) {
            addVirtualDesktop();
            return;
        }
        if (target.classList.contains('virtual-preview')) {
            setActiveDesktop(target.getAttribute('data-id'));
        }
        if (target.classList.contains('virtual')) {
            closeExpoMode();
        }
        const appWindow = target.closest('.appWindow');

        if (appWindow) {
            const appId = appWindow.getAttribute('id');
            blurAllApps();
            focusApp(appId);
            closeExpoMode();

            if (target.classList.contains('windowButton')) {

                if (target.classList.contains('close')) {
                    closeApp(appId);
                }
                if (target.classList.contains('minimize')) {
                    minimizeApp(appId);
                }
                if (target.classList.contains('maximize')) {
                    toggleMaximizeApp(appId);
                }
                return;
            }

            if (isCoreApp(appId)) {
                dispatchAppEvents(appId, 'click', e);
            }
        }
    });
    panel.addEventListener('click', e => {
        const {target} = e;
        if (target === appsButton) {
            if (appsButton.classList.contains('active')) {
                appsButton.classList.remove('active');
            } else {
                appsButton.classList.add('active');
            }
            return;
        }
        if (target === expoButton) {
            openExpoMode();
        }
        const appBarIcon = target.closest('.barWindow');
        if (appBarIcon) {
            const appId = appBarIcon.getAttribute('data-appId');
            const appWindow = getAppWindow(appId);
            if (appWindow.classList.contains('focused')) {
                minimizeApp(appId)
            } else {
                focusApp(appId);
            }
            return;
        }
    });
    appListContainer.addEventListener('click', e => {
        const app = e.target.closest('.appListElement')
        if (!app) {
            return;
        }
        const name = app.getAttribute('data-name');
        const args = JSON.parse(decodeURIComponent(app.getAttribute('data-arguments')));
        if (appList[name].options.singleInstance
            && runningApps.some(app => app.name === name)) {
            alert("already running");
            console.log(runningApps);
            return;
        }
        runApp(name, args);
        appsButton.classList.remove('active');
    });
    appListSearchBar.addEventListener('input', e => {
        const value = e.target.value.toLowerCase();
        if (!value) {
            createMenu();
            return;
        }

        appListContainer.innerHTML = [
            ...Object.keys(appList)
                .filter(key => appList[key].title.toLowerCase().includes(value))
                .map(key => ({
                    appName: key,
                    icon: appList[key].icon,
                    title: appList[key].title,
                    args: {}
                })),
            ...searchFiles(value).map(file => ({
                appName: resolveAppForFileType(file.type),
                icon: {
                    name: getIconBaseOnType(file.type),
                    bgColor: '#00c5ff'
                },
                title: file.name,
                args: {file: file.path}
            }))
        ].map(({appName, icon, title, args}) => {
            value.split('').forEach(chr => {
                title = title
                    .replaceAll(chr, `<b>${chr}</b>`)
                    .replaceAll(chr.toUpperCase(), `<b>${chr.toUpperCase()}</b>`)
            });
            title = title.replaceAll('</b><b>', '')
            title = title.replaceAll('<b>', '<b><u>');
            title = title.replaceAll('</b>', '</u></b>');
            return getAppListIcon(appName, args, icon, title);
        }).join('');
    })
    document.addEventListener('dblclick', e => {
        const windowTitleBar = e.target.closest('.windowTitle');
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (windowTitleBar) {
            toggleMaximizeApp(appId);
        }
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'dblclick', e);
        }
    });
    document.addEventListener('mousedown', e => {
        isMouseDown = true;
        mouseDownPosition.x = e.clientX;
        mouseDownPosition.y = e.clientY;
        const appWindow = e.target.closest('.appWindow');
        if (appWindow) {
            const windowTopBar = e.target.closest('.windowTop');
            focusedWindow = appWindow;
            if (windowTopBar) {
                isMouseDownAppTopBar = true;
            }
            const resizeField = e.target.closest('.resize-field');
            if (resizeField) {
                if (resizeField.classList.contains('resize-right')) {
                    windowResizeMouseDown.right = true;
                }
                if (resizeField.classList.contains('resize-left')) {
                    windowResizeMouseDown.left = true;
                }
                if (resizeField.classList.contains('resize-top')) {
                    windowResizeMouseDown.top = true;
                }
                if (resizeField.classList.contains('resize-bottom')) {
                    windowResizeMouseDown.bottom = true;
                }
                if (resizeField.classList.contains('resize-top-right')) {
                    windowResizeMouseDown.topRight = true;
                }
                if (resizeField.classList.contains('resize-bottom-right')) {
                    windowResizeMouseDown.bottomRight = true;
                }
                if (resizeField.classList.contains('resize-top-left')) {
                    windowResizeMouseDown.topLeft = true;
                }
                if (resizeField.classList.contains('resize-bottom-left')) {
                    windowResizeMouseDown.bottomLeft = true;
                }
            }
        }
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'mousedown', e);
        }
    });
    document.addEventListener('mouseup', e => {
        isMouseDown = false;
        mouseDownPosition.x = 0;
        mouseDownPosition.y = 0;
        isMouseDownAppTopBar = false;

        windowResizeMouseDown.right = false;
        windowResizeMouseDown.left = false;
        windowResizeMouseDown.top = false;
        windowResizeMouseDown.bottom = false;
        windowResizeMouseDown.topRight = false;
        windowResizeMouseDown.bottomRight = false;
        windowResizeMouseDown.topLeft = false;
        windowResizeMouseDown.bottomLeft = false;

        allWindows(el => el.classList.remove('no-transition'));
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'mouseup', e);
        }
    }, true);
    document.addEventListener('mouseleave', e => {
        if (e.target !== document) {
            const appWindow = e.target.closest('.appWindow');
            const appId = appWindow?.getAttribute('id');
            if (isCoreApp(appId)) {
                dispatchAppEvents(appId, 'mouseleave', e);
            }
        }
    }, true);
    window.addEventListener('mousemove', e => {
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');


        const rect = focusedWindow?.getBoundingClientRect();
        if (rect) {
            focusedWindow.classList.add('no-transition');
            if (windowResizeMouseDown.right || windowResizeMouseDown.bottomRight || windowResizeMouseDown.topRight) {
                focusedWindow.style.width = e.clientX + 5 - rect.left + 'px'
            }
            if (windowResizeMouseDown.left || windowResizeMouseDown.bottomLeft || windowResizeMouseDown.topLeft) {
                const diff = e.clientX - rect.left;

                focusedWindow.style.width = rect.width - diff + 'px'
                focusedWindow.style.left = e.clientX + 'px'
            }
            if (windowResizeMouseDown.top || windowResizeMouseDown.topLeft || windowResizeMouseDown.topRight) {
                const diff = e.clientY - rect.top;

                focusedWindow.style.height = rect.height - diff + 'px'
                focusedWindow.style.top = e.clientY + 'px'
            }
            if (windowResizeMouseDown.bottom || windowResizeMouseDown.bottomRight || windowResizeMouseDown.bottomLeft) {
                focusedWindow.style.height = e.clientY + 5 - rect.top + 'px'
            }
            if (Object.keys(windowResizeMouseDown).map(key => windowResizeMouseDown[key]).some(key => key === true)) {
                dispatchOsEvents(osEventsTypes.RESIZE_WINDOW, null);
            }
        }

        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'mousemove', e);
        }
        if (!isMouseDownAppTopBar || !focusedWindow) {
            return;
        }

        const deltaX = e.movementX;
        const deltaY = e.movementY;
        focusedWindow.classList.add('no-transition');
        let left = rect.x + deltaX;
        if (left < 0) {
            left = 0;
        }
        if (left + rect.width > window.innerWidth) {
            left = window.innerWidth - rect.width;
        }
        let top = rect.y + deltaY;
        if (top < 0) {
            top = 0;
        }
        if (top + rect.height > window.innerHeight) {
            top = window.innerHeight - rect.height;
        }
        focusedWindow.style.left = left + 'px';
        focusedWindow.style.top = top + 'px';
    }, true);
    window.addEventListener('dragstart', e => {
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'dragstart', e);
        }
    }, true);
    window.addEventListener('dragover', e => {
        e.preventDefault();
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'dragover', e);
        }
    }, true);
    window.addEventListener('dragleave', e => {
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'dragleave', e);
        }
    }, true);
    window.addEventListener('drop', e => {
        e.preventDefault();
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'drop', e);
        }
    }, true);
    window.addEventListener('keyup', e => {
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'keyup', e);
        }
    }, true);
    window.addEventListener('keydown', e => {
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'keydown', e);
        }
    }, true);
}

function createMenu() {
    appListContainer.innerHTML = Object.keys(appList).map(appName => {
        const {title, icon} = appList[appName];

        return getAppListIcon(appName, {}, icon, title);

    }).join('');
}

function getAppListIcon(appName, args, icon, title) {
    args = encodeURIComponent(JSON.stringify(args));
    const iconFontColor = lightOrDark(icon.bgColor) === 'light' ? '#000' : '#fff';
    return `<div class="appListElement" data-name="${appName}" data-arguments="${args}" 
                style="--color: ${icon.bgColor}; --textColor: ${iconFontColor}">
                    <div class="icon">
                        <i class="${icon.name}"></i>
                    </div>
                    <div class="appTitle">${title}</div>
                </div>`;
}

runScreenLoader();

setSavedUserData();
createMenu();
initEvents();
timer();
// runApp('grid_calc', {file: 'home/users-list.csv'})

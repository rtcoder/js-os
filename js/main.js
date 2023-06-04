const runningApps = [];
let isMouseDown = false;
let isMouseDownAppTopBar = false;
const animationDuration = 200;
const panel = document.querySelector('.panel');
const desktop = document.querySelector('.desktop');
const appsButton = document.querySelector('.appsButton');
const appListContainer = document.querySelector('.appList');
const openedWindowList = document.querySelector('.openedWindowList');
const timeContainer = document.querySelector('.tray .time');
const dateContainer = document.querySelector('.tray .date');
let focusedWindow;

function setSavedUserData() {
    updateUserSettingsFromLocalStorage();

    setTheme(userSettings.theme);
}

function timer() {
    timeContainer.innerText = dateToString(new Date(), userSettings.dateTime.time.format);
    dateContainer.innerText = dateToString(new Date(), userSettings.dateTime.date.format);
    setTimeout(timer, 1000);
}

function initEvents() {
    desktop.addEventListener('click', e => {
        appsButton.classList.remove('active');
        const {target} = e;

        const appWindow = target.closest('.appWindow');

        if (appWindow) {
            const appId = appWindow.getAttribute('id');
            blurAllApps();
            focusApp(appId);

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

        appsButton.classList.remove('active');

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

        if (target.closest('.showDesktop')) {
            allWindows(el => {
                minimizeApp(el.getAttribute('id'))
            })
        }
    });
    appListContainer.addEventListener('click', e => {
        const app = e.target.closest('.appListElement')
        if (!app) {
            return;
        }
        const name = app.getAttribute('data-name');
        if (appList[name].options.singleInstance
            && runningApps.some(app => app.name === name)) {
            alert("already running");
            console.log(runningApps);
            return;
        }
        runApp(name);

        appsButton.classList.remove('active');
    });
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
        const windowTopBar = e.target.closest('.windowTop');
        const appWindow = e.target.closest('.appWindow');
        if (windowTopBar) {
            isMouseDownAppTopBar = true;
            focusedWindow = appWindow
        }
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'mousedown', e);
        }
    });
    document.addEventListener('mouseup', e => {
        isMouseDown = false;
        isMouseDownAppTopBar = false;
        allWindows(el => el.classList.remove('no-transition'));
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'mouseup', e);
        }
    }, true);
    window.addEventListener('mousemove', e => {
        const appWindow = e.target.closest('.appWindow');
        const appId = appWindow?.getAttribute('id');
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'mousemove', e);
        }
        if (!isMouseDownAppTopBar || !focusedWindow) {
            return;
        }

        const deltaX = e.movementX;
        const deltaY = e.movementY;
        const rect = focusedWindow.getBoundingClientRect();
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
        console.log({appId})
        if (isCoreApp(appId)) {
            dispatchAppEvents(appId, 'drop', e);
        }
    }, true);
}

function createMenu() {
    appListContainer.innerHTML = Object.keys(appList).map(appName => {
        const {title, icon} = appList[appName];

        return `<div class="appListElement" data-name="${appName}">
                    <div class="icon" style="color: ${icon.bgColor}">
                        <i class="${icon.name}"></i>
                    </div>
                    ${title}
                </div>`;

    }).join('');
}

setSavedUserData();
createMenu();
initEvents();
timer();

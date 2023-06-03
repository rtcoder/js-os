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
            const appName = appWindow.getAttribute('id');
            blurAllApps();
            focusApp(appName);

            if (target.classList.contains('windowButton')) {

                if (target.classList.contains('close')) {
                    closeApp(appName);
                }
                if (target.classList.contains('minimize')) {
                    minimizeApp(appName);
                }
                if (target.classList.contains('maximize')) {
                    toggleMaximizeApp(appName);
                }
                return;
            }

            if (isCoreApp(appName)) {
                dispatchAppEvents(appName, 'click', e);
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
            const appName = appBarIcon.getAttribute('data-appId');
            const appWindow = getAppWindow(appName);
            if (appWindow.classList.contains('focused')) {
                minimizeApp(appName)
            } else {
                focusApp(appName);
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
        if (runningApps.includes(name) && appList[name].options.singleInstance) {
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
        const appName = appWindow?.getAttribute('id');
        if (windowTitleBar) {
            toggleMaximizeApp(appName);
        }
        if (isCoreApp(appName)) {
            dispatchAppEvents(appName, 'dblclick', e);
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
        const appName = appWindow?.getAttribute('id');
        if (isCoreApp(appName)) {
            dispatchAppEvents(appName, 'mousedown', e);
        }
    });
    document.addEventListener('mouseup', e => {
        isMouseDown = false;
        isMouseDownAppTopBar = false;
        allWindows(el => el.classList.remove('no-transition'));
        const appWindow = e.target.closest('.appWindow');
        const appName = appWindow?.getAttribute('id');
        if (isCoreApp(appName)) {
            dispatchAppEvents(appName, 'mouseup', e);
        }
    }, true);
    window.addEventListener('mousemove', e => {
        e.preventDefault();
        const appWindow = e.target.closest('.appWindow');
        const appName = appWindow?.getAttribute('id');
        if (isCoreApp(appName)) {
            dispatchAppEvents(appName, 'mousemove', e);
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
}

function createMenu() {
    appListContainer.innerHTML = Object.keys(appList).map(appName => {
        const {title, icon} = appList[appName];

        return `<div class="appListElement" data-name="${appName}">
                    <img src="${icon}" alt="${title}"> ${title}
                </div>`;

    }).join('');
}

createMenu();
initEvents();
timer();

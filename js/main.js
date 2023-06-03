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
let focusedWindow;

function timer() {
    let format = 'HH:mm';
    if (timeContainer.getAttribute('data-seconds') === 'show') {
        format = 'HH:mm:ss';
    }
    timeContainer.innerText = dateToString(new Date(), format);
    setTimeout(timer, 1000);
}

function runApp(name) {
    blurAllApps();

    const {title, options, url, path, icon} = appList[name];
    const content = `<iframe src="${url||path}" frameborder="0"></iframe>`;
    const {windowButtons} = options;
    const buttonsOptions = Object.keys(windowButtons).filter(key => windowButtons[key]).join();

    let style = '';
    if (options.width) {
        style += `width: ${options.width};`;
    }
    if (options.height) {
        style += `height: ${options.height};`
    }

    const template = document.getElementById('window-template').innerHTML
        .replaceAll('{name}', name)
        .replaceAll('{icon}', icon)
        .replaceAll('{title}', title)
        .replaceAll('{buttonsOptions}', buttonsOptions)
        .replaceAll('{style}', style)
        .replaceAll('{content}', content);


    const barTemplate = document.getElementById('bar-window-template').innerHTML
        .replaceAll('{name}', name)
        .replaceAll('{icon}', icon)
        .replaceAll('{title}', title);

    desktop.append(htmlToElement(template))
    openedWindowList.append(htmlToElement(barTemplate))

    runningApps.push(name);
}

function closeApp(appId) {
    console.log("closed: " + appId);
    const appKey = runningApps.indexOf(appId);
    runningApps.splice(appKey, 1);
    const appWindow = document.querySelector(`.appWindow#${appId}`);
    const appBarIcon = document.querySelector(`.barWindow[data-appId="${appId}"]`);
    appWindow.classList.add('closing');
    appBarIcon.classList.add('closing');

    setTimeout(() => {
        appWindow.remove();
        appBarIcon.remove();
    }, animationDuration);

    blurAllApps();
}

function blurAllApps() {
    document.querySelectorAll('.appWindow').forEach(el => el.classList.remove('focused'));
    document.querySelectorAll('.barWindow').forEach(el => el.classList.remove('focused'));
}

function allWindows(callback) {
    document.querySelectorAll('.appWindow').forEach(callback);
}

function getAppWindow(appId) {
    return document.querySelector(`.appWindow#${appId}`);
}

function focusApp(appId) {
    blurAllApps();

    const appWindow = getAppWindow(appId);
    const appBarIcon = document.querySelector(`.barWindow[data-appId="${appId}"]`);

    appWindow.classList.add('focused');
    appWindow.classList.remove('minimized');
    appBarIcon.classList.add('focused');
}

function minimizeApp(appId) {
    console.log("minimized: " + appId);
    getAppWindow(appId).classList.add("minimized");
    blurAllApps();
}

function toggleMaximizeApp(appId) {
    const appWindow = getAppWindow(appId);
    if (appWindow.getAttribute('data-maximized') === 'true') {
        restoreAppSize(appId);
    } else {
        maximizeApp(appId);
    }
}

function maximizeApp(appId) {
    console.log("maximized: " + appId);
    const appWindow = getAppWindow(appId);
    const rect = appWindow.getBoundingClientRect();

    appWindow.setAttribute("data-w", `${rect.width}`);
    appWindow.setAttribute("data-h", `${rect.height}`);
    appWindow.setAttribute("data-t", `${rect.top}`);
    appWindow.setAttribute("data-l", `${rect.left}`);
    appWindow.setAttribute("data-maximized", "true");
}

function restoreAppSize(appId) {
    console.log("restored: " + appId);
    const appWindow = getAppWindow(appId);
    const w = appWindow.getAttribute("data-w");
    const h = appWindow.getAttribute("data-h");
    const t = appWindow.getAttribute("data-t");
    const l = appWindow.getAttribute("data-l");
    appWindow.removeAttribute("data-w");
    appWindow.removeAttribute("data-h");
    appWindow.removeAttribute("data-t");
    appWindow.removeAttribute("data-l");
    appWindow.setAttribute("data-maximized", "false");
    appWindow.setAttribute("data-w", `${w}px`);
    appWindow.setAttribute("data-h", `${h}px`);
    appWindow.setAttribute("data-t", `${t}px`);
    appWindow.setAttribute("data-l", `${l}px`);
}

function initEvents() {
    desktop.addEventListener('click', e => {
        appsButton.classList.remove('active');
        const {target} = e;

        const appWindow = target.closest('.appWindow');
        if (appWindow) {
            const appName = appWindow.getAttribute('id');

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

        if(target.closest('.showDesktop')){
            allWindows(el=>{
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
        if (windowTitleBar) {
            const appWindow = e.target.closest('.appWindow');
            const appName = appWindow.getAttribute('id');
            toggleMaximizeApp(appName);
        }
    });
    document.addEventListener('mousedown', e => {
        isMouseDown = true;
        const windowTopBar = e.target.closest('.windowTop');
        const _window = e.target.closest('.appWindow');
        if (windowTopBar) {
            isMouseDownAppTopBar = true;
            focusedWindow = _window
        }
    });
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        isMouseDownAppTopBar = false;
        allWindows(el => el.classList.remove('no-transition'));
    }, true);
    window.addEventListener('mousemove', e => {
        e.preventDefault();
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

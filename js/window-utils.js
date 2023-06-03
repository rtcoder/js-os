function allWindows(callback) {
    document.querySelectorAll('.appWindow').forEach(callback);
}

function getAppWindow(appId) {
    return document.querySelector(`.appWindow#${appId}`);
}

function isCoreApp(appId) {
    return !!appList[appId]?.isSystemApp;
}

function blurAllApps() {
    document.querySelectorAll('.appWindow').forEach(el => el.classList.remove('focused'));
    document.querySelectorAll('.barWindow').forEach(el => el.classList.remove('focused'));
}

function focusApp(appId) {
    blurAllApps();

    const appWindow = getAppWindow(appId);
    const appBarIcon = document.querySelector(`.barWindow[data-appId="${appId}"]`);

    appWindow.classList.add('focused');
    appWindow.classList.remove('minimized');
    appBarIcon.classList.add('focused');
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

    if (runningApps.length) {
        focusApp(runningApps[0]);
    }
}

function addStyleToSystemAppHtml(html, styleUrl) {
    return `<link rel="stylesheet" href="${styleUrl}"/>${html}`;
}

function addJsScriptToSystemAppHtml(appId, scriptUrl) {
    const appWindow = getAppWindow(appId);
    let scriptEle = document.createElement("script");
    scriptEle.async = false;
    scriptEle.defer = true;
    scriptEle.setAttribute("src", scriptUrl);
    appWindow.appendChild(scriptEle);

}

async function runApp(name) {
    blurAllApps();

    const {title, options, url, path, css, js, icon, isSystemApp} = appList[name];
    let content = `<iframe src="${url || path}" frameborder="0"></iframe>`;
    const {windowButtons, fullscreen} = options;
    const buttonsOptions = Object.keys(windowButtons).filter(key => windowButtons[key]).join();
    if (isSystemApp) {
        content = await fetch(path)
            .then(res => res.text())
            .then(html => addStyleToSystemAppHtml(html, css));
    }
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
        .replaceAll('{fullscreen}', `${!!fullscreen}`)
        .replaceAll('{isSystemApp}', `${!!isSystemApp}`)
        .replaceAll('{content}', content);


    const barTemplate = document.getElementById('bar-window-template').innerHTML
        .replaceAll('{name}', name)
        .replaceAll('{icon}', icon)
        .replaceAll('{title}', title);

    desktop.appendChild(htmlToElement(template));
    openedWindowList.append(htmlToElement(barTemplate));
    addJsScriptToSystemAppHtml(name, js);

    runningApps.push(name);
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
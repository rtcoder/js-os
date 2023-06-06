(() => {
    const {currentScript} = document;
    const appWindow = currentScript.parentNode;
    const appId = appWindow.getAttribute('id');

    const content = appWindow.querySelector('.files-app .content-panel');
    const navigationBar = appWindow.querySelector('.navigation-bar');
    const backBtn = appWindow.querySelector('.navigation .back');
    const forwardBtn = appWindow.querySelector('.navigation .forward');
    const history = [];
    let historyIndex = -1;
    const currentPath = [];

    function displayContent(dirPath) {
        const dirTree = getDirTree(userSettings.dirTree, dirPath);
        content.innerHTML = dirTree.sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => a.type === fileTypes.DIR ? -1 : 1)
            .map(file => {
                const icon = `<i class="${getIconBaseOnType(file.type)}"></i>`;
                return `<div class="file-item" 
                        draggable="true"
                        data-name="${file.name}"
                        data-type="${file.type}"
                        data-path="${[...dirPath, file.name].join('/')}">
                        ${icon}
                        ${file.name}
                    </div>`
            }).join('')
    }

    function getDirTree(tree, path) {
        const [dir, ...rest] = path;
        if (!dir) {
            return tree;
        }
        const foundDir = tree.find(obj => obj.name === dir && obj.type === fileTypes.DIR);
        if (!foundDir) {
            return [];
        }

        return !rest.length
            ? foundDir.tree || []
            : getDirTree(foundDir.tree || [], rest);
    }

    function modifyDirTree(tree, path, callback) {
        const [dir, ...rest] = path;
        if (!dir) {
            return;
        }
        const foundDir = tree.find(obj => obj.name === dir && obj.type === fileTypes.DIR);
        if (!foundDir) {
            return;
        }

        if (!rest.length) {
            foundDir.tree = callback(foundDir.tree);
        }
        modifyDirTree(foundDir.tree || [], rest, callback)
    }

    function getIconBaseOnType(type) {
        return {
            [fileTypes.DIR]: 'fa-sharp fa-solid fa-folder',
            [fileTypes.FILE]: 'fa-sharp fa-solid fa-file',
            [fileTypes.TEXT]: 'fa-sharp fa-solid fa-file-lines',
            [fileTypes.PDF]: 'fa-sharp fa-solid fa-file-pdf',
            [fileTypes.CSV]: 'fa-sharp fa-solid fa-file-csv',
            [fileTypes.IMAGE]: 'fa-sharp fa-solid fa-file-image',
        }[type] || 'fa-sharp fa-solid fa-file';
    }

    function blurFiles() {
        content.querySelectorAll('.file-item')
            .forEach(el => el.classList.remove('selected', 'dragover'));
    }

    function selectFile(file) {
        blurFiles();
        file.classList.add('selected');
    }

    function openDir(dir) {
        const type = +dir.getAttribute('data-type');
        if (type !== fileTypes.DIR) {
            openFile(dir);
            return;
        }
        currentPath.push(dir.getAttribute('data-name'));
        if (historyIndex !== history.length - 1) {
            history.length = historyIndex + 1
        }
        history.push([...currentPath]);
        historyIndex++;
        refreshNavigationBar();
        displayContent(currentPath);
        backBtn.classList.remove('inactive');
        forwardBtn.classList.add('inactive');
    }

    function openFile(file) {
        const type = +file.getAttribute('data-type');
        if (type === fileTypes.DIR) {
            return;
        }
        const appName = resolveAppForFileType(type);
        if (!appName) {
            return;
        }
        dispatchOsEvents(osEventsTypes.OPEN_APP, {
            appName,
            args: {file: file.getAttribute('data-path')}
        });
    }

    function openPath(pathString, affectHistory = true) {
        const path = pathString.split('/').filter(v => v.length);
        currentPath.length = 0;
        path.forEach(item => currentPath.push(item));
        displayContent(currentPath);
        if (affectHistory) {
            if (!history.length ||
                pathString !== history[history.length - 1].join('/')) {
                if (historyIndex !== history.length - 1) {
                    history.length = historyIndex + 1
                }
                history.push(path);
                historyIndex++;
            }
        }
        if (history.length) {
            if (historyIndex > 0) {
                backBtn.classList.remove('inactive');
            }
            if (historyIndex < history.length - 1) {
                backBtn.classList.remove('inactive');
            }
        }
        refreshNavigationBar();
    }

    function refreshNavigationBar() {
        navigationBar.innerHTML = currentPath.map((name, idx) => {
            const parts = [...currentPath];
            parts.length = idx + 1
            return `<div class="nav-item" data-path="${parts.join('/')}">${name}</div>`
        }).join('');
    }

    function goBack() {
        const path = history[historyIndex - 1];
        if (!path) {
            return;
        }
        historyIndex--;
        openPath(path.join('/'), false);
        if (historyIndex <= 0) {
            backBtn.classList.add('inactive');
        }
        forwardBtn.classList.remove('inactive');
    }

    function goForward() {
        const path = history[historyIndex + 1];
        if (!path) {
            return;
        }
        historyIndex++;
        openPath(path.join('/'), false);
        if (historyIndex >= history.length - 1) {
            forwardBtn.classList.add('inactive');
        }
        backBtn.classList.remove('inactive');
    }

    function moveFile({from, to, file}) {
        if (from.join('/') === to.join('/')) {
            return;
        }
        const fullFile = getFullFile(userSettings.dirTree, from, file);

        if (getDirTree(userSettings.dirTree, to).find(f => f.name === file)) {
            alert('A file with the same name already exists in the destination folder');
            return;
        }

        modifyDirTree(userSettings.dirTree, from, tree => {
            return tree.filter(f => f.name !== file);
        })
        modifyDirTree(userSettings.dirTree, to, tree => {
            return [...tree, fullFile];
        })

        dispatchOsEvents(osEventsTypes.REFRESH_WINDOW, null)
    }

    openPath('');
    registerOsEvents(appId, {
        [osEventsTypes.REFRESH_WINDOW]: e => {
            displayContent(currentPath);
            refreshNavigationBar();
            console.log(userSettings)
        }
    })
    registerAppEvents(appId, {
        click: e => {
            const file = e.target.closest('.file-item');
            if (file) {
                selectFile(file);
                return;
            }
            if (e.target === content) {
                blurFiles();
                return;
            }
            const navigation = e.target.closest('.navigation');
            if (navigation) {
                const navItem = e.target.closest('.nav-item');
                if (navItem) {
                    const path = navItem.getAttribute('data-path');
                    openPath(path);
                    return;
                }
                const backButton = e.target.closest('.back');
                if (backButton) {
                    goBack();
                    return;
                }
                const forwardButton = e.target.closest('.forward');
                if (forwardButton) {
                    goForward()
                    return;
                }
            }
        },
        dblclick: e => {
            const file = e.target.closest('.file-item');
            if (file) {
                openDir(file)
            }
        },
        dragover: e => {
            if (e.target.closest('.content-panel')) {
                content.classList.add('dragover')
            }
            const file = e.target.closest('.file-item');
            const type = file?.getAttribute('data-type');
            if (file && type !== undefined && +type === fileTypes.DIR) {
                file.classList.add('dragover')
            } else {
                blurFiles();
            }
        },
        dragleave: e => {
            if (e.target.closest('.content-panel')
                && !e.target.closest('.file-item')) {
                content.classList.remove('dragover')
            }
        },
        dragstart: e => {
            const file = e.target.closest('.file-item');
            e.dataTransfer.setData("text", JSON.stringify({
                file: file.getAttribute('data-name'),
                from: currentPath,
                appId
            }));
        },
        drop: e => {
            const data = JSON.parse(e.dataTransfer.getData('text'));
            content.classList.remove('dragover');
            moveFile({...data, to: currentPath})
        },
        mouseup: e => {
            content.classList.remove('dragover')
        },
    })
})();

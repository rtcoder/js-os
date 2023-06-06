(() => {
    const {currentScript} = document;
    const appWindow = currentScript.parentNode;
    const appId = appWindow.getAttribute('id');
    const args = JSON.parse(
        decodeURIComponent(appWindow.getAttribute('data-arguments'))
    );
    let locationPath = '/';
    const history = [];
    let historyIndex = 0;
    let currentCommand = '';

    const commandInput = appWindow.querySelector('.command');
    const output = appWindow.querySelector('.output');
    commandInput.addEventListener('input', () => {
        currentCommand = commandInput.value;
    })

    function runCommand(command) {
        if (!command) {
            return;
        }
        history.push(command);
        historyIndex++;
        currentCommand = '';
        commandInput.value = '';

        const arr = command.split(' ');

        output.innerHTML += `<div class="row"><div class="location">${locationPath}</div>${command}</div>`;

        if (arr[0] === 'run') {
            const foundApp = Object.keys(appList).find(name => name === arr[1]);
            if (foundApp) {
                runApp(foundApp);
                output.innerHTML += `<div class="row">run: ${foundApp}</div>`;
            } else {
                output.innerHTML += `<div class="row">sh: cannot find app ${arr[1]}</div>`;
            }
        }

        if (arr[0] === 'open') {
            const filepath = arr[1];
            const fullPath = filepath.split('/');
            const filename = fullPath[fullPath.length - 1];
            fullPath.length = fullPath.length - 1;

            const file = getFullFile(userSettings.dirTree, fullPath, filename);

            if (file) {
                const foundApp = resolveAppForFileType(file.type);
                runApp(foundApp, {file: filepath});
                output.innerHTML += `<div class="row">run: ${foundApp}</div>`;
                output.innerHTML += `<div class="row">open: ${filepath}</div>`;
            } else {
                output.innerHTML += `<div class="row">sh: cannot find file ${filepath}</div>`;
            }
        }
    }

    registerAppEvents(appId, {
        click: _ => {
            commandInput.focus();
        },
        keydown: e => {
            console.log(e.key)
            if (e.key === 'Enter') {
                runCommand(commandInput.value);
            }

            if (e.key === 'ArrowUp') {
                if (historyIndex === 0) {
                    return;
                }
                historyIndex--;
                commandInput.value = history[historyIndex];
            }

            if (e.key === 'ArrowDown') {
                if (historyIndex === history.length - 1) {
                    commandInput.value = currentCommand;
                    return;
                }
                historyIndex++;
                commandInput.value = history[historyIndex];
            }
        }
    })
})();

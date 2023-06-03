const appList = {
    terminal: {
        isSystemApp: true,
        title: "Terminal",
        path: "apps/terminal.html",
        icon: "icons/default/terminal.png",
        options: {
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    },
    memory: {
        title: "Memory",
        url: 'https://rtcoder.github.io/MemoryGame/',
        icon: "icons/default/memory.png",
        options: {
            fullscreen: true,
            singleInstance: true,
            windowButtons: {
                min: true,
                max: false,
                close: true
            }
        }
    },
    tic_tac_toe: {
        title: "Tic Tac Toe",
        url: 'https://rtcoder.github.io/Tic-Tac-Toe/',
        icon: "icons/default/tictactoe.png",
        options: {
            width: '400px',
            height: '500px',
            singleInstance: true,
            windowButtons: {
                min: true,
                max: false,
                close: true
            }
        }
    },
    web_draft: {
        title: "WebDraft",
        url: 'https://rtcoder.github.io/WebDraft/',
        icon: "icons/default/webdraft.png",
        options: {
            fullscreen: true,
            singleInstance: true,
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    },
    photo_view: {
        title: "Photos Viewer",
        path: "apps/photo_view/",
        icon: "icons/default/photo_view.png",
        options: {
            singleInstance: true,
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    },
    calc: {
        title: "Calculator",
        path: "apps/calc/calc.html",
        icon: "icons/default/calc.png",
        options: {
            width: '250px',
            height: '360px',
            singleInstance: true,
            windowButtons: {
                min: true,
                max: false,
                close: true
            }
        }
    },
    writer: {
        title: "Writer",
        path: "apps/writer.html",
        icon: "icons/default/writer.png",
        options: {
            singleInstance: true,
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    },
    settings: {
        isSystemApp: true,
        title: "Settings",
        path: "core-apps/settings/settings.html",
        css: "core-apps/settings/css/style.css",
        js: "core-apps/settings/js/main.js",
        icon: "icons/default/settings.png",
        options: {
            width: '500px',
            height: '500px',
            singleInstance: true,
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    }
};

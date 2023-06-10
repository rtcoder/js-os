const appList = {
    terminal: {
        isSystemApp: true,
        title: "Terminal",
        path: "apps/terminal.html",
        icon: {name: "fa-light fa-terminal", bgColor: '#0573ae'},
        options: {
            width: '500px',
            height: '500px',
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
        icon: {name: "fa-sharp fa-regular fa-cards", bgColor: '#1dc79f'},
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
        icon: {name: "fa-light fa-circle-xmark", bgColor: '#4024ea'},
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
        icon: {name: "fa-sharp fa-regular fa-scribble", bgColor: '#aea005'},
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
    pix_view: {
        title: "PixView",
        path: "apps/pix_view/",
        icon: {name: "fa-sharp fa-regular fa-hexagon-image", bgColor: '#ae2405'},
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
        icon: {name: "fa-light fa-calculator-simple", bgColor: '#00c1b1'},
        options: {
            resizable: false,
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
        title: "ScriptPro",
        isSystemApp: true,
        icon: {name: "fa-sharp fa-light fa-code", bgColor: '#05aea8'},
        options: {
            width: '500px',
            height: '500px',
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    },
    grid_calc: {
        title: "GridCalc",
        isSystemApp: true,
        icon: {name: "fa-regular fa-function", bgColor: '#61ff09'},
        options: {
            width: '500px',
            height: '500px',
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
        icon: {name: "fa-sharp fa-regular fa-gear", bgColor: '#f30'},
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
    },
    files: {
        isSystemApp: true,
        title: "Files",
        icon: {name: "fa-sharp fa-regular fa-folders", bgColor: '#ffd800'},
        options: {
            width: '500px',
            height: '500px',
            windowButtons: {
                min: true,
                max: true,
                close: true
            }
        }
    },
    music: {
        isSystemApp: true,
        title: "Music",
        icon: {name: "fa-regular fa-music", bgColor: '#ff33dd'},
        options: {
            width: '300px',
            height: '600px',
            customWindowStyle: true,
            windowTopBar: false,
            resizable: false,
            windowButtons: {
                min: true,
                max: false,
                close: true
            }
        }
    }
};

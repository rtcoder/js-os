(async () => {
    const WRITER = {
        languages: [],
        currentLine: 1,
        tab: userSettings.appSettings.writer?.tabChar || '\t'
    };
    const {currentScript} = document;
    const appWindow = currentScript.parentNode;
    const appId = appWindow.getAttribute('id');
    const args = JSON.parse(
        decodeURIComponent(appWindow.getAttribute('data-arguments'))
    );


    const code = appWindow.querySelector('code');
    const textarea = appWindow.querySelector('textarea');
    const languageSelect = appWindow.querySelector('select.language-select');
    const caretPosition = appWindow.querySelector('.caret-position');

    await getLanguages();

    if (args.file) {

        const fullPath = args.file.split('/');
        const filename = fullPath[fullPath.length - 1];
        fullPath.length = fullPath.length - 1;
        setWindowTitle(appId, filename)
        const file = getFullFile(userSettings.dirTree, fullPath, filename);


        textarea.textContent = `#include <iostream>
using namespace std;

int main() {
    int n;
    long factorial = 1.0;

    cout << "Enter a positive integer: ";
    cin >> n;

    if (n < 0)
        cout << "Error! Factorial of a negative number doesn't exist.";
    else {
        for(int i = 1; i <= n; ++i) {
            factorial *= i;
        }
        cout << "Factorial of " << n << " = " << factorial;
    }

    return 0;
}`;
        setLanguage('cpp')
    }

    code.addEventListener("click", function (event) {
        textarea.style.color = "black";
    }, false);

    textarea.addEventListener("input", function (event) {
        refreshHighlighting();
        setCaretPosition();
    }, false);


    textarea.addEventListener("blur", function (event) {
        refreshHighlighting();
    }, false);

    textarea.addEventListener("selectstart", function (event) {

    }, false);

    languageSelect.addEventListener('change', e => {
        setLanguage(e.target.value);
    })

    function setCaretPosition() {
        const pos = textarea.selectionStart;
        const textToPosition = textarea.value.substring(0, pos);
        const lines = textToPosition.split('\n');
        const positionInLine = pos - (lines.length > 1
            ? lines.slice(0, -1).map(str => str.length).reduce((a, b) => a + b)
            : 0);
        WRITER.currentLine = lines.length;
        caretPosition.innerHTML = lines.length + ':' + (positionInLine - (lines.length - 2));
    }

    function highlightCurrentLine() {

        code.querySelectorAll('tr').forEach((tr, index) => {
            if (index + 1 === WRITER.currentLine) {
                tr.classList.add('current')
            } else {
                tr.classList.remove('current')
            }
        })
    }

    function refreshHighlighting() {
        textarea.innerHTML = textarea.value
        code.innerHTML = textarea.innerHTML;
        hljs.highlightBlock(code);
        hljs.lineNumbersBlock(code);
        textarea.style.color = "transparent";
        setTimeout(() => {
            highlightCurrentLine();
        }, 2)
    }

    async function getLanguages() {
        if (CACHE.writer?.languages) {
            WRITER.languages = CACHE.writer.languages;
        } else {
            WRITER.languages = await fetch('core-apps/writer/json/langs.json').then(res => res.json());
            if (!CACHE.writer) {
                CACHE.writer = {}
            }
            updateObjProp(CACHE, WRITER.languages, 'writer.languages');
        }

        languageSelect.innerHTML = WRITER.languages.map(lang =>
            `<option value="${lang.code}">${lang.name}</option>`
        ).join('');

        setLanguage('plaintext');
    }

    function setLanguage(langCode) {
        languageSelect.value = langCode;

        code.classList.remove(
            [...code.classList].find(cls => cls.startsWith('language-')) || ''
        );

        code.classList.add('language-' + langCode);

        refreshHighlighting();
    }

    function addIndent() {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const selection = textarea.value.substring(start, end);
        let tabsInserted = 1;

        if (selection.includes('\n')) {
            tabsInserted = selection.split('\n').length - 1

            textarea.value = textarea.value.substring(0, start)
                + selection.replaceAll('\n', '\n' + WRITER.tab)
                + textarea.value.substring(end)
        } else {
            textarea.value = textarea.value.substring(0, start)
                + WRITER.tab
                + textarea.value.substring(start)
        }

        textarea.selectionStart = start + (start === end ? 1 : 0);
        textarea.selectionEnd = (start !== end
            ? end + (tabsInserted * WRITER.tab.length)
            : start + 1);
        refreshHighlighting();
    }

    function removeIndent() {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const selection = textarea.value.substring(start, end);
        let charsRemoved = 1;

        if (selection.includes('\n')) {
            charsRemoved = 0;
            textarea.value = textarea.value.substring(0, start)
                + selection.split('\n').map(str => {
                    if (str.startsWith('\t')) {
                        charsRemoved++;
                        return str.replace('\t', '');
                    } else if (str.startsWith('    ')) {
                        charsRemoved += 4;
                        return str.replace(/^\s{4}/, '')
                    }
                    return str;
                }).join('\n')
                + textarea.value.substring(end)
        } else {
            textarea.value = textarea.value.substring(0, start)
                + WRITER.tab
                + textarea.value.substring(start)
        }

        textarea.selectionStart = start + (start === end ? 1 : 0);
        textarea.selectionEnd = (start !== end
            ? end - charsRemoved
            : start + 1);
        refreshHighlighting();
    }

    function addClosure(char) {
        const openingChar = char;
        const closingChar = {'{': '}', '[': ']', '(': ')'}[char];

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const selection = textarea.value.substring(start, end);

        textarea.value = textarea.value.substring(0, start)
            + openingChar + selection + closingChar
            + textarea.value.substring(end)

        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1
        refreshHighlighting();
    }

    refreshHighlighting();

    registerAppEvents(appId, {
        keydown: e => {
            if (e.target === textarea) {

                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        removeIndent();
                    } else {
                        addIndent();
                    }
                    e.preventDefault();
                }
                if (['{', '[', '('].includes(e.key)) {
                    addClosure(e.key);
                    e.preventDefault();
                }
            }
            setCaretPosition();
            highlightCurrentLine();
        },
        keyup: e => {
            setCaretPosition();
            highlightCurrentLine();
        },
        click: e => {
            setCaretPosition();
            highlightCurrentLine();
        }
    })
})();

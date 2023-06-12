(() => {
    const {currentScript} = document;
    const appWindow = currentScript.parentNode;
    const appId = appWindow.getAttribute('id');
    const args = JSON.parse(
        decodeURIComponent(appWindow.getAttribute('data-arguments'))
    );
    const tbody = appWindow.querySelector('tbody');
    const input = appWindow.querySelector('input.input');
    const csvContent = [];
const activeCellPosition={
    row:-1,
    column:-1
}
    function getAllRows() {
        return tbody.querySelectorAll('tr');
    }

    function csvToArray(text) {
        let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
        for (l of text) {
            if ('"' === l) {
                if (s && l === p) row[i] += l;
                s = !s;
            } else if (',' === l && s) l = row[++i] = '';
            else if ('\n' === l && s) {
                if ('\r' === p) row[i] = row[i].slice(0, -1);
                row = ret[++r] = [l = ''];
                i = 0;
            } else row[i] += l;
            p = l;
        }
        return ret;
    }

    function arrayToCSV(row) {
        for (let i in row) {
            row[i] = row[i].replace(/"/g, '""');
        }
        return '"' + row.join('","') + '"';
    }

    function colName(n) {
        const ordA = 'a'.charCodeAt(0);
        const ordZ = 'z'.charCodeAt(0);
        const len = ordZ - ordA + 1;

        let s = "";
        while (n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s;
    }

    function parseValues(arr) {
        return arr.map(line =>
            line.map(value =>
                isNaN(value)
                    ? value.trim()
                    : (value.includes('.')
                            ? parseFloat(value)
                            : parseInt(value)
                    )
            )
        );
    }

    function toComplexFormat(csvArray) {
        return csvArray.map(line => line.map(val => ({
            value: val,
            type: isNaN(val) ? 'string' : 'number',
            isActive: false,
        })));
    }

    function displayContent(content) {
        csvContent.length = 0;
        csvContent.push(...toComplexFormat(parseValues(csvToArray(content))));
        const tableHtml = [
            csvContent[0].map((val, i) => colName(i)),
            ...csvContent
        ].map((line, idx) =>
            htmlToElement(`<tr>${
                [(idx > 0 ? idx : ''), ...line]
                    .map((val, index) => getCellHTML(index, idx, val)).join('')
            }</tr>`)
        )
        tbody.append(...tableHtml);
    }

    function updateContent() {

    }

    function getCellHTML(column, row, value) {
        column = column > 0 ? (column - 1) : '';
        row = row > 0 ? (row - 1) : '';
        const isValueObject = typeof value === 'object';
        const type = isValueObject ? value.type : '';
        const cellValue = isValueObject ? value.value : value;
        const contentEditable = isValueObject ? 'contenteditable="true"' : '';
        return `<td data-column="${column}" data-row="${row}" data-type="${type}" ${contentEditable}>${cellValue}</td>`
    }

    function openPath(pathString) {
        let content = '';
        if (pathString) {
            const f = getFullFileByPath(userSettings.dirTree, pathString);

            if (f && f.type !== fileTypes.DIR) {
                content = f.content;
            }
        }
        displayContent(content);
    }

    function selectCell(row, column) {
        row = +row;
        column = +column;
        const newContent = csvContent.map(line => line.map(cell => {
            cell.active = false;
            return cell;
        }));

        activeCellPosition.row=row;
        activeCellPosition.column=column;

        newContent[row][column].active = true;
        csvContent.length = 0;
        csvContent.push(...newContent);

        input.value = csvContent[row][column].value;


        tbody.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        tbody.querySelector(`td[data-column="${column}"][data-row="${row}"]`).classList.add('active');
    }

    function updateCellInArray(column, row, value, updateNodeValue = true) {
        row = +row;
        column = +column;
        csvContent[row][column].value = value;
        csvContent[row][column].type = isNaN(value) ? 'string' : 'number'

        const node = tbody.querySelector(`td[data-column="${column}"][data-row="${row}"]`);
        if (updateNodeValue) {
            node.innerText = value;
        }
        node.setAttribute('data-type', csvContent[row][column].type)
    }

    tbody.addEventListener('click', e => {
        const {target} = e;

        if (target.nodeName.toLowerCase() === 'td' && target.getAttribute('data-type')?.length) {
            selectCell(
                target.getAttribute('data-row'),
                target.getAttribute('data-column'),
            );
        }
    })
    tbody.addEventListener('input', e => {
        const {target} = e;

        if (target.nodeName.toLowerCase() === 'td' && target.getAttribute('data-type')?.length) {
            updateCellInArray(
                target.getAttribute('data-column'),
                target.getAttribute('data-row'),
                target.textContent,
                false
            );
        }
    })
    input.addEventListener('input', e => {
        const {target} = e;

        updateCellInArray(
            activeCellPosition.column,
            activeCellPosition.row,
            target.value,
        );
    })
    openPath(args.file || '');
    registerOsEvents(appId, {})
    registerAppEvents(appId, {})
})();

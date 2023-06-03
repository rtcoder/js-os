function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function repeatStr(count, str) {
    let out = '';
    for (let i = 0; i < count; i++) {
        out += str;
    }
    return out;
}

function padStart(string, length, chars) {
    const strLength = length ? string.length : 0;
    return (length && strLength < length)
        ? (repeatStr(length - strLength, chars) + string)
        : (string || '')
}

/**
 *
 * @param date Date object
 * @param format Output format pattern
 * YYYY is the year, with four digits (0000 to 9999)
 * YY is the year, with two digits (00 to 99)
 * MM is the month, with two digits (01 to 12)
 * M is the month, with one or two digits (1 to 12)
 * DD is the day of the month, with two digits (01 to 31)
 * D is the day of the month, with one or two digits (1 to 31)
 * HH is the hour, with two digits (00 to 23)
 * H is the hour, with one or two digits (0 to 23)
 * mm is the minute, with two digits (00 to 59)
 * m is the minute, with one or two digits (0 to 59)
 * ss is the second, with two digits (00 to 59)
 * s is the second, with one or two digits (0 to 59)
 * sss is the millisecond, with three digits (000 to 999)
 */
function dateToString(date, format) {
    const d = new Date(date)
    if (format.includes("YYYY")) {
        format = format.replace("YYYY", `${d.getFullYear()}`)
    }
    if (format.includes("YY")) {
        format = format.replace(
            "YY",
            d.toLocaleDateString("en", {year: "2-digit"})
        )
    }
    if (format.includes("DD")) {
        format = format.replace("DD", padStart(`${d.getDate()}`, 2, "0"))
    }
    if (format.includes("D")) {
        format = format.replace("D", `${d.getDate()}`)
    }
    if (format.includes("MM")) {
        format = format.replace("MM", padStart(`${d.getMonth() + 1}`, 2, "0"))
    }
    if (format.includes("M")) {
        format = format.replace("M", `${d.getMonth() + 1}`)
    }
    if (format.includes("HH")) {
        format = format.replace("HH", padStart(`${d.getHours()}`, 2, "0"))
    }
    if (format.includes("H")) {
        format = format.replace("H", `${d.getHours()}`)
    }
    if (format.includes("mm")) {
        format = format.replace("mm", padStart(`${d.getMinutes()}`, 2, "0"))
    }
    if (format.includes("m")) {
        format = format.replace("m", `${d.getMinutes()}`)
    }
    if (format.includes("sss")) {
        format = format.replace("sss", padStart(`${d.getMilliseconds()}`, 3, "0"))
    }
    if (format.includes("ss")) {
        format = format.replace("ss", padStart(`${d.getSeconds()}`, 2, "0"))
    }
    if (format.includes("s")) {
        format = format.replace("s", `${d.getSeconds()}`)
    }

    return format
}

function updateObjProp(obj, value, propPath) {
    const [head, ...rest] = propPath.split('.');

    !rest.length
        ? obj[head] = value
        : this.updateObjProp(obj[head], value, rest.join('.'));
}

function hexToRgba(hex, opacity = 100) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = opacity / 100;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function convertRgbaStringToArray(rgba) {
    return rgba.replace(/^(rgb|rgba)\(/, '')
        .replace(/\)$/, '')
        .replace(/\s/g, '')
        .split(',');
}

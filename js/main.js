var runningApps = new Array();
var appIsHovered = false;

function timer() {
    var t, time, g, m, s;
    setInterval(function () {
        t = new Date();
        g = t.getHours();
        m = t.getMinutes();
        s = t.getSeconds();
        if (g < 10) {
            g = "0" + g;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        time = g + ":" + m;
        if ($("#time").attr('data-seconds') === 'show') {
            time = g + ":" + m + ":" + s;
        }
        $("#time").text(time);
    }, 1000);
}
function runApp(name, content, title, options) {
    options = JSON.parse(options)
    let windowTitle = '<div class="appWindowTitle">' + title + '</div>';
    let windowIcon = '<div class="appWindowIcon"><img src="icons/default/' + name + '.png"/></div>';
    let windowButtonMax = options.windowButtons.max ? '<div class="windowButton maximize" title="maximize"></div>' : '';
    let windowButtonMin = options.windowButtons.min ? '<div class="windowButton minimize" title="minimize"></div>' : '';
    let windowButtonClose = options.windowButtons.close ? '<div class="windowButton close" title="close"></div>' : '';
    let windowButtons = '<div class="appWindowButtons">' + windowButtonMin + windowButtonMax + windowButtonClose + '</div>';
    let windowContent = '<div class="appContent">' + content + '</div>';
    let windowTop = '<div class="appWindowTop">' + windowIcon + windowTitle + windowButtons + '</div>';
    let app = '<div class="appWindow focused" id="' + name + '" data-maximized="false">' + windowTop + windowContent + '</div>';
    $("#desktop").append(app);

    $("#openedWindowList").append('<div class="barWindow focused" data-appId="' + name + '"><div class="barIcon"><img src="icons/default/' + name + '.png"></div><div class="barTitle">' + title + '</div></div>');

    $(".appWindow").draggable({handle: ".appWindowTitle"});
    runningApps.push(name);
    initWindowButtons(options);
}

function closeApp(appId) {
    console.log("closed: " + appId);
    var appKey = runningApps.indexOf(appId);
    runningApps.splice(appKey, 1);
    $(".barWindow[data-appId=" + appId + "], .appWindow#" + appId).fadeOut(100, function () {
        $(this).remove();
    });
    $(".appWindow, .barWindow").removeClass("focused");
}

function minimizeApp(appId) {
    console.log("minimized: " + appId);
    $(".appWindow#" + appId).fadeOut(100, function () {
        $(this).addClass("minimized");
    });
    $(".appWindow, .barWindow").removeClass("focused");
}

function maximizeApp(appId) {
    console.log("maximized: " + appId);
    var w = parseInt($(".appWindow#" + appId).width()),
            h = parseInt($(".appWindow#" + appId).height()),
            t = parseInt($(".appWindow#" + appId).css("top")),
            l = parseInt($(".appWindow#" + appId).css("left"));
    $(".appWindow#" + appId)
            .attr("data-w", w)
            .attr("data-h", h)
            .attr("data-t", t)
            .attr("data-l", l)
            .attr("data-maximized", "true")
            .animate({
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%"
            }, 200)
            .draggable('destroy');
}

function unmaximizeApp(appId) {
    console.log("restored: " + appId);
    var w = $(".appWindow#" + appId).attr("data-w"),
            h = $(".appWindow#" + appId).attr("data-h"),
            t = $(".appWindow#" + appId).attr("data-t"),
            l = $(".appWindow#" + appId).attr("data-l");
    $(".appWindow#" + appId)
            .attr("data-maximized", "false")
            .removeAttr("data-w")
            .removeAttr("data-h")
            .removeAttr("data-t")
            .removeAttr("data-l")
            .animate({
                top: t + "px",
                left: l + "px",
//                width: w + "px",
                width: "auto",
                height: h + "px"
            }, 200);
    $(".appWindow").draggable({handle: ".appWindowTitle"});
}
function initWindowButtons(options) {
    $(".windowButton").click(function () {
        var c = $(this).attr("class");
        var idWindow = $(this)
                .parents(".appWindow")
                .map(function () {
                    return this.id;
                });

        switch (c) {
            case"windowButton close":
                closeApp(idWindow[0]);
                break;
            case"windowButton minimize":
                minimizeApp(idWindow[0]);
                break;
            case"windowButton maximize":
                $(this).removeClass("maximize").addClass("unmaximize");
                maximizeApp(idWindow[0]);
                break;
            case"windowButton unmaximize":
                $(this).removeClass("unmaximize").addClass("maximize");
                unmaximizeApp(idWindow[0]);
                break;
            default:
                return false;
        }
    });
    $(".appWindow").mousedown(function () {
        var appId = $(this).attr("id");
        console.log("focused: " + appId);
        $(".appWindow, .barWindow").removeClass("focused");
        $(".barWindow[data-appId=" + appId + "]").addClass("focused");
        $(this).addClass("focused");
    }).hover(function () {
        appIsHovered = true;
    }).mouseleave(function () {
        appIsHovered = false;
    });
    $(".barWindow").click(function () {
        var appId = $(this).attr("data-appId");
        $(".appWindow, .barWindow").removeClass("focused");
        $(".appWindow#" + appId).addClass("focused");
        $(this).addClass("focused");
        if ($(".appWindow#" + appId).hasClass("minimized")) {
            $(".appWindow#" + appId).fadeIn(100, function () {
                $(this).removeClass("minimized");
                console.log("restored: " + appId);
                console.log("focused: " + appId);
            });
        }
    });
}
function initEvents() {
    $("#desktop").click(function () {
        $("#appList").hide();
        if (!appIsHovered) {
            $(".appWindow, .barWindow").removeClass("focused");
        }
    });
    $("#appsButton").click(function () {
        $("#appList").toggle();
    });
    $(".app").click(function () {
        var appName = $(this).attr("data-appName");
        if (runningApps.indexOf(appName) >= 0) {
            alert("already running");
        } else {
            var path = $(this).attr("data-path");
            var options = $(this).attr("data-options");
            var title = $(this).attr("title");
            console.log("run: " + appName);
            $.get(path, function (data) {
                runApp(appName, data, title, options);
            });
            $("#appList").hide();
        }
    });
}

function createMenu() {
    var i = 0;
    $.each(appList, function (index, entry) {
        $("#appList").append('<li class="appListElement"><div class="titleApp">' + index + '</div><ul class="submenu" id="' + i + '"></ul></li>');
        $.each(entry, function (key, val) {
            $(".submenu#" + i).append('<li class="app" title="' + val.title + '" data-path="' + val.path + '" data-options=\'' + JSON.stringify(val.options) + '\' data-appName="' + key + '"><span style="background:url(\'' + val.icon + '\');background-size:20px 20px"></span>' + val.title + '</li>');
        });
        i++;
    });
}

$(document).ready(function () {
    document.oncontextmenu = function () {
        return false;
    };
    $(document).mousedown(function (e) {
        if (e.button === 2) {
            return false;
        }
        return true;
    });
    timer();
    createMenu();
    initEvents();
});

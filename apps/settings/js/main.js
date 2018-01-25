function hexToRgba(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var a = opacity / 100;
    var result = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

    return result;
}

(function () {
    $('.tile').click(function () {
        let id = $(this).data('section');
        $('#settings section').hide();
        $('#settings section[data-id=' + id + ']').show();
    });
    $('.back').click(function () {
        $('#settings section').hide();
        $('#settings section[data-id=home]').show();
    });
    for (let i = 1; i <= 5; i++) {
        let image = '<div class="image" style="background-image: url(pics/wallpapers/wallpaper' + i + '.jpg)" data-image="pics/wallpapers/wallpaper' + i + '.jpg"></div>';
        $('section[data-id=wallpaper] .wallpapers').append(image);
    }
    $('section[data-id=wallpaper] .wallpapers .image').click(function () {
        let image = $(this).data('image');
        $('#osPage').css('background-image', 'url(' + image + ')');
    });

    $('section[data-id=wallpaper] .options #position').change(function () {
        $('#osPage').css('background-position', $(this).val());
    });
    $('section[data-id=wallpaper] .options #bg-repeat').change(function () {
        $('#osPage').css('background-repeat', $(this).val());
    });
    $('section[data-id=wallpaper] .options #bg-size').change(function () {
        $('#osPage').css('background-size', $(this).val());
    });
    $('section[data-id=wallpaper] .options #bg-color').change(function () {
        $('#osPage').css('background-color', $(this).val());
    });

    $('#panel-bg-color').change(function () {
        let c = $('#panel').css('background-color');
        let rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
        let alpha = rgb[3];
        $('#panel').css('background-color', hexToRgba($(this).val(), alpha * 100));
    });

    $('#panel-bg-opacity').change(function () {
        let c = $('#panel').css('background-color');
        let rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
        $('#panel').css('background-color', 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + parseFloat($(this).val()) / 100 + ')');
    }).mousemove(function () {
        let c = $('#panel').css('background-color');
        let rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
        $('#panel').css('background-color', 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + parseFloat($(this).val()) / 100 + ')');
    });

    $('#panel-position').change(function () {
        $('#panel').removeClass('top right bottom left');
        $('#panel').addClass($(this).val());
    });
})();
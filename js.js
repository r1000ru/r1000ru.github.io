// Подсвечиваем код
var codeBlockes = document.getElementsByClassName('codeblock');
for (var b = 0; b < codeBlockes.length; b++) {
    hljs.highlightBlock(codeBlockes[b]);
}

// Обработчики задания CSS
var popUp = document.getElementById('popUp');
document.getElementById('popUpMe').addEventListener('click', function () {
    popUp.style.display = "block";
    popUp.style.top = parseInt(window.pageYOffset + window.innerHeight / 2) + 'px';
});
popUp.addEventListener('click', function () {
    popUp.style.display = "none";
});

// Задание по JS
var goods = [];
var summ = 0;
goods[123343] = {
    count: 4,
    price: 3.43
};
goods[1233343] = {
    count: 2,
    price: 2.43
};
goods[923343] = {
    count: 4,
    price: 3.43
};
document.getElementById('calcMe').addEventListener('click', function () {
    goods.forEach(function (good) {
        summ += good.count * good.price;
    });
    alert(summ);
});

// Задание по jQuery
var d1 = $('#date1');
var d2 = $('#date2');

var d2Block = function (e) {
    if ($(e).val() !== '') {
        d2.attr('disabled', true);
    } else {
        d2.removeAttr('disabled');
    }
};

function check() {
    result = true;

    var p = $('#sendResult');
    p.css('color', 'red').empty();
    if (d1.val() !== "") {
        var timestamp = Date.parse(d1.val());
        if (isNaN(timestamp) === true) {
            p.append('<br/>Ошибка в дате 1');
            result = false;
        }
    }
    if (d2.val() !== "") {
        var timestamp = Date.parse(d2.val());
        if (isNaN(timestamp) === true) {
            p.append('<br/>Ошибка в дате 2');
            result = false;
        }
    }
    return result;
}


d1.keydown(function () {
    d2Block(this);
}).change(function () {
    d2Block(this);
    check();
}).blur(function () {
    d2Block(this);
    check();
}).keyup(function () {
    d2Block(this);
});
d2.change(function () {
    check();
}).blur(function () {
    check();
});
$('#sendMe').click(function () {
    if (check()) {
        $.getJSON("http://r1000.ru/Test/dateJs", {
            'date1': d1.val(),
            'date2': d2.val()
        }, function (resp) {
            var html = 'Дата 1 = ' + resp.result.date1 + '<br/>Дата 2 = ' + resp.result.date2;
            $('#sendResult').css('color', 'black').html(html);
        });
    }
});
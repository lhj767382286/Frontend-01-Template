
function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    console.log('-----style-start---------');

    console.log(element.computedStyle);
    

    for(let prop in element.computedStyle) {

        console.log(prop);

        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    console.log('-----style-end--------');


    return element.style;
}


function layout(element) {
    if (!element.computedStyle) {
        return;
    }

    var elementStyle = getStyle(element);

    // 只实现 flex 排版
    if (elementStyle.display !== 'flex') {
        return;
    }

    // 获取 flex-items
    var items = element.children.filter(e => e.type === 'element');

    // 根据 flex-items 的 order 排序。order 默认值为 0，越小越靠前
    items.sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    var style = elementStyle;

    ['width', 'height'].forEach(size => {
        if(style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    // flex-container: flex-direction
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    // flex-container: align-items
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }

    // flex-container: justify-content
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }

    // flex-container: flex-wrap
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }

    // flex-container: align-content
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }

    var mainSize, mainStart, mainEnd, mianSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style.flexDirection === 'row') {
        mainSize ='width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSize = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize ='width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSize = -1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize ='height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSize = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize ='height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSize = -1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        var temp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
}

module.exports = layout;

function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    // style 预处理
    for(let prop in element.computedStyle) {

        element.style[prop] = element.computedStyle[prop].value;

        // px => number 类型
        // 其他单位处理类似
        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        // 数字 => number 类型
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}


function layout(element) {
    if (!element.computedStyle) {
        return;
    }

    var elementStyle = getStyle(element);

    // 这里只实现 flex 排版
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

    // 默认值处理
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

    // 使用以下 10 个变量抽象一个方向
    // size - 尺寸，可选值：width、height
    // start、end - 方向，可选值：left -> right、right -> left、top -> bottom、bottom -> top
    // sign - 排版方向，可选值：+1 (left -> right, 在 base 基础上加)、-1 (right -> left)
    // base - 排版起点，可选值：0 (left -> right)、元素宽度的值 (right -> left)
    var mainSize, mainStart, mainEnd, mianSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    // left -> right
    if (style.flexDirection === 'row') {
        mainSize ='width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSize = +1; // 可以理解为正负号
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    // right -> left
    if (style.flexDirection === 'row-reverse') {
        mainSize ='width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSize = -1;
        mainBase = style.width; // container.width

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    // top -> bottom
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

    // bottom -> top
    if (style.flexDirection === 'column-reverse') {
        mainSize ='height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSize = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    // flex-wrap 影响交叉轴
    if (style.flexWrap === 'wrap-reverse') {
        // crossStart 与 crossEnd 互换
        var temp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }


    var isAutoMainSize = false;
    if (!style[mainSize]) { 
        // auto sizing
        // mainSize = 子元素 mainSize 相加
        elementStyle[mainSize] = 0;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] += itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }


    // 元素进行
    var flexLine = [];  // 表示一行
    var flexLines = [flexLine]; // 表示多行

    var mainSpace = elementStyle[mainSize]; // 剩余空间
    var crossSpace = 0; // 交叉轴尺寸

    for(var i = 0; i < items.length; i++) {
        var item = items[i];
        // 获取子元素 style
        var itemStyle = getStyle(item);

        // 没有主轴尺寸，默认为 0
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        // 子元素有 flex 属性
        if (itemStyle.flex) {
            // flex 属性意味着可伸缩，代表着这一行无论有多少元素一定能放进去
            flexLine.push(item);

        // 父元素有 nowrap 
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (iemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }

            if (mianSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mianSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }

            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossStart = Math.max(crossSpace, itemStyle[crossSize]);
            }

            mainSpace -= itemStyle[mainSize];
        }
    }

    flexLine.mianSpace = mainSpace;


}

module.exports = layout;
const EOF = Symbol("EOF"); // EOF: End of File，处理文件结束的小技巧：todo

// https://html.spec.whatwg.org/multipage/parsing.html#data-state


/**
 * data 状态
 * @param {*} c 
 */
function data(c) {
    if ( c == '<') {
        return tagOpen;
    } else if (c == EOF) {
        return;
    } else {
        return data;
    }
}


// </
function tagOpen(c){
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        // Reconsume
        return tagName(c);
    } else if (c == '>') {
        return data;
    } else {
        return tagName;
    }
}   

function endTagOpen(c){}

function tagName(c){}

function beforeAttributeName(c){
}

function selfClosingStartTagState(c) {
}

module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
}
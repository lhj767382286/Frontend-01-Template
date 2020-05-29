const net = require('net');
const parser = require('./parser');



class Request {
    // method, url = host + port + path
    // body: k/v
    // headers:
        // content-type:
        // 1. 表单提交: application/x-www-form-urlencoded
        // 2. multipart/form-data
        // 3. text/html
        // 4. application/json

    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.path = options.path || "/";
        this.port = options.port || 80;
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = "application/x-www-form-urlencoded";
        }

        if (this.headers['Content-Type'] === 'application/json')
            this.bodyText = JSON.stringify(this.body);
        else if (this.headers['Content-Type'] === "application/x-www-form-urlencoded")
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\n\r
${this.bodyText}`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {

            let parser = new ResponseParser();

            if (connection){
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                });
            }

            // todo: tcp 是流式传输，流式数据，即 data 不确定是否是完整的 response
            // 因此不可能直接在 on.data 里: new Response(data);
            // ondata 事件被触发多少次是不太确定的，因此需要有 ResponseParser 去负责产生 response 这个 class
            // 关于分包：
                // data事件触发条件：
                    // Buffer 满了：客户端从网卡接数据，如分配 10k 空间，10 k 写满了，触发 data 事件
                    // 服务端已经收到一个包（IP包）
                // 小结：
                    // tcp 可以看成是流，断在哪是无所谓也不确定。
                    // 服务端的 response 不确定会分成多少个包，只保证顺序状态，不保证分包的状态。
                    // 然后客户端接收数据又存在 buffer，这个包可能比 buffer 大，也有可能比 buffer 小
                    // data 是流，一部分一部分给 parser
            // 关键点在于如何处理 chunk:
                // 不能用正则 - 流式
                // 因此只能用状态机去实现
                    // 状态1: status-line
                    // 状态2: headers 及 headers 子状态
                    // 状态3: 空行
                    // 状态4: body...自身另起状态机处理
            connection.on('data', (data) => {
                parser.receive(data.toString());
                if (parser.isFinished){
                    resolve(parser.response);
                }
                // resolve(data.toString());
                // console.log(parser.statusLine);
                // console.log(parser.headers);
                connection.end();
            });

            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
    }
}

class ResponseParser {

    constructor() {

        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;

        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;

        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";

        // 根据 Transfer-Encoding 创建
        this.bodyParser = null;
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusTex: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join("")
        };
    }

    receive(string) {
        for (let i = 0; i < string.length; i++)
            this.receiveCharacter(string.charAt(i));
    }

    receiveCharacter(char){
        if(this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked')
                    this.bodyParser = new TrunkedBodyParser();
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if(char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }        

    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_LENGTH_LINE_END = 4;
        this.FINISHED_NEW_LINE = 5;
        this.FINISHED_NEW_LINE_END = 6;

        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    // chunk 最终以 0 结尾
                    this.current = this.FINISHED_NEW_LINE;
                } else {
                    this.current = this.WAITING_LENGTH_LINE_END;
                }
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length --;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if(char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        } else if (this.current === this.FINISHED_NEW_LINE) {
            if (char === '\r') {
                this.current = this.FINISHED_NEW_LINE_END;
            }
        } else if (this.current === this.FINISHED_NEW_LINE_END) {
            if (char === '\n') {
                this.isFinished = true;
            }
        }
    }
}


void async function() {

    let request = new Request({
        method: "POST",
        host: '127.0.0.1',
        port: 8088,
        headers: {
            'X-FOO': 'foo'
        },
        body: {
            name: 'irving'
        }
    });
    let response = await request.send();
    console.log(response);

    // 实现上我们等 response 完全构建完毕，才得到这个结果。实际上是用 generator 实现的
    let dom = parser.parseHTML(response.body);

    let viewport = images(800, 600);

    render(viewport, dom.children[0].children[3].children[1].children[1]);

    viewport.save('viewport.jpg');

    // console.log(dom);
    
}();


// const client = net.createConnection({ port: 8088 }, () => {

//     let request = new Request({
//         method: "POST",
//         host: '127.0.0.1',
//         port: "8088",
//         headers: {
//             'X-FOO': 'foo'
//         },
//         body: {
//             name: 'irving'
//         }
//     });

//     console.log(request.toString());

//     client.write(request.toString());


//   });
//   client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
//   });
//   client.on('end', () => {
//     console.log('disconnected from server');
//   });






// const client = net.createConnection({ port: 8088 }, () => {
//   // 'connect' listener.
//   console.log('connected to server!');
//   client.write('POST / HTTP/1.1\r\n');
//   client.write('HOST: 127.0.0.1\r\n');
//   client.write('Content-Length: 9\r\n');
//   client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//   client.write('\r\n');
//   client.write('name=elle');
//   client.write('\r\n');
// });
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });
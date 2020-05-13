class Request {}

class Response {}

const net = require("net");
const client = net.connect(
    {
        host: "127.0.0.1",
        port: 8088,
    },
    () => {
        console.log('connected to server!');
        client.write('POST / HTTP/1.1\r\n');
        client.write('HOST: 127.0.0.1\r\n');
        client.write('Content-Type: application/x-www-form-urlencoded\r\n');
        client.write('field1=aaa&code=x%3D1\r\n');
        client.write('\r\n');
    }
);

client.on("data", (data) => {
    console.log(data.toString());
    client.end();
});
client.on("end", () => {
    console.log("disconnected from server");
});
client.on("error", (err) => {
    console.log(err);
    client.end();
});

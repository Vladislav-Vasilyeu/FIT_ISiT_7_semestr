const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '..', 'calc.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const calcProto = grpc.loadPackageDefinition(packageDefinition).calc;

// Подключение к серверу (укажите адрес вашего сервера)
const client = new calcProto.Calculator('localhost:5244', grpc.credentials.createInsecure());

function callAndPrint(operation, method, request) {
    return new Promise((resolve) => {
        client[method](request, (err, response) => {
            if (err) {
                console.log(`${operation} ОШИБКА: ${err.details} (Код: ${err.code})`);
            } else {
                console.log(`${operation}: ${response.result}`);
            }
            resolve();
        });
    });
}

async function main() {
    console.log('--- Вызов удаленных процедур ---');
    await callAndPrint('SUM(10, 5)', 'sum', { x: 10, y: 5 });
    await callAndPrint('SUB(10, 5)', 'sub', { x: 10, y: 5 });
    await callAndPrint('MUL(10, 5)', 'mul', { x: 10, y: 5 });
    await callAndPrint('DIV(10, 2)', 'div', { x: 10, y: 2 });
    await callAndPrint('DIV(10, 0)', 'div', { x: 10, y: 0 });
    await callAndPrint('FACT(5)', 'fact', { x: 5 });
    await callAndPrint('FACT(20)', 'fact', { x: 20 });
}

main();
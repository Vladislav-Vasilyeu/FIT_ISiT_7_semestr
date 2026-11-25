const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '..', 'calc.proto'); // Путь к общему .proto файлу
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const calcProto = grpc.loadPackageDefinition(packageDefinition).calc;

function sum(call, callback) {
    callback(null, { result: call.request.x + call.request.y });
}

function sub(call, callback) {
    callback(null, { result: call.request.x - call.request.y });
}

function mul(call, callback) {
    callback(null, { result: call.request.x * call.request.y });
}

function div(call, callback) {
    if (call.request.y === 0) {
        // Возвращаем ошибку с соответствующим статус-кодом
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: 'Деление на ноль невозможно.'
        });
    }
    callback(null, { result: call.request.x / call.request.y });
}

function fact(call, callback) {
    const n = call.request.x;
    if (n < 0) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: 'Факториал отрицательного числа не определен.'
        });
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
        // Проверка на превышение размерности 32-битного целого
        if (result > 2147483647) {
            return callback({
                code: grpc.status.OUT_OF_RANGE,
                details: 'Результат превышает размерность типа int.'
            });
        }
    }
    callback(null, { result: result });
}

const server = new grpc.Server();
server.addService(calcProto.Calculator.service, { sum, sub, mul, div, fact });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) throw err;
    console.log(`gRPC сервер запущен на порту ${port}`);
});
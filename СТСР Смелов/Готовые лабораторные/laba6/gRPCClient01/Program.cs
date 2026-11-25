using Grpc.Net.Client;
using CalcGrpc;
using Grpc.Core;

using var channel = GrpcChannel.ForAddress("http://localhost:50051");
var client = new Calculator.CalculatorClient(channel);

async Task CallAndPrint<T>(string operation, Func<Task<T>> action, Func<T, double> selector)
{
    try
    {
        var reply = await action();
        Console.WriteLine($"{operation}: {selector(reply)}");
    }
    catch (RpcException ex)
    {
        Console.WriteLine($"{operation} ОШИБКА: {ex.Status.Detail} (Код: {ex.StatusCode})");
    }
}

Console.WriteLine("--- Вызов удаленных процедур ---");

await CallAndPrint("SUM(10, 5)",
    () => client.SumAsync(new CalcRequest { X = 10, Y = 5 }).ResponseAsync,
    r => r.Result);

await CallAndPrint("SUB(10, 5)",
    () => client.SubAsync(new CalcRequest { X = 10, Y = 5 }).ResponseAsync,
    r => r.Result);

await CallAndPrint("MUL(10, 5)",
    () => client.MulAsync(new CalcRequest { X = 10, Y = 5 }).ResponseAsync,
    r => r.Result);

await CallAndPrint("DIV(10, 2)",
    () => client.DivAsync(new CalcRequest { X = 10, Y = 2 }).ResponseAsync,
    r => r.Result);

await CallAndPrint("DIV(10, 0)",
    () => client.DivAsync(new CalcRequest { X = 10, Y = 0 }).ResponseAsync,
    r => r.Result);

await CallAndPrint("FACT(5)",
    () => client.FactAsync(new FactRequest { X = 5 }).ResponseAsync,
    r => r.Result);   // r.Result — int, неявно преобразуется в double

await CallAndPrint("FACT(20)",
    () => client.FactAsync(new FactRequest { X = 20 }).ResponseAsync,
    r => r.Result);

Console.WriteLine("Нажмите любую клавишу для выхода...");
Console.ReadKey();
using Grpc.Core;
using CalcGrpc;
using System;

namespace gRPCServer01.Services;

public class CalculatorService : Calculator.CalculatorBase
{
    private readonly ILogger<CalculatorService> _logger;

    public CalculatorService(ILogger<CalculatorService> logger)
    {
        _logger = logger;
    }

    public override Task<CalcReply> Sum(CalcRequest request, ServerCallContext context)
        => Task.FromResult(new CalcReply { Result = request.X + request.Y });

    public override Task<CalcReply> Sub(CalcRequest request, ServerCallContext context)
        => Task.FromResult(new CalcReply { Result = request.X - request.Y });

    public override Task<CalcReply> Mul(CalcRequest request, ServerCallContext context)
        => Task.FromResult(new CalcReply { Result = request.X * request.Y });

    public override Task<CalcReply> Div(CalcRequest request, ServerCallContext context)
    {
        if (request.Y == 0)
        {
            // Генерация исключения в соответствии с заданием
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Деление на ноль невозможно."));
        }
        return Task.FromResult(new CalcReply { Result = request.X / request.Y });
    }

    public override Task<FactReply> Fact(FactRequest request, ServerCallContext context)
    {
        if (request.X < 0)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Факториал отрицательного числа не определен."));
        }

        try
        {
            // Проверка на переполнение типа int
            checked
            {
                int result = 1;
                for (int i = 2; i <= request.X; i++)
                {
                    result *= i;
                }
                return Task.FromResult(new FactReply { Result = result });
            }
        }
        catch (OverflowException)
        {
            // Генерация исключения при переполнении
            throw new RpcException(new Status(StatusCode.OutOfRange, "Результат превышает размерность типа int."));
        }
    }
}
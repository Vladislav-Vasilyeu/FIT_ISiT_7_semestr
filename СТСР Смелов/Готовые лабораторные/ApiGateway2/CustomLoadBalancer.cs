using Ocelot.LoadBalancer;
using Ocelot.LoadBalancer.Interfaces;
using Ocelot.Responses;
using Ocelot.Values;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CustomLoadBalancer : ILoadBalancer
{
    private readonly Func<Task<List<Service>>> _services;
    // Each cycle distributes requests between X, Y and Z in a 5:3:2 ratio.
    private static readonly int[] Schedule = { 0, 1, 0, 2, 0, 1, 0, 2, 1, 0 };
    private readonly object Locker = new();
    private int _counter = 0;

    public CustomLoadBalancer(Func<Task<List<Service>>> services) => _services = services;

    public string Type => nameof(CustomLoadBalancer);

    public void Release(ServiceHostAndPort hostAndPort) { }

    // ✅ В Ocelot 25.x метод называется LeaseAsync (а не Lease)
    public async Task<Response<ServiceHostAndPort>> LeaseAsync(HttpContext context)
    {
        var services = await _services.Invoke();

        lock (Locker)
        {
            int index = Schedule[_counter];
            _counter = (_counter + 1) % Schedule.Length;

            // Защита от выхода за границы, если серверов меньше трёх
            if (index >= services.Count) index = 0;

            var selectedService = services[index];
            return new OkResponse<ServiceHostAndPort>(selectedService.HostAndPort);
        }
    }
}

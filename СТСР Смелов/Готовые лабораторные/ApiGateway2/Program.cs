using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Configuration;
using Ocelot.ServiceDiscovery.Providers;


var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange:true);

Func<IServiceProvider, DownstreamRoute, IServiceDiscoveryProvider, CustomLoadBalancer> loadBalancerFactory =
    (_, _, discoveryProvider) => new CustomLoadBalancer(discoveryProvider.GetAsync);

builder.Services
    .AddOcelot(builder.Configuration)
    .AddCustomLoadBalancer(loadBalancerFactory);

var app = builder.Build();

await app.UseOcelot();

app.Run();
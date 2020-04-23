using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Core.Assets;
using Core.Assets.Models;
using Core.Containers;
using Core.Database.Payloads;
using Core.Database.QueryLanguages;
using Core.Database.Tables;
using Core.Relationships;
using Core.Users.Implementation.QueryLanguages;
using GraphQL;
using GraphQL.EntityFramework;
using GraphQL.Server;
using GraphQL.Types;
using GraphQL.Utilities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Container = Core.Database.Tables.Container;

namespace Core.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Core.Database.BeawreContext.ConnectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddMediatR();

            services.AddScoped<Database.IBeawreContext, Database.BeawreContext>();
            services.AddDbContext<Database.BeawreContext>();

            #region GraphQl
            GraphTypeTypeRegistry.Register<Asset, AssetGraphQl>();
            GraphTypeTypeRegistry.Register<AssetModel, AssetGraphQl>();
            GraphTypeTypeRegistry.Register<Vulnerability, VulnerabilityGraphQl>();
            GraphTypeTypeRegistry.Register<Risk, RisksGraphQl>();
            GraphTypeTypeRegistry.Register<Treatment, TreatmentsGraphQl>();
            GraphTypeTypeRegistry.Register<Container, ContainerGraphQl>();
            GraphTypeTypeRegistry.Register<Relationship, RelationshipGraphQl>();
            GraphTypeTypeRegistry.Register<Database.Tables.Evidence, EvidenceGraphQl>();
            GraphTypeTypeRegistry.Register<RiskPayload, RiskPayloadGraphQl>();
            GraphTypeTypeRegistry.Register<RiskPayloadModel, RiskPayloadModelGraphQl>();
            GraphTypeTypeRegistry.Register<TreatmentPayloadModel, TreatmentPayloadModel.TreatmentkPayloadGraphQl>();
            GraphTypeTypeRegistry.Register<User, UserGraphQl>();
            GraphTypeTypeRegistry.Register<Relationship, NotificationGraphQl>();

            EfGraphQLConventions.RegisterInContainer(services, new Core.Database.BeawreContext(), userContext => (Core.Database.BeawreContext)userContext);

            services.AddSingleton<AssetGraphQl>();
            services.AddSingleton<VulnerabilityGraphQl>();
            services.AddSingleton<RisksGraphQl>();
            services.AddSingleton<TreatmentsGraphQl>();
            services.AddSingleton<ContainerGraphQl>();
            services.AddSingleton<RelationshipGraphQl>();
            services.AddSingleton<EvidenceGraphQl>();
            services.AddSingleton<RiskPayloadGraphQl>();
            services.AddSingleton<RiskPayloadModelGraphQl>();
            services.AddSingleton<TreatmentPayloadModel.TreatmentkPayloadGraphQl>();
            services.AddSingleton<OwaspDictionaryGraphType>();
            services.AddSingleton<UserGraphQl>();
            services.AddSingleton<NotificationGraphQl>();

            foreach (var type in GetGraphQlTypes())
                services.AddSingleton(type);

            services.AddGraphQL(options => options.ExposeExceptions = true);

            services.AddSingleton<IDocumentExecuter, EfDocumentExecuter>();
            services.AddSingleton<IDependencyResolver>(
                provider => new FuncDependencyResolver(provider.GetRequiredService));
            services.AddSingleton<ISchema, Core.Api.Controllers.Schema>();
            #endregion

            Core.Users.Config.InitializeServices(ref services);
            Core.Containers.Config.InitializeServices(ref services);
            Core.Assets.Config.InitializeServices(ref services);
            Core.Relationships.Config.InitializeServices(ref services);
            Core.AuditTrail.Config.InitializeServices(ref services);
            Core.Evidence.Config.InitializeServices(ref services);

            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddAutoMapper(opt =>
            {
                opt.AddProfile(new Core.Users.UsersProfile());
                opt.AddProfile(new AssetsProfile());
                opt.AddProfile(new RelationshipProfile());
                opt.AddProfile(new CoreContainersProfile());
                opt.AddProfile(new Core.AuditTrail.CustomProfile());
            });

            services.AddControllersWithViews();

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders =
                    ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromHours(24);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            services.AddCors(opt => {
                opt.AddPolicy("CorsRules", pol => pol.SetIsOriginAllowed((host) => true).AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            });

            services.AddMvcCore().AddApiExplorer();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo() { Title = "Risk Control", Version = "v1" });
            });

            //In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ReactApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders();
            app.Use((context, next) =>
            {
                var limitFeature = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
                limitFeature.MaxRequestBodySize = Int32.MaxValue;
                context.Request.Scheme = "https";
                return next();
            });

            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseSpaStaticFiles();

            app.UseSession();

            app.UseRouting();
            app.UseCors("CorsRules");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Risk Control");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ReactApp";
            });
        }

        static IEnumerable<Type> GetGraphQlTypes()
        {
            return typeof(Startup).Assembly
                .GetTypes()
                .Where(x => !x.IsAbstract &&
                            (typeof(IObjectGraphType).IsAssignableFrom(x) ||
                             typeof(IInputObjectGraphType).IsAssignableFrom(x)));
        }
    }

}

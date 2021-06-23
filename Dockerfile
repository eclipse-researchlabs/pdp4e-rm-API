FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y libgdiplus
RUN ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll
WORKDIR /app
EXPOSE 80
EXPOSE 443

 

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app
COPY . .
RUN dotnet restore "src/Core.Api.csproj"
RUN dotnet publish "src/Core.Api.csproj" -c Release -o /app/publish

 

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish . 
ENTRYPOINT ["dotnet", "Core.Api.dll"]
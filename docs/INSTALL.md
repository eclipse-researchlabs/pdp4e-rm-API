# Risk Management - Installation Guide

Risk Management tool is composed of C# .net 3.2 backend and React based frontend. There are two basic ways to interact with the tool:

- production type use of the tool via Docker container
- development environment

Within this guide we will cover two ways of starting the system.

## Running the tool in production

Prerequistes:

- MS SQL instance with empty database
- Docker desktop

### Steps

1. Clone the repository with submodules

```
git clone --recurse-submodulehttps://github.com/eclipse-researchlabs/pdp4e-rm-API pdp4e-risk-management
```

2. Change directory to source folder

```
cd ./pdp4e-risk-management/
```

3. Specify correct settings in the `src/appsettings.json`. Pay special attention to settings in the **connection string** section

4. Build the docker Image by running

```
docker build .
```

5. You should be able to see new image in the **Docker Client** **Images** tab

![docker client](docker-image.png "Docker Client")

6. Run the image and specify the ports you would like the tool to be accessible on. Once run the tool is accessible on the **https** port specfied.

![docker run](docker-run.png "Docker Run")

## Running the tool in development mode

1. Repeat steps 1 and 2 from the section _Run In Production_
1. Open the `Core.Api.sln` in Visual Studio
1. Wait until Visual studio restores the modules and dependencies
1. Start the backend with "Run" _(F5)_ icon in Visual Studio Code
1. Navigate to `src/ReactApp` in your console application
1. Restore frontend packages by running `yarn` command
1. Run the development version of the frontend with `yarn start`
1. The frontend of the system autoconnects to backend and should be accessbile `http://localhost:5000`

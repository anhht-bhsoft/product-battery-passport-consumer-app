# ![Product Battery Passport Consumer Backend](../../docs/catena-x-logo.svg) Product Battery Passport Consumer Backend
# Version: 0.2.9-SNAPSHOT

## Table of contents
<!-- TOC -->
  * [What is this backend app responsible for?](#what-is-this-backend-app-responsible-for)
  * [Services Available](#services-available)
    * [Authentication Services](#authentication-services)
    * [API Services](#api-services)
      * [Data](#data)
      * [Passport API](#passport-api)
        * [Versions Available](#versions-available)
      * [Contract API](#contract-api)
      * [Contracts](#contracts)
    * [Public APIs](#public-apis)
  * [Run the application](#run-the-application)
    * [Available Environments](#available-environments)
      * [Development Environment](#development-environment)
      * [Integration Environment](#integration-environment)
      * [Configuration of Environment](#configuration-of-environment)
      * [Adding a new Environment](#adding-a-new-environment)
      * [OSS License Check](#oss-license-check)
      * [Swagger Docs](#swagger-docs)
  * [License](#license)
<!-- TOC -->

## What is this backend app responsible for?

This backend includes the services and *logics* to manage the *passports* of the `frontend app`.

## Services Available

### Authentication Services

For login and log out!
```bash
\auth\login
------
\auth\check #With this api you can check you authentication status.
------
\auth\logout
------
\auth\token #Request token from the keycloak instance
------
\auth #Calling this api will redirect you to \auth\login
```

### API Services
>  **_NOTE:_** You must be authenticated with the keycloak instance to access this APIs


#### Data
Get data from Catena-X Services
```bash
\api\data\catalog?providerUrl=<...> #Get all the catalog from the provider

------
\api\data\submodel\<assetId>?idType=<...>&index=<...>
__________
default idType = "Battery_ID_DMC_Code"
default index = 0

------

\api\data\passport?transferId=<...> #Get passport if the transferId is available -> No contract exchange is required if transferId exists

```

#### Passport API

Get a passport from a Catena-X Provider by using its AssetId, this will start a negotiation with the provider and retrieve passport

```bash
\api\passport\<version>\<assetId>?idType=<...>&index=<...>
__________
default idType = "Battery_ID_DMC_Code"
default index = 0
```

##### Versions Available
The passport available versions are:
```bash
[ "v1" ] -> Battery Passport
```

To change the available versions add in the configurations for each environment ``

```yaml
passport:
  versions:
    - 'v1'
```

#### Contract API

Get a contract from the catalog searching by assetId
```bash
\api\contracts\<assetId>
```

### Public APIs

Public APIs don't require authentication
```bash
\health #Get the health status of the server
```
```json
{
    "message": "RUNNING",
    "status": 200,
    "data": "24/11/2022 17:48:18.487"
}

```
## Run the application

Use maven to run the spring boot application:
```bash
mvn spring-boot:run
```


### Available Environments
By default the application will start in development environment:
#### Development Environment
For the development environment include the following code:
```yaml
environmentCode: dev
```
#### Integration Environment
For the integration environment include the following code:
```yaml
environmentCode: int
```


#### Configuration of Environment
To configure the environment go to the following file ```src/main/resources/config/env.yml```
```yaml
environment: "int" # If empty will be selected the default environment

default:
  environment: "dev" # Default environment
  available: #Available environments
    - "dev"
    - "int"

```
#### Adding a new Environment
Let imagine you want to add the following environment code: `newEnvironmentCode`

> **_NOTE:_**: Environment codes **must** not have _spaces_ or _special characters_!

1. When a new environment is at the available list, a configuration file must be defined and added in the ```src/main/resources/application.yml```:

```yaml
spring:
  config:
    import: "application-dev.yml"

---

spring:
  config:
    activate:
      on-profile: "int"
    import: "application-int.yml"

---

spring:
    config:
        activate:
            on-profile: "<newEnvironmentCode>"
        import: "application-newEnvironmentCode.yml"

```

2. Add the following environmentCode to the ```src/main/resources/config/env.yml```

```yaml
default:
  environment: "dev" # Default environment
  available: #Available environments
    - "dev"
    - "int"
    - "newEnvironmentCode"
```

3. Configure the following files
   - Vault File:  `data/VaultConfig/vault.token-newEnvironmentCode.yml`
   - Application Configuration File: `src/main/resources/config/configuration-newEnvironmentCode.yml`
   - Spring Boot Configuration File: `src/main/resources/application-newEnvironmentCode.yml`

## OSS License Check

 The third party library dependecies, utilized in this app have to  be approved from The Eclipse Foundation.

The [Dash Licence Tool](https://github.com/eclipse/dash-licenses) is used to scan the dependencies

[OSS License Checks with Dash & Compliance with Apache 2.0](https://confluence.catena-x.net/pages/viewpage.action?pageId=54989501)

At the time of writing this manual, the dependencies have status approved and therefore no need to generate  IP Team Review request further.

[Maven plugin](https://github.com/eclipse/dash-licenses/blob/master/README.md#maven-plugin-options) used to check OSS license

How to run: 
```bash
mvn org.eclipse.dash:license-tool-plugin:license-check -Ddash.summary=DEPENDENCIES
```


## Swagger Docs

Swagger documentation is now automatically available at the following  path:

```https://<host>/swagger-ui/index.html```

![img.png](docs/media/img2.png)


## License
[Apache-2.0](https://raw.githubusercontent.com/catenax-ng/product-battery-passport-consumer-app/main/LICENSE)


<div style="display: flex; align-items: center;justify-content: center;align-content: center;">
   <img src="./catena-x-logo.svg" alt="Product Battery Pass Consumer App Release Guide" style="width:50px;"/>
   <h1 style="margin: 10px 0 0 10px">Product Battery Pass Consumer App Release Guide</h1>
</div>

## Release an application

The application is released through [GitHub Releases page](https://github.com/catenax-ng/product-battery-passport-consumer-app/releases) by creating a new release and tag. Follow the [Semantic Versioning Scheme](https://semver.org/spec/v2.0.0.html) while creating a new tag.


The changelog must also be updated from [CHANGELOG.md](../CHANGELOG.md) file, showing the changes in release using [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

## Release Helm charts

Helm charts of below components can be found in *deployment/helm* folder.

- [consumer-ui](../deployment/helm/consumer-ui/Chart.yaml)
- [edc-consumer](../deployment/helm/edc-consumer/Chart.yaml)
- [edc-provider](../deployment/helm/edc-provider/Chart.yaml)

In order to update helm charts, please update helm chart version and related dependencies from *version* property in *Chart.yaml file* for the above components. In addition, if there are changes to application version, the *appVersion* property also needs to be changed.

Navigate to the [Deploymment Guide](/deployment/README.md) and follow the steps. The deployment guide illustrates the manual steps to install helm deployments into ArgoCD INT environment.

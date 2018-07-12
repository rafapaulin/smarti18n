# Changelog

## 0.2.0 - Assets-loaded translations
- Translation work being triggered by the directive, or directly subscribing to the service
- Both ```defaultLocale``` and ```locale``` are optionals, but at least one must be passed on config obj when initializing the service.
- Service checks for ```smarti18n``` on localstorage, and uses it if found
- Service falls back to ```default.i18n.json``` if desired locale file is not found
- Service load translations from /assets/```[componentName]```/```[lang | default].i18n.json```.
- Added a peerDependency on rxjs.

## 0.1.0 - Initial set up
- Package information added to package.json.
- Initial directive structure and data validation.

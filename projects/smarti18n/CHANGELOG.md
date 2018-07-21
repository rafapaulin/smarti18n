# Changelog

## 0.5.7
- Simple pluralization approach changed from `one-or-many` to `zero-one-or-many`.
- More descriptive error messages for pluralization errors.

## 0.5.6
- Documentation updated to cover the wholw library instructions.

## 0.5.5
- Pluralization feature added to translations.

## 0.4.0
- Variable interpolation feature added to translations.

## 0.3.5
- Translation loader decoupled from the main service to its own class, allowing the use of different types of loaders.

## 0.3.0
- A pipe was added as a translation option.

## 0.2.1
- Translation subscription service unsubscribed onDestroy().
- Added a peerDependency on rxjs.
- Fixed [issue](https://github.com/rafapaulin/smarti18n/issues/4) regarding object deep merge.
- Fixed [issue](https://github.com/rafapaulin/smarti18n/issues/3) regarding translations not being triggered on elements hidden by *ngIf.

## 0.2.0
- Both ```defaultLocale``` and ```locale``` are both optionals, but at least one must be passed on config obj when initializing the service.
- Translation triggered by the directive.
- Translation triggered by directly subscribing to the service.
- Service falls back to ```default.i18n.json``` if desired locale file is not found.
- Service load translations from /assets/```[componentName]```/```[lang | default].i18n.json```.

## 0.1.0
- Initial directive structure and data validation.

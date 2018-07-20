# Smart i18n

A better internationalization package for angular 6+
### [Changelog](CHANGELOG.md)

### status: [![CircleCI](https://circleci.com/gh/rafapaulin/smarti18n.svg?style=svg)](https://circleci.com/gh/rafapaulin/smarti18n)

---

## Install and usage

### **Setup**

install: `npm install smarti18n`

import and use in root module like so:

```
import { Smarti18nModule } from 'smarti18n'
// ...
@NgModule({
	imports: [
		Smarti18nModule.defaultLoader()
	]
})
```

**NOTE:** The `defaultLoader()` method loads the smarti18n library with the default assets-based json file loading.
This is done this way because we are supporting different loaders in the future.

### **Usage**

We provide several methods for translation:

- Directive

```
<!-- direct string -->
<div smarti18n="translate.label"></div>
<!-- from component property -->
<div [smarti18n]="translateLabelValue"></div>
<!-- with additional parameters for interpolation and couting -->
<div smarti18n="translate.label" [smarti18nParams]="objectWithParams" [smarti18nToCount]="countValue"></div>

```

- Pipe

```
<!-- from component property -->
<div>{{ label | smarti18n }}</div>
<!-- with additional parameters for interpolation and couting (properties) -->
<div>{{ label | smarti18n:objectWithParams:countValue }}</div>
```

### Interpolation / Counting

#### TODO!!!

---

## Roadmap

There's a few things we are planning to implement soon:

- A command-line tool to generate i18n asset json files from .json files side-by-side with component typescript code;
- An HTTP loader that allows for changing the url to request translation files from;

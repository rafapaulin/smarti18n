# Smart i18n

A better internationalization package for angular 6+

### Status: [![CircleCI](https://circleci.com/gh/rafapaulin/smarti18n.svg?style=svg)](https://circleci.com/gh/rafapaulin/smarti18n)

---
## Table of contents

- [1 - Features](#features)
- [2 - Installation and setup](#install-and-setup)
  - [2.1 - Installation](#installation)
  - [2.2 - Configuration](#configuration)
- [3 - The CLI](#the-cli)
  - [3.1 - Commands](#commands)
  - [3.2 - Component-level translation files guidelines](#component-level-translation-files-guidelines)
- [4 - Usage](#usage)
  - [4.1 - Translation object](#translation-object)
  - [4.2 - The Loaders](#the-loaders)
    - [4.2.1 - Default assets loader](#--default-assets-loader)
	- [4.2.3 - Configurable http loader](#--configurable-http-loader)
    - [4.2.3 - Write your own loader](#--write-your-own-loader)
  - [4.3 - Translation techniques](#translation-techniques)
    - [4.3.1 - Directive](#--directive-template)
    - [4.3.2 - Pipe](#--pipe-template)
    - [4.3.3 - Service](#--service-typescript)
  - [4.4 - Interpolation](#interpolation)
  - [4.5 - Pluralization](#pluralization)
    - [4.5.1 - Simple style](#--simple-style)
    - [4.5.2 - Complex style](#--complex-style)
- [5 - Roadmap](ROADMAP.md)
- [6 - Changelog](CHANGELOG.md)

---
## Features
- Lazy-loaded in-memory translation
- Eliminates the need of having all the locales loaded at same time
- Decoupled loader
  - Default [assets loader](#assets-loader)
  - Write your own loaders!
- Many translation techniques
  - [Directive-driven](#directive) (template) translation
  - [Pipe-driven](#pipe) (template) translation
  - [Service-driven](#service) (typescript) translation
- Command Line Interface
  - Command to bundle the component-level translation files
---

## Installation and setup

### **INSTALLATION**

Install: `npm install smarti18n --save`

Import and use in root module like so:

```typescript
import { Smarti18nModule } from 'smarti18n';

// [...]

@NgModule({
  imports: [
    Smarti18nModule.defaultLoader()
  ]
})
```

This will provide the `Smarti18nService` application-wide and set up the translation loader. The `defaultLoader()` method provides the smarti18n lib with the default [assets loader][#assets-loader].

Note that you will still need to import this module in all the modules in you application that are using translations, to enable the `[Directive](#directive)` and the `[Pipe](#pipe)`. We recomend importing and exporting it in a shared module.

*IMPORTANT*: Just provide the loader in the root module. Nowhere else.

### **CONFIGURATION**

You need also to configure the lib on your main `AppComponent`, providing starting locale you will be using in your application. This lib supports a `locale` and a `defaultLocale` config params. 

The `locale` congif param stands for the current language selected for your application.

The `defaultLocale` config param stands for the default language of your application. 

You can provide both of them in the config method, but at least one of them (which can be either one) **must** be provided.

```typescript
import { Component } from '@angular/core';
import { Smarti18nService } from 'projects/smarti18n/src/public_api';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(
		private smarti18nService: Smarti18nService
	) {
		this.smarti18nService.setConfig({
			defaultLocale: 'en-us',
			locale: 'pt-br'
		});
	}
}
```
If at any given time you request a specific translation key from the translation object, and it does not exist on the current language object, it will fallback to the default location key before printing the raw dot-notation string.

The translation object will be assembles deep-merging the object retrieved from `locale` **into** the object retrieved from `defaultLocale`, overwritting any duplicated keys and falling back to `defaultLocale` keys for any non-existing `locale` key, standing with a single translation object.

Example (with the above config):

```typescript
// en-us.i18n.json
{
  "fallback": "this is a fallback",
  "key1": "value1",
  "group": {
    "key2": "value2",
    "key3": "value3"
  }
}

// pt-br.i18n.json
{
  "key1": "valor1",
  "group": {
    "key2": "valor2",
  }
}

// Assembled translation object (in-memory)
{
  "fallback": "this is a fallback", // Fallback. From en-us.i18n.json
  "key1": "valor1", // From pt-br.i18n.json
  "group": {
    "key2": "value2", // From pt-br.i18n.json
    "key3": "value3" // Fallback. From en-us.i18n.json
  }
}
```

---
## The CLI

*_Please note that this section only applies to those who use the `defaultLoader`._

This package ships with a CLI to help keep your project nice and tidy.

Just run `$ npx smarti18n <command> <options>` from the root of you project.

### **COMMANDS**

- `help`: Display help information.
- `build`: Compile all your component-level `.i18n.json` files into the final bundle used by this package.

### _Options_
- `-h, --help`: Print this usage guide.
- `-v, --verbose`: Verbose output.

### **COMPONENT-LEVEL TRANSLATION FILES GUIDELINES**

Respecting the folloging guidelines and recommendations will ensure that the CLI will find and compile all your translation files properly, as well as allow you to keep your project organized with component-scoped translation files.

- Your translation files can be stored anywhere inside your project source defined in your `angular.json` file (or on the specified folder), but must me inside a `i18n` subfolder.
- The extension of your translation files must be `.i18n.json` (I.E.: `en-us.i18n.json`).
- You may use the `_basePath` key in your translation files to specify a "scope" for the translation keys to avoid potential undesired overwrites. We recommend that you use the `_basePath` key as your component name. For instance:

The following files:

```json
{
  "_basePath": "Component1",
  "duplicatedScopedKey": "value1",
  "anotherKey": "value2"
}
```
```json
{
  "_basePath": "Component2",
  "duplicatedScopedKey": "value3",
  "differentKey": "value4"
}
```
```json
{
  "generalKey1": "value5",
  "generalKey2": "value6",
}
```

Will compile into:

```json
{
  "Component1": {
    "duplicatedScopedKey": "value1",
    "anotherKey": "value2"
  },
  "Component2": {
    "duplicatedScopedKey": "value3",
    "differentKey": "value4"
  },
  "generalKey1": "value5",
  "generalKey2": "value6",
}
```

The `jsonMap` dot-notation strings must always point to the final bundled file keys you want to use.

---
## Usage

In this section we explain how to use the different features of this lib. Feel free to ask questions or suggest improvements if you feel that something you need is not covered by this documentation.

### **TRANSLATION OBJECT**

Regardless of the loader used, this lib relies on a JSON-like translation file such as:
```json
{
  "translationKey1": "Translated sentence to be used",
  "group1": {
    "translationKey2": "Another translated sentence to be used"
  },
  "group2": {
    "subgroup": {
      "translationKey3": "One more translated sentence to be used"
    }
  }
}
```
This translation file will be lazy-loaded into memory using as source what is defined in the loader. the `defaultLoader` will load based on the `.i18n.json` files inside the `/assets/i18n` folder.

### **THE LOADERS**

The loaders is the part of the lib which loads your translation objects into memory. We provide the default assets-loader out-of-the-box. We have [plans](#roadmap) to include other loaders in the future.

### _- Default assets loader_

The default assets loader relies on the following file structure:
```
|- src
  |- assets
    |- i18n
      |- en-us.i18n.json
      |- [other-locales].json
```
Your translation files:
- Should be named with the same name as you set on the [config method](#install-and-setup) of the service you called in your `AppComponent`. The same rule goes for further `.setLocale(locale)` calls to change the language of your application.
- Must always have `.i18n.json` as extension. (`en-us.i18n.json`)

We recommend that you scope your translation keys inside a component key. This process can be automatized using the [embedded CLI](#the-cli).

### _- Configurable http loader_

Instead of using the default assets loader, you can instead use the other embedded loader, the Http Loader. This uses a special configuration in `config` to give you complete freedom of where/how to store your locale data. To use, simply need to import the module at `root` using the `httpLoader()` method:

```typescript
import { Smarti18nModule } from 'smarti18n';

// [...]

@NgModule({
  imports: [
    Smarti18nModule.httpLoader()
  ]
})
```

and pass the necessary configuration, following the schema into the optional `loader` property on `setConfig()`:

```typescript
smarti18n.setConfig({
	defaultLocale: 'en-us',
	locale: 'pt-br',
	loader: {
		"baseUrl": "http://baseUrl",
		"suffix": "a_suffix"
	}
})
```

either `baseUrl` and `suffix` are optional, but at least one of them should be set. The final url follows the logic
```typescript
`${baseUrl || ''}/${locale}/${suffix || ''}`
```
so for the example above, we get `http://baseUrl/{locale}/a_suffix`

### _- Write your own loader_

You can create your own loader by creating a new service class, inheriting from `LocaleLoaderService`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { ObjMap, LocaleLoaderService } from 'smarti18n';

export class MyOwnLoaderService extends LocaleLoaderService {
	constructor() { super(); }

	/**
	 * this method must return an object representing the requested locale
	 * this here results, for example, in the availability of translation for the following keys:
	 *   - key1
	 *   - key2.key3
	 * 
	 * @param locale The desired locale.
	 * @returns an observable of the requested locale
	 * @memberof HttpLoaderService
	 */
	public load(locale: string): Observable<ObjMap<string>> {
		return ObservableOf({
			key1: 'value',
			key2: {
				key3: 'other value'
			}
		});
	}
}
```
...and using the following in your `root` module to override the injection:

```typescript
import { Smarti18nModule, LocaleLoaderService } from 'smarti18n';
import { MyOwnLoaderService } from './my-own-loader.service';

// [...]

@NgModule({
  imports: [
    Smarti18nModule // no need to import using either `defaultLoader` or `httpLoader`
  ],
  providers: [
	  { provide: LocaleLoaderService, useClass: MyOwnLoaderService } // override default service injection
  ]
})
```

### **TRANSLATION TECHNIQUES**

All the translation techniques rely on the translation object, which is a json-like object like the following:

```json
{
  "translationKey1": "Translated sentence to be used",
  "group1": {
    "translationKey2": "Another translated sentence to be used"
  },
  "group2": {
    "subgroup": {
      "translationKey3": "One more translated sentence to be used",
      "simplePlural": "I have no apples.|I have one apple.|I have many apples.",
      "complexPlural": "{0}I have no apples.|{1}I have one apple.|[2-9]I have some apples.|{10}I have exactly ten apples.|[11,*]I have many apples."
    },
    "interpolation": "I have a dog. Its name is :dogName."
  }
}
```
*_The object above will be used on the techniques examples_

You must provide the `jsonMap` in dot-notation to the sentence you want to show. For instance, if you want to print the sentence `Another translated sentence to be used`, you should provide `group1.translationKey2` as the dot-notation to the techniques you want to use.

You can use any or all of the following ways to prepare the localization of your app. Just choose which fits best your needs and code style!


### _- Directive (template)_

*_Translation object [example](#translation-techniques)_

The directive can be used in any html element. It will insert the text retrieved from the translation object and insert into the element ```innerText```.

The dot-notation can be provided:

- As a string:
```html
<span smarti18n="group1.translationKey2"></span><!-- Another translated sentence to be used -->
```
- Or as a property from the typescript file of your component:
```typescript
export class Randomcomponent {
  public translateLabelValue = 'group1.translationKey2';
}
```
```html
<span [smarti18n]="translateLabelValue"></span> <!-- Another translated sentence to be used -->
```


### _- Pipe (template)_

*_Translation object [example](#translation-techniques)_

The main difference between the `Directive` and the `Pipe`, is that on the `Pipe` the lib does not replace the content of the element. You should use the `Pipe` technique when there is more elements inside the html element than just the sentence you want translated.

*_Please note that due to our support of user-driven locale changes, this is not a [`Pure pipe`](https://angular.io/guide/pipes#pure-and-impure-pipes)._

As the directive, the pipe technique also supports both:

- Static string
```html
<span>{{ 'group1.translationKey2' | smarti18n }}</span><!-- Another translated sentence to be used -->
```
- Property from the typescript file of your component:
```typescript
export class Randomcomponent {
  public translateLabelValue = 'group1.translationKey2';
}
```
```html
<div>{{ translateLabelValue | smarti18n }}</div><!-- Another translated sentence to be used -->
```


### _- Service (typescript)_

*_Translation object [example](#translation-techniques)_

If you need to get a translated value inside yout component typescript code, you can use the `Smarti18nService` directly. Just inject it in your component, and call the `getTranslation()` method, passing your dot-notation as the first argument:

```typescript 
import { Smarti18nService } from 'smarti18n';

export class RandomComponent {
  translatedSentence: string;

  constructor(
    private smati18nService: Smarti18nService
  ) {}

  translate() {
	  this.translatedSentence = this.smati18nService.getTranslation('group1.translationKey2'); // Another translated sentence to be used
  }
}
```
And then printing it at the template.
```html
<span>{{ translatedSentence }}</span>
```
Or using inside  your component as any other property.

### **INTERPOLATION**

*_Translation object [example](#translation-techniques)_

We support variable interpolation in all the techniques above! If you need to pass variable into the to-be-translated senteces just use the colon notation for the variables inside the translated sentences, and pass an `object` containing the variable name and its value either:

```typescript
const params = {
  dogName: 'Spike'
}
```

- As `smarti18nParams` attribute in the `Directive` technique:
```html
<div smarti18n="group2.interpolation" [smarti18nParams]="params"></div> <!-- I have a dog. Its name is Spike. -->
```

- As the first argument on the `Pipe` technique:
```html
<span>{{ 'group2.interpolation' | smarti18n:params }}</span> <!-- I have a dog. Its name is Spike. -->
```

- As the second parameter of the `getTranslation()` method on the `Service` technique:
```typescript
// [...]
  this.smarti18nService.getTranslation('group2.interpolation', params); // I have a dog. Its name is Spike.
// [...]
```

### **PLURALIZATION**

*_Translation object [example](#translation-techniques)_

You can also pluralize your sentences! There is two styles of pluralization: the simple style and the complex style.

In both of them you must provide a number as a `count`, which will be considered when the lib selects which sentence to show.

### _- Simple Style_

This style is basically a `zero-one-or-many` syntax. Your sentences on the translation object must be separated by a `|`.

In your translation object you must provide a 3-variation sentence (`"I have no apples.|I have one apple.|I have many apples."`)

The first sentence will be selected when the `count == 0`, the second option when the `count == 1` and the last one when the `count > 1`.

In the `Directive` pluralization technique, you must pass the `count` to the `smarti18nToCount` attribute, either as a static or dinamic value:
```html
<div smarti18n="group2.subgroup.simplePlural" [smarti18nToCount]="0"></div><!-- I have no apples. -->
<div smarti18n="group2.subgroup.simplePlural" smarti18nToCount="1"></div><!-- I have one apple. -->
<div smarti18n="group2.subgroup.simplePlural" smarti18nToCount="5"></div><!-- I have many apples. -->
```

In the `Pipe` technique, you must pass the `count` as the second parameter of the pipe (nullifying the first, if no variables are being interpolated):
```html
<span>{{ 'group2.subgroup.simplePlural' | smarti18n:null:0 }}</span><!-- I have no apples. -->
<span>{{ 'group2.subgroup.simplePlural' | smarti18n:null:1 }}</span><!-- I have one apple. -->
<span>{{ 'group2.subgroup.simplePlural' | smarti18n:null:5 }}</span><!-- I have many apples. -->
```

In the `Service` technique, the `count` must be the third parameter (nullifying the second, if no variables are being interpolated):

```typescript
// [...]
  this.smarti18nService.getTranslation('group2.subgroup.simplePlural', null, 0); // I have no apples.
  this.smarti18nService.getTranslation('group2.subgroup.simplePlural', null, 1); // I have one apple.
  this.smarti18nService.getTranslation('group2.subgroup.simplePlural', null, 5); // I have many apples.
// [...]
```

### _- Complex Style_

In this style, you can set specific sentences to a specific `count` number or range of numbers. You will still need to separate the sentence option with `|`, and provide the `count` number or range as the very first thing on the sentence option.

The notation is:

- `{number}` for à specific `count`;
- `[numberA,numberB]` for ranges (no spaces). A '*' as `numberB`, it means `infinite`.

No changes are needed on the directive/pipe/service.

The numbers provided **must never** overlap.

Example: `{0}I have no apples.|{1}I have one apple.|[2-9]I have some apples.|{10}I have exactly ten apples.|[11,*]I have many apples.`

```html
<div smarti18n="group2.subgroup.complexPlural" [smarti18nToCount]="0"></div><!-- I have no apples. -->
<div smarti18n="group2.subgroup.complexPlural" smarti18nToCount="1"></div><!-- I have one apple. -->
<div smarti18n="group2.subgroup.complexPlural" smarti18nToCount="5"></div><!-- I have some apples. -->
<div smarti18n="group2.subgroup.complexPlural" smarti18nToCount="10"></div><!-- I have exactly ten apples. -->
<div smarti18n="group2.subgroup.complexPlural" smarti18nToCount="20"></div><!-- I have many apples. -->
```
```html
<span>{{ 'group2.subgroup.complexPlural' | smarti18n:null:0 }}</span><!-- I have no apples. -->
<span>{{ 'group2.subgroup.complexPlural' | smarti18n:null:1 }}</span><!-- I have one apple. -->
<span>{{ 'group2.subgroup.complexPlural' | smarti18n:null:5 }}</span><!-- I have some apples. -->
<span>{{ 'group2.subgroup.complexPlural' | smarti18n:null:10 }}</span><!-- I have exactly ten apples. -->
<span>{{ 'group2.subgroup.complexPlural' | smarti18n:null:20 }}</span><!-- I have many apples. -->
```
```typescript
// [...]
  this.smarti18nService.getTranslation('group2.subgroup.complexPlural', null, 0); // I have no apples.
  this.smarti18nService.getTranslation('group2.subgroup.complexPlural', null, 1); // I have one apple.
  this.smarti18nService.getTranslation('group2.subgroup.complexPlural', null, 5); // I have some apples.
  this.smarti18nService.getTranslation('group2.subgroup.complexPlural', null, 10); // I have exactly ten apples.
  this.smarti18nService.getTranslation('group2.subgroup.complexPlural', null, 20); // I have many apples.
// [...]
```

### _Yes! You can combine both variables and pluralization. Just stick with the syntaxes on both topics and you are golden._

---
## [Roadmap](ROADMAP.md)

---
## [Changelog](CHANGELOG.md)

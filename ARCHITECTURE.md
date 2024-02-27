# Architecture

This document describes the high-level architecture of web-components-toolbox. The web-components-toolbox is designed based on the atomic design methodology. It provides a set of reusable UI components for building web applications using Web Components and Shadow DOM, ES Modules.

If you want to familiarize yourself with the code base, you are just in the right place!

Yet another resource is the `README.md` about various rules and tod's of the web-components-toolbox and the [XX](http://www.google.ch) Video Tutorial.

## Bird's Eye View

![](https://user-images.githubusercontent.com/1711539/50114578-e8a34280-0255-11e9-902c-7cfc70747966.png)

On the highest level, the web-component-toolbox is organized around UI components of varying levels of abstraction - atoms, molecules, organisms... Each UI component is implemented as a Web Component using custom elements, shadow DOM, HTML templates etc. This encapsulates the markup, styles, and behavior of the component. Components expose custom CSS properties to enable styling by consumers. Scoped styling variables avoid clashes.

Each component is implemented as a Web Component using ES Modules and custom elements.
namespace allows multiple versions of the same component.
variant allows modifications of the same component.
File and folder structure reflects the namespace and variant.
Components are loaded dynamically using wc-loader based on configuration.
Tests are implemented using Playwright in e2e folder.


## Code Map

This section talks briefly about various important directories and data structures. The components are organized from low-level to high-level abstractions.

### Atoms
These are basic HTML elements like inputs, buttons, images etc. wrapped as web components with proper styling and behavior.
Example: `<a-button>`,`<a-input>`

### Molecules
These are simple groups of UI elements composing a component.
Example: <m-teaser>, <m-navigation>

### Organisms
These are complex UI components composing of molecules and atoms.
Example: <o-header>, <o-footer>

### Controllers
These are not visual components, but JavaScript classes for handling logic/state. connect components to APIs/data.
Example: <c-filter>

### Pages
Complete page templates made of multiple organisms.
Example: <p-home>, <p-settings>

### Loading Components
The wc-config.js handles dynamically loading components via HTML imports.
It loads components on demand based on which ones are used on the page.

### Styling
Shared styles are in styles/ folder. Components have local styles for encapsulation.
Custom app styles can override via CSS variables. The styling is based on CSS custom properties defined in :root. This allows themeing by just overriding variable values.
Global styles are in variablesCustom.css which components can import. Components have local styles in their shadow roots.

### Connectivity
The components are loosely coupled and communicate via events and data binding. Parent components use light DOM to compose child components.
Slotted content allows components to be populated from outside their shadow roots.

### Testing
Unit tests for components are in test/ folder.
End-to-end tests using Playwright are in e2e/ folder.

# 2
### `src/es/components `
Contains the source code for all the web components like atoms, molecules, organisms etc.

### `docs`
Contains documentation for using the components.

### `wc-config.js`
Main config file for loading components on the page.

### `demo`
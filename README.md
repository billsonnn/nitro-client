# Nitro Client
Nitro Client is a frontend UI written in Angular for rendering [nitro-renderer](https://git.krews.org/nitro/nitro-renderer)

## Prerequisites

* You must have [git](https://git-scm.com/) installed
* You must have [NodeJS](https://nodejs.org/) >= 16.13 installed
* We recommend you use [Yarn](https://yarnpkg.com/) over [npm](https://npmjs.com/)
    - ```npm i yarn -g```
* Install the Angular CLI globally
    - ```yarn global add @angular/cli```

## Installation
* First you should open terminal and navigate to the folder where you want to clone Nitro
* Clone Nitro
    - ```git clone https://git.krews.org/nitro/nitro-client.git```
* Install the dependencies
    - ```yarn install```
    - This may take some time, please be patient
* Rename a few files
    - Rename ``.env.example`` to ``.env``
    - Rename ``src/renderer-config.json.example`` to ``src/renderer-config.json``
    - Rename ``src/ui-config.json.example`` to ``src/ui-config.json``
* Set your links
    - Open ``.env`` & update the values
        - The point of this file is to make it easier for deployment
        - These keys will be injected into your ``index.html``
    - Open ``src/renderer-config.json``
        - You may not need to change any values here unless you have customized your assets
        - ``socket.url, asset.url, image.library.url, & hof.furni.url`` are empty because these values are being pulled from ``.env``. Updating the values here will override ``.env``.
    - Open ``src/ui-config.json``
        - The only value that probably needs updating here is ``url.prefix``
        
## Usage
* To use Nitro you will have to have ``.nitro`` assets generated, see [nitro-converter](https://git.krews.org/nitro/nitro-converter) for instructions
* See [Morningstar Websockets](https://git.krews.org/nitro/ms-websockets) for instructions on configuring websockets on your server

### Development
Run Nitro in development mode when you are editing the files, this way you can see the changes in your browser instantly
```
yarn start
```

### Production
To build a production version of Nitro just run the following command
```
yarn build-prod
```

* A ``dist`` folder will be generated, these are the files that must be uploaded to your webserver
* Consult your CMS documentation for compatibility with Nitro and how to add the production files

### NitroConfig
* This is a **required** global variable in the ``index.html`` file
* This variable contains configuration options that are used when Nitro is bootstrapped
* See the default ``index.html`` file for the default options
* Any keys added here will override those keys in your configuration files

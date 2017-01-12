# ExpressJS with Angular 2

Using [Angular2 CLI](https://github.com/angular/angular-cli). Install with `npm install -g angular-cli`.

## Angular CLI
```bash
# Create APP
ng new mean-app
ng new mean-app --style=sass 
ng help

# Generate (g)
ng g component new-cmp      # --> src/app/feature/new-cmp
ng g component ../newer-cmp # --> src/app/newer-cmp
# Component   
ng g component my-new-component
# Directive   
ng g directive my-new-directive
# Pipe    
ng g pipe my-new-pipe
# Service     
ng g service my-new-service
# Class   
ng g class my-new-class
# Interface   
ng g interface my-new-interface
# Enum    
ng g enum my-new-enum
# Module  
ng g module my-module
```

note: generating routes is disabled.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build
```bash
ng build
ng build -dev # same up

# Build production
ng build -prod
```


## ExpressJS Configuration

```bash
npm install --save express body-parser
```

### `/server.js` 

```js
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
```

### `/server/routes/api.js` 

Axios and jsonplaceholder are used to create fake data.

```js
const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

module.exports = router;
```

### `/src/app/app.module.js` 

Modules with inline routes.

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostsService } from './posts.service';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: 'posts',
    component: PostsComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [PostsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


### `/src/app/app.module.html` 

`router-outlet` print router component content.

```html
<h1>
  {{title}}
</h1>
<router-outlet></router-outlet>
```

```bash
# creates the dist folder with the 
# angular 2 app built files.
ng build
```

Better `npm run build` at `package.json`.

```json
{
  "name": "mean-app",
  // meta data
  "scripts": {
    // Other scripts
    "build": "ng build && node server.js"
  },
  "private": true,
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  }
}
```

## Connect with Express

### Create Angular service
```bash
ng generate service posts
```

Creates `src/app/posts.service.ts` 

```ts
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostsService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getAllPosts() {
    return this.http.get('/api/posts')
      .map(res => res.json());
  }
}
```

### Adding service to Angular components

Creates `src/app/posts/posts.component.ts` 

```ts
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostsService {

  constructor(private http: Http) { }

  // Get all posts from the API
  getAllPosts() {
    return this.http.get('/api/posts')
      .map(res => res.json());
  }
}
```


### Component view

Creates `src/app/posts/posts.component.html` 

```html
<div class="container">
  <div class="row" *ngFor="let post of posts">
    <div class="card card-block">
      <h4 class="card-title">{{ post.title }}</h4>
      <p class="card-text">{{post.body}}</p>
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </div>
  </div>
</div>
```


## Change styles to sass
```bash
ng set defaults.styleExt scss
```


## Adding Bootstrap 4

Install bootstrap 4 from npm:

```bash
npm install bootstrap@next
```

Then add the needed script files to `apps[0].scripts`:

```json
"scripts": [
  "../node_modules/jquery/dist/jquery.js",
  "../node_modules/tether/dist/js/tether.js",
  "../node_modules/bootstrap/dist/js/bootstrap.js"
],
```

Finally add the Bootstrap CSS to the `apps[0].styles` array:

```json
"styles": [
  "../node_modules/bootstrap/dist/css/bootstrap.css",
  "styles.css"
],
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

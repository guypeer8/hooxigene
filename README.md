# hooxigene
![cdbc0131-98f9-41a3-939e-07e23c1c2473](https://user-images.githubusercontent.com/13187428/53160489-bf45c080-35d0-11e9-818c-88bc234950cd.png)

- An unfancy straight forward state manager for react hooks applications.

## Installation
```
npm install --save hooxigene
```

## Usage 
#### Create pretty & easy-to-understand reducer-like objects
###### Notice that it seems like you "mutate" the data you change. You treat it as if it was a mutation in your code, but thanks to the power of `immer`, a new state object is created.
```js
// baseReducer.js
export default {
    name: 'base',
    initialState: {
        modal: null,
    },
    handlers: {
        SET_MODAL: (state, { modal }) =>
            state.modal = modal,
        CLOSE: state =>
            state.modal = null,
    },
};

// userReducer.js
export default {
    name: 'user',
    initialState: {
        id: '',
        local: {
            email: '',
            name: '',
            password: '',
            confirm_password: '',
        },
        plan: 'free',
        active: true,
        is_logged_in: false,
        role: null,
        error: {
            message: '',
            type: '',
        },
    },
    handlers: {
        CHANGE_FIELD: (state, payload) =>
            state.local = { ...state.local, ...payload },
        SET_USER: (state, { id, role }) => {
            state.id = id;
            state.role = role;
            state.is_logged_in = true;
        },
        LOGIN: state =>
            state.is_logged_in = true,
        LOGOUT: state => {
            state.id = '';
            state.is_logged_in = false;
            state.role = null;
        },
        SET_ADMIN: state =>
            state.role = 'admin',
        SET_ERROR: (state, { error }) =>
            state.error = error,
        CLEAR_ERROR: state =>
            state.error = { ...state.error, type: '', message: '' },
        TOGGLE_ACTIVATION: state =>
            state.active = !state.active,
    },
};

// dashboardReducer.js
export default {
    name: 'dashboard',
    initialState: {
        siteId: null,
        textEditor: {
            mode: 'edit', // [ edit, preview ]
        },
        category: {
            activeCategory: null,
            list: {}, // { [category]: [] }
        },
        dictionary: {
            currentPhrase: '',
            defByPhrase: {},
        },
    },
    handlers: {
        SET_SITE_ID: (state, { site_id }) =>
            state.siteId = site_id,
        SET_TEXT_EDITOR_MODE: (state, { mode }) =>
            state.textEditor.mode = mode,
        SET_ACTIVE_CATEGORY: (state, { activeCategory }) =>
            state.category.activeCategory = activeCategory,
        ADD_CATEGORY: (state, { category }) =>
            state.category.list[category] = [],
        REMOVE_CATEGORY: (state, { category }) =>
            delete state.category.list[category],
        ADD_SUBCATEGORY: (state, { category, subCategory }) =>
            state.category.list[category].push(subCategory),
        ...
        ...
        ...
    },
};

```
#### Create your store passing your reducer-like objects using `createStore`
```js
// store.js
import { createStore } from 'hooxigene';
import dashboard from './dashboardReducer';
import base from './baseReducer';
import user from './userReducer';

export default createStore(base, user, dashboard);
```
---

#### `StoreProvider`
```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import StoreProvider from 'hooxigene';
import AppRouter from './AppRouter';
import store from './store';

const App = () => (
    <StoreProvider 
        store={store}
        viewer={true}
     />  
        <AppRouter/>
    </StoreProvider>
);

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
```
- `StoreProvider` should wrap the app in the top level, so the store data will be available throughout the whole app.
- `props`:
  - `store` - pass a store holding the app state. the store should be created using the `createStore` function supplied be `hooxigene`.
  - `viewer` - `hooxigene` uses `react-state-trace` library, which is a great devtool that let's you view your app state as it changes and break it to pieces. `viewer` is a boolean flag. when explicitly set to `true`, it shows the viewer at the top right of the app. Press `shift + s` to show or hide the devtool when you use it.
---

### Consuming the store & dispatching actions - `getState` & `getDispatch`
```js
import React from 'react';
import capitalize from 'lodash/capitalize';
import { getState, getDispatch } from 'hooxigene';

const MODES = {
    EDIT: 'edit',
    PREVIEW: 'preview',
};

const TextEditor = () => {
    const mode = getState('dashboard.textEditor.mode');
    const dispatch = getDispatch('dashboard');

    return (
        <div>
            {Object.keys(MODES).map(MODE => (
                <button
                    key={MODES[MODE]}
                    active={mode === MODES[MODE]}
                    onClick={() =>
                        dispatch('SET_TEXT_EDITOR_MODE', { mode: MODES[MODE] })
                    }
                >{capitalize(MODES[MODE])} Mode
                </button>
            ))}
        </div>
    );
};

export default TextEditor;
```
- `getState` exposes your app state. Make sure to call it inside a component or a function, because the nature of `hooks` in `react` require it.
    - You pass the name you gave the reducer-like object. In our example it could be `dashboard`, `user` or `base`.
    - If you have nested properties you do not have to destructure the object, you can simply separate the path using commas `.`. For example you can do any of the following four and it is the same:
        - `const mode = getState('dashboard.textEditor.mode');`
        - `const { mode } = getState('dashboard.textEditor');`
        - `const { textEditor: { mode } } = getState('dashboard');`
        - `const { dashboard: { textEditor: { mode } } } = getState();`
    - When you use `getState` without a reducer-like object name, you get the whole state object.
    
- `getDispatch` exposes your app dispatcher / actions. As with `getState`, make sure to call it inside a component or a function.
                    - You pass the name you gave the reducer-like object. In our example it could be `dashboard`, `user` or `base`.:
    - You pass the name you gave the reducer-like object. In our example it could be `dashboard`, `user` or `base`.
    - You can access a specific reducer-like object dispatcher directly. For example you can do any of the following four and it is the same:
        - `const dispatch = getDispatch('dashboard');`
        - `const dispatch = getDispatch().dashboard;`
    - When you want to dispatch an action to change the state you call `dispatch('SET_TEXT_EDITOR_MODE', { mode: 'edit' })`.
        - First argument is the type of the action which you defined as a key on `handlers` in your reducer-like object.
        - Second argument is the payload which is passed to the handler itself as the second parameter: `handlers: { SET_TEXT_EDITOR_MODE: (state, { mode }) => state.mode = mode, }`.
---

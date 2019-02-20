import React, { createContext, useContext } from 'react';
import isPlainObject from 'lodash.isplainobject';
import StateViewer from 'react-state-trace';
import PropTypes from 'prop-types';

const StoreContext = createContext(null);

export const StoreProvider = ({ children, store, viewer }) => {
    const _store = store();

    return (
        <StoreContext.Provider value={_store}>
            {children}
            {viewer && <StateViewer store={_store} />}
        </StoreContext.Provider>
    );
};

StoreProvider.propTypes = {
    store: PropTypes.func.isRequired,
    viewer: PropTypes.bool.isRequired,
};

StoreProvider.defaultProps = {
    viewer: false,
};

export const getStore = () =>
    useContext(StoreContext);

export const getState = (key) => {
    const { state } = getStore();

    if (!key)
        return state;

    if (!isPlainObject(state))
        return state;

    let _state = {...state};

    key
        .split('.')
        .forEach(k =>
            _state = _state[k]
        );

    return _state;
};

export const getDispatch = (key) => {
    const { dispatch } = getStore();
    return key ? dispatch[key] : dispatch;
};

export default StoreProvider;

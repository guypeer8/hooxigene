import { useReducer } from 'react';
import flattenDeep from 'lodash.flattendeep';
import produce from 'immer';

function reducerBuilder({ name, initialState, handlers }) {
    if (!name)
        throw new Error(`"name" is a required attribute to define your reducers`);
    if (!initialState)
        throw new Error(`"initialState" is a required attribute to define your reducers`);
    if (!handlers)
        throw new Error(`"handlers" is a required attribute to define your reducers`);

    const reducer = (state = initialState, action) => produce(state, _state => {
        if (handlers[action.type])
            handlers[action.type](_state, action.payload);
        else
            return state;
    });

    const [state, dispatch] = useReducer(reducer, initialState);
    return ({
        state: {
            [name]: state,
        },
        dispatch: {
            [name]: (type, payload) => dispatch({ type, payload }),
        },
    });
}

export default function reducersBuilder(...reducerObjects) {
    return flattenDeep(reducerObjects)
        .map(reducerObject =>
            reducerBuilder(reducerObject)
        )
        .reduce(
            (acc, value) => ({
                state: {
                    ...acc.state,
                    ...value.state,
                },
                dispatch: {
                    ...acc.dispatch,
                    ...value.dispatch,
                },
            }),
            {}
        );
};

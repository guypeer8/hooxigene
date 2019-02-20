import reducersBuilder from './reducersBuilder';

export default (...reducers) => () => reducersBuilder(reducers);

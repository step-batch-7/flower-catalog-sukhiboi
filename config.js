const dataStorePath = './DATASTORE.json';
const [, , customPort] = process.argv;
const defaultPORT = 8000;
const PORT = customPort || defaultPORT;

module.exports = {
  dataStorePath,
  PORT
};

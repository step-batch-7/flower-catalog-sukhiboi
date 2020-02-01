const dataStorePath = process.env.DATASTORE;
const [, , customPort] = process.argv;
const defaultPORT = 8000;
const PORT = customPort || defaultPORT;

module.exports = {
  dataStorePath,
  PORT
};

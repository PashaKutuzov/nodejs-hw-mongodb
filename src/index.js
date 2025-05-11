import  setupServer  from './server.js';
console.log('Starting app...');
(async () => {
  try {
    await setupServer();
  } catch (error) {
    console.error('Error while starting server:', error);
  }
})();
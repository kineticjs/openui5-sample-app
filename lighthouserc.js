module.exports = {
    ci: {
      collect: {
        staticDistDir: './dist',
        url: ['http://localhost:8080/index.html?sap-ui-language=en']
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };
const websiteRoutes = require('./WebsiteRoutes');

function route(app) {
    app.get('/api/id', websiteRoutes);
    app.get('/api/search', websiteRoutes);
}

module.exports = route;

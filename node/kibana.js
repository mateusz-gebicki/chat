function init(app) {
    app.get('/kibana', (req, res) => {
        const kibanaUrl = process.env.KIBANA_URL || 'http://localhost:5601';
        res.redirect(kibanaUrl);
    });
}

module.exports = { init };

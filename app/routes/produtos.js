module.exports = function(app) {
     function listaProdutos(req, res) {
        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.lista(function(err, results) {
            res.format({
                html: function(){
                    res.render("produtos/lista",{lista:results});
                },
                json: function(){
                    res.json(results);
                }
            });
        });

        connection.end();
    }

    app.get('/produtos', listaProdutos);

    app.get('/produtos/form', function(req, res){
        res.render('produtos/form', {errosValidacao:{}, produtos:{}});
    });

    app.post('/produtos&id=\*', function(req, res){


        var idLivro = req.body.id;

        console.log(idLivro);

        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.delete(idLivro, function(err, results){
            res.redirect("/produtos");
        });
    });

    app.post('/produtos', function(req, res){

        var produtos = req.body;

        var validadorTitulo = req.assert('titulo', 'titulo é obrigatório');
        validadorTitulo.notEmpty();

        var erros = req.validationErrors();
        if(erros){
            res.render('produtos/form', {errosValidacao:erros, produtos:produtos});
            return;
        }

        var connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.ProdutosDAO(connection);

        produtosDAO.salva(produtos, function(err, results){
            res.redirect("/produtos");
        });
    });
}

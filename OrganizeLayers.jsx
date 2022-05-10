#target.Illustrator
#targetengine.main()
//UFT-8
// Configuracoes do aplicativo
    // desbalita mensagem de scrit na inicializacao
    app.preferences.setBooleanPreference("ShowExternalJSXWarning", false)
    //Seta Origem da Regua
    app.preferences.setBooleanPreference ("isRulerOriginTopLeft",true);
    // seta unidade de medida para o usi do aplicativo em mm
    app.preferences.setIntegerPreference("rulerType", 1);
//

function main(){
    try{
        var doc=app.document
        if(app.documents.length<1){
            alert('No document to process\nOpen a document containing some objects', 'Organize Layers')
            return
        }else{
            // Chama interface grafica
            UI()
        }
    }catch(erro){
        msgErro='Description: ' + erro.description + '\n'
        alert ('Could not run script because:\n' + msgErro, 'The main( ) function says:')
    }
}
main()

function UI(){
    // Configuracao do Layout geral
        var janela=new Window('dialog','Organiza Camadas',undefined,{closeButton: false})
        //var janela=new Window('palette','Organiza Camadas',undefined,{})
            //janela.preferedSize=[250,390]
            janela.alignChildren='fill'
        
        var painelInformacao=janela.add('panel',undefined,undefined)
            painelInformacao.alignChildren='fill'

            janela.add('staticText',undefined,'Escopo:')
        var painelOrigem=janela.add('panel',undefined,undefined)
            painelOrigem.orientation='column'
            painelOrigem.alignChildren='fill'

            janela.add('staticText',undefined,'Opcoes:')
        var painelOpcoes=janela.add('panel',undefined,undefined)
            painelOpcoes.orientation='column'
            painelOpcoes.alignChildren='fill'

        var painelBotoes=janela.add('panel',undefined,undefined)
            painelBotoes.alignChildren='center'
    //
    
    // Configuracao do Painel Informacao
        strInformacao='Esse script organiza, cria e nomea, camadas a partir do eescopo determinado na opção origem, utilizando as propriedades dos Objetos presentes no documeno como regras de organizacao'
        var textoInformacao=painelInformacao.add('staticText',undefined,strInformacao,{multiline:true})
    //  

    // Configuracao do Painel Radio Origem
        var radioTudo=painelOrigem.add('radioButton',undefined,'Tudo')
            radioTudo.value=true
        var radioArtboard=painelOrigem.add('radioButton',undefined,'Artboard')
            radioArtboard.value=false      
        var radioSelecionados=painelOrigem.add('radioButton',undefined,'Selecionados')
            radioSelecionados.value=false

        var listaDeArtboards=listarArtboards()
        var listArtboads=painelOrigem.add('dropdownlist',undefined,listaDeArtboards)
            listArtboads.visible=true
            listArtboads.selection=0
            listArtboads.enabled=false
    //

    // Configuracao do Painel Opcoes
        var checkDeletarCamadasVazias=painelOpcoes.add('checkbox',undefined,'Deletar camadas vazias')
            checkDeletarCamadasVazias.value=true
        var checkDeletarPranchetasVazias=painelOpcoes.add('checkbox',undefined,'Deletar pranchetas vazias')
            checkDeletarPranchetasVazias.value=true
        var checkCamadaObjetosSemNome=painelOpcoes.add('checkbox',undefined,'Camada para Obj. Sem Nome')
            checkCamadaObjetosSemNome.value=true
    //

    /* Configuracao do Painel Radio Sintaxe
        var nomes=['Nomes','Nome dos Objetos','Cores dos Contornos','Numeros Sequenciais']
        var prefixos=['Prefixos']
        var sulfixos=['Sulfixos']
        var listPrefixos=painelSintaxe.add('dropdownlist',undefined,prefixos)
            listPrefixos.selection=0
        var listNomes=painelSintaxe.add('dropdownlist',undefined,nomes)
            listNomes.selection=0
        var listSulfixos=painelSintaxe.add('dropdownlist',undefined,sulfixos)
            listSulfixos.selection=0
    */

    // Configuracao do Painel Botoes
        var grupoBotoes=painelBotoes.add('group')
            grupoBotoes.alignChildren='row'
            var bntOrganizar=grupoBotoes.add('button',undefined,'Organizar')
            var bntTestes=grupoBotoes.add('button',undefined,'Testes')
            var bntSair=grupoBotoes.add('button',undefined,'Sair')
    //

    // Configuracao Copyright
        var copyright = janela.add('statictext', undefined, '\u00A9 Inacio Felipe, inacioFelipens@gmail');
        copyright.justify = 'center';
        copyright.enabled = false;
    //

    // EVENTOS
        // Radios Origem
            radioTudo.onClick = function(){
                listArtboads.selection=0
                listArtboads.enabled=false
            };
            radioArtboard.onClick = function(){
                listArtboads.enabled=true
                listArtboads.selection=1
                // listaDeArtboards=listarArtboards()
            };
            radioSelecionados.onClick = function(){
                listArtboads.selection=0
                listArtboads.enabled=false
            };
        //

        // Listas
            listArtboads.onChange=function(){
                zoomArtboard(listArtboads.selection.text)
            }
        //

        // Botoes
            bntOrganizar.onClick = function(){
                escopo=radioSelecionado(painelOrigem)
                selArtboard=listArtboads.selection

                organizarCamadas(escopo,selArtboard,checkDeletarCamadasVazias.value,checkDeletarPranchetasVazias.value,checkCamadaObjetosSemNome.value,janela)
            }
            bntTestes.onClick = function(){
                /*Fechar a unidade grafica porque por um motivO desconhecido ela esta impedindo a execucao do script
                    alert('fechando janela')
                    janela.close()
                    alert('aguardando ...')
                    setTimeout(function(){alert('passaram-se 5 seg')},5000);
                    alert('continuando execucao')
                */
                testarFuncoes()
            }
            bntSair.onClick = function(){
                janela.close()
            };
        //
    //
    
    janela.show()
}

function organizarCamadas(escopo,selArtboard,checkCamadasVazias,checkArtboardsVazias,checkObjetosSemNome,UI){
    /*Essa funcao cria e nomea camadas a partir de um objeto contido na interface grafica
        parametros:
        -> escopo
            variavel que contem o escopo de atuacao do script, definida pelos
            os objetos(shapes) presentes no documento atual (layers)
        -> sintaxe
            variavel que contem a forma como serão nomeadas as camadas
        -> UI
            Janela da interface grafica
    */

    // Verifica objetos 
        /* Verifica a presenca de objetos nao nomeados no documento,
            porque esses objetos, levarao a criacao de camadas vazias,
            numa eventual execucao posterior do script
        */
            numObjSemNome=0
            objetos=app.activeDocument.pageItems
            for(i=0; i<objetos.length;i++){
                if(objetos[i].name==''){
                    numObjSemNome++
                }
            }
            var resp=confirm('Existem ' + numObjSemNome + ' objetos não nomeados presentes no documento.\n\nUma Camada especial,"Objetos sem nome", será criada para inserção desses objetos.\n\nDeseja continuar?','Organizar Camadas')
            if (resp==true) {
                //Fechar a unidade grafica porque o metodo "setActiveArtboardIndex()"
                //por um motivo desconhecido esta impedindo a execucao do script
                UI.close()
                // continua a execucao do script
            } else {
                // Fecha janela e para a execucao do script
                UI.close();
                return
            }
    //

    // Apaga as artboards vazias
        if(checkArtboardsVazias==true){
            delArtboardsVazias()
        }
    //

    // Motor da funcao
    switch(escopo){
        case "Tudo":
            var artbs=app.activeDocument.artboards
            // Percorre todas as Artboards do documento
            for(var i=0; i<artbs.length; i++){
                var artboardAtual=artbs[i]
                // Cria camada com o nome da prancheta
                    var nomeArtboard=artboardAtual.name
                    var nivelArtboards=app.activeDocument.layers
                    criarCamada(nivelArtboards,nomeArtboard)
                    // Verifica se existem objetos na artboard
                        app.activeDocument.artboards.setActiveArtboardIndex(i);
                        app.activeDocument.selection=null
                        if(app.activeDocument.selectObjectsOnActiveArtboard()==true){ // boolean
                            // cria e move os objetos para sua camada
                                var sel=app.activeDocument.selection
                                for(var j=0; j<sel.length; j++){
                                    //Criar sublayer -> camada para o objeto dentro da camada prancheta
                                        nivelObjetos=nivelArtboards.getByName(nomeArtboard).layers
                                        if(checkObjetosSemNome==true){
                                           if(sel[j].name==''){
                                               camadaObjetoSemNome=criarCamada(nivelObjetos,'Objetos sem nome')
                                               sel[j].move(camadaObjetoSemNome,ElementPlacement.PLACEATBEGINNING)
                                               redraw()
                                           }else{
                                               camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                                               sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                                               redraw()
                                           }
                                        }else{
                                            camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                                            sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                                            redraw()
                                        }
                                        redraw()
                                };
                            //
                        }
                    //
                //
            }
            app.activeDocument.selection=null
        break;
        case "Artboard":
            //alert ('iniciar artboard com a prancheta: '+ selArtboard)
            boardNum=selArtboard-1
            //var boardNum = app.activeDocument.artboards.getActiveArtboardIndex() //+ 1
            var artboardAtual=app.activeDocument.artboards[boardNum]
            // Cria camada com o nome da prancheta
                var nomeArtboard=artboardAtual.name
                var nivelArtboards=app.activeDocument.layers
                criarCamada(nivelArtboards,nomeArtboard)
                // seleciona os objetos da artboard
                    app.activeDocument.artboards.setActiveArtboardIndex(boardNum);
                    app.activeDocument.selection=null
                    if(app.activeDocument.selectObjectsOnActiveArtboard()==true){ // boolean
                        // Nomea os objetos da selecao
                            var sel=app.activeDocument.selection
                            for(var j=0; j<sel.length; j++){

                                //Criar sublayer -> camada para o objeto dentro da camada prancheta
                                nivelObjetos=nivelArtboards.getByName(nomeArtboard).layers
                                if(checkObjetosSemNome==true){
                                    if(sel[j].name==''){
                                        camadaObjetoSemNome=criarCamada(nivelObjetos,'Objetos sem nome')
                                        sel[j].move(camadaObjetoSemNome,ElementPlacement.PLACEATBEGINNING)
                                        redraw()
                                    }else{
                                        camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                                        sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                                        redraw()
                                    }
                                }else{
                                    camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                                    sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                                    redraw()
                                }
                                redraw()
                            };
                        //
                    }
                //
            //
        break;
        case "Selecionados":
            var sel=app.activeDocument.selection
            var nomeCamada="Selecionados"
            var nivelArtboards=app.activeDocument.layers
            criarCamada(nivelArtboards,nomeCamada)
            if(sel.length>0){
                // Nomea os objetos da selecao
                    for(var j=0; j<sel.length; j++){

                        //Criar sublayer -> camada para o objeto dentro da camada prancheta
                        nivelObjetos=nivelArtboards.getByName(nomeCamada).layers
                        if(checkObjetosSemNome==true){
                            if(sel[j].name==''){
                                camadaObjetoSemNome=criarCamada(nivelObjetos,'Objetos sem nome')
                                sel[j].move(camadaObjetoSemNome,ElementPlacement.PLACEATBEGINNING)
                                redraw()
                            }else{
                                camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                                sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                                redraw()
                            }
                        }else{
                            camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                            sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                            redraw()
                        }
                        redraw()


                        /*/Criar sublayer -> camada para o objeto dentro da camada prancheta
                            nivelObjetos=nivelArtboards.getByName(nomeCamada).layers
                            camadaObjeto=criarCamada(nivelObjetos,sel[j].name)
                            redraw()
                        //Move os Items para dentro da nova camada
                            sel[j].move(camadaObjeto,ElementPlacement.PLACEATBEGINNING)
                        */
                    };
                //
            }else{
                // alert('Nada esta selecionado','A funcao "organizarCamadas( )" diz:')
            }
        break;
    }

    // Apaga as camadas e subcamadas vazias
        if (checkCamadasVazias==true){
            delCamadasSubcamadasVazias()
        }
    //
}


// METODOS -----------------------------------------------------------------------------
function testarFuncoes(){
    alert ('Teste Concluido!','Organiza Camadas diz:')
}

function radioSelecionado(controle){
    /*Essa funcao retorna o nome do controle radioButtom que foi selecionado
        Parametros:
        -> controle:
            o controle de ser um painel com radiobuttons
    */
    for (var i=0; i<controle.children.length; i++) {
      if(controle.children[i].value==true){
          controle=controle.children[i].text
          return controle
      }
    };
    //alert('Retonando o controle:\n' + controle ,'A funcao "radioSelecionado( )" diz:')
}

function criarCamada(nivel,strNome){
    /* Essa funcao cria uma nova camada se ela nao existir no nivel indicado
        parametros:
        -> nivel:
            nivel onde sera criada a camada.
            Ex.: 'app.activeDocument.layers' para o primeiro nivel
        -> strNome:
            string com o nome que sera atribuido a nova layer
    */
    var novaCamada;
    try {
        novaCamada = nivel.getByName(strNome);
    } catch (e) {
        // no layer by that name, so make it
        novaCamada = nivel.add()
        novaCamada.name = strNome;
    }
    return novaCamada;
}

function listarArtboards(){
    //alert('carregando lista de artboards...','A funcao "listarArtboards( )" diz:')
    var listaDeArtboards=['Lista de Artboards']
    artbs=app.activeDocument.artboards
    for(var i=0; i<artbs.length; i++){
        listaDeArtboards.push(artbs[i].name)
    }
    return listaDeArtboards
}

function idArtboard(strNome){
    /* Essa funcao retorna o id da prancheta no documento atual indicada pelo seu nome
        Parametros:
        strNome-> string que contem o nome da artboard a ser identificada
    */

    var artbs= app.activeDocument.artboards
    var id=0
    var j=0
    for (i=0; i<artbs.length; i++){
        if(artbs[i].name==strNome){
            id=i
            //alert('Encontrei a prancheta '+ strNome + '.Seu id é:' + id)
            j++
        }
    }
    return id
}

function zoomArtboard(index){
   try{
        // Esse bloco de codigo é responsavel pela ativacao da artboard com o paramentro passado
        // faz a identificacao do parametro seja ele um String ou um Numero 
        if(isNaN(index)==true){
            // O parametro é um string, usa a funcao idArtboard(index) para recuperar o id
            id=idArtboard(index)
            //app.activeDocument.artboards.setActiveArtboardIndex(id)
            
        }else{
            // O paramentro é um numero
            //app.activeDocument.artboards.setActiveArtboardIndex(index)
        }
    }catch(erro){
        alert('Não foi possivel prosseguir com o script porque:\n' + erro, 'A funcao "selObjetosArtboard( )" diz:')
        return
    }

    //verifica se existe selecao de objetos na artboard atual
    app.executeMenuCommand('fitin')
    //app.executeMenuCommand('fitall')
}

function delArtboardsVazias(){
    var doc=app.activeDocument
    var artbs=doc.artboards
    var log='Verificadas ' + artbs.length + ' artboards:'
    for(i=artbs.length-1;i>=0;i--){
        doc.selection=null
        doc.artboards.setActiveArtboardIndex(i)
        sel=doc.selectObjectsOnActiveArtboard()
        selecao=doc.selection
        redraw()
        log=log+'artboard ' + i + ' ->' + selecao.length + ' objetos;\n'
        if (app.selection.length == 0) {
            doc.artboards.remove(i)
            redraw()
        }
    }
    //alert(log) // this function is crashing the illustrator in notebook
}

function delCamadasSubcamadasVazias(){
    /* Copyright
       Script recolhido da Adobe Support Community
       https://community.adobe.com/t5/illustrator-discussions/removing-empty-sub-layers/td-p/7678505
       Resposta correta de Silly-V
   
       Essa funcao retorna um array com todas as camadas e subcamadas vazias
       do documento.
       Parametros:
       -> container:
           Local onde devera ser feita a busca por camadas
       -> arr:
           array de retorno da funcao com as camdas vazias recolhidas de container
   */

   // Apaga as camadas e subcamadas vazias
       var emptyLayers = [];
       recolheCamadasVazias (app.activeDocument, emptyLayers);
       for (var i=0; i<emptyLayers.length; i++) {
           emptyLayers[i].remove();
           redraw()
       }
   //

   // Metodo que recolhe as camadas vazias do documento atual
   function recolheCamadasVazias(container, arr) {
       var layers = container.layers;
       for (var ii=0; ii<layers.length; ii++) {
           try {
               var ilayer = layers[ii];
               ilayer.canDelete = true;
               if (ilayer.layers.length>0) {
                   recolheCamadasVazias (ilayer, arr)
               }
               if (ilayer.pageItems.length==0 && ilayer.canDelete) {
                   arr.push(ilayer);
               }
               else {
                   ilayer.canDelete = false;
                   container.canDelete = false;
               }
           }
           catch(e){
           }
       }
   }
}



//Nao usadas
function reiniciaUI(UI,tempo){
    UI.close
    setTimeout(function(){
        alert('Reiniciando...')
        main()
        }
    ,tempo*1000)
}

function selObjetosArtboard(index){
    /*
     Essa funcao ativa,seleciona e entao retorna a selecao de todos os objetos da
     artboard do documento ativo , indicada com o paramentro indice da funcao
     Parametros:
     -> Index:
        indice da artboard a trabalhar pode ser um string ou um numero inteiro
    */

    try{
        // Esse bloco de codigo é responsavel pela ativacao da artboard com o paramentro passado
        // faz a identificacao do parametroseja ele um String ou um Numero 
        if(isNaN(index)==true){
            // O parametro é um string, usa a funcao idArtboard(index) para recuperar o id
            id=idArtboard(index)
            alert ('O id da artboard e: ' + id + '\nSe o aplicativo travar é porque é necessario fechar a janela da aplicacao antes de prosseguir, existe um problema com um metodo nativo')
            //Por algum motivo isso nao esta funcionando. e necessario fechar a janela UI
            app.activeDocument.artboards.setActiveArtboardIndex(id)
        }else{
            // O paramentro é um numero
            alert('O Index, ' + index + ' e um numero\nSe o aplicativo travar é porque é necessario fechar a janela da aplicacao antes de prosseguir, existe um problema com um metodo nativo')
            //Por algum motivo isso nao esta funcionando. e necessario fechar a janela UI
            app.activeDocument.artboards.setActiveArtboardIndex(index)
        }
    }catch(erro){
        alert('Não foi possivel prosseguir com o script porque:\n' + erro, 'A funcao "selObjetosArtboard( )" diz:')
        return
    }

    //Seleciona os objetos da artboard atual
    sel=app.activeDocument.selectObjectsOnActiveArtboard()

    redraw()
    if(sel==true){
        selecao=app.activeDocument.selection
        return selecao
    }else{
        return alert('Nao existem objetos na Artboard selecionada','A funcao "selObjetosArtboard( )" diz:')
    }
}
    

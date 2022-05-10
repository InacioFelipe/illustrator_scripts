#target.Illustrator
#targetengine.main()

function main(){
    //start
    try{
        if(app.documents.length<1){
            alert('No document to process\nOpen a document containing some objects', 'Naming Objects')
            return
        }else{
            // globals
                DOC=app.activeDocument
                ARTBS=DOC.artboards
                LAYERS=DOC.layers
            //
            UI() //loading graphical interface
        }
    }catch(erro){
        msgErro='Description: ' + erro.description + '\n'
        alert ('Could not run script because:\n' + msgErro, 'The main( ) function says:')
    }
}
main()

function UI(){
    const janela=new Window('dialog','Naming Objects',undefined,{closeButton: false})
        janela.preferedSize=[300,600]

    // VARIABLES
        const informacoes='This script names the document objects according to the controls choices below'
        var listPrefixes=['Prefixos','Auto Numeracao','Nome Prancheta']
        var listNames=['Nomes','Biqueira','Contorno','Furo Passador','Logomarca','Pino Mola','Registro Silk','Registro Contorno','Trazeira']
        var listSulfixes=['Sulfixos','Auto Numeracao','Nome Prancheta']
    //

    // LAYOUT
        // Informacoes
            const infoPanel=janela.add('panel',undefined,undefined)
            infoPanel.alginChildren='fill'
            infoPanel.orientation='row'
        
            const groupInformation=janela.add('group')
            const info=groupInformation.add('staticText',[0,0,250,30],informacoes,{multiline:true})

            const f = File ('C:/Users/inaci/OneDrive/Scripts/Scripts Ilustrator/Inacio/icones/lanchonete.png');
            try {
                var bntInfo = groupInformation.add ("iconbutton", [0,0,22,22], f, {style: "toolbutton", toggle: true})
            } catch (_) {
                var bntInfo = groupInformation.add ("button", [0,0,22,22], '-', {})
            }
            // Event to retract/expand information
            bntInfo.onClick = function(){
                if(info.visible==true){
                    //infoPanel.size=[300,10]
                    info.visible=false
                    bntInfo.text='+'
                    bntInfo.size=[22,10]
                }else if(info.visible==false){
                    //infoPanel.size=[300,30]
                    info.visible=true
                    bntInfo.text='-'
                    bntInfo.size=[22,22]
                }
            };
            
        //
        
        // Scopo Panel
            const scopoPanel=janela.add('panel',undefined,'Escopo:')
            scopoPanel.margins=[15,30,15,15]
            scopoPanel.alignChildren='fill'
            scopoPanel.orientation='column'
        
            const groupRadiosScopo=scopoPanel.add('group',[0,0,300,30],undefined,{})
                const radioTudo=groupRadiosScopo.add('radioButton',undefined,'Tudo')
                    radioTudo.value=false
                const radioArtboard=groupRadiosScopo.add('radioButton',undefined,'Artboards')
                    radioArtboard.value=false      
                const radioSelecionados=groupRadiosScopo.add('radioButton',undefined,'Selecionados')
                    radioSelecionados.value=true

            const groupListAtboards=scopoPanel.add('group')
                const listArtboads=groupListAtboards.add('dropdownlist',undefined,listarArtboards())
                    listArtboads.visible=true
                    listArtboads.selection=0
                    listArtboads.enabled=false
        //

        // Sintaxe Panel
            const sintaxePanel=janela.add('panel',undefined,'Sintaxe:')
            sintaxePanel.margins=[15,30,15,15]
            sintaxePanel.alignChildren='fill'
            sintaxePanel.orientation='column' 
        
            const groupRadiosSeparator=sintaxePanel.add('group',[0,0,300,30],undefined,{})
            const radioUnderline=groupRadiosSeparator.add('radioButton',undefined,'( _ ) Underline')
                radioUnderline.value=true
            const radioSpace=groupRadiosSeparator.add('radioButton',undefined,'(   ) Espaco')
                radioSpace.value=false      
            const radioHifen=groupRadiosSeparator.add('radioButton',undefined,'( - ) Hifem')
                radioHifen.value=false

            const groupDropDownLists=sintaxePanel.add('group')
            // Simulate editabled dropDownList prefixes
                const groupPrefixes = groupDropDownLists.add ("group {alignChildren: 'left', orientation: ’stack'}");
                if (File.fs !== "Windows") {
                    // for Windows
                    var dropPrefixes = groupPrefixes.add ("dropdownlist", undefined, listPrefixes);
                    var ePrefixes = groupPrefixes.add ("edittext");
                } else { 
                    // for Macs
                    var ePrefixes = groupPrefixes.add ("edittext");
                    var dropPrefixes = groupPrefixes.add ("dropdownlist", undefined, listPrefixes);
                }
                ePrefixes.text = listPrefixes[0]; ePrefixes.active = true;
                dropPrefixes.preferredSize.width = 80;
                ePrefixes.preferredSize.width = 60; ePrefixes.preferredSize.height = 20;
                
                // Event to Simulate
                dropPrefixes.onChange = function () {
                    ePrefixes.text = dropPrefixes.selection.text;
                    ePrefixes.active = true;
                }
            //

            // Simulate editabled dropDownList Names
                const groupNames = groupDropDownLists.add ("group {alignChildren: 'left', orientation: ’stack'}");
                if (File.fs !== "Windows") {
                    // for Windows
                    var dropNames = groupNames.add ("dropdownlist", undefined, listNames);
                    var eNames = groupNames.add ("edittext");
                } else { 
                    // for Macs
                    var eNames = groupNames.add ("edittext");
                    var dropNames = groupNames.add ("dropdownlist", undefined, listNames);
                }
                eNames.text = listNames[0]; eNames.active = true;
                dropNames.preferredSize.width = 120;
                eNames.preferredSize.width = 100; eNames.preferredSize.height = 20;
                
                // Event to Simulate
                dropNames.onChange = function () {
                    eNames.text = dropNames.selection.text;
                    eNames.active = true;
                }
            //

            // Simulate editabled dropDownList sulfixes
                    const groupSulfixes = groupDropDownLists.add ("group {alignChildren: 'left', orientation: ’stack'}");
                    if (File.fs !== "Windows") {
                        // for Windows
                        var dropSulfixes = groupSulfixes.add ("dropdownlist", undefined, listSulfixes);
                        var eSulfixes = groupSulfixes.add ("edittext");
                    } else { 
                        // for Macs
                        var eSulfixes = groupSulfixes.add ("edittext");
                        var dropSulfixes = groupSulfixes.add ("dropdownlist", undefined, listSulfixes);
                    }
                    eSulfixes.text = listSulfixes[0]; eSulfixes.active = true;
                    dropSulfixes.preferredSize.width = 80;
                    eSulfixes.preferredSize.width = 60; eSulfixes.preferredSize.height = 20;
                    
                    // Event to Simulate
                    dropSulfixes.onChange = function () {
                        eSulfixes.text = dropSulfixes.selection.text;
                        eSulfixes.active = true;
                    }
                //
                
            //
        //
        
        // Buttons Panel
            const groupButtons=janela.add('group')
                groupButtons.align='fill'
                groupButtons.orientation='row'
                const btnNomear=groupButtons.add('button',undefined,'Nomear')
                const btnSair=groupButtons.add('button',undefined,'Sair')
        //

        // Copyright block
            const copyright = janela.add('statictext', undefined, '\u00A9 Inacio Felipe, inacioFelipens@gmail');
            copyright.justify = 'center';
            copyright.enabled = false;
        //
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
                
            }
        //

        // botoes
            btnNomear.onClick=function(){

                // Está sendo necessario o fechamento daunidade grafica porque
                // a instalacao do illustrator nao esta aceitando o metodo: 'setActiveArtboardIndex'
                janela.close()

                // get scopo

                    // utiliza metodo para retornar os 'radios buttons' selecionados
                    scopo=radioSelecionado(groupRadiosScopo)
                
                    switch(scopo){
                        case 'Tudo':
                            var selecao=DOC.pathItems
                        break;
                        case 'Artboards':
                            // Utiliza metodo pra selecionar os objetos
                            var selecao=selObjetosArtboard(listArtboads.selection.text)
                        break;
                        case 'Selecionados':
                            var selecao=DOC.selection
                        break;
                    }
                    //alert('Num. Obj.Sel. -> ' + selecao.length)
                //

                // get sintaxe
                    // Utiliza metodo pra selecionar os objetos
                    switch(radioSelecionado(groupRadiosSeparator)){
                        case '( _ ) Underline':
                            var strSeparator='_'
                        break;
                        case '(   ) Espaco':
                            var strSeparator=' '
                        break;
                        case '( - ) Hifem':
                            var strSeparator='-'
                        break;
                    }
                    // lembrando que na verdade o retorno da opcao é capturado na caixa de texto
                    // e nao na DropDownList
                    if(ePrefixes.text=='Prefixos'){
                        strPrefix=false
                    }else{
                        strPrefix=ePrefixes.text
                    }
                    
                    if(eSulfixes.text=='Sulfixos'){
                        strSulfix=false
                    }else{
                        strSulfix=eSulfixes.text
                    }
                    if(eNames.text=='Nomes'){
                        strName=''
                    }else{
                        strName=eNames.text
                    }
                    
                    
                //

                nomearObjetos(selecao,strSeparator,strPrefix,strName,strSulfix)
            }
            
            btnSair.onClick = function(){
                janela.close()
            }
        //
    //

    janela.show()
}

function nomearObjetos(selecao,strSeparator,strPrefix,strName,strSulfix){

    var PreX=strPrefix
    var SulX=strSulfix
    var nome=strName

    for(i=0;i<selecao.length;i++){

        switch(PreX){
            case 'Auto Numeracao':
                prefixo=i
            break;
            case 'Nome Prancheta':
                prefixo=selecao[i].parent
            break;
            case 'Prefixos':
                prefixo=''
            break;
        }
        switch(SulX){
            case 'Auto Numeracao':
                sulfixo=i
            break;
            case 'Nome Prancheta':
                sulfixo=selecao[i].parent
            break;
            case 'Sulfixos':
                sulfixo=''
            break;
        }

        // rules of naming
            var nomeObj=''
            if(strPrefix==false && strSulfix==false){
                nomeObj = nome
            }else if(strPrefix==false && strSulfix=!false){
                nomeObj = nome + strSeparator + sulfixo
            }else if(strPrefix=!false && strSulfix==false){
                nomeObj = prefixo + strSeparator + nome
            }else if(strPrefix=!false && strSulfix=!false){
                nomeObj = prefixo + strSeparator + nome + strSeparator + sulfixo
            }
            //alert(nomeObj)
        //

        // apply the name in the objects    
        selecao[i].name=nomeObj
        redraw() 
    }
}

function listarArtboards(){
    var listaDeArtboards=['Lista de Artboards']
    artbs=app.activeDocument.artboards
    for(var i=0; i<artbs.length; i++){
        listaDeArtboards.push(artbs[i].name)
    }
    return listaDeArtboards
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
        // faz a identificacao do parametro seja ele um String ou um Numero 
        if(isNaN(index)==true){
            // O parametro é um string, usa a funcao idArtboard(index) para recuperar o id
            id=idArtboard(index)
            //Por algum motivo isso nao esta funcionando. e necessario fechar a janela UI
            app.activeDocument.artboards.setActiveArtboardIndex(id)
            
        }else{
            // O paramentro é um numero
            //Por algum motivo isso nao esta funcionando. e necessario fechar a janela UI
            app.activeDocument.artboards.setActiveArtboardIndex(index)
        }
    }catch(erro){
        //alert('Não foi possivel prosseguir com o script porque:\n' + erro, 'A funcao "selObjetosArtboard( )" diz:')
        return
    }

    // Selecione os objetos
    sel=app.activeDocument.selectObjectsOnActiveArtboard()
    if(sel==true){
        selecao=app.activeDocument.selection
        redraw()
        return selecao
    }else{
        //return alert('Nao existem objetos na Artboard selecionada','A funcao "selObjetosArtboard( )" diz:')
    }

    //Metodo retorna id
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
                j++
            break;
            }
        }
        //if (j==0){alert('Não encontrei ' + strNome + '. Retonando a primeira atboard')}
        return id
    }
}
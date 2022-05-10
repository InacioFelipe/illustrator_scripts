/*
    Name-> OrganizeLayers
    By-> Inacio Felipe
    Where-> https://community.adobe.com/t5/illustrator-discussions/script-to-rename-layers-with-art-board-names/m-p/12643479#M305480
    what are you doing-> 
        This script gets the size of all objects contained in the root of an artboard and applies
        those values to the artboard.
        You can choose an application scope from the active artboard, any artboard, or all artboards in
        the document.
        You can also choose which properties will be affected, Width or Height,
        whether or not to keep a safety border.
*/

#target.Illustrator
#targetengine.main()

main()

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

            /* if(DOC.selection.length>0){
                UI() //loading graphical interface
            }else{
                alert('nada selecionado')
                return
            } */

            UI() //loading graphical interface
        }
    }catch(erro){
        msgErro='Description: ' + erro.description + '\n'
        alert ('Could not run script because:\n' + msgErro, 'The main( ) function says:')
    }
}

function UI(){
    const janela=new Window('dialog','Fit Artboards',undefined,{closeButton: false})
        janela.preferedSize=[300,600]

    // VARIABLES
        const infoScript='This script adjusts the artboard to the artwork according to the settings below'

        // gera lista como o nome das pranchetas
        var ScopeLst=['All','Active']
        for(i=2;i<ARTBS.length+2;i++){
            ScopeLst[i]=ARTBS[i-2].name
        }
    //

    // LAYOUT
        // information
            const panelInfo=janela.add('panel',undefined)
                panelInfo.margins=[15,15,15,15]
                panelInfo.alignChildren='fill'
                panelInfo.orientation='row'
                const info=panelInfo.add('staticText',undefined,infoScript,{multiline:true})
        //

        // DropDownList (Scope)
            const panelScope=janela.add('panel',undefined,'Scope of application:')
                panelScope.margins=[15,15,15,15]
                panelScope.alignChildren='fill'
                panelScope.orientation='row'

            const grpScope = panelScope.add('group')
                const lblScope=grpScope.add('staticText',undefined,'Artboard:')
                const listScope=grpScope.add('dropDownList',undefined,ScopeLst)
                listScope.selection=1
        //

        // Radios (Property)
            const panelRadios=janela.add('panel',undefined,'Property to change:')
                panelRadios.margins=[15,15,15,15]
                panelRadios.alignChildren='fill'
                panelRadios.orientation='row'
            const groupRadios=panelRadios.add('group')
                const rdWidth=groupRadios.add('radioBUtton',undefined,'Width')
                const rdHeight=groupRadios.add('radioBUtton',undefined,'Height')
                const rdBoth=groupRadios.add('radioBUtton',undefined,'Both')
                    rdBoth.value=true
        //

        // Slider (Safety)
            const panelSafetyBorder=janela.add('panel',undefined,'Safety Border:')
                panelSafetyBorder.margins=[15,15,15,15]
                panelSafetyBorder.alignChildren='fill'
                panelSafetyBorder.orientation='row'

            const grpSafety = panelSafetyBorder.add('group')
                const defaultSafety=5
                var lblSafety=grpSafety.add('staticText',undefined,'Dist.:')
                var sliderSafety=grpSafety.add('slider',undefined,defaultSafety,0,100)
                var textoSafety=grpSafety.add('editText',undefined,defaultSafety)
                    textoSafety.characters='3'
                var lblSafety=grpSafety.add('staticText',undefined,'mm')
        //

        // Buttons 
            const panelButtons=janela.add('panel',undefined)
            panelButtons.alignChildren='fill'
            panelButtons.orientation='row'
            const bntDo=panelButtons.add('button',undefined,'Do')
            const bntExit=panelButtons.add('button',undefined,'Exit')
        //

        // Copyright block
            const copyright = janela.add('statictext', undefined, '\u00A9 Inacio Felipe, inacioFelipens@gmail');
            copyright.justify = 'center';
            copyright.enabled = false;
        //
    //

    // EVENTS
        // Siders
            sliderSafety.onChanging=function(){
                textoSafety.text=sliderSafety.value.toFixed(0)
            }
        //

        // Buttons
            bntDo.onClick = function(){
                //Aplica a escolha dos radiosButtons
                var choice=radioSelecionado(groupRadios)
                var idArtb
                const vSafety=Number(textoSafety.text) * 2.834645 // Converte unidades
                switch (listScope.selection.text){
                    case 'All':
                        for(var i=0; i<ARTBS.length; i++){
                            resizeArtboard(i,choice,vSafety)
                        }
                    break;
                    case 'Active':
                        idxx=idArtboard(idArtb=listScope.selection.text)
                        resizeArtboard(idxx,choice,vSafety)
                    break;
                    default:
                        idxx=idArtboard(idArtb=listScope.selection.text)
                        resizeArtboard(idxx,choice,vSafety)
                    break;
                }
            };
            
            bntExit.onClick = function(){
                janela.close()
            };
        //
        
    //

    janela.show()
}

function resizeArtboard(idx,resizeType,valueSafety){
    
    const doc = app.activeDocument
    var ab
    var artbBounds
    var graphicBounds
    var rect
    var resizeType

    /*
        Por algum motivo a funcão nativa:

        'doc.selectObjectsOnActiveArtboard()'

        nao está executando. Então foi
        desenvolvido um codigo paralelo contido
        na funcao

        'selObjetosArtboard ()''
        
        para efetuar a selecao dos objetos da
        prancheta
    */

    // Seleciona conteudo da prancheta
    selObjetosArtboard(idx)

    ab = doc.artboards[idx];
    artbBounds = ab.artboardRect; // captura os valores da prancheta
    graphicBounds=aferir(doc.selection) // captura os valores da seleção

    switch(resizeType){
        case 'Both':// ajustar altura e largura
            //doc.fitArtboardToSelectedArt(idx);
            rect=[graphicBounds[0]-valueSafety,graphicBounds[1]+valueSafety,graphicBounds[2]+valueSafety,graphicBounds[3]-valueSafety]
        break;

        case 'Width': // ajustar largura e manter altura
            rect=[artbBounds[0]-valueSafety,graphicBounds[1],artbBounds[2]+valueSafety,graphicBounds[3]]
        break;

        case 'Height': // Manter largura e ajustar altura
            rect=[graphicBounds[0],artbBounds[1]+valueSafety,graphicBounds[2],artbBounds[3]-valueSafety]
            
        break;
    }
    
    // aplica as novas configuracoes na prancheta
    ab.artboardRect = rect;

    redraw()

    return
}

function aferir(selecao){
    /* Essa funcao retorna o array coordenadas[] com os valores
        coordenadas[0]= X1 -> valor X do Canto superior esquerdo da selecao
        coordenadas[1]= Y1 -> valor Y Canto superior esquerdo da selecao
        coordenadas[2]= X2 -> Valor X do canto inferior direito da selecao
        coordenadas[3]= Y2 -> Valor Y do canto inferior direito da selecao
        coordenadas[4]= Largura -> valor correspondente a largura da selecao
        coordenadas[5]= Altura  -> valor correspondente a altura da selecao
        coordenadas[6]= CentroX -> Valor correspondente ao X do centro da selecao
        coordenadas[7]= CentroY -> Valor correspondente ao Y do centro da selecao
        Parametros:
        -> selecao
            objeto(s) selecionado(s) no documento ativo
    */

    var doc=app.activeDocument // scopo de atuacao do script
    coordenadas=[] // array de retorno da funcao

    if (selecao.length<1){
        alert ('Nenhuma selecao foi encontrada.\nSelecione algo e volte a executar','A funcao "aferirSelecao( )" diz:')
        return;
    }

    // Agrupa para aferir
        var grupoTemporario=doc.activeLayer.groupItems.add()
        camadas=[]
        for (i = 0; i < selecao.length; i++) {
            // iterar array com nome das camadas para voltar o objeto a ela
            camadas[i]=selecao[i].layer.name
            selecao[i].moveToEnd(grupoTemporario)
        }
    //

    // captura coordenadas
        var coords = grupoTemporario.geometricBounds
    //

    // Desagrupa e volta para as camadas de selecao
        for (i = 0; i < selecao.length; i++) {
            // recuperar do array o nome da camada em que o objeto estava
            selecao[i].moveToEnd(doc.layers[camadas[i]])
        }
    //
    
    // Efetua calculos
        // configura as coords X Y
        var x1 = coords[0]
        var x2 = coords[2]
        var y1 = coords[1]
        var y2 = coords[3]

        // configura da dados de tamanho
        var largura = x2 - x1
        var altura = y1 - y2

        // configura dados de posicao (centro da selecao)
        var centroX = x1 + (largura / 2)
        var centroY = y1 - (altura / 2)
    //

    // Prepara retorno
        coordenadas[0]=x1
        coordenadas[1]=y1
        coordenadas[2]=x2
        coordenadas[3]=y2
        coordenadas[4]=largura
        coordenadas[5]=altura
        coordenadas[6]=centroX
        coordenadas[7]=centroY
    //

    return coordenadas
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
    // Verifica se existe mais de uma prancheta com o mesmo nome
    if(j>1){
        alert('Encontrei mais de uma prancheta com o Nome:\n' + strNome + '\n\nEstou retonando o id da ultima encontrada', 'A funcao "idArtboard ( )"" diz:')
    }else if(j=0){
        alert('Nao exite a prancheta com o Nome:\n' + strNome + '\n\nEstou retonando a primeira prancheta','A funcao "idArtboard ( )"" diz:')
    }
    return id
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
        alert('Não foi possivel prosseguir com o script porque:\n' + erro, 'A funcao "selObjetosArtboard( )" diz:')
        return
    }

    // Selecione os objetos
    sel=app.activeDocument.selectObjectsOnActiveArtboard()
    if(sel==true){
        selecao=app.activeDocument.selection
        redraw()
        return selecao
    }else{
        return alert('Nao existem objetos na Artboard selecionada','A funcao "selObjetosArtboard( )" diz:')
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
        if (j==0){alert('Não encontrei ' + strNome + '. Retonando a primeira atboard')}
        return id
    }
}
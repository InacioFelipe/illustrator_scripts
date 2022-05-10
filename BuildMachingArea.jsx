#target.Illustrator
#targetengine.main()
//App configuration
    //disable illustrator execution message 
    app.preferences.setBooleanPreference("ShowExternalJSXWarning", false)
    //Set ruler in millimeters
    app.preferences.setIntegerPreference("rulerType", 6);
    //Set origem of ruler
    app.preferences.setBooleanPreference ("isRulerOriginTopLeft",true);
//

function main(){
    try{
        if (app.documents.length<1){
            alert('No document to process.\nOpen a document wicth some objects in it','Build Machining Area')
            return
        }
        else{
            //Call The Graphic Interface
            UI()
        }
    }
    catch(erro){
        msgErro='Description: ' + erro.description + '\n'
        alert ('Could no run script because:\n' + msgErro,'The main() function says:')
    }
}
main();

function UI(){
    /*
    This function returns the GUI and events of your controls
    */

    const vDefaultUsinagem=6.1
    const vDefaultBloco=5
    const vDefaultRaio=3.1
    
    // General Layout
        var janela=new Window('dialog','Area Usinagem',undefined)
        janela.preferedSize=[255,280]
        janela.alignChildren='fill'
        pBloco=janela.add('panel',[0,0,255,65],'Bloco')
        pUsinagem=janela.add('panel',[0,0,255,100],'Usinagem')
        pBotoes=janela.add('panel',[0,0,255,50],undefined)
    //

    // Block Panel
        var gSliderBloco=pBloco.add('group')
        gSliderBloco.orientation='row'
            var usinagemLabelDist=gSliderBloco.add('staticText',undefined,'Desloc')
            var blocoSlider=gSliderBloco.add('slider',undefined,vDefaultBloco,0,15)
            var blocoTexto=gSliderBloco.add('editText',undefined,vDefaultBloco)
            blocoTexto.characters='3'
            var blocoLabel=gSliderBloco.add('staticText',undefined,'mm')
    //

    // Machinig Panel
        var gSliderUsinagem=pUsinagem.add('group')
        gSliderUsinagem.orientation='column'
        var gborda=pUsinagem.add('group')
            gborda.orientation='row'
            var usinagemLabelDist=gborda.add('staticText',undefined,'Desloc')
            var usinagemSlider=gborda.add('slider',undefined,vDefaultUsinagem,0,15)
            var usinagemTexto=gborda.add('editText',undefined,vDefaultUsinagem)
            usinagemTexto.characters='3'
            var usinagemLabel=gborda.add('staticText',undefined,'mm')

        var gRaio=pUsinagem.add('group')
        gRaio.orientation='row'
            var usinagemLabelAng=gRaio.add('staticText',undefined,'Angulo')
            var usinagemSliderRaio=gRaio.add('slider',undefined,vDefaultRaio,0,15)
            var usinagemValorRaio=gRaio.add('editText',undefined,vDefaultRaio)
            usinagemValorRaio.characters='3'
            var usinagemRaioLabel=gRaio.add('staticText',undefined,'graus')
    //

    // Buttons Panel
        var gBotoes=pBotoes.add('group')
            gBotoes.alignChildren='row'
            var bntGerar=gBotoes.add('button',undefined,'Gerar')
            var bntSair=gBotoes.add('button', undefined,'Sair')
    //

    // EVENTS
        // sliders
            blocoSlider.onChanging=function(){
                blocoTexto.text=blocoSlider.value.toFixed(0)
                manipularBorda('bloco',blocoTexto.text)
            }
            usinagemSlider.onChanging=function(){
                usinagemTexto.text=usinagemSlider.value.toFixed(1)
                manipularBorda('area_usinagem',usinagemTexto.text)
            }
            usinagemSliderRaio.onChanging=function(){
                usinagemValorRaio.text=usinagemSliderRaio.value.toFixed(1)
            }
        //

        // editTexts
            blocoTexto.addEventListener("changing", function () {
                blocoSlider.value=Number(blocoTexto.text)
            });
            usinagemTexto.addEventListener("changing", function () {
                usinagemSlider.value=Number(usinagemTexto.text)
            });
            usinagemValorRaio.addEventListener("changing", function(){
                usinagemSliderRaio.value=Number(usinagemValorRaio.text)
            })
        //

        // bUttons
            bntGerar.onClick=function(){
                var strUsinagem='area_usinagem'
                var flagUsinagem=false
                var counterUsinagem=0
                var strBloco='bloco'
                var flagBloco=false
                var counterBloco=0
                var items=app.activeDocument.pageItems

                //Checks if there are already borders in the document
                    for (var i = 0; i < items.length; i++) {
                        var artItem = items[i];
                        switch (artItem.name) {
                            case strUsinagem:
                                flagUsinagem=true
                                counterUsinagem ++
                            break;
                            case strBloco:
                                flagBloco=true
                                counterBloco ++
                            break;
                        }
                    }
                //

                //
                    if(flagUsinagem==true && flagBloco==true){
                        alert('Exitem as Bordas de usinagem e bloco.\nNao e possivel a confecao de novas bordas')               
                        return
                    }
                //

                //build machining area
                    if(flagUsinagem==false && flagBloco==false){
                        selUsinagem=app.activeDocument.selection;
                        criarBorda(selUsinagem,usinagemTexto.text,usinagemValorRaio.text,strUsinagem);
                    }else if(flagUsinagem==false && flagBloco==true){
                        var obj=app.activeDocument.pageItems.getByName(strBloco)
                        obj.selected=true
                        selBloco=app.activeDocument.selection;
                        criarBorda(selBloco,-Number(blocoTexto.text),usinagemValorRaio.text,strUsinagem);
                    }
                //

                //build block area
                    if(flagBloco==false){
                        var obj=app.activeDocument.pageItems.getByName(strUsinagem)
                        obj.selected=true
                        selBloco=app.activeDocument.selection;
                        criarBorda(selBloco,blocoTexto.text,0,strBloco);
                    }
                //

                redraw()
                //janela.close()
            }
            bntSair.onClick=function(){
                janela.close()
            }
        //
    //
    janela.show()
}

function manipularBorda(nomeBorda,valor){
    var obj=app.activeDocument.pathItems.getByName(nomeBorda)
    obj.selected=true
    selObj=app.activeDocument.selection;
    
    //alert('Manipulando ' + nomeBorda + ' ...' + obj.typename)
    aferir(selObj)
    Largura=Number(coordenadas[4])
    Altura=Number(coordenadas[5])
    novaLargura=Number(Largura) + Number(valor)
    novaAltura=Number(Altura)+ Number(valor)
    /*
    if(valor<valor2){
        novaLargura=Number(Largura) - Number(valor)
        novaAltura=Number(Altura)- Number(valor)
    }else if (valor>valor2){
        novaLargura=Number(Largura) + Number(valor)
        novaAltura=Number(Altura)+ Number(valor)
    }
    */
    escalaX=(novaLargura*100)/Largura
    escalaY=(novaAltura*100)/Altura
    obj.resize(escalaX,escalaY)
    
    redraw()
}

function criarBorda(selecao,distancia,raio,nome){
    /*Essa funcao retorna um retangulo no documento ativo
        baseado em uma selecao feita previamente pelo usuario
        nesse mesmo documento. Nomeando-o e colocando-o em uma
        camada separada, tambem nomeada.  Com os seguintes
        Parametros:
        -> selecao
            Selecao feita pelo usuario na interface grafica
        -> distancia
            valor dado em mm que cobre a área entre a selecao
            e a construcao do retangulo
            valor obtido a partir do slider da UI
        -> raio
            valor de arredondamento dos cantos do retangulo
            valor obtido a partir do slider da UI
        -> nome
            nome que será atribuido à camada e ao retangulo
            depois de sua construcao
    */

    if (selecao.length<1){
        alert ('Nenhuma selecao foi encontrada.\nSelecione algo e volte a executar','A funcao criarBorda( ) diz:')
        return;
    }
    
    // Gera borda
        //captura e retorna coordenadas da selecao a partir da funcao AFERIR()
            aferir(selecao)
            var x1=coordenadas[0]
            var y1=coordenadas[1]
            var x2=coordenadas[2]
            var y2=coordenadas[3]
            var largura=coordenadas[4]
            var altura=coordenadas[5]
        //

        //Efetua Calculos
            var distBorda=Number(distancia)*2.834645 //converte em pontos
            var raioBorda=Number(raio)*2.834645 //converte em pontos
            var posX=x1-distBorda
            var posY=y1+distBorda
            var largBorda=largura+(2*distBorda)
            var altBorda=altura+(2*distBorda)
        //

        //cria uma camada com o nome da borda
        criarCamada(nome)

        //cria borda
        var doc=app.activeDocument
        var borda=doc.layers[nome].pathItems.roundedRectangle(posY,posX,largBorda,altBorda,raioBorda,raioBorda)
    //

    // Configuracoes especiais para a contrucao de bordas "bloco e 'area_usinagem"
        // Cores Utilizadas
            var semCor=new NoColor()
            var corUsinagem = new CMYKColor()
            corUsinagem.black = 50
            corUsinagem.cyan = 0
            corUsinagem.magenta=0
            corUsinagem.yellow=0
            var corBloco = new CMYKColor()
            corBloco.black = 100
            corBloco.cyan = 0
            corBloco.magenta=0
            corBloco.yellow=0
            var corAleatoria = new CMYKColor()
            corAleatoria.black = 0
            corAleatoria.cyan = 0
            corAleatoria.magenta=0
            corAleatoria.yellow=0
        //

        // Parametros do Documento
            doc.defaultFillColor = semCor
            //doc.defaultStrokeColor = corBorda
            doc.rulerOrigin = [0,0]
        //
        
        //aplica configuracoes
            borda.name=nome
            borda.fillColor=semCor
            if(nome=='area_usinagem'){
                borda.strokeColor=corUsinagem
            }
            else if (nome=='bloco'){
                borda.strokeColor=corBloco
            }else{
                borda.strokeColor=corAleatoria
            }
        //
    //
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
            alert(camadas[i])
            //nameLayerOfReturnGroup=grupoTemporario.layer.name
            //selecao[i].moveToEnd(doc.layers.getByName(nameLayerOfReturnGroup))
            //alert('Nome:\n' + grupoTemporario.layer.name + 'n\Id: ' + grupoTemporario.layer.index)
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

    //msg='X1:'+ x1 +'\ny1:'+ y1 + '\nx2:' + x2 + '\ny2:' + y2 +'\nLarg:' + largura + '\nAlt:' + altura + '\nPosX:' + centroX + '\nPosY:' + centroY
    //alert(msg)

    return coordenadas
}

function criarCamada(strNome){
    /* Verifica a existencia da camada percorrendo todas
        as camadas do documento verificando a ocorrencia do nome
        e em caso de sua ausência cria
    */
    var j=0;
    for (i=0; i<app.activeDocument.layers.length; i++){
        if(app.activeDocument.layers[i].name==strNome){j+=1;}
    }
    if(j==0){
        var camadaDosPontos=app.activeDocument.layers.add();
        camadaDosPontos.name=strNome;
    }
}


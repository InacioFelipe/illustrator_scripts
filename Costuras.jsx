//Habilita propriedades para confeção de janelas modais
#target.Illustrator
#targetengine.gerarPontos()
//desabilita a mensagem de execucao de scripts do illustrator
app.preferences.setBooleanPreference("ShowExternalJSXWarning", false);


var w=new Window('dialog','Costuras',undefined,{});
    w.preferredSize=[200,300];
    w.alignChildren=['fill',''];
    
var p1=w.add('panel',[0,0,200,180],undefined,{borderStyle:'white'});
    var g1=p1.add('group');
        g1.orientation='column'
        g1.alignChildren=['center','top'];
            var lbl1=g1.add('statictext',undefined,'Diâmetro da Fresa:');
    var g2=p1.add('group');
        g2.orientation='row'
            var valFresa=g2.add('edittext',[0,0,35,20],0.3);
            var sliderFresa=g2.add('slider',undefined,0.3,0,12);
    var g3=p1.add('group');
        g3.orientation='column'
        g3.alignChildren=['center','top'];
            var lbl2=g3.add('statictext',undefined,'Tamanho do ponto:');
    var g4=p1.add('group');
        g4.orientation='row'
            var valTamPonto=g4.add('edittext',[0,0,35,20],2);
            var sliderTamPonto=g4.add('slider',undefined,2,0,12);
    var g5=p1.add('group');
        g5.orientation='column'
        g5.alignChildren=['center','top'];
            var lbl3=g5.add('statictext',undefined,'Distância entre os pontos:');     
    var g6=p1.add('group');
        g6.orientation='row';
            var valDistPonto=g6.add('edittext',[0,0,35,20],1);
            var sliderDistPonto=g6.add('slider',undefined,1,0,12);
var p2=w.add('panel',undefined,undefined)
    p2.preferedSize=['fill',30];
    p2.alignCildren=['fill'];
    var lblInformation=p2.add('statictext',[0,0,200,20],undefined);
var p3=w.add('panel',undefined,undefined,{borderStyle:'white'});
    p3.preferredSize=['fill',30];
    p3.alignCildren=['fill'];
    var g1=p3.add('group',undefined);
        var btnGerar=g1.add('button',undefined,'Gerar');
        var btnSair=g1.add('button',undefined,'Sair');

// Eventos
sliderFresa.onChanging=function(){
    valFresa.text = sliderFresa.value.toFixed(1);
    numPontos(valFresa,valTamPonto, valDistPonto);
};
sliderTamPonto.onChanging=function(){
    valTamPonto.text = sliderTamPonto.value.toFixed(1);
    numPontos(valFresa,valTamPonto, valDistPonto);
};
sliderDistPonto.onChanging=function(){
    valDistPonto.text = sliderDistPonto.value.toFixed(1);
    numPontos(valFresa,valTamPonto, valDistPonto);
};

valFresa.addEventListener("changing", function () {
    numPontos(valFresa,valTamPonto, valDistPonto);
});
valTamPonto.addEventListener("changing", function () {
    numPontos(valFresa,valTamPonto, valDistPonto);
});
valDistPonto.addEventListener("changing", function () {
    numPontos(valFresa,valTamPonto, valDistPonto);
});

// Metodos
function numPontos(diamFresa,tamPt,distPt){
    
    var vetorPonto=Number(tamPt.text)-Number(diamFresa.text);
    var vetorEspaco=Number(distPt.text)-Number(diamFresa.text);
    var diametroFresa=Number(diamFresa.text);
    var ppc=10/(2*diametroFresa+(vetorPonto+vetorEspaco));
    ppc=ppc.toFixed(2);

    return lblInformation.text= ppc + ' pontos por cm';
}

function pts(milimetros){
    // Converte milimetros(mm) em pontos(pt)
    var unitPontos=Number(milimetros)*2.834645;
    return unitPontos
}

function mms(points){
    //converte points(pt) em milimetros(mm)
    var unitMilimetros=Number(points)*0.352778;
    return unitMilimetros;
}

function criarCamadas(strNome){
    /* Verifica a existencia da camada e em caso de sua ausência cria*/
    var j=0;
    for (i=0; i<app.activeDocument.layers.length; i++){
        if(app.activeDocument.layers[i].name==strNome){j+=1;}
    }
    if(j==0){
        var camadaDosPontos=app.activeDocument.layers.add();
        camadaDosPontos.name=strNome;
    }
}

function distPt(pt0, pt1){
    var result,dx,dy;
    (pt0[0]>pt1[0]) ? dx=pt0[0]-pt1[0] : dx=pt1[0]-pt0[0];
    (pt0[1]>pt1[1]) ? dy=pt0[1]-pt1[1] : dy=pt1[1]-pt0[1];
    result = Math.sqrt (dx*dx+dy*dy);
    return result;
}

function gerarPontos(){
    //1 point = 2,834645 milimetros
    //var doc = app.documents.add();

    try{
        if(app.documents.length<1){
            strMsg='Abra um documento que contenha os vetores\na serem transformados em pontos de costura';
            alert(strMsg,'Costuras',false);
            w.close();
        }else{
            var doc = app.activeDocument;
            app.defaultStroked = true;
            app.defaultFilled = true;

            var srtCamada='pontos'
            criarCamadas(srtCamada);
            
            vetSelecionados=[];
            if (app.activeDocument.selection<0){
                return;
            }
            else{
                vetSelecionados=app.activeDocument.selection;
                for (i = 0; i < vetSelecionados.length; i++) {
                    // Mostra Dados do vetor: Comprimento e Quantidade de anchor points
                    compVetor=vetSelecionados[i].length;
                    allPoints=vetSelecionados[i].pathPoints;
                    strMsg='O vetor ' + i + ' Mede:\n'+ compVetor +'\n'+
                    'Num Pontos:' + allPoints.length;
                    alert(strMsg);

                    alert('A medida entre os pontos é: ' + distPt(allPoints[0].anchor, allPoints[1].anchor));
                       

                    // Append another point to the line
                    /*
                    var newPoint = vetSelecionados[i].pathPoints.add();
                    newPoint.anchor = Array(50, 0);
                    newPoint.leftDirection = newPoint.anchor;
                    newPoint.rightDirection = newPoint.anchor;
                    newPoint.pointType = PointType.CORNER;
                    */
                }
            }

            w.close();
        }
    }
    catch(erro){
        alert("O script falhou porque:\n"+ erro);
    }
    

    
};


btnGerar.onClick=function(){gerarPontos();};
btnSair.onClick=function(){w.close();};

w.show();
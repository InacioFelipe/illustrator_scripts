
/* Script para illustrator
Script para illustrator com a cricao de ferramentas com
o objetivo de auxiliar na producao de desenhos tecnicos
para usinagem

1-Mensura os objetos selecionados: tamanho dos vetores em //mm//
2-Aplica calculo para tempo de corte baseado na tabela
1 point = 2,83465 milimetros
*/

#target.Illustrator
#targetengine.Requisitos()

/* Requerimentos iniciais:---------------------------------------------------------
Exige a presença de um documento e objetos selecionados para o início do script
*/
function Requisitos() {
  const versao = "Ferramentas 1.04.21"; //Numero de confeção . Mes . Ano
  try {
    if (app.documents.length > 0) { // se existe um documento
      if (app.activeDocument.selection.length > 0) { // se exite seleção
        Iniciar();
      } else {
        throw new Error("Não existem objetos selecionados no documento. \n\n" + "Selecione os objetos para fazer o orçamento.", versao);
      }
    } else {
      throw new Error("Não existe um Documento aberto. \n\n" + "Crie ou abra um documento para iniciar", "Requisitos() diz:");
    }
  }
  catch (e) {
    alert(e.message, "Requisitos() diz:", true);
  }
}
Requisitos();

/*Processo Principal:-------------------------------------------------------------
O início do script começa aqui
E Iniciar() é a rotina logica para essa função
*/

function Iniciar (){
  // Banco de dados -> modifique ou insira dados no vetores abaixo
  //bancoDados['materiaPrima'][0]['MDF Cru'][0]['espMdfCru'][0] -> 1.5
  const BANCO_DADOS={
    materiaPrima:[
      {'MDF Cru':[
        {espMdfCru:[1.5,3,6,9,12,15]},
        {vMdfCru:[70,100,160,0,0,0]}, // Valor JR ferragens -> 10/05/2021
        {largPlcMdfCru:[2750,2750,2750,2750,2750]},
        {compPlcMdfCru:[1830,1830,1830,1830,1830,]},
        {velCorte:[40,23,10,3,1,1]}
      ]},
      {'MDF Laminado 1 Face':[
        {espMdfLam1Face:[3]},
        {vMdfLam1Face:[45]}, // Valor Laroy Merlin -> 07/05/2021
        {largPlcMdfLam1Face:[1000]},
        {compPlcMdfLam1Face:[1000]},
        {velCorte:[18]},
        {refMdfLam1Face:["Ref 1"]}
      ]},
      {'MDF Laminado 2 Face':[
        {espMdfLam2Face:[6]},
        {vMdfLam2Face:[189]}, // valor Jr Ferragens -> 07/05/2021
        {largPlcMdfLam2Face:[2750]},
        {compPlcMdfLam2Face:[1830]},
        {velCorte:[3]},
        {refMdfLam2Face:["Ref 2-1"]},
      ]},
      {'Acrilico':[
        {espAcrilico:[2,3,4,5,6,10]},
        {vAcrilico:[87,132,167,207,262,489]},
        {largPlcAcrilico:[1000,1000,1000,1000,1000,1000]},
        {compPlcAcrilico:[500,500,500,500,500,500]},
        {velCorte:[30,23,15,10,10,3]},
        {refAcrilico:["Ref Acr-1","Ref Acr-2","Ref Acr-3","Ref Acr-4"]},
      ]},
      {'EVA':[
        {espEva:[]},
        {vEva:[]},
        {largPlcEva:[]},
        {compPlcEva:[]},
        {velCorte:[]}
      ]},
      {'Papel':[
        {espPapel:[]},
        {vPapel:[]},
        {largPlcPapel:[]},
        {compPlcPapel:[]},
        {velCorte:[]}
      ]},
      {'Papelao':[
        {espPapelao:[]},
        {vPapelao:[]},
        {largPlcPapelao:[]},
        {compPlcPapelao:[]},
        {velCorte:[]}
      ]}
    ],
    acabamentos:[
      {'Sem Acabamento':[
        {tinta:["Sem Tinta"]},
        {vTinta:[0]},
        {cobertura:[0]}
      ]},
      {'Pintura Esmalte Base Agua':[
        {tinta:["Branco","Preto","vermelho","Amarela","Macadamia"]},
        {vTinta:[35,35,65,60,50]},
        {cobertura:[18,18,18,18,18]}
      ]},
      {'Pintura Esmalte Base Solvente':[
        {tinta:["Alumínio","Dourado",]},
        {vTinta:[50,70]},
        {cobertura:[18,18]}
      ]},
      {'Pintura Acrilica':[
        {tinta:["Branco","Preto","vermelho","Amarela","Macadamia"]},
        {vTinta:[35,35,65,60,50]},
        {cobertura:[18,18,18,18,18]}
      ]},
      {'Pintura Artesanal':[
        {tinta:["Aquarela","Country","Craquelê"]},
        {vArtesanal:[30,60,90]},
        {cobertura:[5,8,7]}
      ]}
    ],
    laser:[
      {'Canhao':[
        {potencia:["110 Watts"]},
        {valor:[4000]}, // Real
        {vidaUitil:[2500]} // Horas
      ]},
      {'Lente':[
        {carac1:[]},
        {carac2:[]},
        {carac3:[]}
      ]},
    ]
  }
  //alert(Object.keys(BANCO_DADOS));
  //alert(Object.value(BANCO_DADOS));

  //Prepara o documento para os claculos
  preparaDoc();

  // Inicia Formulario
  ConstroiFormulario(BANCO_DADOS).show();
}

/*Processos de apoio: --------------------------------------------------------
Cada função aqui desempenha uma funcionalidade parcial
Essas funções são chamadas e executadas dentro do processo principal
*/

function bancoDados(dados){
  // CONSTRUTOR
  var gDados = dados;
  
  this.getDados = function(){
    return gDados;
  }

  //METODOS
  this.Lst = function(controle,nomeObjBd,tipo){
    //return gDados.materiaPrima[0].mdfCru[0].espMdfCru[0] -> 1.5;
    var gNomeObjBd=nomeObjBd;
    var res="";
    i=0;

    //Lista os objetos do banco de dados na posicao -> nomeObjBd
    for (obj in gNomeObjBd){
      if (gNomeObjBd.hasOwnProperty(obj)) {
        //Popula a caixa de listagem com as propriedades do objetos
        for (var prop in gNomeObjBd[obj]) {
          if(tipo ==="chave"){
            controle.add('item', prop); //Propriedade -> key
          }else if (tipo ==="valor"){
            // aplicar novos valores
            controle.add('item', gNomeObjBd[obj][i]); //Propriedade -> value
            i++;
          }
          controle.selection=0;
        }
      }
      res = res + gNomeObjBd + "." + obj + " = " + gNomeObjBd[obj] + "\n";
    }
    //return alert("listando o objeto:\n" + res);
  }

  this.toVetor=function(nomeObjBd,tipo){
    //return gDados.materiaPrima[0].mdfCru[0].espMdfCru[0] -> 1.5;
    var gNomeObjBd=nomeObjBd;
    var res="";
    var vetorLst=[];
    i=0;

    //Lista os objetos do banco de dados na posicao -> nomeObjBd
    for (obj in gNomeObjBd){
      if (gNomeObjBd.hasOwnProperty(obj)) {
        //Popula a caixa de listagem com as propriedades do objetos
        for (var prop in gNomeObjBd[obj]) {
          if(tipo ==="chave"){
            vetorLst[i]=prop; //Propriedade -> key
          }else if (tipo ==="valor"){
            // aplicar novos valores
            vetorLst[i]=gNomeObjBd[obj][i]; //Propriedade -> value
            i++;
          }
        }
      }
      res = res + gNomeObjBd + "." + obj + " = " + gNomeObjBd[obj] + "\n";
    }
    //alert("listando o objeto:\n" + res);
    return vetorLst;
  }
  
  this.retornaNome = function(nomeObjBd){
    //return gDados.materiaPrima[0].mdfCru[0].espMdfCru[0] -> 1.5;
    var gNomeObjBd=nomeObjBd;//'materiaPrima';
    i=0;

    //Lista os objetos do banco de dados na posicao -> nomeObjBd
    for (obj in gNomeObjBd){
      if (gNomeObjBd.hasOwnProperty(obj)) {
        var obje=gNomeObjBd[obj];
        //Popula a caixa de listagem com as propriedades do objetos
        for (var prop in gNomeObjBd[obj]) {
          var nome=obj;
          var valor=gNomeObjBd[obj];
        }
      }
    }
    return nome;
  }

  this.toArray=function(obj){
      var result = [];
      for (var prop in obj) {
          var value = obj[prop];
          if (typeof value === 'object') {
              result.push(this.toArray(obj)); // <- recursive call
          }
          else {
              result.push(value);
          }
      }
      return alert ("" + result);
  }
  
  this.filtrarCategorias=function(id, categorias, resultado){

    resultado = resultado ? resultado : [];
    for(var i = 0;i<categorias.length;i++){
      var categoria = categorias[i];
      resultado.push(categoria);
      if (categoria.code == id){
        return resultado;
      }
      if(categoria.children.length > 0){
        resultado = this.filtrarCategorias(id, categoria.children, resultado);
        if(resultado.length > 1)
          return resultado;
      }
      resultado.pop();
    }
    return [];
  }

  this.mostrarProps= function(obj, nomeDoObj) {
    var resultado = "";
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
          resultado += nomeDoObj + "." + i + " = " + obj[i] + "\n\n";
      }
    }
    return alert("Resultado:\n\n" + resultado);
  }
}
function Matrizes(vetorMatriz){
  
  // CONSTRUTOR
  var gMatriz = vetorMatriz;
  var linha,coluna; //indices da matriz
  
  this.getMatriz = function(){
    return gMatriz;
  }

  // METODOS
  this.escreveMatriz = function(){
    var strMatriz; //string de saida da funcao
    strMatriz="";
    for (linha = 0; linha < gMatriz.length; linha++) {
      for (coluna = 0; coluna < gMatriz[linha].length; coluna++) {
        if (coluna === gMatriz[linha].lenght) {
          strMatriz += gMatriz[linha][coluna] + "\n";
        } else {
          strMatriz += gMatriz[linha][coluna] + "\t";
        }
      }
    }
    //return alert("Matriz " + gMatriz.length + " X " + gMatriz[0].length + " :\n\n" + strMatriz);
  }

  this.retornalinha = function(nLinha){
    var strLinha;
    var vetorLinha=[];
    // Constroi vetorLina -> saida do metodo
      for (coluna = 0; coluna < gMatriz[nLinha].length; coluna++) {
        vetorLinha[coluna] = gMatriz[nLinha][coluna];
      }

    // Formata vetor de saida
    strLinha="";
    for (i = 0; i < vetorLinha.length; i++) {
      if (i<vetorLinha.length-1) {
        strLinha += vetorLinha[i] + " - ";
      } else{
        strLinha += vetorLinha[i];
      }
    }
    alert("Sua linha:\n" + strLinha);

    return vetorLinha;
  }

  this.retornacoluna = function(nColuna){
    var strColuna;
    var vetorColuna=[];
    var i=0;
    // Constroi vetorColuna -> saida do metodo
    for (linha = 0; linha < gMatriz.length; linha++) {
      for (coluna = 0; coluna < gMatriz[linha].length; coluna++) {
        if (coluna == nColuna) {
          vetorColuna[i] = gMatriz[linha][coluna];
          i++;
        }
      }
    }

    // Formata vetor de saida
    strColuna="";
    for (i = 0; i < vetorColuna.length; i++) {
      strColuna += vetorColuna[i] + "\n";
    }
    alert("Sua Coluna:\n" + strColuna);

    return vetorColuna;
  } 
}
function Orcamento(dados, callbackFrm, compCorte, areaCorte) {
  
  // CONSTRUTOR -------------------------------------------------------------------------
  var vetorOrcamento=[]; // vetor dde saida da função
  var vetorRegistro=[]; // vetor com os dados da materia prima
  var vetorLaser=[]; // vetor com os dados da maquina laser
  var vetorAcabamento=[]; // vetor com os dados do acabamento
  var vtCustoOperacionalCorte=[]; // vetor com dados das depesas operacionais do corte
  var vtCustoOperacionalAcabamento=[]; // vetor com dados das depesas operacionais do Acabamento
  const gBancoDados=dados;
  const gIdMaterial = callbackFrm[0];
  const gMaterial = callbackFrm[1];
  const gIdEspessura = callbackFrm[2];
  const gEspessura = callbackFrm[3];
  const gIdAcabamento = callbackFrm[4];
  const gAcabamento = callbackFrm[5];
  const gIdOpcaoAcabamento = callbackFrm[6];
  const gOpcaoAcabamento = callbackFrm[7];
  const gTaxaLucro = callbackFrm[8];
  const gTempoAcabamento = callbackFrm[9];
  const gCompCorte = ComprimentoSelecao();
  const gAreaCorte = AreaSelecao();

  //Construir no formulario a opção para escolhas
  //das configurações da maquina de corte a laser
  const gIdLaser=0; // canhao

  //confereRegistro(callbackFrm,'Callback Form');

  vetorRegistro=BuscaProduto(gIdMaterial,gIdEspessura);
  //confereRegistro(vetorRegistro,'Registro');

  vetorLaser=BuscaLaser(gIdLaser);
  //confereRegistro(vetorLaser,'Laser');

  vetorAcabamento=BuscaAcabamento(gIdAcabamento,gIdOpcaoAcabamento);
  //confereRegistro(vetorAcabamento,'Acabamento');


  // METODOS ---------------------------------------------------------------------------------
  function confereRegistro(vetor,nome){
    //Confere registro
    msg="Confere Vetor " + nome + ":\n\n";
    for (i = 0; i < vetor.length; i++) {
      msg = msg + "-" + vetor[i] +"\n";
    }
    alert(msg);
  }

  function BuscaProduto(idProduto,idEspessura){
    //------------------------------ ESTRUTURA DO BANCO DE DADOS ---------------------------------
    //--------------------------------------------------------------------------------------------
    //gBancoDados[strObjeto][idProd]   [strProd][0]   [strEsp][idEsp];       //-> Valor retornado
    //gBancoDados["materiaPrima"][0]   ["mdfCru"][0]  ["espMdfCru"][0];      //-> 1.5
    //gBancoDados["materiaPrima"][0]   ["mdfCru"][1]  ["vMdfCru"][0];        //-> 30
    //gBancoDados["materiaPrima"][0]   ["mdfCru"][2]  ["largPlcMdfCru"][0];  //-> 2800
    //gBancoDados["materiaPrima"][0]   ["mdfCru"][3]  ["compPlcMdfCru"][0];  //-> 1730
    //--------------------------------------------------------------------------------------------
  
    var strObjeto="materiaPrima";
    var idProd=Number(idProduto);
    var idEsp=Number(idEspessura);

    const bd=new bancoDados(gBancoDados);
    
    var strProd=bd.retornaNome(gBancoDados[strObjeto][idProd]);
    // recupera chaves
    var strEsp=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][0]); // Espessura
    var strVal=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][1]); // Valor
    var strLarg=bd.retornaNome(gBancoDados[strObjeto][idProd] [strProd][2]); // Largura
    var strComp=bd.retornaNome(gBancoDados[strObjeto][idProd] [strProd][3]); // Comprimento
    var strVelC=bd.retornaNome(gBancoDados[strObjeto][idProd] [strProd][4]); // Velocidade Corte
    // recupera valores
    vetorRegistro[0]=strProd;
    vetorRegistro[1]=gBancoDados[strObjeto][idProd]  [strProd][0]  [strEsp][idEsp]; // Espessura
    vetorRegistro[2]=gBancoDados[strObjeto][idProd]  [strProd][1]  [strVal][idEsp]; // Valor
    vetorRegistro[3]=gBancoDados[strObjeto][idProd]  [strProd][2]  [strLarg][idEsp]; // Largura
    vetorRegistro[4]=gBancoDados[strObjeto][idProd]  [strProd][3]  [strComp][idEsp]; // Comprimento
    vetorRegistro[5]=gBancoDados[strObjeto][idProd]  [strProd][4]  [strVelC][idEsp]; // Velocidade Corte

    /* alert("O Registro retornado é:\n\n" 
    + "strProd: " + vetorRegistro[0] + "\n"
    + "Esp: " + strEsp + " - " + vetorRegistro[1] + "\n"
    + "Val: " + strVal + " - " + vetorRegistro[2] + "\n"
    + "Larg: " + strLarg + " - " + vetorRegistro[3] + "\n"
    + "Comp: " + strComp + " - " + vetorRegistro[4] + "\n"
    + "Vel C: " + strComp + " - " + vetorRegistro[5] + "\n"
    ); */

    return vetorRegistro;
  }

  function BuscaLaser(idLaser){
     //------------------------------ ESTRUTURA DO BANCO DE DADOS ---------------------------------
    //--------------------------------------------------------------------------------------------
    //gBancoDados[strObjeto][idProd]   [strProd][0]   [strEsp][idEsp];       //-> Valor retornado
    //gBancoDados["laser"][0]   ["valor"][0]  ["horas"][0];      //-> 1.5
    //--------------------------------------------------------------------------------------------
  
    const strObjeto="laser";
    var idProd=Number(idLaser);
    var idPotencia=0; // 110 watts

    const bd=new bancoDados(gBancoDados);
    
    var strProd=bd.retornaNome(gBancoDados[strObjeto][idProd]);

    // recupera chaves
    var strPot=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][0]); // potencia
    var strVal=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][1]); // Valor
    var strHoras=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][2]); // horas

    // recupera valores
    vetorLaser[0]=strProd;
    vetorLaser[1]=gBancoDados[strObjeto][idProd]  [strProd][0]  [strPot][idPotencia]; // potencia
    vetorLaser[2]=gBancoDados[strObjeto][idProd]  [strProd][1]  [strVal][idPotencia]; // Valor
    vetorLaser[3]=gBancoDados[strObjeto][idProd]  [strProd][2]  [strHoras][idPotencia]; // horas

    return vetorLaser;
  }

  function BuscaAcabamento(idAcabamento,idOpcaoAcabamento){
    //------------------------------ ESTRUTURA DO BANCO DE DADOS ---------------------------------
   //--------------------------------------------------------------------------------------------
   //gBancoDados[strObjeto][idProd]   [strProd][0]   [strEsp][idEsp];       //-> Valor retornado
   //gBancoDados["acabamentos"][0]   ["tecnica"][0]  ["tinta"][0];      //-> 1.5
   //--------------------------------------------------------------------------------------------
 
   const strObjeto="acabamentos";
   var idProd=Number(idAcabamento);
   var idOpcao=Number(idOpcaoAcabamento);

   const bd=new bancoDados(gBancoDados);
   
   var strProd=bd.retornaNome(gBancoDados[strObjeto][idProd]);

   // recupera chaves
   var strTinta=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][0]); // tinta
   var strVal=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][1]); // Valor
   var strCob=bd.retornaNome(gBancoDados[strObjeto][idProd]  [strProd][2]); // Cobertura

   // recupera valores
   vetorAcabamento[0]=strProd;
   vetorAcabamento[1]=gBancoDados[strObjeto][idProd]  [strProd][0]  [strTinta][idOpcao]; // tinta
   vetorAcabamento[2]=gBancoDados[strObjeto][idProd]  [strProd][1]  [strVal][idOpcao]; // Valor
   vetorAcabamento[3]=gBancoDados[strObjeto][idProd]  [strProd][2]  [strCob][idOpcao]; // Cobertura

   return vetorAcabamento;
 }

  this.CustoOperacional = function(tempoGasto) {
    var vetorOperacional=[]; // vetor com as despesas
    var cOperacional=0; // valor final das despesas convertidas em seg
    var cOperacionalTotal=0; // Valor final do custo operacional;
    const gTempoGasto=tempoGasto;

    //Despesas Fixas
    const gAluguel=1145;
    const gFolhaPgto=2290;

    //Despesas variaveis
    const gAgua=95;
    const gEnergia=550;
    const gTelefonia=150;
    const gLanche=150;
    const gValeTransporte=600;
    const gValeRefeicao=2290;
    const gManutencao=150;

    // converte de mês para segundos
    vetorOperacional[0]=0; // Custo Operacional final
    vetorOperacional[1]=0;
    vetorOperacional[2]=gAluguel / converteTempo(1,'mesSalario','seg');
    vetorOperacional[3]=gFolhaPgto / converteTempo(1,'mesSalario','seg'); // 1 mesSalario 22 dias - 8 horas - equivale a 'x' segundos
    vetorOperacional[4]=gAgua / converteTempo(1,'mesSalario','seg');
    vetorOperacional[5]=gEnergia / converteTempo(1,'mesSalario','seg');
    vetorOperacional[6]=gTelefonia / converteTempo(1,'mesSalario','seg');
    vetorOperacional[7]=gLanche / converteTempo(1,'mesSalario','seg');
    vetorOperacional[8]=gValeTransporte / converteTempo(1,'mesSalario','seg');
    vetorOperacional[9]=gValeRefeicao / converteTempo(1,'mesSalario','seg');
    vetorOperacional[10]=gManutencao / converteTempo(1,'mesSalario','seg');

    for (i = 0; i < vetorOperacional.length; i++) {
      cOperacional += vetorOperacional[i];
    }
    // Custo Operacional final
    cOperacionalTotal = cOperacional * gTempoGasto;
    vetorOperacional[0]=cOperacionalTotal; // Valor final para o custo operacional
    vetorOperacional[1]=cOperacional; // Valor total das despesas para cada seg mensal
    vetorOperacional[2]=gTempoGasto; // Tempo de trabalho usado para o calculo
    return vetorOperacional;
  }

  this.CustoCorte = function (valorCanhao,VidaUtil,VelCorte) {
    //Confere entradas 
    //alert("valor canhao: " + valorCanhao  + "\n Vida Util: " + VidaUtil + "\n vel: " + VelCorte);
    
    //propriedades do canhão laser
    const gValorCanhao=valorCanhao;// Real
    const gVidaUtilCanhao=VidaUtil;// Tempo de vida util do canhao em horas
    const gVelocidadeCorte=VelCorte;// velocidade de corte mm/seg
    var gValorCorteHora;
    var gValorCorteSegundo;
    var gCustoDoCorte;
    var vetorCustoCorte=[];
    var gTempoCorte;
    gValorCorteHora = gValorCanhao / gVidaUtilCanhao;
    //--------------------------------------------------------------------------------
    //gValorCorteHora=60; // esse calculo esta errado para fazer o preço de custo correto
    //--------------------------------------------------------------------------------

    gValorCorteSegundo = (gValorCorteHora / 60) / 60; // tempo de vida convertido em segundos
    gTempoCorte = compCorte / gVelocidadeCorte;
    gCustoDoCorte = gTempoCorte * gValorCorteSegundo;

    /* alert("Comp Corte: " + compCorte + "\n" +
    "Tempo Corte: " + gTempoCorte + "\n" +
    "Vel Corte: " + gVelocidadeCorte + "\n" +
    "Valor Corte Seg: " + gValorCorteSegundo + "\n" +
    "Custo Corte: " + gCustoDoCorte); */

    vetorCustoCorte[0]=gCustoDoCorte;
    vetorCustoCorte[1]=gValorCorteSegundo;
    vetorCustoCorte[2]=compCorte;
    vetorCustoCorte[3]=gVelocidadeCorte;

    //confere os dados de saida da funcao
    //confereRegistro(vetorCustoCorte,"Vetor Corte");
    
    return vetorCustoCorte;
  }

  this.CustoMaterial = function (valor,larg,alt) {
    //propriedades do Material
    const gPrecoPlaca=valor; // valor em Real
    const gLargMaterial=larg; // Largura do material em mm
    const gCompMaterial=alt; // Altura do material em mm
    var gAreaPlaca;
    var gValorMaterialMm2;
    var gCustoDoMaterial;
    var vetorCustoMaterial=[];
    // calculo do custo do material
    gAreaPlaca = (gLargMaterial * gCompMaterial); // area da placa do material em mm2
    gValorMaterialMm2 = gPrecoPlaca / gAreaPlaca; // valor a ser combrado por mm2 do material
    gCustoDoMaterial = areaCorte * gValorMaterialMm2;

    vetorCustoMaterial[0]=gCustoDoMaterial;
    vetorCustoMaterial[1]=gValorMaterialMm2;
    vetorCustoMaterial[2]=0 //gLargMaterial;
    vetorCustoMaterial[3]=0 //gCompMaterial;
    vetorCustoMaterial[4]=areaCorte;

    //alert("O Custo do material é: " + gCustoDoMaterial);
    return vetorCustoMaterial;
  }

  this.CustoAcabamento = function (valorTinta,coberturaMetro2) {
    //propriedades da pintura
    const gValorTinta=valorTinta; // valor da tinta em Real
    const gValorDoPrimer=0;
    var gAreaCobertura=coberturaMetro2; // area cobertura para tinta esmalte da coral metro quadrado
    var gValorTintaMm2;
    var gValorPrimerMm2;
    var gCustoPrimerPintura;
    var gCustoDaPintura;
    var gCustoFinaldaPintura;
    var vetorCustoAcabamento=[];

    //calculo do custo da pintura
    gAreaCobertura = gAreaCobertura * 1000000; // converte metro2 para Milimetro2
    gValorTintaMm2 = gValorTinta / gAreaCobertura;
    gValorPrimerMm2 = gValorDoPrimer / gAreaCobertura;
    gCustoPrimerPintura = (areaCorte * 2) * gValorPrimerMm2; // calculo efetuado para as duas faces do material
    gCustoDaPintura = (areaCorte * 2) * gValorTintaMm2; // calculo efetuado para as duas faces do material
    gCustoFinaldaPintura = gCustoPrimerPintura + gCustoDaPintura;

    vetorCustoAcabamento[0]=gCustoFinaldaPintura;
    vetorCustoAcabamento[1]=gCustoPrimerPintura;
    vetorCustoAcabamento[2]=gCustoDaPintura;
    vetorCustoAcabamento[3]=gValorPrimerMm2;
    vetorCustoAcabamento[4]=gValorTintaMm2;
    vetorCustoAcabamento[5]=areaCorte;

    //alert("O Custo do Pintura é: " + gCustoDaPintura + "\n\n Valor da Tinta: " + gValorTintaMm2 );
    return vetorCustoAcabamento;
  }

  this.OrcamentoFinal = function (taxaDeLucro,idAcabamento) {
    //saidas do orçamento
    var vetorCustoCorte = this.CustoCorte(vetorLaser[2],vetorLaser[3],vetorRegistro[5]);
    var gCorte = vetorCustoCorte[0];
    var vetorCustoMaterial = this.CustoMaterial(vetorRegistro[2], vetorRegistro[3], vetorRegistro[4]);
    var gMaterial = vetorCustoMaterial[0];
    var vetorCustoAcabamento = this.CustoAcabamento(vetorAcabamento[2],vetorAcabamento[3]);
    var gAcabamento = vetorCustoAcabamento[0];
    var gCustoOperacionalCorte=0;
    var gCustoOperacionalAcabamento=0;
    var gTxLucro=taxaDeLucro;
    var gCustoOrcamento; // custoDoCorte + custoDoMaterial + custoDaPintura
    var gOcamentoFinal; // Custos + Taxa de Lucro
    
    //Calculo do custo operacional do corte a laser
    const tempoCorte = ComprimentoSelecao()/vetorRegistro[5]; // Comprimento das linhas do corte / velocidade de Corte
    vtCustoOperacionalCorte=this.CustoOperacional(tempoCorte);
    gCustoOperacionalCorte=vtCustoOperacionalCorte[0];
    //confereRegistro(vtCustoOperacionalCorte,"Custo operacional Corte:");
    
    // calculo do custo operacional do acabamento
    const tAcab = converteTempo(gTempoAcabamento,'hora','seg');
    vtCustoOperacionalAcabamento=this.CustoOperacional(tAcab);
    gCustoOperacionalAcabamento=vtCustoOperacionalAcabamento[0];
    //confereRegistro(vtCustoOperacionalAcabamento,"Custo operacional Acabamento:");

    if (idAcabamento==0) {
      gCustoOrcamento = gMaterial + gCorte + gCustoOperacionalCorte;
      //alert("Calculo SEM Acabamento com Tx Lucro de: " + gTxLucro);
    }else{
      gCustoOrcamento = gMaterial + gCorte + gCustoOperacionalCorte + gAcabamento + gCustoOperacionalAcabamento;
      //alert("Calculo COM Acabamento com Tx Lucro de: " + gTxLucro);
    }
    
    gOcamentoFinal = gCustoOrcamento + ((gCustoOrcamento * gTxLucro) / 100);

    // ---------------- POPULA VETOR DE SAIDA PARA A FUNÇÃO -------------------
    // ------ Trasfere os dados dos vetores separados para um vetor unico -----
    vetorOrcamento[0]=gOcamentoFinal;
    //confereRegistro(vetorCustoCorte,"Vetor Corte");
    vetorOrcamento[1]=vetorCustoCorte[0]; // CUSTO FINAL DO CORTE
    vetorOrcamento[2]=vetorCustoCorte[1]; // Custo do corte por seg
    vetorOrcamento[3]=vetorCustoCorte[2]; // Comprimento do Corte
    vetorOrcamento[4]=vetorCustoCorte[3]; // Velocidade do corte efetuado
    //confereRegistro(vetorCustoMaterial,"Vetor Material");
    vetorOrcamento[5]=vetorCustoMaterial[0]; // CUSTO FINAL DO MATERIAL
    vetorOrcamento[6]=vetorCustoMaterial[1]; // Valor do material por mm2.
    vetorOrcamento[7]=vetorCustoMaterial[2]; // Largura do material
    vetorOrcamento[8]=vetorCustoMaterial[3]; // Comprimento do material
    vetorOrcamento[9]=vetorCustoMaterial[4]; // Area do material utilizada
    //confereRegistro(vetorCustoAcabamento,"Vetor Acabamento");
    vetorOrcamento[10]=vetorCustoAcabamento[0]; // CUSTO FINAL PARA A PINTURA
    vetorOrcamento[11]=vetorCustoAcabamento[1] // Custo do Primer
    vetorOrcamento[12]=vetorCustoAcabamento[2] // Custo da Pintura
    vetorOrcamento[13]=vetorCustoAcabamento[3] // Valor do Primer po mm2;
    vetorOrcamento[14]=vetorCustoAcabamento[4] // Valor da Tinta por mm2;
    vetorOrcamento[15]=vetorCustoAcabamento[5] // area do material pintado;
    //confereRegistro(vtCustoOperacionalCorte,"Vetor Custo operacional");
    vetorOrcamento[16]=vtCustoOperacionalCorte[0]; // CUSTO FINAL OPERACIONAL PARA O CORTE
    vetorOrcamento[17]=vtCustoOperacionalCorte[1]; // custo por seg
    vetorOrcamento[18]=vtCustoOperacionalCorte[2]; // tempo de corte
    vetorOrcamento[19]=vtCustoOperacionalAcabamento[0]; // CUSTO FINAL OPERACIONAL PARA O ACABAMENTO
    vetorOrcamento[20]=vtCustoOperacionalAcabamento[1]; // custo por seg
    vetorOrcamento[21]=vtCustoOperacionalAcabamento[2]; // tempo de trabalho
    
    //alert("O Orcamento final é: " + ocamentoFinal);
    return vetorOrcamento;
  }
  
}
function preparaDoc(){

  //alert("Entrei na função 'preparaDoc'");

  if (app.documents.length > 0) {
    const selecao = app.activeDocument.selection;
    //alert("Encontrei: " + selecao.length + " Objetos na selecao");

    const doc=app.activeDocument;
    const numCompoundPaths = doc.compoundPathItems.length;
    const numGroupItems = doc.groupItems.length;
    const numGraphItems =doc.graphItems.length;
    const numLegacyTextItems =doc.legacyTextItems.length;
    const numMeshItems =doc.meshItems.length;
    const numNonNativeItems =doc.nonNativeItems.length;
    const numPlacedItems =doc.placedItems.length;
    const numPluginItems =doc.pluginItems.length;
    const numRasterItems =doc.rasterItems.length;
    const numSymbolItems =doc.symbolItems.length;
    const numTextFrameItems =doc.textFrames.length;

    const msg="Existem no Documento\n\n" +
    "Objetos CompoundPath: " + numCompoundPaths + "\n" +
    "Objetos GroupItem: " + numGroupItems + "\n" +
    "Objetos GraphItem: " + numGraphItems + "\n" +
    "Objetos LegacyTextItem: " + numLegacyTextItems + "\n" +
    "Objetos MeshItem: " + numMeshItems + "\n" +
    "Objetos NonNativeItem: " + numNonNativeItems + "\n" +
    "Objetos PlacedItem: " + numPlacedItems + "\n" +
    "Objetos PluginItem: " + numPluginItems + "\n" +
    "Objetos RasterItem: " + numRasterItems + "\n" +
    "Objetos SymbolItem: " + numSymbolItems + "\n" +
    "Objetos TextFrameItem: " + numTextFrameItems + "\n";
    //alert (msg);

    if (selecao.length > 0) { // Existem objetos selecionados no documento
      
      // Cria Camada e duplica elementos da selecao dentro dela
      // para evitar perda de configurações nos elementos originais.
      const camada="Camada Orcamento"
    
      //Agrupa
      var grupo = app.activeDocument.activeLayer.groupItems.add();
      for (i = 0; i < selecao.length; i++) {
        selecao[i].moveToEnd(grupo);
      }
      var local = grupo.position; // Captura posicao X,Y
      //Desagrupa
      for (i = 0; i < selecao.length; i++) {
        selecao[i].moveToEnd(app.activeDocument.activeLayer);
      }

      app.executeMenuCommand('copy');
      CriaCamada(camada);
      app.executeMenuCommand('paste');
      
      //Agrupa
      const Sel1 = app.activeDocument.selection;
      var grupo = app.activeDocument.layers[camada].groupItems.add();
      for (i = 0; i < Sel1.length; i++) {
        Sel1[i].moveToEnd(grupo);
      }
      grupo.position = [local[0],local[1]];
      //Desagrupa
      for (i = 0; i < Sel1.length; i++) {
        Sel1[i].moveToEnd(app.activeDocument.layers[camada]);
      }
      redraw();

      // Trata os objetos da selecao para que possam ser utilizados pelo script
      const Sel2 = app.activeDocument.selection;
      //alert ("A selecao possui: " + Sel2.length);
      var strLogGraphText="";
      var strLogLegacyText="";
      var strLogMesh="";
      var strLogNonNative="";
      var strLogPlaced="";
      var strLogPlugin="";
      var strLogRaster="";
      var strLogSymbol="";
      var strLogTextFrame="";

      for (i = 0; i < Sel2.length; i++) {
        //alert("O objeto " + i + " é do tipo:\n" + selecao[i].typename);
        switch (Sel2[i].typename) {
          case "CompoundPathItem":
            //alert("Trabalhando o 'CompoundItem' ... ");

            /* var noColor = new NoColor();
            selecao[i].fillColor = noColor;
            redraw(); */

            /* var rgbColor = new RGBColor();
            rgbColor.red = 255;
            selecao[i].rgbColor;
            redraw(); */

            //Libera Caminho Composto
            app.executeMenuCommand("noCompoundPath");
            break;
          case "GroupItem":
            //alert("Trabalhando o 'GroupItem' ... ");
            //Desagrupa
            if (Sel2[i].clipped){
              alert("encontrei máscara. Retirando selecao");
              Sel2.remove;
            }
            app.executeMenuCommand("ungroup");
            break;
          case "GraphItem":
            Sel2[i].remove();
            strLogGraphText += " - " + i;
          break;
          case "LegacyTextItem":
            Sel2[i].remove();
            strLogLegacyText += " - " + i;
            break;
          case "MeshItem":
            Sel2[i].remove();
            strLogMesh += " - " + i;
            break;
          case "NonNativeItem":
            Sel2[i].remove();
              strLogNonNative += " - " + i;
            break;
          case "PlacedItem":
            Sel2[i].remove();
              strLogPlaced += " - " + i;
            break;
          case "PluginItem":
            Sel2[i].remove();
              strLogPlugin += " - " + i;
            break;
          case "RasterItem":
              Sel2[i].remove();
              strLogRaster += " - " + i;
            break;
          case "SymbolItem":
            Sel2[i].remove();
              strLogSymbol += " - " + i;
            break;
          case "TextFrame":
            Sel2[i].remove();
              strLogTextFrame += " - " + i;
            break;
        }
      }
    } else { //Se não existem objetos selecionados no documento
      new Error("Não existem objetos selecionados. \n" + "Selecione os objetos para a aferição do comprimento.", "ComprimentoSelecao() diz:");
      //alert("Não existem Objetos selecionados no documento");
    }
  } else { // Se não exte um documento aberto
    new Error("Não existe um documento aberto. \n" + "Abra um documento e selecione os objetos que deseja fazer o orçamento.", "ComprimentoSelecao() diz:");
    //alert("Abra um documento e selecione os objetos que deseja fazer o orçamento","A função ComprimentoSeleção() diz:",false);
  }

  //Retorna Log ao usuario
  alert ("Foram removidos do cálculo:\n\n" +
 "Graph: " + strLogGraphText + "\n" +
 "LegacyText: " + strLogLegacyText + "\n" +
 "Mesh: " + strLogMesh + "\n" +
 "NonNative: " + strLogNonNative + "\n" +
 "Placed: " + strLogPlaced + "\n" +
 "Plugin: " + strLogPlugin + "\n" +
 "Raster: " + strLogRaster + "\n" +
 "Symbol: " + strLogSymbol + "\n" +
 "TextFrame: " + strLogTextFrame + "\n"
 );
}
function ConstroiFormulario(dados) {
  /*dados:Banco de dados;
  /*
  #########################################################################################################
  ############################################## CONSTRUTOR ###############################################
  #########################################################################################################
  */
    var gBancoDados=dados;
    var parametrosFormulario = []; // vetor de saida -> resultado da funcao
    var frm = new Window("dialog", "Orçamento de Corte Laser", undefined, { resizeable: false, closeButton: true });
    //var frm = new Window("palette", "Orçamento de Corte Laser",undefined,{resizeable:true,closeButton:true});
    frm.center();
  
    /*######################################### Frame Materiais ###########################################
    #######################################################################################################
    */
      var FrameMateriais = frm.add("panel", undefined, "Materiais");
      FrameMateriais.orientation = "row";
      FrameMateriais.alignment = "fill";
      FrameMateriais.bounds=[10,10,330,60];
      FrameMateriais.visible=true;
      // Grupo Opcoes de materiais
      var grupoMateriais = FrameMateriais.add("group");
      grupoMateriais.orientation = "row";
      grupoMateriais.alignment = "left";
      grupoMateriais.visible=true;
      var listaDeMateriais;
      (listaDeMateriais = grupoMateriais.add("dropdownlist", undefined));
      listaDeMateriais.size = [100, 25];
      listaDeMateriais.selection = 0;
      listaDeMateriais.visible = true;
      var listaEspessuras;
      (listaEspessuras = grupoMateriais.add("dropdownlist", undefined));
      listaEspessuras.visible = true;
      listaEspessuras.size = [100, 25];
      listaEspessuras.selection = 0;
      listaEspessuras.visible=true;
    /* ##################################### Fim Frame Materiais ########################################*/


    /*####################################### Frame Acabamento ############################################
    #######################################################################################################
    */
      var FrameAcabamento = frm.add("panel", undefined, "Acabamentos:");
      FrameAcabamento.orientation = "row";
      FrameAcabamento.alignment = "fill";
      FrameAcabamento.bounds=[10,80,330,130];
      FrameAcabamento.visible=true;
      // Grupo Opcoes de Acabamentos
      var grupoAcabamentos = FrameAcabamento.add("group", undefined);
      grupoAcabamentos.orientation = "row";
      grupoAcabamentos.alignment = "left";
      grupoAcabamentos.alignChildren = "left";
      grupoAcabamentos.visible=true;
      var listaDeAcabamentos;
      (listaDeAcabamentos = grupoAcabamentos.add("dropdownlist", undefined));
      listaDeAcabamentos.size = [180, 25];
      listaDeAcabamentos.selection = 0;
      listaDeAcabamentos.visible = true;
      var lblTempoAcabamento = grupoAcabamentos.add("statictext",undefined,"Tempo:");
      var txtTempoAcabamento = grupoAcabamentos.add("edittext", undefined, "0");
      var lblTempoAcabamento = grupoAcabamentos.add("statictext",undefined,"h");
      txtTempoAcabamento.bounds=[0,0,25,30];
    /* ##################################### Fim Frame Acabamento #######################################*/

    /*####################################### Frame Opção Acabamentos #####################################
    #######################################################################################################
    */
      var FrameOpcaoAcabamentos = frm.add("panel", undefined, "Opções de Acabamento Pintado");
      FrameOpcaoAcabamentos.orientation = "row";
      FrameOpcaoAcabamentos.alignment = "fill";
      FrameOpcaoAcabamentos.bounds=[10,200,330,250]; //[10,290,330,370];
      FrameOpcaoAcabamentos.visible = true;
      // Grupo Opcao de tintas
      var grupoOpcaoAcabamentos = FrameOpcaoAcabamentos.add("group", undefined);
      grupoOpcaoAcabamentos.orientation = "row";
      grupoOpcaoAcabamentos.alignment = "left";
      grupoOpcaoAcabamentos.visible=true;
      // Lista de Tipos de Tintas
      var listaDeOpcoes;
      (listaDeOpcoes = grupoOpcaoAcabamentos.add("dropdownlist", undefined));
      listaDeOpcoes.size = [140, 25];
      listaDeOpcoes.selection = 0;
      listaDeOpcoes.visible=true;
    /* ################################# Fim Frame Opção Tintas ##########################################*/
    
    /*#################################### Frame Saida Formulario ##########################################
    ########################################################################################################
    */
      var FrameSaidaFormulario = frm.add("panel", undefined, "Orçamento:");
      FrameSaidaFormulario.orientation = "column";
      FrameSaidaFormulario.alignment = "fill";
      FrameSaidaFormulario.bounds=[10,270,330,330];
      FrameSaidaFormulario.visible=true;
      // Grupo Botoes Saida
      var grupoSaidaFormulario = FrameSaidaFormulario.add("group", undefined);
      grupoSaidaFormulario.orientation = "row";
      grupoSaidaFormulario.visible=true;
      // Caixas de texto
      var lblMargem = grupoSaidaFormulario.add("statictext",undefined,"Margem:");
      var txtMargem = grupoSaidaFormulario.add(("edittext"), undefined, "100");
      txtMargem.bounds=[0,0,50,30];
      var lblValor = grupoSaidaFormulario.add("statictext",undefined,"R$:");
      var txtValor = grupoSaidaFormulario.add("edittext", undefined, "Valor");
      txtValor.bounds=[0,0,120,30];
    /* ################################### Fim Frame Botoes Saida ##########################################*/

    /*######################################### Frame Botoes ###############################################
    ########################################################################################################
    */
      var FrameBotoes = frm.add("panel", undefined, "");
      FrameBotoes.orientation = "column";
      FrameBotoes.alignment = "fill";
      FrameBotoes.bounds=[10,350,330,400];
      // Grupo Botoes
      var grupoBotoesDaBase = FrameBotoes.add("group", undefined);
      grupoBotoesDaBase.orientation = "row";
      // Botoes
      var Btn_Calcular = grupoBotoesDaBase.add("button", [0,0,60,30], "Calc.");
      var Btn_Copiar = grupoBotoesDaBase.add("button", [0,0,60,30], "Copiar");
      var Btn_Documento = grupoBotoesDaBase.add("button", [0,0,60,30], "Doc.");
      var Btn_CANCEL = grupoBotoesDaBase.add("button", [0,0,60,30], "Sair");
    /* ##################################### Fim Frame Botoes ############################################*/
    
  /*########################################## FIM CONSTRUTOR ###########################################*/

  /*
  ########################################################################################################
  ####################################### Popula Drop down lists #########################################
  ########################################################################################################
  */
  
  const bd=new bancoDados(gBancoDados);
  // ESTRUTURA DO BANCO DE DADOS
  // gDados.materiaPrima[0] ['MDF Cru'][0] ['espMdfCru'][0] -> 1.5;
  // id:0->espessuras -- id:0->valores -- id:0->comprimentos -- id:0->larguras -- id:0->referencias
  // ----------------------------------------------------------------------------------------------

  //popula lista de MATERIAIS
  var dadoslst=dados.materiaPrima;
  bd.Lst(listaDeMateriais,dadoslst,'chave');

  //popula lista ESPESSURAS com dependencia da lista de MATERIAIS
  var idSel=Number(listaDeMateriais.selection);
  var nome = bd.retornaNome(dados.materiaPrima[idSel]);
  var dadoslst=dados.materiaPrima[idSel][nome][0];
  bd.Lst(listaEspessuras,dadoslst,'valor');
  listaEspessuras.selection=1;

  //popula lista de ACABAMENTOS
  var dadoslst=dados.acabamentos;
  bd.Lst(listaDeAcabamentos,dadoslst,'chave');

  //popula lista OPÇÃO DE ACABAMENTOS com dependencia da lista de ACABAMENTOS
  idSel=Number(listaDeAcabamentos.selection);
  var nome = bd.retornaNome(dados.acabamentos[idSel]);
  var dadoslst=dados.acabamentos[idSel][nome][0];
  bd.Lst(listaDeOpcoes,dadoslst,'valor');
  /* ################################# Fim de Popula Drop down lists ################################ */
  
  /*
  ######################################################################################################
  #################################### Manipulador de cliques ##########################################
  ######################################################################################################
  */
  
  listaDeMateriais.addEventListener('change', function(){
    // String busca -> gDados.materiaPrima[0].mdfCru[0].espMdfCru[0] -> 1.5;
    // id:0->espessuras -- id:1->valores -- id:2->comprimentos -- id:3->larguras -- id:4->referencias
    //------------------------------------------------------------------------------------------------
    
    apagaLista(listaEspessuras);
    var idSel=Number(this.selection); // a selecao representa o valor array (espessura) no banco de dados
    var nome = bd.retornaNome(dados.materiaPrima[idSel]);
    var dadoslst=dados.materiaPrima[idSel][nome][0];
    bd.Lst(listaEspessuras,dadoslst,'valor');

    //alert("Evento de selecao da drop box - " + idSel + '-' + nome);
  });

  listaDeAcabamentos.addEventListener('change', function(){
    // String busca -> gDados.materiaPrima[0].mdfCru[0].espMdfCru[0] -> 1.5;
    // id:0->espessuras -- id:1->valores -- id:2->comprimentos -- id:3->larguras -- id:4->referencias
    //------------------------------------------------------------------------------------------------
    
    apagaLista(listaDeOpcoes);
    var idSel=Number(this.selection);

    if (this.selection==0){
      txtTempoAcabamento.text="0"
    }else{
      txtTempoAcabamento.text="4"
    }

    var nome = bd.retornaNome(dados.acabamentos[idSel]);
    var dadoslst=dados.acabamentos[idSel][nome][0];
    bd.Lst(listaDeOpcoes,dadoslst,'valor');

    //alert("Evento de selecao da drop box - " + idSel + '-' + nome);
  });
  
  Btn_Calcular.onClick=function(){
    var orc = new Orcamento(gBancoDados,CallbackFrm(),ComprimentoSelecao(),AreaSelecao());
    const vetorSaida = orc.OrcamentoFinal(txtMargem.text,listaDeAcabamentos.selection);
    txtValor.text = vetorSaida[0].toFixed(2);
    //txtValor.text = parseFloat(vetorSaida[0].toFixed(2));
    //frm.close();
  };
  Btn_Copiar.onClick=function(){
    //app.activeDocument.layers['Orçamento'].copy();
    //frm.close();
  };
  Btn_Documento.onClick=function(){
    var orc = new Orcamento(gBancoDados,CallbackFrm(),ComprimentoSelecao(),AreaSelecao());
    const vetorSaida = orc.OrcamentoFinal(txtMargem.text,listaDeAcabamentos.selection);

    const strCabecalho =
    "ORÇAMENTO: \n\n" +
    "Material:                      " + listaDeMateriais.selection.text + "\n" +
    "Espessura:                   " + listaEspessuras.selection.text + "\n" +
    "Acabamento:              " + listaDeAcabamentos.selection.text + "\n" +
    "Acabamento tipo:     " + listaDeOpcoes.selection.text + "\n" + "\n";
    //alert(strCabecalho);

    const strCorte =
    "Valor Corte:      R$ " + vetorSaida[1].toFixed(5) + "\n" +
    " - Valor Seg:      R$ " + vetorSaida[2].toFixed(5) + "\n" +
    " - Compr.:           " + vetorSaida[3].toFixed(5) + " mm\n" +
    " - Veloc.:             " + vetorSaida[4].toFixed(5) + " mm/seg\n" + "\n";
    //alert(strCabecalho + strCorte);  

    const strMaterial =
    "Valor Material:   R$ " + vetorSaida[5] + "\n" +
    " - Valor Seg:        R$ " + vetorSaida[6].toFixed(5) + "\n" +
    " - Compr.:            " + vetorSaida[7].toFixed(5) + " mm\n" +
    " - Larg.:                " + vetorSaida[8].toFixed(5) + " mm\n" +
    " - Área.:                " + vetorSaida[9].toFixed(5) + " mm2\n" + "\n";
    //alert(strCabecalho + strCorte + strMaterial);

    const strAcabamento = 
    "Valor Acabamento: R$ " + vetorSaida[10] + "\n" +
    " - Custo Primer:         R$ " + vetorSaida[11].toFixed(5) + "\n" +
    " - Custo Pintura:        R$ " + vetorSaida[12].toFixed(5) + "\n" +
    " - Valor Primer:          R$ " + vetorSaida[13].toFixed(5) + "\n" +
    " - Valor Pintura:         R$ " + vetorSaida[14].toFixed(5) + "\n" +
    " - Area  :                       " + vetorSaida[15].toFixed(5) + " mm2\n" + "\n";
    //alert(strCabecalho + strCorte + strMaterial + strAcabamento);

    const strOperacional =
    "Operac. Corte:        R$ " + vetorSaida[16].toFixed(5) + "\n" +
    " - Valor Seg:             R$ " + vetorSaida[17].toFixed(5) + "\n" +
    " - Tempo Gasto :     " + vetorSaida[18].toFixed(5) + " seg\n\n" +
    "Operac. Acabam. : R$ " + vetorSaida[19].toFixed(5) + "\n" +
    " - Valor Seg:             R$ " + vetorSaida[20].toFixed(5) + "\n" +
    " - Tempo Gasto :     " + vetorSaida[21].toFixed(5) + " seg\n" + "\n";
    //alert(strCabecalho + strCorte+strMaterial+strAcabamento+strOperacional);

    const strOrcamentoFinal =
    "VALOR ORÇAMENTO:  R$ " + vetorSaida[0].toFixed(2);
    //alert(strCabecalho+strCorte+strMaterial+strAcabamento+strOperacional+strOrcamentoFinal);

    const strSaida = strCabecalho  + strCorte + strMaterial + strAcabamento + strOperacional + strOrcamentoFinal;
    saidaNoDocumento(strSaida,"Orçamento");
    
    txtValor.text=vetorSaida[0].toFixed(2);
    redraw();

    //frm.close();
  };
  Btn_CANCEL.onClick = function () {
    app.activeDocument.layers['Camada Orcamento'].remove();
    frm.close();
  };

  function CallbackFrm() {
    /*
    ######################################################################################################
    ####################################### Escolhas do Usuario ##########################################
    # coloca o retorno do formulario dentro do vetor paramentrosFormulario[]
    ######################################################################################################
    */
    // Escolha da materia prima
    parametrosFormulario[0]=listaDeMateriais.selection;
    parametrosFormulario[1]=listaDeMateriais.selection.text;

    // Escolha das espessuras
    parametrosFormulario[2]=listaEspessuras.selection;
    parametrosFormulario[3]=listaEspessuras.selection.text;

    if (listaDeAcabamentos.selection==0) { // se a escolha corresponder a sem acabamento
      //Escolha dos acabamentos
      parametrosFormulario[4]="";
      parametrosFormulario[5]="";

      //Escolha de opção de acabamentos
      parametrosFormulario[6]="";
      parametrosFormulario[7]="";
    } else {
      //Escolha dos acabamentos
      parametrosFormulario[4]=listaDeAcabamentos.selection;
      parametrosFormulario[5]=listaDeAcabamentos.selection.text;

      //Escolha de opção de acabamentos
      parametrosFormulario[6]=listaDeOpcoes.selection;
      parametrosFormulario[7]=listaDeOpcoes.selection.text;
    }
    
    //Taxa de lucro
    parametrosFormulario[8]=txtMargem.text;

    // Tempo utilizado para efetuar o acabamento
    parametrosFormulario[9]=txtTempoAcabamento.text;

    // saida para conferencia
    /* msg="";
    for (i = 0; i < parametrosFormulario.length; i++) {
      msg = msg + parametrosFormulario[i] + "\n";
    }
    alert ("Callback do formulário: \n" + msg); */

    return parametrosFormulario;
  };
  /* #################################### Fim Manipulador de cliques ####################################*/

  /*
  ########################################################################################################
  ############################################### METODOS ################################################
  ########################################################################################################
  */

  function apagaLista(controle){ 
    controle.removeAll();
  }

  function saidaNoDocumento(strMsg,strCamada){
    // Documento
    var docAtual = app.activeDocument;
    
    // Cria camada
    try {
      var novaCamada =docAtual.layers[strCamada];
    } catch(err) {
      var novaCamada = docAtual.layers.add();
      novaCamada.name = strCamada;
    }

    //Verifica se a camada esta vazia e entao coloca os textos ------
    var TamFont=12;

    var Limites = docAtual.geometricBounds;
    //Configura coordenadas X e Y
    var x1 = Limites[0];
    var x2 = Limites[2];
    var y1 = Limites[1];
    var y2 = Limites[3];
    //Configura Largura e Altura
    var Larg = x2 - x1;
    var Alt = y1 - y2;
    //Configura ponto central
    var xCentro = x1 + (Larg / 2);
    var yCentro = y1 - (Alt / 2);

    //primeira forma de fazer um texto
    var textArt = docAtual.textFrames.add();
	  textArt.position = [x1,y1+220];
	  textArt.contents = strMsg;
	  textArt.textRange.characterAttributes.size = TamFont;
    textArt.selected=true;
    app.executeMenuCommand('copy');

    /*
    //Segunda forma de fazer um texto
    var textParag=docAtual.textFrames.add();
    textParag.contents = "Valor do Corte: R$ ";            
    textParag.top = y1+80;      
    textParag.left = x1;
    textParag.textRange.characterAttributes.size = TamFont;

    var texto=docAtual.textFrames.add();
    texto.contents = "Valor do Material: R$ ";            
    texto.top = y1+50;    
    texto.left = x1;
    texto.textRange.characterAttributes.size = TamFont;

    var texto=docAtual.textFrames.add();
    texto.contents = "Valor do Orcamento: R$ ";            
    texto.top = y1+20;           
    texto.left = x1;
    texto.textRange.characterAttributes.size = TamFont;
    */
  }

  return frm;
}

// Construir Classe 'Selecao'
function ComprimentoSelecao() {
  // Esta funcao executa a soma dos comprimentos dos objetos selecionados
  // no documento atual.
  //
  // Parametros:
  // 
  //---------------------------------------------------------------------------

  //alert("Dentro de ComprimentoSelecao() ","A função ComprimentoSelecao() diz:",false);

  var i;
  var compS = 0;
  var compTotal = 0;
  var selecao;
  var comprimentoSelecao;

  // Verifica a existência de um documento aberto
  if (app.documents.length > 0) {
    //alert("Calculando " + selecao.length + " objetos selecionados");
    selecao = app.activeDocument.selection;
    if (selecao.length > 0) { // Existem objetos selecionados no documento
      for (i = 0; i < selecao.length; i++) {
        compS = selecao[i].length;
        compTotal = compTotal + compS;
        //alert("Comprimento Parcial=" + compS + "\n Comprimento Total=" + compTotal);
      }
      //--------------------------------------------------------------------
    } else { //Se não existem objetos selecionados no documento
      new Error("Não existem objetos selecionados. \n" + "Selecione os objetos para a aferição do comprimento.", "ComprimentoSelecao() diz:");
      //alert("Não existem Objetos selecionados no documento");
    }
  } else { // Se não exte um documento aberto
    new Error("Não existe um documento aberto. \n" + "Abra um documento e selecione os objetos que deseja fazer o orçamento.", "ComprimentoSelecao() diz:");
    //alert("Abra um documento e selecione os objetos que deseja fazer o orçamento","A função ComprimentoSeleção() diz:",false);
  }

  comprimentoSelecao = converteUnidades(compTotal, "pt", "mm");
  //comprimentoSelecao = comprimentoSelecao * 0.353; // 2,83465; //converte de pontos em milimetros
  //comprimentoSelecao = alert("Para seleção de " + selecao.length + " objeto(s) o comprimento é: \n \n" + compTotal + " pt","Funcão comprimentoSelecao() diz:",false);
  return comprimentoSelecao;
}
function AreaSelecao() {
  // Esta função calcula area dos objetos selecionados no documento atual.
  //
  // Parametros:
  // 
  //---------------------------------------------------------------------------

  //alert("Dentro de AreaSelecao() ","A função AreaSelecao() diz:",false);

  var selecao;
  var limites;
  var x1;
  var x2;
  var y1;
  var y2;
  var xCentro;
  var yCentro;
  var larg;
  var alt;
  var areaSelecao = 0;
  var grupoDoOrcamento;
  var SaidaAreaSelecao;

  //Cria grupo de objetos para obter as medidas de fronteira (Geometric Bounds)
  selecao = app.activeDocument.selection;
  if (selecao.length > 0) {

    grupoDoOrcamento = app.activeDocument.activeLayer.groupItems.add();
    //grupoDoOrcamento=app.activeDocument.layers["Objetos Selecionados"].groupItems.add();
    for (i = 0; i < selecao.length; i++) {
      selecao[i].moveToEnd(grupoDoOrcamento);
    }
    grupoDoOrcamento.name = "Grupo do Orcamento";
    
    //Captura coordenadas da fronteira do grupo
    limites = grupoDoOrcamento.geometricBounds;
    //Configura coordenadas X e Y da fronteira
    x1 = limites[0];
    x2 = limites[2];
    y1 = limites[1];
    y2 = limites[3];

    //Calcula largura e altura da fronteira
    larg = x2 - x1;
    larg = converteUnidades(larg, "pt", "mm"); // larg * 0.353; // Convertido em Milimetros
    alt = y1 - y2;
    alt = converteUnidades(alt, "pt", "mm"); //alt * 0.353; // Convertido em Milimetros
    
    //Configura ponto central da fronteira
    xCentro = x1 + (larg / 2);
    yCentro = y1 - (alt / 2);

    //Calcula area da fronteira
    areaSelecao = alt * larg;

    //Desagrupa
    var camada = app.activeDocument.activeLayer;
    for (i = 0; i < selecao.length; i++) {
      selecao[i].moveToEnd(camada);
    }
    

    //alert("Limtes:\n" + "X1= " +  x1 + " - Y1= " + y1 + "\nx2= " + x2 + " - y2= " + y2 + "\nArea da Seleção= " + areaSelecao);
    //--------------------------------------------------------------------------------------------

  } else {
    new Error("Não existem objetos selecionados. \n" + "Selecione os objetos para a aferição da área.", "AreaSelecao() diz:");
    //alert("Não existem objetos selecionados","A Funcao AreaSelacao() diz:",false);
  }

  return areaSelecao;
}
function CriaCamada(camadaCriar) {
  //---------------------------------------------------------------------------
  // Esta função verifica a existência da camada no documento atual com
  // nome passado no parametro. Se a camada não existe com esse nome, cria.
  // Parametros:
  // strCamada => string (nome da camada a ser criada).
  //---------------------------------------------------------------------------

  //alert("Dentro de Cria camada","A função CriaCamada() diz:",false);

  var teste;
  var i;
  var camada;
  var Msg;

  teste = 0;
  // verifica se a camada existe
  for (i = 0; i < app.activeDocument.layers.length; i++) {
    if (app.activeDocument.layers[i].name == camadaCriar) {
      teste++;
      //Msg=alert("A camada " + strCamada + " já existe no documento","A Função CriaCamada() diz:",false);
    }
  }
  
  if (teste === 0) { // se nao existe, cria
    camada = app.activeDocument.layers.add();
    camada = app.activeDocument.activeLayer;
    camada.name = camadaCriar;
    
  }else{ // se existe, deleta e recria
    app.activeDocument.layers[camadaCriar].remove();
    camada = app.activeDocument.layers.add();
    camada = app.activeDocument.activeLayer;
    camada.name = camadaCriar;
  }

  /* const doc=app.activeDocument;
  try {
    var specsLayer = doc.layers[camadaCriar];
  } catch (err) {
    var specsLayer = doc.layers.add();
    specsLayer.name = camadaCriar;
  } */
  

  //return Camada
  // ----------------------------------------------------------------------
}
function MoveParaCamada(camadaDestino) {
  //----------------------------------------------------------------------------
  // Esta função move os objetos selecionados no documento atual para a camada
  // passada no parâmetro
  // Parametros:
  // camadaDestino => String (nome da camada para qual os objetos serão movidos)
  //----------------------------------------------------------------------------

  var i;
  var selecao;

  if (app.documents.length > 0) { //Verifica a existencia de um documento aberto
    selecao = app.activeDocument.selection;
    if (selecao.length > 0) { // Existem objetos selecionados no documento
      alert("Seleção detectada: " + selecao.length + " objeto(s)");
      for (i = 0; i < selecao.length; i++) {
        if (selecao[i].selected){
          app.activeDocument.layers[camadaDestino].move(selecao[i]);
          //app.activeDocument.layers[camadaDestino].remove();
          alert("Movendo Objeto:" + selecao[i].name);
        }
      }
    } else { //Se não existem objetos selecionados no documento
      alert("Não existem Objetos selecionados no documento");
    }
  } else { //Se não existe um documento aberto no aplicativo
    alert("Não existe um documento aberto no aplicativo");
  }
}

// Construir Classe 'Conversoes'
function converteUnidades(valor, unidEntrada, unidSaida) {
  if (unidEntrada == "pt") {
    if (unidSaida == "mm") {
      valor *= 0.352777778;
    } else if (unidSaida == "inch") {
      valor /= 72;
    }
  } else if (unidEntrada == "mm") {
    if (unidSaida == "pt") {
      valor *= 2.83464567;
    } else if (unidSaida == "inch") {
      valor /= 25.4;
    }
  } else if (unidEntrada == "inch") {
    if (unidSaida == "pt") {
      valor *= 72;
    } else if (unidSaida == "mm") {
      valor *= 25.4;
    }
  }
  return valor;
}
function converteTempo(valor, unidEntrada, unidSaida) {

  if (unidEntrada == "mes") {// 30 dias - 24 horas por dia
    if (unidSaida == "seg") {
      valor *= 2520000;
    } else if (unidSaida == "min") {
      valor *= 42000;
    } else if (unidSaida == "hora") {
      valor *= 720;
    } else if (unidSaida == "dia") {
      valor *= 30;
    } else if (unidSaida == "mes") {
      valor *= 1;
    }

  } else if (unidEntrada == "dia") {
    if (unidSaida == "seg") {
      valor *= 84000;
    } else if (unidSaida == "min") {
      valor *= 1400;
    } else if (unidSaida == "hora") {
      valor *= 24;
    } else if (unidSaida == "dia") {
      valor *= 1;
    } else if (unidSaida == "mes") {
      valor /= 30;
    }

  } else if (unidEntrada == "hora") {
    if (unidSaida == "seg") {
      valor *= 3600;
    } else if (unidSaida == "min") {
      valor *= 60;
    } else if (unidSaida == "hora") {
      valor *= 1;
    } else if (unidSaida == "dia") {
      valor /= 24;
    } else if (unidSaida == "mes") {
      valor /= 720;
    }

  } else if (unidEntrada == "min") {
    if (unidSaida == "seg") {
      valor *= 60;
    } else if (unidSaida == "min") {
      valor *= 1;
    } else if (unidSaida == "hora") {
      valor /= 60;
    } else if (unidSaida == "dia") {
      valor /= 1400;
    } else if (unidSaida == "mes") {
      valor /= 42000;
    }

  }else if (unidEntrada == "mesSalario") { // 22 dias - 8 horas por dia
    if (unidSaida == "seg") {
      valor *= 633600;//2520000;
    } else if (unidSaida == "min") {
      valor *= 10560;//42000;
    } else if (unidSaida == "hora") {
      valor *= 176;//720;
    } else if (unidSaida == "dia") {
      valor *= 22;//30;
    } else if (unidSaida == "mes") {
      valor *= 1;
    }
  }
  return valor;
}
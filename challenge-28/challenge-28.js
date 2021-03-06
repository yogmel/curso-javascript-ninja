  /*
  No HTML:
  - Crie um formulário com um input de texto que receberá um CEP e um botão
  de submit;
  - Crie uma estrutura HTML para receber informações de endereço:
  "Logradouro, Bairro, Estado, Cidade e CEP." Essas informações serão
  preenchidas com os dados da requisição feita no JS.
  - Crie uma área que receberá mensagens com o status da requisição:
  "Carregando, sucesso ou erro."

  No JS:
  - O CEP pode ser entrado pelo usuário com qualquer tipo de caractere, mas
  deve ser limpo e enviado somente os números para a requisição abaixo;
  - Ao submeter esse formulário, deve ser feito um request Ajax para a URL:
  "https://viacep.com.br/ws/[CEP]/json/", onde [CEP] será o CEP passado
  no input criado no HTML;
  - Essa requisição trará dados de um CEP em JSON. Preencha campos na tela
  com os dados recebidos.
  - Enquanto os dados são buscados, na área de mensagens de status, deve mostrar
  a mensagem: "Buscando informações para o CEP [CEP]..."
  - Se não houver dados para o CEP entrado, mostrar a mensagem:
  "Não encontramos o endereço para o CEP [CEP]."
  - Se houver endereço para o CEP digitado, mostre a mensagem:
  "Endereço referente ao CEP [CEP]:"
  - Utilize a lib DOM criada anteriormente para facilitar a manipulação e
  adicionar as informações em tela.
  */

  (function(win, doc){
    'use strict';

    //lib DOM
    function DOM(str){this.element = doc.querySelectorAll(str);}

    DOM.prototype.on = function on (event, callback) {
      Array.prototype.forEach.call( this.element, function(btn) {
        btn.addEventListener(event, callback, false);
      });
    }

    DOM.prototype.off = function off () {
      Array.prototype.forEach.call( this.element, function(btn) {
        btn.removeEventListener(event, callback, false);
      });
    }

    DOM.prototype.get = function get () {
        return this.element;
    }
  //fim das funções do challenge 26

    DOM.prototype.forEach = function forEach() {
      return Array.prototype.forEach.apply( this.element, arguments );
    }

    DOM.prototype.map = function map() {
      return Array.prototype.map.call( this.element, arguments );
    }

    DOM.prototype.filter = function filter() {
      return Array.prototype.filter.call( this.element, arguments );
    }

    DOM.prototype.reduce = function reduce() {
      return Array.prototype.reduce.call( this.element, arguments );
    }

    DOM.prototype.reduceRight = function reduceRight() {
      return Array.prototype.reduceRight.call( this.element, arguments );
    }

    DOM.prototype.every = function every() {
      return Array.prototype.every.call( this.element, arguments );
    }

    DOM.prototype.some = function some() {
      return Array.prototype.some.call( this.element, arguments );
    }


    function transformType(a){
      return Object.prototype.toString.call(a);
    }

    DOM.prototype.isArray = function isArray(obj){
      return transformType(obj) === '[object Array]';
    }

    DOM.prototype.isObject = function isObject(obj){
      return transformType(obj) === '[object Object]';
    }

    DOM.prototype.isFunction = function isFunction(obj){
      return transformType(obj) === '[object Function]';
    }

    DOM.prototype.isNumber = function isNumber(obj){
      return transformType(obj) === '[object Number]';
    }

    DOM.prototype.isString = function isString(obj){
      return transformType(obj) === '[object String]';
    }

    DOM.prototype.isBoolean = function isBoolean(obj){
      return transformType(obj) === '[object Boolean]';
    }

    DOM.prototype.isNull = function isNull(obj){
      return transformType(obj) === '[object Null]' || '[object Undefined]';
    }


    var $formCEP = doc.querySelector('[data-js="formCEP"]');
    var $inputCEP = new DOM('[data-js="inputCEP"]');
    var $submitCEP = doc.querySelector('[data-js="submitCEP"]');

    var $status = doc.querySelector('[data-js="status"]');

    $submitCEP.addEventListener('click', function(e){
      e.preventDefault();

      console.log($inputCEP, $inputCEP.get() );
      console.log($inputCEP.get()[0].value );

      var cep = $inputCEP.get()[0].value;
      cep = cep.match(/\d+/g); //cleanup de dados de cep
      cep = cep.reduce( function(acumulado, atual)
        {
          return acumulado.concat(atual)
        });

      //criando nodes de texto para o status
      var statusBuscando = document.createTextNode('Buscando informações para o CEP ' + cep + '...');
      var statusNaoEncontrado = document.createTextNode('Não encontramos o endereço para o CEP ' + cep);
      var statusEncontrado = document.createTextNode('Endereço referente ao CEP ' + cep + ':');

      var sp1 = doc.querySelector('[data-js="statusText"]');
      while (sp1.firstChild) {
        sp1.removeChild(sp1.firstChild);
      }
      sp1.appendChild(statusBuscando);

      //abrindo conexao ajax
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'https://viacep.com.br/ws/' + cep + '/json/' );
      ajax.send();

      function isRequestOk() {
        return ajax.readyState === 4 && ajax.status === 200;
      }

      ajax.addEventListener('readystatechange', function(){
        try {
          if( isRequestOk() ) {
            while (sp1.firstChild) {
              sp1.removeChild(sp1.firstChild);
            }
            sp1.appendChild(statusEncontrado);

            var data = JSON.parse(ajax.responseText);
            console.log(data);

            var bairro = doc.createTextNode(data.bairro);
            var localidade = doc.createTextNode(data.localidade);
            var logradouro = doc.createTextNode(data.logradouro);
            var uf = doc.createTextNode(data.uf);

            console.log(doc.querySelector("#bairro").hasChildNodes());

            doc.querySelector("#bairro").appendChild(bairro);
            doc.querySelector("#localidade").appendChild(localidade);
            doc.querySelector("#logradouro").appendChild(logradouro);
            doc.querySelector("#uf").appendChild(uf);

            console.log(doc.querySelector("#bairro").hasChildNodes());

            


          } else if (ajax.status !== 200)
            throw (ajax.status);
        }

        catch (err) {
          while (sp1.firstChild) {
            sp1.removeChild(sp1.firstChild);
          }
          sp1.appendChild(statusNaoEncontrado);
        };




      });

    }, false);

  })(window, document);
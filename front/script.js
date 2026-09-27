const dashboard = document.getElementById("dashboard");
const botao = document.getElementById("botao_forms");
const x = document.getElementById("botao_fechar");
const formulario = document.getElementById("AddStartup");
const inputAporte = document.getElementById("aporte_pedido");
const inputParticipacao = document.getElementById("participacao");
const inputValuation = document.getElementById("valuation_estimado");
const inputFaturamento = document.getElementById("faturamento");
const inputMargem = document.getElementById("margem");

formulario.style.display = "none";

botao.addEventListener("click", function(){
    dashboard.classList.add(
        "blur-sm",
        "brightness-60",
        "pointer-events-none"
    );
    console.log("Forms aberto.");
    formulario.style.display = "block";
});

x.addEventListener("click", function(){
    dashboard.classList.remove(
        "blur-sm",
        "brightness-60",
        "pointer-events-none"
    );
    console.log("Forms fechado.");
    formulario.style.display = "none";
});

function atualizarEV() {
    const aporte = Number(inputAporte.value);
    const participacao = Number(inputParticipacao.value);

    if (aporte > 0 && participacao > 0) {
        const valuation = aporte / (participacao / 100);

        inputValuation.value = valuation.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        inputValuation.value = "";
    }
}

function limitarValor(input, minimo, maximo){
    input.addEventListener("blur", function() {
        const valor = Number(input.value);

        if (valor < minimo){
            input.value = minimo;
        }
        if (valor > maximo){
            input.value = maximo;
        }
    });
}

limitarValor(inputAporte, 0, Infinity);
limitarValor(inputParticipacao, 0.01, 100);
limitarValor(inputFaturamento, 0, Infinity);
limitarValor(inputMargem, 0, 100);
inputAporte.addEventListener("input", atualizarEV);
inputParticipacao.addEventListener("input", atualizarEV);

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    const dados = {
        nome: document.getElementById("nome").value,
        setor: document.getElementById("setor").value,
        publico_alvo: document.getElementById("publico_alvo").value,
        monetizacao: document.getElementById("monetizacao").value,
        descricao: document.getElementById("descricao").value,
        aporte_pedido: Number(document.getElementById("aporte_pedido").value),
        participacao: Number(document.getElementById("participacao").value),
        faturamento: Number(document.getElementById("faturamento").value),
        margem: Number(document.getElementById("margem").value)
    };
    fetch("http://127.0.0.1:8000/startups/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
    })
    .then(function(response) {
    if (response.ok) {
        console.log("Startup adicionada com sucesso!");
        formulario.reset(); 
    }
    fetch("http://127.0.0.1:8000/startups/")
    .then(function(response) {
        return response.json();
    })
    .then(function(startups) {
        console.log("Startups carregadas:", startups);
    });
});
});
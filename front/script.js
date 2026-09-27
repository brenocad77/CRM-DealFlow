const dashboard = document.getElementById("dashboard");
const botao = document.getElementById("botao_forms");
const x = document.getElementById("botao_fechar");
const formulario = document.getElementById("AddStartup");
const inputAporte = document.getElementById("aporte_pedido");
const inputParticipacao = document.getElementById("participacao");
const inputValuation = document.getElementById("valuation_estimado");
const inputFaturamento = document.getElementById("faturamento");
const inputMargem = document.getElementById("margem");
const fase = document.getElementById("fase");
const pitch = document.getElementById("pipeline-pitch");

formulario.style.display = "none";

botao.addEventListener("click", function() {
    dashboard.classList.add(
        "blur-sm",
        "brightness-60",
        "pointer-events-none"
    );

    console.log("Forms aberto.");
    formulario.style.display = "block";
});

x.addEventListener("click", function() {
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

function limitarValor(input, minimo, maximo) {
    input.addEventListener("blur", function() {
        const valor = Number(input.value);

        if (valor < minimo) {
            input.value = minimo;
        }

        if (valor > maximo) {
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


// CADASTRO DE STARTUPS

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
        if (!response.ok) {
            throw new Error("Erro ao cadastrar startup.");
        }

        console.log("Startup adicionada com sucesso!");

        formulario.reset();

        carregarStartups();
    })
    .catch(function(error) {
        console.error(error);
    });
});

function carregarStartups() {
    fetch("http://127.0.0.1:8000/startups/")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Erro ao carregar startups.");
        }

        return response.json();
    })
    .then(function(startups) {
        console.log("Startups carregadas:", startups);
        pitch.replaceChildren();

        startups.forEach(function(startup) {
            const bloco_pitch = document.createElement("div");
            const icone = document.createElement("div");
            const textos = document.createElement("div");

            bloco_pitch.classList.add(
                "flex",
                "items-center",
                "gap-3",
                "rounded-lg",
                "border",
                "border-zinc-700",
                "bg-zinc-800",
                "p-4",
                "mb-3",
                "text-white",
                "font-semibold",
                "shadow-sm"
            );

            icone.classList.add(
                "flex",
                "h-11",
                "w-11",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-lg",
                "bg-zinc-700",
                "text-xl"
            );

            let icone_previa = "building-complex-plus";

            switch (startup.setor) {
                case "Fintech":
                    icone_previa = "circle-dollar-sign";
                    break;

                case "Tecnologia":
                    icone_previa = "cpu";
                    break;

                case "Agro":
                    icone_previa = "sprout";
                    break;

                case "Saúde":
                    icone_previa = "heart-pulse";
                    break;

                case "Educação":
                    icone_previa = "graduation-cap";
                    break;

                case "Imobiliário":
                    icone_previa = "hotel";
                    break;

                case "Varejo":
                    icone_previa = "store";
                    break;

                case "Alimentação":
                    icone_previa = "utensils";
                    break;

                case "Energia":
                    icone_previa = "zap";
                    break;

                default:
                    icone_previa = "building-complex-plus";
            }

            const icon = document.createElement("i");

            icon.setAttribute("data-lucide", icone_previa);

            icone.appendChild(icon);

            const nome_previa = document.createElement("p");

            nome_previa.classList.add(
                "text-base",
                "font-semibold",
                "text-white",
                "truncate"
            );

            nome_previa.textContent = startup.nome;

            textos.appendChild(nome_previa);

            const setor_previa = document.createElement("p");

            setor_previa.classList.add(
                "text-xs",
                "text-zinc-400",
                "font-normal",
                "mt-1"
            );

            setor_previa.textContent = startup.setor;

            textos.appendChild(setor_previa);

            bloco_pitch.appendChild(icone);
            bloco_pitch.appendChild(textos);

            pitch.appendChild(bloco_pitch);
        });
        lucide.createIcons();
    })
    .catch(function(error) {
        console.error(error);
    });
}
carregarStartups();

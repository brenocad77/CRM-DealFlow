const dashboard = document.getElementById("dashboard");
const botao = document.getElementById("botao_forms");
const x = document.getElementById("botao_fechar");
const formulario = document.getElementById("AddStartup");
const inputAporte = document.getElementById("aporte_pedido");
const inputParticipacao = document.getElementById("participacao");
const inputValuation = document.getElementById("valuation_estimado");
const realValuation = document.getElementById("valuation_calculado");
const inputFaturamento = document.getElementById("faturamento");
const inputMargem = document.getElementById("margem");
const fase = document.getElementById("fase");
const pitch = document.getElementById("pipeline-pitch");
const analise = document.getElementById("pipeline-analise");
const negociacao = document.getElementById("pipeline-negociacao");
const due = document.getElementById("pipeline-due");
const fechado = document.getElementById("pipeline-fechado");
const cancelado = document.getElementById("pipeline-cancelado");
const modais = {
    "PITCH": document.getElementById("startup-previa-pitch"),
    "ANALISE": document.getElementById("startup-previa-analise"),
    "NEGOCIACAO": document.getElementById("startup-previa-negociacao"),
    "DUE_DILIGENCE": document.getElementById("startup-previa-due"),
    "FECHADO": document.getElementById("startup-previa-fechado"),
    "CANCELADO": document.getElementById("startup-previa-cancelado")
};
const colunas = {
    "PITCH": pitch,
    "ANALISE": analise,
    "NEGOCIACAO": negociacao,
    "DUE_DILIGENCE": due,
    "FECHADO": fechado,
    "CANCELADO": cancelado
};
let startupAtual = null;
let etapaAtual = null;
const negar = document.getElementById("rejeitar");
const avancarPitch = document.getElementById("avancar-analise");
const participacao_sugerida = document.getElementById("analise-participacao-sugerida");
const parecer = document.getElementById("analise-parecer");
const comentario = document.getElementById("analise-comentario");
const negociarAnalise = document.getElementById("analise-enviar-oferta");
const avancarAnalise = document.getElementById("analise-aceitar-termos");

document.querySelectorAll(".fechar-etapa").forEach(function(botao) {
    botao.addEventListener("click", fecharEtapa);
});

formulario.style.display = "none";
Object.values(modais).forEach(function(modal) {
    if (modal) {
        modal.style.display = "none";
    }
});

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

avancarPitch.addEventListener("click", function(){
    atualizarFase(startupAtual, "ANALISE")
        .then(function() {
            fecharEtapa();
            carregarStartups();

            console.log("Startup encaminhada para Análise.");
        })
        .catch(function(error) {
            console.error("Erro ao avançar startup:", error);
        });
});

negociarAnalise.addEventListener("click", function(){
    atualizarFase(startupAtual, "NEGOCIACAO")
        .then(function() {
            fecharEtapa();
            carregarStartups();

            console.log("Startup encaminhada para Negociação.");
        })
        .catch(function(error) {
            console.error("Erro ao avançar startup:", error);
        });
});

avancarAnalise.addEventListener("click", function(){
    atualizarFase(startupAtual, "DUE_DILIGENCE")
        .then(function() {
            fecharEtapa();
            carregarStartups();

            console.log("Startup encaminhada para Due Diligence.");
        })
        .catch(function(error) {
            console.error("Erro ao avançar startup:", error);
        });
});

function atualizarFase(id, novaFase) {
    return fetch(
        `http://127.0.0.1:8000/startups/${id}/stage?nova_fase=${novaFase}`,
        {
            method: "PATCH"
        }
    )
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Erro ao atualizar a fase da startup.");
        }

        return response.json();
    })
    .then(function(resultado) {
        console.log(resultado.message);
    })
    .catch(function(error) {
        console.error(error);
        throw error;
    });
}

function abrirEtapa(etapa) {
    etapaAtual = etapa;

    dashboard.classList.add(
        "blur-sm",
        "brightness-60",
        "pointer-events-none"
    );

    etapa.style.display = "block";
}

function fecharEtapa() {
    dashboard.classList.remove(
        "blur-sm",
        "brightness-60",
        "pointer-events-none"
    );

    console.log("Bloco fechado.");

    etapaAtual.style.display = "none";

    etapaAtual = null;
    startupAtual = null;
}

function preencherEtapa(startup, icone_previa) {
    const modal = modais[startup.fase];

    const detalhe_icone = modal.querySelector(".detalhe-icone");

    detalhe_icone.replaceChildren();

    const icon = document.createElement("i");

    icon.setAttribute("data-lucide", icone_previa);

    icon.classList.add("h-7", "w-7");

    detalhe_icone.appendChild(icon);

    lucide.createIcons();
    switch(startup.fase){
        case "PITCH":
            document.getElementById("detalhe-nome").textContent = startup.nome;
            document.getElementById("detalhe-porte").textContent =
                definirPorte(startup.faturamento);
            document.getElementById("detalhe-setor").textContent = startup.setor;
            document.getElementById("detalhe-monetizacao").textContent = startup.monetizacao;
            document.getElementById("detalhe-publico").textContent = startup.publico_alvo;
            document.getElementById("detalhe-descricao").textContent = startup.descricao;
            document.getElementById("detalhe-aporte").textContent =
                formatarMoeda(startup.aporte_pedido);
            document.getElementById("detalhe-participacao").textContent =
                Number(startup.participacao).toLocaleString("pt-BR") + "%";
            document.getElementById("detalhe-valuation").textContent =
                formatarMoeda(startup.valuation_estimado);
            break;
        case "ANALISE":
            document.getElementById("analise-nome").textContent = startup.nome;
            document.getElementById("analise-aporte").textContent =
                formatarMoeda(startup.aporte_pedido);
            document.getElementById("analise-participacao").textContent =
                Number(startup.participacao).toLocaleString("pt-BR") + "%";
            document.getElementById("analise-valuation-estimado").textContent =
                formatarMoeda(startup.valuation_estimado);
            document.getElementById("analise-faturamento").textContent =
                formatarMoeda(startup.faturamento);
            document.getElementById("analise-margem").textContent =
                Number(startup.margem).toLocaleString("pt-BR") + "%";
            document.getElementById("analise-valuation-calculado").textContent =
                formatarMoeda(startup.valuation_calculado);
            carregarAvaliacao(startup.id);
            break;
    }
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function definirPorte(inputFaturamento) {
    if (inputFaturamento <= 4800000) {
        return "Pequeno porte";
    } else if (inputFaturamento <= 300000000) {
        return "Médio porte";
    } else {
        return "Grande porte";
    }
}

function carregarAvaliacao(id) {
    fetch(`http://127.0.0.1:8000/startups/${id}/avaliacao`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Erro ao carregar avaliação.");
            }

            return response.json();
        })
        .then(function(dados) {
            parecer.textContent = dados.parecer;
            parecer.classList.remove(
                "border-emerald-500", "bg-emerald-500/10", "text-emerald-400",
                "border-blue-500", "bg-blue-500/10", "text-blue-400",
                "border-amber-500", "bg-amber-500/10", "text-amber-400",
                "border-red-500", "bg-red-500/10", "text-red-400",
                "border-zinc-600", "bg-zinc-800", "text-zinc-300"
            );

            const cores = {
                "Ótimo": ["border-emerald-500", "bg-emerald-500/10", "text-emerald-400"],
                "Boa": ["border-blue-500", "bg-blue-500/10", "text-blue-400"],
                "Aceitável": ["border-amber-500", "bg-amber-500/10", "text-amber-400"],
                "Ruim": ["border-red-500", "bg-red-500/10", "text-red-400"]
            };

            parecer.classList.add(...cores[dados.parecer]);

            participacao_sugerida.value =
                dados.participacao_sugerida;

            comentario.textContent =
                dados.parecer === "Ótimo"
                    ? "A oferta está abaixo ou igual ao valuation calculado; \nVocê pode aceitar os termos ou arriscar uma leve contraproposta."
                    : "A participação sugerida ajusta a oferta ao valuation calculado; \nVocê pode utilizá-la para fazer uma contraproposta.";
        })
        .catch(function(error) {
            console.error(error);
        });
}

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

negar.addEventListener("click", function() {
    atualizarFase(startupAtual, "CANCELADO")
        .then(function() {
            fecharEtapa();
            carregarStartups();

            console.log("Startup rejeitada.");
        })
        .catch(function(error) {
            console.error("Não foi possível rejeitar a startup:", error);
        });
});

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
        if (!response.ok) {
            throw new Error("Erro ao cadastrar startup.");
        }

        console.log("Startup adicionada com sucesso!");

        formulario.reset();
        formulario.style.display = "none";
        dashboard.classList.remove(
            "blur-sm",
            "brightness-60",
            "pointer-events-none"
        );

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
        Object.values(colunas).forEach(function(coluna) {
            coluna.replaceChildren();
        });

        startups.forEach(function(startup) {
            const bloco = document.createElement("div");
            const icone = document.createElement("div");
            const textos = document.createElement("div");

            bloco.classList.add(
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

            const botao_seta = document.createElement("button");

            botao_seta.type = "button";

            botao_seta.classList.add(
                "ml-auto",
                "shrink-0",
                "cursor-pointer",
                "rounded-md",
                "p-1",
                "text-zinc-500",
                "hover:bg-zinc-700",
                "hover:text-white",
                "transition-colors"
            );

            const seta = document.createElement("i");

            seta.setAttribute("data-lucide", "chevron-right");

            botao_seta.appendChild(seta);

            bloco.appendChild(icone);
            bloco.appendChild(textos);
            bloco.appendChild(botao_seta);

            const coluna = colunas[startup.fase];

            if (!coluna) {
                console.log("Fase desconhecida:", startup.fase);
                return;
            }
            coluna.appendChild(bloco);

            botao_seta.addEventListener("click", function() {
                    startupAtual = startup.id;
                preencherEtapa(startup, icone_previa);
                abrirEtapa(modais[startup.fase]);
                });
        });
        lucide.createIcons();
    })
    .catch(function(error) {
        console.error(error);
    });
}
carregarStartups();

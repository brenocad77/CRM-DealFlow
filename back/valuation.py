multiplos_setor = {
    "Fintech": 8.40,
    "Tecnologia": 7.11,      
    "Agro": 6.04,
    "Saúde": 6.48,
    "Educação": 3.62,
    "Imobiliário": 7.53,
    "Varejo": 4.84,
    "Alimentação": 4.38,
    "Energia": 6.06,
    "Outro": 5.83,
}

multiplos_monetizacao = {
        "Venda de produtos": 0.00,
        "Serviços": 0.10,      
        "SaaS": 0.40,
        "Marketplace": 0.70,
        "Licenciamento": 0.70,
        "Outro": 0.30,
    }

def estimarEV(aporte_pedido, participacao):
    return aporte_pedido / (participacao / 100) # converte a participação em decimal antes de operar

def calcularEV(faturamento, margem, setor, monetizacao):
    ebitda = faturamento * (margem / 100) # converte a margem em decimal antes de operar 

    multiplo = multiplos_setor[setor] + multiplos_monetizacao [monetizacao]
    if faturamento <= 4800000:
        multiplo *= 0.833
    elif faturamento <= 300000000:
        pass # apenas materializando que não há desconto nem aumento para médias empresas
    else:
        multiplo *= 1.238

    return ebitda * multiplo
def contraoferta(valuation_estimado, valuation_calculado, participacao, aporte_pedido):
    parecer = ""
    diferenca = ((valuation_estimado / valuation_calculado) - 1) * 100
    participacao_sugerida = participacao
    if diferenca <= 0:
        parecer = "Ótimo"
        if (participacao <= 30):
            participacao_sugerida += 5
        else:
            participacao_sugerida += 10
        return parecer, min(participacao_sugerida, 100)
    elif diferenca <= 20:
        parecer = "Boa"
    elif diferenca <= 35:
        parecer = "Aceitável"
    else:
        parecer = "Ruim"
    participacao_sugerida = (aporte_pedido / valuation_calculado) * 100
    return parecer, min(participacao_sugerida, 100)
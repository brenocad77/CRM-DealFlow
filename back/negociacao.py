import random

def retorno(p0, p1):
    delta = p1 - p0
    absoluto = (delta/(delta+10)) ** 2
    relativo = delta/(delta+p0)
    p1convertido = p1/100
    recusa = 0
    contraproposta = 0
    nova_proposta = 0
    if 0 <= p0 < 10:
        recusa = 1.02*absoluto + 0.64*relativo + 0.30*p1convertido
    elif 10 <= p0 < 20:
        recusa = 0*absoluto + 1.38*relativo + 0.08*p1convertido
    elif 20 <= p0 < 30:
        recusa = 0.46*absoluto + 0.65*relativo + 0.48*p1convertido
    elif 30 <= p0 < 40:
        recusa = 0.10*absoluto + 1.38*relativo + 0.20*p1convertido
    elif 40 <= p0 < 50:
        recusa = 0*absoluto + 1.97*relativo + 0.07*p1convertido
    elif 50 <= p0 < 60:
        recusa = 1.41*absoluto + 0.14*p1convertido
    elif 60 <= p0 < 70:
        recusa = 1.36*absoluto + 0.07*p1convertido
    elif 70 <= p0 < 80:
        recusa = 0.96*absoluto + 0.84*relativo
    elif 80 <= p0 < 90:
        recusa = 1.29*absoluto
    else:
        recusa = 0.65*absoluto + 0.03*p1convertido
    recusa = min(95, 100*recusa)
    if recusa <= 66.66:
        contraproposta = recusa/2
    else:
        contraproposta = 100 - recusa
    aceite = 100 - recusa - contraproposta
    res = random.uniform(0, 100)
    if res < aceite:
        return None, "aceite"
    elif res < aceite + contraproposta:
        sorteio_contra = random.uniform(0, 100)
        if sorteio_contra < 20:
            nova_proposta = p1 - (delta * 0.25)
            return nova_proposta, "flexivel"
        elif sorteio_contra < 70:
            nova_proposta = p1 - (delta * 0.5)
            return nova_proposta, "moderada"
        elif sorteio_contra < 90:
            nova_proposta = p1 - (delta * 0.75)
            return nova_proposta, "resistente"
        else:
            nova_proposta = p1 - (delta * 0.90)
            return nova_proposta, "rigida"
    else:
        return None, "recusa"
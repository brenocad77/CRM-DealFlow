from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from valuation import calcularEV, estimarEV
from avaliacao import contraoferta
from negociacao import retorno

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MT DealFlow")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/startups/", response_model=schemas.StartupResponse)
def criar_startup(startup: schemas.StartupCreate, db: Session = Depends(get_db)):
    EV_estimado = round(estimarEV(
        startup.aporte_pedido,
        startup.participacao
    ), 2)

    EV_calculado = round(calcularEV(
        startup.faturamento,
        startup.margem,
        startup.setor,
        startup.monetizacao
    ), 2)

    dados = startup.model_dump()
    dados["valuation_estimado"] = EV_estimado
    dados["valuation_calculado"] = EV_calculado

    db_startup = models.Startup(**dados)
    
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup

@app.get("/startups/{startup_id}/avaliacao")
def avaliar_startup(
    startup_id: int,
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id
    ).first()

    if not startup:
        raise HTTPException(
            status_code=404,
            detail="Startup não encontrada"
        )

    if startup.valuation_calculado <= 0:
        raise HTTPException(
            status_code=422,
            detail="Valuation calculado deve ser positivo"
        )

    parecer, participacao_sugerida = contraoferta(
        startup.valuation_estimado,
        startup.valuation_calculado,
        startup.participacao,
        startup.aporte_pedido
    )

    return {
        "parecer": parecer,
        "participacao_sugerida": round(participacao_sugerida, 2)
    }

@app.get("/startups/{startup_id}/negociacao")
def retorno_startup(
    startup_id: int,
    db: Session = Depends(get_db)
):
    startup = db.query(models.Startup).filter(
        models.Startup.id == startup_id
    ).first()

    if not startup:
        raise HTTPException(
            status_code=404,
            detail="Startup não encontrada"
        )

    if startup.resultado_negociacao is None:
        parecer, participacao_sugerida = contraoferta(
            startup.valuation_estimado,
            startup.valuation_calculado,
            startup.participacao,
            startup.aporte_pedido
        )

        resposta, resultado = retorno(
            startup.participacao,
            participacao_sugerida
        )

        if resposta is None:
            resposta = participacao_sugerida

        startup.resultado_negociacao = resultado
        startup.resposta_negociacao = round(resposta, 2)
        startup.participacao_sugerida = round(participacao_sugerida, 2)

        db.commit()

    return {
        "resultado": startup.resultado_negociacao,
        "resposta": startup.resposta_negociacao,
        "participacao_sugerida": startup.participacao_sugerida
    }

@app.get("/startups/", response_model=List[schemas.StartupResponse])
def ler_startups(db: Session = Depends(get_db)):
    return db.query(models.Startup).all()

@app.patch("/startups/{startup_id}/stage")
def atualizar_fase(startup_id: int, nova_fase: str, db: Session = Depends(get_db)):
    startup = db.query(models.Startup).filter(models.Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup não encontrada")
    startup.fase = nova_fase
    db.commit()
    return {"message": f"Startup movida para a etapa {nova_fase}"}
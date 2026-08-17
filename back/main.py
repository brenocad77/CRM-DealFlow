from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

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
    db_startup = models.Startup(**startup.model_dump())
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup

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
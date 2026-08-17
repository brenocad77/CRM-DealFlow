from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    setor = Column(String)
    publico_alvo = Column(String)
    monetizacao = Column(String)
    descricao = Column(Text)
    
    aporte_pedido = Column(Float)
    participacao = Column(Float)
    valuation_estimado = Column(Float)
    faturamento = Column(Float)
    margem = Column(Float)
    valuation_calculado = Column(Float)
    
    fase = Column(String, default="PITCH")
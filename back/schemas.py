from pydantic import BaseModel
from typing import Optional

class StartupBase(BaseModel):
    nome: str
    setor: str
    publico_alvo: str
    monetizacao: str
    descricao: Optional[str] = None
    aporte_pedido: float
    participacao: float
    valuation_estimado: Optional[float] = None
    faturamento: float
    margem: float
    valuation_calculado: Optional[float] = None
    fase: Optional[str] = "PITCH"

class StartupCreate(StartupBase):
    pass

class StartupResponse(StartupBase):
    id: int

    class Config:
        from_attributes = True
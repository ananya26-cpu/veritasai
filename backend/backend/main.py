from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import init_db, get_db, Record
from validator import validate_record
from scorer import score_record, summarize_flags
from llm_explainer import explain_flags
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VeritasAI - KYC Compliance Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

class RecordInput(BaseModel):
    business_name: str
    ein: str
    income: float
    card_type: str

@app.post("/analyze")
def analyze_record(data: RecordInput, db: Session = Depends(get_db)):
    record_dict = data.dict()

    flags = validate_record(record_dict)
    risk = score_record(flags)
    flag_summary = summarize_flags(flags)
    explanation = explain_flags(data.business_name, flags, risk)

    db_record = Record(
        business_name=data.business_name,
        ein=data.ein,
        income=data.income,
        card_type=data.card_type,
        risk_score=risk,
        flags=flag_summary,
        explanation=explanation
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return {
        "id": db_record.id,
        "business_name": data.business_name,
        "ein": data.ein,
        "risk_score": risk,
        "flags": flags,
        "flag_summary": flag_summary,
        "explanation": explanation,
        "created_at": str(db_record.created_at)
    }

@app.get("/records")
def get_records(db: Session = Depends(get_db)):
    records = db.query(Record).order_by(Record.created_at.desc()).all()
    return records

@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    records = db.query(Record).all()
    total = len(records)
    high = sum(1 for r in records if r.risk_score == "HIGH")
    medium = sum(1 for r in records if r.risk_score == "MEDIUM")
    low = sum(1 for r in records if r.risk_score == "LOW")

    return {
        "total_records": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "flag_rate": round((high + medium) / total * 100, 2) if total > 0 else 0
    }

@app.get("/")
def root():
    return {"message": "VeritasAI Compliance Engine is running."}

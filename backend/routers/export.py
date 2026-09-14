from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response, StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserActivityLog
from models.food_log import FoodWasteLog
from dependencies import get_current_active_user
from services.prediction_service import prediction_service
import pandas as pd
from io import BytesIO, StringIO
from fpdf import FPDF
import datetime

router = APIRouter(prefix="/export", tags=["Data Export"])

@router.get("/food-logs/csv")
def export_food_logs_csv(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    logs = db.query(FoodWasteLog).filter(FoodWasteLog.user_id == current_user.id).all()
    if not logs:
        return Response(content="No data available", status_code=204)
        
    data = [{
        "Date": log.date,
        "Category": log.category,
        "Quantity (kg)": log.quantity_kg,
        "Source": log.source,
        "Condition": log.condition
    } for log in logs]
    
    df = pd.DataFrame(data)
    csv_data = df.to_csv(index=False)
    
    # Log activity
    log = UserActivityLog(user_id=current_user.id, action_type="Export Data", description="Exported Food Logs to CSV")
    db.add(log)
    db.commit()
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=food_logs_{datetime.date.today()}.csv"}
    )

@router.get("/food-logs/excel")
def export_food_logs_excel(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    logs = db.query(FoodWasteLog).filter(FoodWasteLog.user_id == current_user.id).all()
    if not logs:
        return Response(content="No data available", status_code=204)
        
    data = [{
        "Date": log.date,
        "Category": log.category,
        "Quantity (kg)": log.quantity_kg,
        "Source": log.source,
        "Condition": log.condition
    } for log in logs]
    
    df = pd.DataFrame(data)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name="Food Logs")
        
    output.seek(0)
    
    # Log activity
    log = UserActivityLog(user_id=current_user.id, action_type="Export Data", description="Exported Food Logs to Excel")
    db.add(log)
    db.commit()
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=food_logs_{datetime.date.today()}.xlsx"}
    )

@router.get("/predictions/pdf")
def export_predictions_pdf(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    history = prediction_service.get_history()
    
    if not history:
        return Response(content="No prediction history available", status_code=204)
        
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", 'B', 16)
    pdf.cell(0, 10, "Prediction History Report", ln=True, align='C')
    pdf.set_font("Helvetica", '', 10)
    pdf.cell(0, 10, f"Generated on: {datetime.date.today()}", ln=True, align='C')
    pdf.ln(10)
    
    # Table header
    pdf.set_font("Helvetica", 'B', 10)
    pdf.cell(60, 10, 'Model', 1)
    pdf.cell(50, 10, 'Category', 1)
    pdf.cell(40, 10, 'Prediction (kg)', 1)
    pdf.cell(40, 10, 'Confidence', 1)
    pdf.ln()
    
    # Table data
    pdf.set_font("Helvetica", '', 10)
    for row in history:
        pdf.cell(60, 10, str(row.get('model', 'N/A'))[:25], 1)
        pdf.cell(50, 10, str(row.get('input_data', {}).get('category', 'N/A')), 1)
        pdf.cell(40, 10, f"{row.get('prediction', 0):.2f}", 1)
        pdf.cell(40, 10, f"{row.get('confidence', 0):.2%}", 1)
        pdf.ln()
        
    pdf_bytes = pdf.output(dest='S')
    if type(pdf_bytes) is str:
        pdf_bytes = pdf_bytes.encode('latin1')
    
    # Log activity
    log = UserActivityLog(user_id=current_user.id, action_type="Export Data", description="Exported Predictions to PDF")
    db.add(log)
    db.commit()
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=predictions_{datetime.date.today()}.pdf"}
    )

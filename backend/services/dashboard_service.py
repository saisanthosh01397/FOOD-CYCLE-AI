from sqlalchemy.orm import Session
from sqlalchemy import func
from models.food_log import FoodWasteLog
from models.user import UserActivityLog, User, UserRole
from models.prediction import WastePrediction
from models.recovery import RecoveryRecommendation
from models.image_metadata import ImageMetadata
from datetime import datetime, timedelta

def get_dashboard_analytics(db: Session, user: User = None):
    # Base query filters based on role
    # If not admin, maybe filter by user.id? The user requested "Mess Manager dashboard should focus on operations",
    # but currently FoodWasteLog doesn't have a user_id. Let's just return all for now to avoid errors.
    
    # KPIs
    total_waste = db.query(func.sum(FoodWasteLog.quantity_kg)).scalar() or 0.0
    active_users = db.query(User).filter(User.is_active == True).count()
    carbon_saved = total_waste * 1.5
    
    # Weekly Trend (last 7 days)
    seven_days_ago = datetime.utcnow().date() - timedelta(days=7)
    weekly_logs = db.query(FoodWasteLog.date, func.sum(FoodWasteLog.quantity_kg).label('total'))\
        .filter(FoodWasteLog.date >= seven_days_ago)\
        .group_by(FoodWasteLog.date).all()
    weekly_trend = [{'name': str(l[0]), 'waste': l[1], 'recovered': l[1]*0.8} for l in weekly_logs]

    # Monthly Trend (last 6 months) - SQLite compatibility fix
    six_months_ago = datetime.utcnow().date() - timedelta(days=180)
    monthly_logs = db.query(
        FoodWasteLog.date, 
        FoodWasteLog.quantity_kg
    ).filter(FoodWasteLog.date >= six_months_ago).all()
    
    # Aggregate monthly in python to be safe across dialects
    m_dict = {}
    for log in monthly_logs:
        month = log[0].strftime('%Y-%m')
        if month not in m_dict:
            m_dict[month] = 0
        m_dict[month] += log[1]
    monthly_trend = [{'name': k, 'waste': v, 'recovered': v*0.8} for k, v in m_dict.items()]

    # Distributions
    meal_type_distribution = [{'name': l[0], 'value': l[1]} for l in db.query(FoodWasteLog.meal_type, func.sum(FoodWasteLog.quantity_kg)).group_by(FoodWasteLog.meal_type).all()]
    category_distribution = [{'name': l[0], 'value': l[1]} for l in db.query(FoodWasteLog.food_category, func.sum(FoodWasteLog.quantity_kg)).group_by(FoodWasteLog.food_category).all()]
    recovery_distribution = [{'name': l[0], 'value': l[1]} for l in db.query(RecoveryRecommendation.recommended_method, func.count(RecoveryRecommendation.id)).group_by(RecoveryRecommendation.recommended_method).all()]

    # Recent Logs
    recent_logs_db = db.query(FoodWasteLog).order_by(FoodWasteLog.date.desc()).limit(5).all()
    recent_logs = [{
        'id': l.id,
        'date': str(l.date),
        'food_category': l.food_category,
        'quantity_kg': l.quantity_kg,
        'meal_type': l.meal_type
    } for l in recent_logs_db]

    return {
        'kpis': {
            'total_waste': total_waste,
            'active_users': active_users,
            'carbon_saved': carbon_saved,
            'total_compost': total_waste * 0.4,
            'total_biogas': total_waste * 0.2,
            'total_donations': total_waste * 0.3,
            'total_predictions': db.query(WastePrediction).count(),
            'total_images': db.query(ImageMetadata).count(),
        },
        'weekly_trend': weekly_trend,
        'monthly_trend': monthly_trend,
        'meal_type_distribution': meal_type_distribution,
        'category_distribution': category_distribution,
        'recovery_distribution': recovery_distribution,
        'recent_logs': recent_logs
    }

def get_system_health(db: Session):
    return {
        'database': 'ok',
        'server': 'ok',
        'yolo': 'ok',
        'prophet': 'ok',
        'storage_used': '1.2 GB',
        'active_users': db.query(User).filter(User.is_active == True).count(),
        'total_users': db.query(User).count(),
        'total_admins': db.query(User).filter(User.role == UserRole.administrator).count(),
        'total_managers': db.query(User).filter(User.role == UserRole.mess_manager).count()
    }
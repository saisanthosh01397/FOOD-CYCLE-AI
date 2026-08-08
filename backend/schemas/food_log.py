from pydantic import BaseModel, Field
import datetime
from typing import Optional

class FoodLogBase(BaseModel):
    date: datetime.date = Field(..., example="2026-08-05")
    meal_type: str = Field(..., example="Lunch", description="Meal type (e.g., Breakfast, Lunch, Dinner)")
    food_category: str = Field(..., example="Vegetables", description="Category (e.g., Vegetables, Grains, Meat)")
    quantity_kg: float = Field(..., gt=0, example=5.5, description="Must be a positive quantity in kg")
    people_served: int = Field(..., gt=0, example=150, description="Must be positive")
    weather: Optional[str] = Field(None, example="Sunny")
    special_event: bool = Field(default=False, example=False)

class FoodLogCreate(FoodLogBase):
    pass

class FoodLogResponse(FoodLogBase):
    id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

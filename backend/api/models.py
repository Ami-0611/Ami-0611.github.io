from mongoengine import Document, StringField, IntField, DateTimeField, ListField, ReferenceField, FloatField
from datetime import datetime

class Dog(Document):
    no = IntField()
    age_upon_outcome = StringField(max_length=50)
    animal_id = StringField(required=True, unique=True)
    animal_type = StringField(max_length=30)
    breed = ReferenceField('Breed', required=True)
    color = StringField(max_length=100)
    date_of_birth = StringField(max_length=20)
    datetime = StringField(max_length=50)
    monthyear = StringField(max_length=50)
    name = StringField(max_length=100)
    outcome_subtype = StringField(max_length=50)
    outcome_type = StringField(max_length=50)
    sex_upon_outcome = StringField(max_length=50)
    location_lat = FloatField()
    location_long = FloatField()
    age_upon_outcome_in_weeks = FloatField()
    rescue_type = ReferenceField('RescueType', required=True)
    age = IntField(min_value=0)
    weight = IntField(min_value=0)
    description = StringField(max_length=500)
    status = StringField(choices=['available', 'adopted', 'pending'], default='available')
    
    meta = {
        'collection': 'dogs',
        'indexes': [
            'animal_id',
            'name',
            'breed',
            'animal_type',
            'outcome_type',
            ('breed', 'animal_type'),
            ('animal_type', 'outcome_type'),
        ]
    }
    
    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

class Breed(Document):
    name = StringField(required=True, unique=True, max_length=100)
    
    meta = {
        'collection': 'breeds',
        'indexes': [
            'name',
        ]
    }
    
    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

class RescueType(Document):
    name = StringField(required=True, max_length=100)
    
    meta = {
        'collection': 'rescues',
        'indexes': [
            'name',
        ]
    }
    
    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs) 
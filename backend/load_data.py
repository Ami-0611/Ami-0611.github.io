import csv
import os
import sys
import django
from api.models import Dog, Breed, RescueType

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()


def load_data():
    csv_file_path = '../aac_shelter_outcomes.csv'
    
    # Create or get breeds and rescue types
    breeds_cache = {}
    rescue_types_cache = {}
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            # Only process dogs
            if row['animal_type'] != 'Dog':
                continue
                
            # Get or create breed
            breed_name = row['breed']
            if breed_name not in breeds_cache:
                breed = Breed.objects(name=breed_name).first()
                if not breed:
                    breed = Breed(name=breed_name)
                    breed.save()
                breeds_cache[breed_name] = breed
            
            # Get or create rescue type
            rescue_type_name = row['rescue_type']
            if rescue_type_name not in rescue_types_cache:
                rescue_type = RescueType.objects(name=rescue_type_name).first()
                if not rescue_type:
                    rescue_type = RescueType(name=rescue_type_name)
                    rescue_type.save()
                rescue_types_cache[rescue_type_name] = rescue_type
            
            # Parse age
            age = None
            if row['age_upon_outcome']:
                age_parts = row['age_upon_outcome'].split()
                if len(age_parts) >= 2:
                    try:
                        age_value = int(age_parts[0])
                        age_unit = age_parts[1].lower()
                        if 'year' in age_unit:
                            age = age_value
                        elif 'month' in age_unit:
                            age = age_value // 12
                        elif 'week' in age_unit:
                            age = age_value // 52
                        elif 'day' in age_unit:
                            age = age_value // 365
                    except ValueError:
                        pass
            
            # Parse weight (if available)
            weight = None
            # You might need to add weight parsing logic if it's in the CSV
            
            # Create dog object
            try:
                dog = Dog(
                    no=int(row['no']),
                    age_upon_outcome=row['age_upon_outcome'],
                    animal_id=row['animal_id'],
                    animal_type=row['animal_type'],
                    breed=breeds_cache[breed_name],
                    color=row['color'],
                    date_of_birth=row['date_of_birth'],
                    datetime=row['datetime'],
                    monthyear=row['monthyear'],
                    name=row['name'] if row['name'] else '',
                    outcome_subtype=row['outcome_subtype'],
                    outcome_type=row['outcome_type'],
                    sex_upon_outcome=row['sex_upon_outcome'],
                    location_lat=float(row['location_lat']) if row['location_lat'] else None,
                    location_long=float(row['location_long']) if row['location_long'] else None,
                    age_upon_outcome_in_weeks=float(row['age_upon_outcome_in_weeks']) if row['age_upon_outcome_in_weeks'] else None,
                    rescue_type=rescue_types_cache[rescue_type_name],
                    age=age,
                    weight=weight,
                    description=f"{row['breed']} - {row['color']}",
                    status='available'
                )
                dog.save()
                print(f"Saved dog: {dog.name or 'Unnamed'} ({dog.animal_id})")
            except Exception as e:
                print(f"Error saving dog {row['animal_id']}: {e}")

if __name__ == '__main__':
    print("Loading data from CSV...")
    load_data()
    print("Data loading completed!") 
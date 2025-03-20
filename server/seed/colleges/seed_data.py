#!/usr/bin/env python
import os
import sys
import json
import traceback

from django.db.utils import DataError

# Add the project root to sys.path.
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.insert(0, project_root)

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
import django
django.setup()

from accounts.models import College, School, Department

def seed_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, "seed_colleges.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    college_count = 0
    for college_data in data.get("colleges", []):
        try:
            college, created = College.objects.get_or_create(
                name=college_data["name"],
                defaults={"code": college_data.get("code", "").upper()}
            )
            if created:
                college_count += 1
                print(f"{college_count}. Created College: {college.name}")
            else:
                print(f"{college_count + 1}. College already exists: {college.name}")
        except DataError as e:
            print(f"Error creating college {college_data['name']}: {e}")
            traceback.print_exc()
            continue
        
        for school_data in college_data.get("schools", []):
            try:
                school, created = School.objects.get_or_create(
                    name=school_data["name"],
                    college=college,
                    defaults={"code": school_data.get("code", "").upper()}
                )
                if created:
                    print(f"  Created School: {school.name}")
                else:
                    print(f"  School already exists: {school.name}")
            except DataError as e:
                print(f"Error creating school {school_data['name']} in college {college.name}: {e}")
                traceback.print_exc()
                continue
            
            for dept_data in school_data.get("departments", []):
                try:
                    dept, created = Department.objects.get_or_create(
                        name=dept_data["name"],
                        school=school,
                        defaults={"code": dept_data.get("code", "").upper()}
                    )
                    if created:
                        print(f"    Created Department: {dept.name}")
                    else:
                        print(f"    Department already exists: {dept.name}")
                except DataError as e:
                    print(f"Error creating department {dept_data['name']} in school {school.name}: {e}")
                    traceback.print_exc()
                    continue
    
    print("Seeding completed successfully.")

if __name__ == "__main__":
    seed_data()

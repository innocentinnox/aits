#!/usr/bin/env python
import os
import sys
import json
import glob
import traceback

from django.db.utils import DataError

# Add the project root to sys.path.
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.insert(0, project_root)

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
import django
django.setup()

from accounts.models import College, School, Department, Course, CourseUnit

def seed_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # First load the college structure (without courses)
    structure_path = os.path.join(base_dir, "colleges_structure.json")
    
    with open(structure_path, "r", encoding="utf-8") as f:
        structure = json.load(f)
    
    college_count = 0
    college_map = {}  # To store created colleges by code
    school_map = {}   # To store created schools by code
    dept_map = {}     # To store created departments by code
    
    # First create the college/school/department structure
    for college_data in structure.get("colleges", []):
        try:
            college, created = College.objects.get_or_create(
                name=college_data["name"],
                defaults={"code": college_data.get("code", "").upper()}
            )
            college_map[college.code] = college
            
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
                school_map[school.code] = school
                
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
                    dept_map[dept.code] = dept
                    
                    if created:
                        print(f"    Created Department: {dept.name}")
                    else:
                        print(f"    Department already exists: {dept.name}")
                except DataError as e:
                    print(f"Error creating department {dept_data['name']} in school {school.name}: {e}")
                    traceback.print_exc()
                    continue
    
    # Now load all the course files from the hierarchical courses directory structure
    courses_dir = os.path.join(base_dir, "courses")
    
    # Find all college directories
    college_dirs = [d for d in os.listdir(courses_dir) if os.path.isdir(os.path.join(courses_dir, d))]
    
    for college_code in college_dirs:
        college_path = os.path.join(courses_dir, college_code)
        
        # Find all school directories within the college
        school_dirs = [d for d in os.listdir(college_path) if os.path.isdir(os.path.join(college_path, d))]
        
        for school_code in school_dirs:
            school_path = os.path.join(college_path, school_code)
            
            # Find all course files within the school directory
            course_files = glob.glob(os.path.join(school_path, "*.json"))
            
            for course_file in course_files:
                try:
                    with open(course_file, "r", encoding="utf-8") as f:
                        dept_data = json.load(f)
                    
                    dept_code = dept_data.get("department_code")
                    
                    # Get the department object
                    if dept_code not in dept_map:
                        print(f"Warning: Department with code {dept_code} not found in structure. Skipping courses in file: {course_file}")
                        continue
                    
                    department = dept_map[dept_code]
                    school = department.school
                    
                    # Process courses for this department
                    for course_data in dept_data.get("courses", []):
                        try:
                            course, created = Course.objects.get_or_create(
                                code=course_data["code"],
                                defaults={
                                    "name": course_data["name"],
                                    "school": school,
                                    "department": department,
                                    "years": course_data.get("years", 3),
                                    "description": course_data.get("description", "")
                                }
                            )
                            if created:
                                print(f"      Created Course: {course.code} - {course.name}")
                            else:
                                print(f"      Course already exists: {course.code} - {course.name}")
                                
                                # Update the course with any new data
                                update_fields = []
                                if course.name != course_data["name"]:
                                    course.name = course_data["name"]
                                    update_fields.append("name")
                                if course.years != course_data.get("years", 3):
                                    course.years = course_data.get("years", 3)
                                    update_fields.append("years")
                                if course.description != course_data.get("description", ""):
                                    course.description = course_data.get("description", "")
                                    update_fields.append("description")
                                
                                if update_fields:
                                    course.save(update_fields=update_fields)
                                    print(f"        Updated course fields: {', '.join(update_fields)}")
                            
                            # Process course units for this course
                            for unit_data in course_data.get("course_units", []):
                                try:
                                    unit, created = CourseUnit.objects.get_or_create(
                                        code=unit_data["code"],
                                        course=course,
                                        defaults={
                                            "title": unit_data["title"],
                                            "description": unit_data.get("description", ""),
                                            "year_taken": unit_data.get("year_taken", 1),
                                            "semester": unit_data.get("semester", 1)
                                        }
                                    )
                                    if created:
                                        print(f"        Created Course Unit: {unit.code} - {unit.title}")
                                    else:
                                        print(f"        Course Unit already exists: {unit.code} - {unit.title}")
                                        
                                        # Update the course unit with any new data
                                        update_fields = []
                                        if unit.title != unit_data["title"]:
                                            unit.title = unit_data["title"]
                                            update_fields.append("title")
                                        if unit.description != unit_data.get("description", ""):
                                            unit.description = unit_data.get("description", "")
                                            update_fields.append("description")
                                        if unit.year_taken != unit_data.get("year_taken", 1):
                                            unit.year_taken = unit_data.get("year_taken", 1)
                                            update_fields.append("year_taken")
                                        if unit.semester != unit_data.get("semester", 1):
                                            unit.semester = unit_data.get("semester", 1)
                                            update_fields.append("semester")
                                        
                                        if update_fields:
                                            unit.save(update_fields=update_fields)
                                            print(f"          Updated course unit fields: {', '.join(update_fields)}")
                                            
                                except DataError as e:
                                    print(f"Error creating course unit {unit_data['code']} for course {course.code}: {e}")
                                    traceback.print_exc()
                                    continue
                                except Exception as e:
                                    print(f"Unexpected error creating course unit {unit_data['code']}: {e}")
                                    traceback.print_exc()
                                    continue
                                    
                        except DataError as e:
                            print(f"Error creating course {course_data['code']} for department {department.name}: {e}")
                            traceback.print_exc()
                            continue
                        except Exception as e:
                            print(f"Unexpected error creating course {course_data['code']}: {e}")
                            traceback.print_exc()
                            continue
                            
                except Exception as e:
                    print(f"Error processing course file {course_file}: {e}")
                    traceback.print_exc()
                    continue
    
    print("Seeding completed successfully.")

if __name__ == "__main__":
    seed_data()

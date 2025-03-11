#!/bin/bash

echo "Installing requirements.txt"
python3 -m pip install -r requirements.txt

echo "Collecting static files"
python3 manage.py collectstatic --noinput
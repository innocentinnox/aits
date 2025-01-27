# AITS (Acadmic Issue Tracking System)

## Prerequisites
- Python=>3.10

## Contributors
- Wangoda Francis
- Bwanika Robert
- Mujuni Innocent

## Project setup / Steps / Commands
In this module, we will be start our project. To do this we will need to create a virtual environment.
>Note: Python virtual env docs can be found [here](https://docs.python.org/3/tutorial/venv.html).

1) Virtual Environment - Open a terminal and use the following command to create a virtual environment. 
```
python -m venv venv
```
Now activate the virtual environment with the following command.
```
# windows machine
venv\Scripts\activate.bat

#mac/linux
source venv/bin/activate
```
You will know your virtual environment is active when your terminal displays the following:
```
(venv) path\to\project\aits>
```

2) Secrets and Environment Variables - It is good practice to separate sensitive information from your project. We have installed a package called 'python-dotenv' that helps us manage secrets easily. Lets go ahead and create a env file to store information that is specific to our working environment. Use the following command in your terminal.

```
# windows machine
copy env.template .env

#mac/linux
cp env.template .env
```

You can use your new .env file to store API keys, secret_keys, app_passwords and you will gain access to these in the Django app.
***
***

3) Packages and requirements - Our project will rely on a whole bunch of 3rd party packages (requirements) to function. We will be using a Python package manager to install packages throughout this course. 
I have already created a requirements.txt file. Check out AITS/requirements.txt
```
asgiref==3.5.2
Django==4.1.3
django-extensions==3.2.1
django-filter==22.1
djangorestframework==3.14.0
djangorestframework-jsonapi==6.0.0
inflection==0.5.1
python-dotenv==0.21.0
psycopg2==2.9.10
pytz==2022.6
sqlparse==0.4.3
tzdata==2022.6
```
Let's go ahead and install our project requirements. Add the following code to you terminal.

```
pip install -r requirements.txt
```
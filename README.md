# AITS (Academic Issue Tracking System)
 
## Prerequisites
- Python=>3.10

## Contributors
- Wangoda Francis `Team Lead and Backend`
- Bwanika Robert `Frontend`
- Mujuni Innocent `Backend and Frontend`
- Matsiko Ian Sezi `Backend`
- Kinda Kelsey Naluwafu `Frontend`
- Naluyima Pauline Oliver `Backend`

## Project setup / Steps / Commands
In this module, we will be starting our project. To do this we will need to create a virtual environment.
>Note: Python virtual env docs can be found [here](https://docs.python.org/3/tutorial/venv.html).

1) Virtual Environment - Open a terminal and use the following command to create a virtual environment. 
```
python -m venv venv
```

You will know your virtual environment is active when your terminal displays the following:
```
(venv) path\to\project\aits>
```

2) Secrets and Environment Variables - It is good practice to separate sensitive information from your project. We have installed a package called 'python-dotenv' that helps us manage secrets easily. Let's go ahead and create a env file to store information that is specific to our working environment. Use the following command in your terminal.

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
4)  
**I have already created a requirements.txt file. Check out AITS/server/requirements.txt**
```
Let's go ahead and install our project requirements. Add the following code to your terminal.
```
pip install -r requirements.txt
```

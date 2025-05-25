# Academic Issue Tracking System (AITS)

## Group N Team Members

| NAME                     | GitHub Username       | REG NUMBER      | STUD NUMBER  |
|--------------------------|-----------------------|-----------------|--------------|
| Wangoda Francis          | WangodaFrancis667     | 24/U/11855/PS   | 2400711855   |
| Mujuni Innocent          | innocentinnox         | 24/U/07155/PS   | 2400707155   |
| Bwanika Robert           | BwanikaRobert         | 24/U/23908/PSA  | 2400723908   |
| Kinda Kelsey Naluwafu    | kindakelsey           | 24/U/05862/PS   | 2400705862   |
| Matsiko Ian Sezi         | IANSEZI               | 22/U/3360/EVE   | 2200703360   |
| Naluyima Pauline Oliver  | Paul098ineOliver      | 24/U/08847/PS   | 2400708847   |

---

## 1. Overview & Objectives

**Purpose:** Centralize issue reporting, routing, and resolution for students by lecturers and registrars across COCIS, CESS, CHUSS and other colleges at Makerere University.

**Key Goals:**

1. Secure Authentication (JWT-based signup, login, email verification).  
2. Role-Based Access:  
   - **Students** raise issues.  
   - **Registrars** view/forward/resolve.  
   - **Lecturers** view/resolve within their college.  
3. Tokenized Tracking: Unique tokens per issue, full audit logs, email notifications.

---

## 2. Technologies & Architecture

- **Backend:** Django, Django REST Framework, PostgreSQL  
- **Frontend:** React, Axios, React Router, Tailwind-based CTk, TypeScript, Vue  
- **Deployment:** Docker on custom VPS  
- **CI/CD:** GitHub Actions auto-deploy on `main` commits  
- **Secrets:** Stored in GitHub Secrets (DB passwords, SMTP creds)

---

## 3. Key Features Implemented

- **Signup & Profile Update:** Email/username signup → complete profile with role & college.  
- **Issue Workflow:** Create → notify → registrar review → forward → resolve → notify.  
- **Audit Logging:** Model signals log create/update/delete in audit table.  
- **Notifications:** SMTP emails + browser toasts via React-Toastify.  
- **Filtering & Reporting:** DRF endpoints & dashboard charts for status/college filters.

---

## 4. Links & Credentials

- **GitHub Repo:** [https://github.com/innocentinnox/aits](https://github.com/innocentinnox/aits)  
- **Backend API:** [https://server.aits.ocunex.com/](https://server.aits.ocunex.com/)  
- **Frontend App:** [https://aits.ocunex.com/](https://aits.ocunex.com/)  

### Demo Credentials

### Email and password Password
### Student
```
student1234@students.mak.ac.ug
```
```
Student@1234
```










### Registrar:  
```
registrar567@mak.ac.ug
```
```
Registrar@1234
```

### Lecturer:  
```
lecturer899@cit.ac.ug
```
```
Lecturer@1234
```

---





## Prerequisites
- Python=>3.10
## Project setup / Steps / Commands
In this module, we will be starting our project. To do this we will need to create a virtual environment.
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



2) Packages and requirements - Our project will rely on a whole bunch of 3rd party packages (requirements) to function. We will be using a Python package manager to install packages throughout this course.
 
**I have already created a requirements.txt file. Check out AITS/server/requirements.txt**

Let's go ahead and install our project requirements. Add the following code to your terminal.
```
pip install -r requirements.txt
```

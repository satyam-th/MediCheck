# MediCheck
MediCheck is a web application that helps people check medicine availability at pharmacies across Kathmandu. Built as a Semester IV academic project at Malpi International College.

## About

MediCheck helps patients quickly find pharmacies that have their required medicines in stock, reducing time wasted visiting multiple outlets. Pharmacies update their own inventory through a dedicated portal.

## Portals

1. User portal
  - Search medicines
  - View nearby pharmacy stock
2. Pharmacy portal
  - Manage inventory
  - Update availability
3. Admin portal
  - Approve pharmacies
  - Manage platform data


## Tech stack

Layer                Technology
Frontend             HTML, CSS
Backend              Python
Database             MySQL
Auth                


## Installation

### Backend

git clone https://github.com/satyam-th/MediCheck.git
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


### Frontend

cd medicheck/frontend
npm install
npm start


## Team

Satyam Thapa
Samikshya Shrestha
Ugesh KC
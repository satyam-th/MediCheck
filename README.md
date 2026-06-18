MediCheck

MediCheck is a web-based platform designed to help users locate medicines available at pharmacies across Kathmandu. Developed as a Semester IV academic project at Malpi International College, the system aims to improve access to essential medicines by providing real-time pharmacy inventory information.

Overview

Finding a required medicine can often be time-consuming, especially when patients need to visit multiple pharmacies before locating it. MediCheck addresses this problem by allowing users to search for medicines and instantly view pharmacies where the medicine is currently available.

The platform also enables pharmacies to maintain and update their inventory, ensuring that stock information remains accurate and up to date.

Key Features

User Portal

* Search for medicines by name
* View medicine availability across registered pharmacies
* Locate nearby pharmacies with the required medicine in stock
* Access pharmacy details and location information

Pharmacy Portal

* Manage and update medicine inventory
* Add new medicines to stock records
* Modify availability and stock status in real time
* Monitor listed products efficiently

Admin Portal

* Review and approve pharmacy registrations
* Manage users and pharmacy accounts
* Monitor platform activity and maintain database integrity
* Oversee system-wide operations

Technology Stack

Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Python
Database	MySQL
Authentication	Secure User Authentication System

Installation Guide

Backend Setup

git clone https://github.com/satyam-th/MediCheck.git
cd MediCheck
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup

cd medicheck/frontend
npm install
npm start

Project Objective

The primary objective of MediCheck is to reduce the time and effort required to find essential medicines. By connecting users with pharmacies through a centralized platform, the system promotes convenience, accessibility, and efficient healthcare service delivery.

Development Team

* Satyam Thapa
* Samikshya Shrestha
* Ugesh KC

Malpi International College
Semester IV Project
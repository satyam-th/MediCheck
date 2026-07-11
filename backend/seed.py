import os
import sys
from datetime import date, timedelta, time
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from catalog.models import GlobalMedicine
from pharmacies.models import Pharmacy, LocalInventory, Sale, SaleItem, Patient, StaffAttendance

User = get_user_model()

print('Clearing existing data...')
SaleItem.objects.all().delete()
Sale.objects.all().delete()
StaffAttendance.objects.all().delete()
Patient.objects.all().delete()
LocalInventory.objects.all().delete()
Pharmacy.objects.all().delete()
GlobalMedicine.objects.all().delete()
User.objects.filter(
    email__in=['admin@medicheck.com', 'worker@medicheck.com', 'pharmacy@citymeds.com', 'ram@example.com']
).delete()

print('Creating users...')

super_admin = User.objects.create_superuser(
    email='admin@medicheck.com',
    username='superadmin',
    password='admin123',
    role='super_admin',
    first_name='Super',
    last_name='Admin',
)
print('  super_admin: admin@medicheck.com / admin123')

worker_admin = User.objects.create_user(
    email='worker@medicheck.com',
    username='workeradmin',
    password='admin123',
    role='worker_admin',
    first_name='Worker',
    last_name='Admin',
)
print('  worker_admin: worker@medicheck.com / admin123')

pharmacy_user = User.objects.create_user(
    email='pharmacy@citymeds.com',
    username='citypharmacy',
    password='pharm1234',
    role='pharmacy',
    first_name='City',
    last_name='Pharmacy',
    phone='+9779841234567',
)
print('  pharmacy: pharmacy@citymeds.com / pharm1234')

customer_user = User.objects.create_user(
    email='ram@example.com',
    username='ram123',
    password='customer123',
    role='customer',
    first_name='Ram',
    last_name='Sharma',
    phone='+9779876543210',
)
print('  customer: ram@example.com / customer123')

print('Creating pharmacy...')
pharmacy = Pharmacy.objects.create(
    user=pharmacy_user,
    name='City Meds Pharmacy',
    contact_number='+9779841234567',
    address='New Baneshwor, Kathmandu',
    latitude=27.6989,
    longitude=85.3245,
    status='active',
    license_number='DDA-2024-0042',
    open_time=time(8, 0),
    close_time=time(21, 0),
    low_stock_threshold=10,
    approved_by=super_admin,
)
print(f'  {pharmacy.name} (active)')

print('Creating medicines...')

medicines_data = [
    # --- Analgesics / Pain Relief ---
    {'name': 'Paracetamol 500mg', 'generic_name': 'Paracetamol', 'composition': 'Paracetamol 500mg', 'manufacturer': 'Cipla Ltd.', 'category': 'Analgesic', 'requires_prescription': False},
    {'name': 'Dolo 650mg', 'generic_name': 'Paracetamol', 'composition': 'Paracetamol 650mg', 'manufacturer': 'Micro Labs', 'category': 'Analgesic', 'requires_prescription': False},
    {'name': 'Crocin 500mg', 'generic_name': 'Paracetamol', 'composition': 'Paracetamol 500mg', 'manufacturer': 'GSK Consumer', 'category': 'Analgesic', 'requires_prescription': False},
    {'name': 'Ibuprofen 400mg', 'generic_name': 'Ibuprofen', 'composition': 'Ibuprofen 400mg', 'manufacturer': 'Sun Pharma', 'category': 'Analgesic', 'requires_prescription': False},
    {'name': 'Ibuprofen 200mg', 'generic_name': 'Ibuprofen', 'composition': 'Ibuprofen 200mg', 'manufacturer': 'Sun Pharma', 'category': 'Analgesic', 'requires_prescription': False},
    {'name': 'Combiflam', 'generic_name': 'Ibuprofen + Paracetamol', 'composition': 'Ibuprofen 400mg + Paracetamol 325mg', 'manufacturer': 'Sanofi', 'category': 'Analgesic', 'requires_prescription': False},
    {'name': 'Diclofenac 50mg', 'generic_name': 'Diclofenac Sodium', 'composition': 'Diclofenac Sodium 50mg', 'manufacturer': 'Novartis', 'category': 'Analgesic', 'requires_prescription': True},
    {'name': 'Mefenamic Acid 250mg', 'generic_name': 'Mefenamic Acid', 'composition': 'Mefenamic Acid 250mg', 'manufacturer': 'Parke-Davis', 'category': 'Analgesic', 'requires_prescription': True},
    {'name': 'Naproxen 250mg', 'generic_name': 'Naproxen', 'composition': 'Naproxen 250mg', 'manufacturer': 'Roche', 'category': 'Analgesic', 'requires_prescription': True},
    {'name': 'Tramadol 50mg', 'generic_name': 'Tramadol HCl', 'composition': 'Tramadol HCl 50mg', 'manufacturer': 'Zydus Cadila', 'category': 'Analgesic', 'requires_prescription': True},

    # --- Antibiotics ---
    {'name': 'Amoxicillin 250mg', 'generic_name': 'Amoxicillin', 'composition': 'Amoxicillin Trihydrate 250mg', 'manufacturer': 'GSK Pharmaceuticals', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Amoxicillin 500mg', 'generic_name': 'Amoxicillin', 'composition': 'Amoxicillin Trihydrate 500mg', 'manufacturer': 'GSK Pharmaceuticals', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Amoxiclav 625mg', 'generic_name': 'Amoxicillin + Clavulanic Acid', 'composition': 'Amoxicillin 500mg + Clavulanic Acid 125mg', 'manufacturer': 'GSK', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Amoxiclav 228mg', 'generic_name': 'Amoxicillin + Clavulanic Acid', 'composition': 'Amoxicillin 200mg + Clavulanic Acid 28.5mg', 'manufacturer': 'GSK', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Azithromycin 250mg', 'generic_name': 'Azithromycin', 'composition': 'Azithromycin 250mg', 'manufacturer': 'Zydus Cadila', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Azithromycin 500mg', 'generic_name': 'Azithromycin', 'composition': 'Azithromycin 500mg', 'manufacturer': 'Zydus Cadila', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Ciprofloxacin 500mg', 'generic_name': 'Ciprofloxacin', 'composition': 'Ciprofloxacin 500mg', 'manufacturer': 'Bayer', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Ciprofloxacin Eye Drops', 'generic_name': 'Ciprofloxacin HCl', 'composition': 'Ciprofloxacin HCl 0.3% w/v', 'manufacturer': 'Alcon', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Doxycycline 100mg', 'generic_name': 'Doxycycline', 'composition': 'Doxycycline HCl 100mg', 'manufacturer': 'Pfizer', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Metronidazole 400mg', 'generic_name': 'Metronidazole', 'composition': 'Metronidazole 400mg', 'manufacturer': 'Abbott', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Norfloxacin 400mg', 'generic_name': 'Norfloxacin', 'composition': 'Norfloxacin 400mg', 'manufacturer': 'Cipla', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Ofloxacin 200mg', 'generic_name': 'Ofloxacin', 'composition': 'Ofloxacin 200mg', 'manufacturer': 'Dr. Reddy\'s', 'category': 'Antibiotic', 'requires_prescription': True},
    {'name': 'Cephalexin 500mg', 'generic_name': 'Cephalexin', 'composition': 'Cephalexin 500mg', 'manufacturer': 'Lupin', 'category': 'Antibiotic', 'requires_prescription': True},

    # --- Antihistamines / Allergy ---
    {'name': 'Cetirizine 10mg', 'generic_name': 'Cetirizine HCl', 'composition': 'Cetirizine HCl 10mg', 'manufacturer': 'Dr. Reddy\'s', 'category': 'Antihistamine', 'requires_prescription': False},
    {'name': 'Levocetirizine 5mg', 'generic_name': 'Levocetirizine', 'composition': 'Levocetirizine 5mg', 'manufacturer': 'Sun Pharma', 'category': 'Antihistamine', 'requires_prescription': False},
    {'name': 'Fexofenadine 120mg', 'generic_name': 'Fexofenadine HCl', 'composition': 'Fexofenadine HCl 120mg', 'manufacturer': 'Sanofi', 'category': 'Antihistamine', 'requires_prescription': False},
    {'name': 'Montelukast 10mg', 'generic_name': 'Montelukast Sodium', 'composition': 'Montelukast 10mg', 'manufacturer': 'Merck', 'category': 'Antihistamine', 'requires_prescription': True},
    {'name': 'Loratadine 10mg', 'generic_name': 'Loratadine', 'composition': 'Loratadine 10mg', 'manufacturer': 'Bayer', 'category': 'Antihistamine', 'requires_prescription': False},

    # --- Cardiovascular ---
    {'name': 'Amlodipine 5mg', 'generic_name': 'Amlodipine Besylate', 'composition': 'Amlodipine 5mg', 'manufacturer': 'Pfizer', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Amlodipine 10mg', 'generic_name': 'Amlodipine Besylate', 'composition': 'Amlodipine 10mg', 'manufacturer': 'Pfizer', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Losartan 25mg', 'generic_name': 'Losartan Potassium', 'composition': 'Losartan Potassium 25mg', 'manufacturer': 'Novartis', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Losartan 50mg', 'generic_name': 'Losartan Potassium', 'composition': 'Losartan Potassium 50mg', 'manufacturer': 'Novartis', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Telmisartan 40mg', 'generic_name': 'Telmisartan', 'composition': 'Telmisartan 40mg', 'manufacturer': 'Boehringer Ingelheim', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Metoprolol 50mg', 'generic_name': 'Metoprolol Tartrate', 'composition': 'Metoprolol Tartrate 50mg', 'manufacturer': 'AstraZeneca', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Atorvastatin 10mg', 'generic_name': 'Atorvastatin Calcium', 'composition': 'Atorvastatin 10mg', 'manufacturer': 'Pfizer', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Atorvastatin 20mg', 'generic_name': 'Atorvastatin Calcium', 'composition': 'Atorvastatin 20mg', 'manufacturer': 'Pfizer', 'category': 'Antihypertensive', 'requires_prescription': True},
    {'name': 'Aspirin 75mg', 'generic_name': 'Aspirin', 'composition': 'Aspirin 75mg', 'manufacturer': 'Bayer', 'category': 'Antihypertensive', 'requires_prescription': False},
    {'name': 'Clopidogrel 75mg', 'generic_name': 'Clopidogrel Bisulfate', 'composition': 'Clopidogrel 75mg', 'manufacturer': 'Sanofi', 'category': 'Antihypertensive', 'requires_prescription': True},

    # --- Diabetes ---
    {'name': 'Metformin 500mg', 'generic_name': 'Metformin HCl', 'composition': 'Metformin HCl 500mg', 'manufacturer': 'Merck', 'category': 'Antidiabetic', 'requires_prescription': True},
    {'name': 'Metformin 850mg', 'generic_name': 'Metformin HCl', 'composition': 'Metformin HCl 850mg', 'manufacturer': 'Merck', 'category': 'Antidiabetic', 'requires_prescription': True},
    {'name': 'Glimepiride 2mg', 'generic_name': 'Glimepiride', 'composition': 'Glimepiride 2mg', 'manufacturer': 'Sanofi', 'category': 'Antidiabetic', 'requires_prescription': True},
    {'name': 'Glipizide 5mg', 'generic_name': 'Glipizide', 'composition': 'Glipizide 5mg', 'manufacturer': 'Pfizer', 'category': 'Antidiabetic', 'requires_prescription': True},
    {'name': 'Insulin Mixtard 30/70', 'generic_name': 'Insulin Isophane', 'composition': 'Soluble Insulin 30% + Isophane 70% (40 IU/ml)', 'manufacturer': 'Novo Nordisk', 'category': 'Antidiabetic', 'requires_prescription': True},
    {'name': 'Sitagliptin 100mg', 'generic_name': 'Sitagliptin Phosphate', 'composition': 'Sitagliptin 100mg', 'manufacturer': 'Merck', 'category': 'Antidiabetic', 'requires_prescription': True},

    # --- GI / Digestive ---
    {'name': 'Omeprazole 20mg', 'generic_name': 'Omeprazole', 'composition': 'Omeprazole 20mg', 'manufacturer': 'AstraZeneca', 'category': 'PPI', 'requires_prescription': False},
    {'name': 'Pantoprazole 40mg', 'generic_name': 'Pantoprazole Sodium', 'composition': 'Pantoprazole 40mg', 'manufacturer': 'Pfizer', 'category': 'PPI', 'requires_prescription': False},
    {'name': 'Ranitidine 150mg', 'generic_name': 'Ranitidine HCl', 'composition': 'Ranitidine HCl 150mg', 'manufacturer': 'GSK', 'category': 'Antacid', 'requires_prescription': False},
    {'name': 'Domperidone 10mg', 'generic_name': 'Domperidone', 'composition': 'Domperidone 10mg', 'manufacturer': 'Janssen', 'category': 'Antiemetic', 'requires_prescription': False},
    {'name': 'Ondansetron 4mg', 'generic_name': 'Ondansetron', 'composition': 'Ondansetron 4mg', 'manufacturer': 'Cipla', 'category': 'Antiemetic', 'requires_prescription': True},
    {'name': 'Loperamide 2mg', 'generic_name': 'Loperamide HCl', 'composition': 'Loperamide HCl 2mg', 'manufacturer': 'Janssen', 'category': 'Antidiarrheal', 'requires_prescription': False},

    # --- Respiratory ---
    {'name': 'Salbutamol 100mcg Inhaler', 'generic_name': 'Salbutamol Sulfate', 'composition': 'Salbutamol 100mcg/puff', 'manufacturer': 'Cipla', 'category': 'Respiratory', 'requires_prescription': True},
    {'name': 'Budesonide 200mcg Inhaler', 'generic_name': 'Budesonide', 'composition': 'Budesonide 200mcg/puff', 'manufacturer': 'AstraZeneca', 'category': 'Respiratory', 'requires_prescription': True},
    {'name': 'Montelukast 4mg Chewable', 'generic_name': 'Montelukast Sodium', 'composition': 'Montelukast 4mg', 'manufacturer': 'Merck', 'category': 'Respiratory', 'requires_prescription': True},
    {'name': 'Dextromethorphan Syrup', 'generic_name': 'Dextromethorphan HBr', 'composition': 'Dextromethorphan HBr 15mg/5ml', 'manufacturer': 'Pfizer', 'category': 'Respiratory', 'requires_prescription': False},
    {'name': 'Ambroxol 30mg', 'generic_name': 'Ambroxol HCl', 'composition': 'Ambroxol HCl 30mg', 'manufacturer': 'Boehringer Ingelheim', 'category': 'Respiratory', 'requires_prescription': False},

    # --- Supplements ---
    {'name': 'Vitamin D3 60K IU', 'generic_name': 'Cholecalciferol', 'composition': 'Cholecalciferol 60000 IU', 'manufacturer': 'Abbott', 'category': 'Supplement', 'requires_prescription': False},
    {'name': 'Vitamin B12 1500mcg', 'generic_name': 'Methylcobalamin', 'composition': 'Methylcobalamin 1500mcg', 'manufacturer': 'Sun Pharma', 'category': 'Supplement', 'requires_prescription': False},
    {'name': 'Vitamin C 500mg', 'generic_name': 'Ascorbic Acid', 'composition': 'Ascorbic Acid 500mg', 'manufacturer': 'Cipla', 'category': 'Supplement', 'requires_prescription': False},
    {'name': 'Calcium + D3 Tablet', 'generic_name': 'Calcium Carbonate + Cholecalciferol', 'composition': 'Calcium 500mg + Vitamin D3 400IU', 'manufacturer': 'Abbott', 'category': 'Supplement', 'requires_prescription': False},
    {'name': 'Iron Folic Acid Tablet', 'generic_name': 'Ferrous Sulfate + Folic Acid', 'composition': 'Ferrous Sulfate 100mg + Folic Acid 5mg', 'manufacturer': 'Cipla', 'category': 'Supplement', 'requires_prescription': False},
    {'name': 'Zinc Sulfate 20mg', 'generic_name': 'Zinc Sulfate', 'composition': 'Zinc Sulfate Monohydrate 20mg', 'manufacturer': 'Dr. Reddy\'s', 'category': 'Supplement', 'requires_prescription': False},
    {'name': 'Multivitamin Tablet', 'generic_name': 'Multivitamins + Minerals', 'composition': '13 Vitamins + 9 Minerals', 'manufacturer': 'Abbott', 'category': 'Supplement', 'requires_prescription': False},

    # --- Psychiatric / Neurological ---
    {'name': 'Alprazolam 0.25mg', 'generic_name': 'Alprazolam', 'composition': 'Alprazolam 0.25mg', 'manufacturer': 'Pfizer', 'category': 'CNS', 'requires_prescription': True},
    {'name': 'Alprazolam 0.5mg', 'generic_name': 'Alprazolam', 'composition': 'Alprazolam 0.5mg', 'manufacturer': 'Pfizer', 'category': 'CNS', 'requires_prescription': True},
    {'name': 'Diazepam 5mg', 'generic_name': 'Diazepam', 'composition': 'Diazepam 5mg', 'manufacturer': 'Roche', 'category': 'CNS', 'requires_prescription': True},
    {'name': 'Clonazepam 0.5mg', 'generic_name': 'Clonazepam', 'composition': 'Clonazepam 0.5mg', 'manufacturer': 'Roche', 'category': 'CNS', 'requires_prescription': True},
    {'name': 'Fluoxetine 20mg', 'generic_name': 'Fluoxetine HCl', 'composition': 'Fluoxetine HCl 20mg', 'manufacturer': 'Eli Lilly', 'category': 'CNS', 'requires_prescription': True},
    {'name': 'Sertraline 50mg', 'generic_name': 'Sertraline HCl', 'composition': 'Sertraline 50mg', 'manufacturer': 'Pfizer', 'category': 'CNS', 'requires_prescription': True},

    # --- Topical / Dermatology ---
    {'name': 'Clotrimazole Cream', 'generic_name': 'Clotrimazole', 'composition': 'Clotrimazole 1% w/w', 'manufacturer': 'Bayer', 'category': 'Topical', 'requires_prescription': False},
    {'name': 'Miconazole Cream', 'generic_name': 'Miconazole Nitrate', 'composition': 'Miconazole Nitrate 2% w/w', 'manufacturer': 'Johnson & Johnson', 'category': 'Topical', 'requires_prescription': False},
    {'name': 'Hydrocortisone 1% Cream', 'generic_name': 'Hydrocortisone', 'composition': 'Hydrocortisone 1% w/w', 'manufacturer': 'Pfizer', 'category': 'Topical', 'requires_prescription': False},
    {'name': 'Betamethasone 0.05% Cream', 'generic_name': 'Betamethasone Valerate', 'composition': 'Betamethasone Valerate 0.05% w/w', 'manufacturer': 'GSK', 'category': 'Topical', 'requires_prescription': True},
    {'name': 'Silver Sulfadiazine Cream', 'generic_name': 'Silver Sulfadiazine', 'composition': 'Silver Sulfadiazine 1% w/w', 'manufacturer': 'Johnson & Johnson', 'category': 'Topical', 'requires_prescription': True},

    # --- Eye / Ear ---
    {'name': 'Tobramycin Eye Drops', 'generic_name': 'Tobramycin', 'composition': 'Tobramycin 0.3% w/v', 'manufacturer': 'Alcon', 'category': 'Eye', 'requires_prescription': True},
    {'name': 'Moxifloxacin Eye Drops', 'generic_name': 'Moxifloxacin HCl', 'composition': 'Moxifloxacin HCl 0.5% w/v', 'manufacturer': 'Alcon', 'category': 'Eye', 'requires_prescription': True},
    {'name': 'Sodium Cromoglycate Eye Drops', 'generic_name': 'Sodium Cromoglycate', 'composition': 'Sodium Cromoglycate 2% w/v', 'manufacturer': 'Novartis', 'category': 'Eye', 'requires_prescription': False},

    # --- Other ---
    {'name': 'Prednisolone 5mg', 'generic_name': 'Prednisolone', 'composition': 'Prednisolone 5mg', 'manufacturer': 'Pfizer', 'category': 'Steroid', 'requires_prescription': True},
    {'name': 'Dexamethasone 0.5mg', 'generic_name': 'Dexamethasone', 'composition': 'Dexamethasone 0.5mg', 'manufacturer': 'Merck', 'category': 'Steroid', 'requires_prescription': True},
    {'name': 'Furosemide 40mg', 'generic_name': 'Furosemide', 'composition': 'Furosemide 40mg', 'manufacturer': 'Sanofi', 'category': 'Diuretic', 'requires_prescription': True},
    {'name': 'Warfarin 5mg', 'generic_name': 'Warfarin Sodium', 'composition': 'Warfarin Sodium 5mg', 'manufacturer': 'Bristol-Myers', 'category': 'Anticoagulant', 'requires_prescription': True},
    {'name': 'Sildenafil 50mg', 'generic_name': 'Sildenafil Citrate', 'composition': 'Sildenafil Citrate 50mg', 'manufacturer': 'Pfizer', 'category': 'Other', 'requires_prescription': True},
    {'name': 'Tamsulosin 0.4mg', 'generic_name': 'Tamsulosin HCl', 'composition': 'Tamsulosin HCl 0.4mg', 'manufacturer': 'Boehringer Ingelheim', 'category': 'Other', 'requires_prescription': True},
    {'name': 'ORF-1 (ORS Pack)', 'generic_name': 'Oral Rehydration Salts', 'composition': 'Sodium Chloride + Glucose + Potassium', 'manufacturer': 'Unicef', 'category': 'Other', 'requires_prescription': False},
]

medicines = []
for m in medicines_data:
    med = GlobalMedicine.objects.create(
        **m,
        approval_status='approved',
        submitted_by=worker_admin,
        approved_by=super_admin,
    )
    medicines.append(med)
    print(f'  {med.name}')

print('Creating inventory...')

from random import randint, choice

mrp_map = {
    'Analgesic':        (20, 120),
    'Antibiotic':       (40, 250),
    'Antihistamine':    (25, 180),
    'Antihypertensive': (30, 200),
    'Antidiabetic':     (40, 350),
    'PPI':              (50, 150),
    'Antacid':          (15, 60),
    'Antiemetic':       (20, 80),
    'Antidiarrheal':    (25, 50),
    'Respiratory':      (100, 500),
    'Supplement':       (30, 250),
    'CNS':              (40, 200),
    'Topical':          (40, 150),
    'Eye':              (60, 200),
    'Steroid':          (20, 100),
    'Diuretic':         (25, 80),
    'Anticoagulant':    (50, 150),
    'Other':            (10, 200),
}

batch_prefixes = [
    'BCH', 'LOT', 'BT', 'MAN', 'BAT', 'SER', 'PROD', 'MFG',
]

inventory_items = []
for i, med in enumerate(medicines):
    if i % 3 == 0 and i > 0:
        continue
    low, high = mrp_map.get(med.category, (30, 150))
    mrp = Decimal(str(randint(low, high - 1))) + Decimal('00')
    quantity_choices = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 100]
    qty = choice(quantity_choices)
    item = LocalInventory.objects.create(
        pharmacy=pharmacy,
        medicine=med,
        quantity=qty,
        mrp=mrp,
        batch_number=f'{choice(batch_prefixes)}-{randint(2401, 2420)}',
        expiry_date=date(2026 + choice([0, 1, 2]), randint(1, 12), randint(1, 28)),
    )
    inventory_items.append(item)
    qty_display = f"qty: {item.quantity}" if item.quantity > 0 else "OUT OF STOCK"
    print(f'  {item.medicine.name} — {qty_display}, MRP: Rs.{item.mrp}')

print('Creating patients...')
patients_data = [
    {'name': 'Sita Sharma', 'phone': '+9779812345678', 'address': 'Baneshwor, Kathmandu', 'outstanding_credit': Decimal('0.00')},
    {'name': 'Hari Bahadur', 'phone': '+9779845678901', 'address': 'Koteshwor, Kathmandu', 'outstanding_credit': Decimal('450.00')},
    {'name': 'Gita Adhikari', 'phone': '+9779865432109', 'address': 'New Baneshwor, Kathmandu', 'outstanding_credit': Decimal('0.00')},
]
patients = []
for p in patients_data:
    patient = Patient.objects.create(pharmacy=pharmacy, **p)
    patients.append(patient)
    print(f'  {patient.name}')

print('Creating sales...')
now = timezone.now()
today = now.replace(hour=0, minute=0, second=0, microsecond=0)

sales_data = [
    {
        'patient_name': 'Sita Sharma',
        'items': [
            {'inventory': inventory_items[0], 'quantity': 2, 'unit_price': Decimal('30.00')},
            {'inventory': inventory_items[2], 'quantity': 1, 'unit_price': Decimal('25.00')},
        ],
        'hours_ago': 1,
    },
    {
        'patient_name': 'Hari Bahadur',
        'items': [
            {'inventory': inventory_items[1], 'quantity': 1, 'unit_price': Decimal('85.00')},
        ],
        'is_credit': True,
        'hours_ago': 3,
    },
    {
        'patient_name': 'Walk-in',
        'items': [
            {'inventory': inventory_items[3], 'quantity': 1, 'unit_price': Decimal('35.00')},
            {'inventory': inventory_items[11], 'quantity': 1, 'unit_price': Decimal('40.00')},
        ],
        'hours_ago': 5,
    },
]

for sd in sales_data:
    items_data = sd.pop('items')
    hours_ago = sd.pop('hours_ago')
    created_at = now - timedelta(hours=hours_ago)

    total = Decimal('0.00')
    sale = Sale.objects.create(
        pharmacy=pharmacy,
        created_by=pharmacy_user,
        **sd,
        total_amount=0,
    )
    Sale.objects.filter(id=sale.id).update(created_at=created_at)

    for item_data in items_data:
        inv = item_data['inventory']
        sale_item = SaleItem.objects.create(
            sale=sale,
            inventory=inv,
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
        )
        total += sale_item.subtotal

    Sale.objects.filter(id=sale.id).update(total_amount=total)
    print(f'  Sale #{sale.id} — Rs.{total} — {sale.patient_name}')

print('Creating attendance...')
today_date = date.today()
StaffAttendance.objects.create(
    pharmacy=pharmacy,
    staff_member=pharmacy_user,
    date=today_date,
    status='present',
)
print(f'  Attendance marked for {pharmacy_user.get_full_name()}')

print()
print('=' * 50)
print('Seed complete!')
print('=' * 50)
print()
print('Demo accounts:')
print('  Super Admin:   admin@medicheck.com / admin123')
print('  Worker Admin:  worker@medicheck.com / admin123')
print('  Pharmacy:      pharmacy@citymeds.com / pharm1234')
print('  Customer:      ram@example.com / customer123')
print()
print('Pharmacy: City Meds Pharmacy (active, Baneshwor)')
print(f'Medicines: {GlobalMedicine.objects.count()} created, {LocalInventory.objects.count()} in stock')
print(f'Sales: {Sale.objects.count()} recorded')

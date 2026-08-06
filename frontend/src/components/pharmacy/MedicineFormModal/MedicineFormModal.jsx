import styles from './MedicineFormModal.module.css';
import { useState, useEffect } from 'react';
import Modal from '../../ui/Modal/Modal';
import api from '../../../services/api';

export default function MedicineFormModal({isOpen, onClose, onSubmit, initialData}){
    if (!isOpen) return null;

    return(
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit medicine' : 'Add medicine'}>
            <MedicineFormContent onClose={onClose} onSubmit={onSubmit} initialData={initialData} />
        </Modal>
    );
}

function MedicineFormContent({onClose, onSubmit, initialData}){
    const isEdit = !!initialData;

    const [medicineName, setMedicineName] = useState(initialData?.medicine_name || '');
    const [selectedMedicineId, setSelectedMedicineId] = useState(initialData?.medicine || null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searching, setSearching] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);

    const [genericName, setGenericName] = useState(initialData?.generic_name || '');
    const [genericList, setGenericList] = useState([]);
    const [showGenericSuggestions, setShowGenericSuggestions] = useState(false);
    const [genericHighlight, setGenericHighlight] = useState(0);

    const [category, setCategory] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

    const [quantity, setQuantity] = useState(initialData?.quantity ?? '');
    const [mrp, setMrp] = useState(initialData?.mrp ?? '');
    const [batchno, setBatchno] = useState(initialData?.batch_number || '');
    const [expiryDate, setExpiryDate] = useState(initialData?.expiry_date || '');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let active = true;
        Promise.all([
            api.get('/pharmacy/catalog/categories/'),
            api.get('/pharmacy/catalog/generic-names/'),
        ])
            .then(([catRes, genRes]) => {
                if (!active) return;
                setCategoryList(catRes.data || []);
                setGenericList(genRes.data || []);
            })
            .catch(() => {});
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (isEdit) return;

        let stale = false;
        const timer = setTimeout(async () => {
            const q = medicineName.trim();
            if (q.length < 1) {
                setSuggestions([]);
                setSearching(false);
                setShowSuggestions(false);
                return;
            }

            setSearching(true);
            try {
                const res = await api.get('/pharmacy/catalog/', { params: { q } });
                if (!stale) setSuggestions(res.data.results || res.data || []);
            } catch {
                if (!stale) setSuggestions([]);
            } finally {
                if (!stale) setSearching(false);
            }
        }, 250);

        return () => {
            stale = true;
            clearTimeout(timer);
        };
    }, [isEdit, medicineName]);

    function handlePickMedicine(med){
        setSelectedMedicineId(med.id);
        setMedicineName(med.name);
        setGenericName(med.generic_name || '');
        if (med.category) setCategory(med.category);
        setShowSuggestions(false);
        setHighlightIndex(0);
        setErrors((prev) => ({ ...prev, medicine: '' }));
    }

    function handleNameChange(e){
        setMedicineName(e.target.value);
        setSelectedMedicineId(null);
        setHighlightIndex(0);
        setShowSuggestions(true);
        setErrors((prev) => ({ ...prev, medicine: '' }));
    }

    function handleNameKeyDown(e){
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (showSuggestions && suggestions.length > 0) {
                e.preventDefault();
                handlePickMedicine(suggestions[highlightIndex]);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }

    const filteredGenerics = genericName.trim()
        ? genericList.filter((g) => g.toLowerCase().includes(genericName.trim().toLowerCase())).slice(0, 8)
        : genericList.slice(0, 8);

    function handlePickGeneric(name){
        setGenericName(name);
        setShowGenericSuggestions(false);
        setGenericHighlight(0);
    }

    function handleGenericKeyDown(e){
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setGenericHighlight((prev) => Math.min(prev + 1, filteredGenerics.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setGenericHighlight((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (showGenericSuggestions && filteredGenerics.length > 0) {
                e.preventDefault();
                handlePickGeneric(filteredGenerics[genericHighlight]);
            }
        } else if (e.key === 'Escape') {
            setShowGenericSuggestions(false);
        }
    }

    const filteredCategories = category.trim()
        ? categoryList.filter((c) => c.toLowerCase().includes(category.trim().toLowerCase())).slice(0, 8)
        : categoryList.slice(0, 8);

    function validate(){
        const newErrors = {};

        if (!medicineName.trim()) newErrors.medicine = 'Medicine name is required';
        if (quantity === '' || Number(quantity) < 0) newErrors.quantity = 'Enter a valid quantity';
        if (mrp === '' || Number(mrp) <= 0) newErrors.mrp = 'Enter a valid MRP';
        if (!batchno.trim()) newErrors.batchno = 'Batch number is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(){
        if (!validate()) return;

        const payload = {
            id: initialData?.id ?? null,
            quantity: Number(quantity),
            mrp: Number(mrp),
            batch_number: batchno,
            expiry_date: expiryDate,
        };

        if (isEdit) {
            payload.medicine = initialData.medicine;
        } else {
            const exactMatch = suggestions.find(
                (s) => s.name.trim().toLowerCase() === medicineName.trim().toLowerCase()
            );
            const medId = selectedMedicineId || exactMatch?.id;

            if (medId) {
                payload.medicine = Number(medId);
            } else {
                payload.new_medicine_name = medicineName.trim();
                payload.new_generic_name = genericName.trim();
                payload.new_category = category.trim();
            }
        }

        onSubmit(payload);
    }

    return(
        <>
            <div className={styles.field}>
                <label htmlFor='medicineName'>Medicine Name *</label>
                <div className={styles.autocomplete}>
                    <input
                        id='medicineName'
                        type="text"
                        placeholder="Type medicine name..."
                        value={medicineName}
                        onChange={handleNameChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onKeyDown={handleNameKeyDown}
                        readOnly={isEdit}
                        className={isEdit ? styles.readonly : ''}
                    />
                    {!isEdit && showSuggestions && medicineName.trim() && (
                        <ul className={styles.suggestionList}>
                            {searching && suggestions.length === 0 ? (
                                <li className={styles.suggestionEmpty}>Searching...</li>
                            ) : suggestions.length === 0 ? (
                                <li className={styles.suggestionEmpty}>No matches — will be added as a new medicine</li>
                            ) : (
                                suggestions.slice(0, 8).map((med, idx) => (
                                    <li
                                        key={med.id}
                                        className={idx === highlightIndex ? styles.suggestionActive : ''}
                                        onMouseDown={() => handlePickMedicine(med)}
                                        onMouseEnter={() => setHighlightIndex(idx)}
                                    >
                                        <span className={styles.suggestionName}>{med.name}</span>
                                        {med.generic_name && <span className={styles.suggestionMeta}>{med.generic_name}</span>}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
                {errors.medicine && <span className={styles.errorText}>{errors.medicine}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='genericName'>Generic Name</label>
                <div className={styles.autocomplete}>
                    <input
                        id='genericName'
                        type="text"
                        placeholder="Type generic name..."
                        value={genericName}
                        onChange={(e) => { setGenericName(e.target.value); setShowGenericSuggestions(true); setGenericHighlight(0); }}
                        onFocus={() => setShowGenericSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowGenericSuggestions(false), 150)}
                        onKeyDown={handleGenericKeyDown}
                        readOnly={isEdit}
                        className={isEdit ? styles.readonly : ''}
                    />
                    {!isEdit && showGenericSuggestions && filteredGenerics.length > 0 && (
                        <ul className={styles.suggestionList}>
                            {filteredGenerics.map((g, idx) => (
                                <li
                                    key={g}
                                    className={idx === genericHighlight ? styles.suggestionActive : ''}
                                    onMouseDown={() => handlePickGeneric(g)}
                                    onMouseEnter={() => setGenericHighlight(idx)}
                                >
                                    <span className={styles.suggestionName}>{g}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {!isEdit && (
                <div className={styles.field}>
                    <label htmlFor='category'>Category</label>
                    <div className={styles.autocomplete}>
                        <input
                            id='category'
                            type="text"
                            placeholder="Type category..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            onFocus={() => setShowCategorySuggestions(true)}
                            onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                        />
                        {showCategorySuggestions && filteredCategories.length > 0 && (
                            <ul className={styles.suggestionList}>
                                {filteredCategories.map((c) => (
                                    <li key={c} onMouseDown={() => { setCategory(c); setShowCategorySuggestions(false); }}>
                                        <span className={styles.suggestionName}>{c}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.field}>
                <label htmlFor='quantity'>Quantity</label>
                <input id='quantity' type="number" value={quantity} onChange={(e) =>{ setQuantity(e.target.value); setErrors((prev) => ({ ...prev, quantity: '' }));}} />
                {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='mrp'>MRP</label>
                <input id='mrp' type="number" value={mrp} onChange={(e) =>{ setMrp(e.target.value); setErrors((prev) => ({ ...prev, mrp: '' }));}} />
                {errors.mrp && <span className={styles.errorText}>{errors.mrp}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='batchno'>Batch number</label>
                <input id='batchno' type="text" value={batchno} onChange={(e) => {setBatchno(e.target.value); setErrors((prev) => ({ ...prev, batchno: '' }));}} />
                {errors.batchno && <span className={styles.errorText}>{errors.batchno}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor='expiryDate'>Expiry date</label>
                <input id='expiryDate' type="date" value={expiryDate} onChange={(e) =>{ setExpiryDate(e.target.value); setErrors((prev) => ({ ...prev, expiryDate: '' }));}} />
                {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
            </div>

            <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmit}>{isEdit ? 'Update medicine' : 'Add medicine'}</button>
            </div>
        </>
    );
}

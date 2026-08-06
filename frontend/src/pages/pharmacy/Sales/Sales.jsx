import { useState, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

import styles from './Sales.module.css';

export default function Sales(){
  const { inventory, handleCompleteSale} = useOutletContext();

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qtyToAdd, setQtyToAdd] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const searchRef = useRef(null);

  // When inventory changes (after a sale), drop any selected id that no longer exists.
  const [prevInventory, setPrevInventory] = useState(inventory);
  if (prevInventory !== inventory) {
    setPrevInventory(inventory);
    if (selectedMedId && !inventory.some((m) => m.id === selectedMedId)) {
      setSelectedMedId('');
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);

  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return inventory;
    return inventory.filter(
      (m) =>
        (m.medicine_name || '').toLowerCase().includes(term) ||
        (m.generic_name || '').toLowerCase().includes(term)
    );
  }, [inventory, searchTerm]);

  function getAvailableStock(medId){
    const med = inventory.find((m) => m.id === medId);
    if(!med) return 0;
    const inCart = cart.find((c) => c.id === medId);
    return med.quantity - (inCart ? inCart.quantity : 0);
  }

  function handlePickMedicine(medId){
    setSelectedMedId(medId);
    setSearchTerm('');
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  function handleAddToCart(){
    const qty = Number(qtyToAdd);
    if(selectedMedId === '' || !qty || qty <= 0) return;

    const available = getAvailableStock(selectedMedId);
    if(qty > available){
      toast.error(`Only ${available} left in stock`);
      return;
    }

    const med = inventory.find((m) => m.id === selectedMedId);

    setCart((prev) => {
      const existing = prev.find((c) => c.id === selectedMedId);
      if(existing){
        return prev.map((c) => c.id === selectedMedId ? { ...c, quantity: c.quantity + qty } : c);
      }
      return [...prev, { id: med.id, name: med.medicine_name, mrp: med.mrp, quantity: qty }];
    });

    setSelectedMedId('');
    setQtyToAdd('1');
  }

    function handleRemoveFromCart(id){
        setCart((prev) => prev.filter((c) => c.id !== id));
    }

    async function onCompleteSale(){
      if(cart.length === 0 || submitting) return;

      setSubmitting(true);
      try {
        await handleCompleteSale(cart);
        setCart([]);
        toast.success('Sale completed!');
      } catch (err) {
        toast.error(err.message || 'Sale could not be completed.');
      } finally {
        setSubmitting(false);
      }
    }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sales</h1>
        <p className={styles.subtitle}>Record a new sale</p>
      </div>

      <div className={styles.addRow}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            ref={searchRef}
            type="text"
            className={styles.select}
            placeholder="Search medicine by typing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {selectedMedId === '' && searchTerm.trim() && (
            <div className={styles.dropdown}>
              {filteredInventory.length === 0 ? (
                <div className={styles.dropdownEmpty}>No medicines found</div>
              ) : (
                filteredInventory.map((med) => {
                  const available = getAvailableStock(med.id);
                  return (
                    <button
                      key={med.id}
                      type="button"
                      className={styles.dropdownItem}
                      disabled={available === 0}
                      onMouseDown={() => handlePickMedicine(med.id)}
                    >
                      <span>{med.medicine_name}</span>
                      <span className={styles.dropdownMeta}>
                        {med.generic_name ? `${med.generic_name} · ` : ''}{available} in stock
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {selectedMedId !== '' && (
          <span className={styles.selectedPill}>
            {inventory.find((m) => m.id === selectedMedId)?.medicine_name}
            <button
              className={styles.clearPick}
              onClick={() => { setSelectedMedId(''); setSearchTerm(''); }}
            >
              ✕
            </button>
          </span>
        )}

        <input
          type="number"
          min="1"
          className={styles.qtyInput}
          value={qtyToAdd}
          onChange={(e) => setQtyToAdd(e.target.value)}
        />

        <button className={styles.addBtn} onClick={handleAddToCart} disabled={!selectedMedId}>Add to Cart</button>
      </div>

      {/* cart display */}
      <div className={styles.cart}>
        {cart.length === 0 ? (
          <p className={styles.emptyCart}>Cart is empty</p>
        ) : (
        <>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {(item.mrp * item.quantity).toFixed(2)}</td>
                      <td>
                        <button className={styles.removeBtn} onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>Rs. {cartTotal.toFixed(2)}</span>
            </div>

            <button className={styles.completeBtn} onClick={onCompleteSale} disabled={submitting}>
              {submitting ? 'Completing...' : 'Complete Sale'}
            </button>
        </>
        )}
        </div>
    </div>
  );
}

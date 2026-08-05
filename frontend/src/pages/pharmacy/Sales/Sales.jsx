import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './Sales.module.css';

export default function Sales(){
  const { inventory, handleCompleteSale} = useOutletContext();

  const [cart, setCart] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qtyToAdd, setQtyToAdd] = useState('1');

  const cartTotal = cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);

  // how many of this medicine are still sellable, accounting for what's already in the cart
  function getAvailableStock(medId){
    const med = inventory.find((m) => m.id === medId);
    if(!med) return 0;
    const inCart = cart.find((c) => c.id === medId);
    return med.quantity - (inCart ? inCart.quantity : 0);
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
    return [...prev, { id: med.id, name: med.name, mrp: med.mrp, quantity: qty }];
  });

  setSelectedMedId('');
  setQtyToAdd('1');
  }

    function handleRemoveFromCart(id){
        setCart((prev) => prev.filter((c) => c.id !== id));
    }

    function onCompleteSale(){
      if(cart.length === 0) return;

      handleCompleteSale(cart);
      setCart([]);
      toast.success('Sale completed!');
    }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sales</h1>
        <p className={styles.subtitle}>Record a new sale</p>
      </div>

      <div className={styles.addRow}>
        <select
          className={styles.select}
          value={selectedMedId}
          onChange={(e) => setSelectedMedId(Number(e.target.value))}
        >
          <option value="">Select medicine</option>
          {inventory.map((med) => {
            const available = getAvailableStock(med.id);
                return (
                <option key={med.id} value={med.id} disabled={available === 0}>
                  {med.name} ({available} in stock)
                </option>
              );
            })}
        </select>

        <input
          type="number"
          min="1"
          className={styles.qtyInput}
          value={qtyToAdd}
          onChange={(e) => setQtyToAdd(e.target.value)}
        />

        <button className={styles.addBtn} onClick={handleAddToCart}>Add to Cart</button>
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

            <button className={styles.completeBtn} onClick={onCompleteSale}>Complete Sale</button>
        </>
        )}
        </div>
    </div>
  );
}
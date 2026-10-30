import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import mainImage from '../main_image.jpg';

const stoneTypes = [
  { name: '2 Stones', rate: 100 }, { name: '3 Stones', rate: 150 },
  { name: '4 Stones', rate: 200 }, { name: '5 Stones', rate: 250 },
  { name: '6 Stones', rate: 300 }, { name: '7 Stones', rate: 350 },
  { name: '8 Stones', rate: 400 }, { name: '9 Stones', rate: 450 },
  { name: '10 Stones', rate: 500 },
];
const money = (value) => `₹${value.toFixed(2)}`;
const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const initialRows = () => stoneTypes.map((stone) => ({ ...stone, qty: 0 }));

function App() {
  const [customer, setCustomer] = useState('Pandi');
  const [billNo, setBillNo] = useState('001');
  const [billDate, setBillDate] = useState(today);
  const [rows, setRows] = useState(initialRows);
  const [paid, setPaid] = useState('0');
  const [oldDebt, setOldDebt] = useState('0');
  const [error, setError] = useState('');

  const total = rows.reduce((sum, row) => sum + (Number(row.rate) || 0) * (Number(row.qty) || 0), 0);
  const payableTotal = total + (Number(oldDebt) || 0);
  const balance = payableTotal - (Number(paid) || 0);
  const status = balance > 0 ? 'Payment status: Balance due' : balance < 0 ? 'Payment status: Excess amount paid' : payableTotal === 0 ? 'Payment status: No order' : 'Payment status: Paid in full';

  function updateRow(index, key, value) {
    setRows((current) => current.map((row, i) => i === index ? { ...row, [key]: value } : row));
    setError('');
  }
  function calculateBill() {
    const invalidRow = rows.some((row) => row.rate === '' || row.qty === '' || !Number.isFinite(Number(row.rate)) || !Number.isFinite(Number(row.qty)) || Number(row.rate) < 0 || Number(row.qty) < 0);
    if (invalidRow) { setError('Enter a valid rate and quantity for every stone type.'); return null; }
    if (oldDebt === '' || !Number.isFinite(Number(oldDebt)) || Number(oldDebt) < 0) { setError('Enter a valid previous balance.'); return null; }
    if (paid === '' || !Number.isFinite(Number(paid)) || Number(paid) < 0) { setError('Enter a valid paid amount.'); return null; }
    setError('');
    return total;
  }
  function printBill() {
    const amount = calculateBill();
    if (amount === null) return;
    if (amount <= 0) { setError('Enter a stone quantity before printing the bill.'); return; }
    window.print();
  }
  function resetBill() {
    setCustomer('');
    setBillNo(String(Date.now()).slice(-6));
    setPaid('0');
    setOldDebt('0');
    setRows((current) => current.map((row) => ({ ...row, qty: 0 })));
    setError('');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-50 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 text-center">
          <img className="mx-auto h-36 w-full max-w-[250px] sm:h-40 rounded-xl border-[3px] border-[#245a87] object-cover" src={mainImage} alt="Stone Photo" />
        </div>
        <section className="rounded-xl bg-white p-4 shadow-lg sm:p-7">
          <h1 className="text-center text-xl leading-tight font-bold text-[#173d67] sm:text-3xl">🪨 PANDI STONE ENTERPRISES</h1>
          <h3 className="mb-6 mt-2 text-center text-lg font-semibold text-slate-700">கல் விற்பனை பில்</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">வாடிக்கையாளர் பெயர்
              <input className="field mt-1" type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </label>
            <label className="block text-sm font-medium text-slate-700">பில் எண்
              <input className="field mt-1" type="text" value={billNo} onChange={(e) => setBillNo(e.target.value)} />
            </label>
            <label className="block text-sm font-medium text-slate-700">தேதி
              <input className="field mt-1" type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
            </label>
          </div>
          <h2 className="mb-3 mt-7 text-xl font-bold text-[#245a87]">கல் விவரங்கள்</h2>
          <div className="overflow-x-auto">
            <table className="responsive-table w-full min-w-[600px] border-collapse text-center">
              <thead><tr className="bg-[#245a87] text-white"><th className="cell">வ.எண்</th><th className="cell">கல் வகை</th><th className="cell">விலை ₹</th><th className="cell">அளவு</th><th className="cell">தொகை ₹</th></tr></thead>
              <tbody>{rows.map((row, index) => <tr className="even:bg-[#eef4fa]" key={row.name}>
                <td className="cell" data-label="No.">{index + 1}</td><td className="cell" data-label="Stone type">{row.name}</td>
                <td className="cell" data-label="Rate"><input aria-label={`${row.name} rate`} className="number-field" type="number" min="0" step="0.01" value={row.rate} onChange={(e) => updateRow(index, 'rate', e.target.value)} /></td>
                <td className="cell" data-label="Quantity"><input aria-label={`${row.name} quantity`} className="number-field" type="number" min="0" step="1" value={row.qty} onChange={(e) => updateRow(index, 'qty', e.target.value)} /></td>
                <td className="cell" data-label="Amount">{money((Number(row.rate) || 0) * (Number(row.qty) || 0))}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="my-5 rounded-lg bg-[#edf5fc] p-4 text-left sm:p-5 sm:text-right">
            <p className="mb-4 text-lg">மொத்த தொகை: <strong className="text-[#173d67]">{money(total)}</strong></p>
            <label className="payment-input flex w-full flex-col gap-2 font-medium sm:ml-auto sm:max-w-sm sm:flex-row sm:items-center sm:justify-end sm:gap-3">பழைய பற்று:
              <input className="field w-full sm:max-w-40" type="number" min="0" step="0.01" value={oldDebt} onChange={(e) => { setOldDebt(e.target.value); setError(''); }} />
            </label>
            <label className="payment-input flex w-full flex-col gap-2 font-medium sm:ml-auto sm:max-w-sm sm:flex-row sm:items-center sm:justify-end sm:gap-3">செலுத்திய தொகை ₹:
              <input className="field w-full sm:max-w-40" type="number" min="0" value={paid} onChange={(e) => { setPaid(e.target.value); setError(''); }} />
            </label>
            <p className="mt-4 text-lg">மீதித் தொகை: <strong className="text-[#173d67]">{balance < 0 ? `${money(Math.abs(balance))} முன்பணம்` : money(balance)}</strong></p>
            <p className="mt-2 font-semibold" aria-live="polite">{status}</p>
          </div>
          {error && <p className="mb-3 text-right text-sm font-medium text-red-700" role="alert">{error}</p>}
          <div className="grid grid-cols-1 gap-2 print:hidden sm:flex sm:flex-wrap sm:justify-center">
            <button className="action" type="button" onClick={calculateBill}>கணக்கிடு</button>
            <button className="action" type="button" onClick={printBill}>பில் பிரிண்ட்</button>
            <button className="action" type="button" onClick={resetBill}>புதிய பில்</button>
          </div>
          <h3 className="mt-7 text-center text-lg font-semibold">நன்றி! மீண்டும் வருக!</h3>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);



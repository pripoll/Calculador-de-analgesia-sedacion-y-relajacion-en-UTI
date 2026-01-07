function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
window.onclick = function(event) { if (event.target.className === 'modal') { event.target.style.display = "none"; } }

function runAsrCalculation() {
    const sex = document.querySelector('input[name="sex"]:checked').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!height || !weight) {
        alert('DATA ERROR: Incomplete patient metrics.');
        return;
    }

    const imc = weight / Math.pow(height / 100, 2);
    let ibw = (sex === 'male') ? 50 + 0.91 * (height - 152.4) : 45.5 + 0.91 * (height - 152.4);
    const abw = ibw + 0.4 * (weight - ibw);

    const useCorrected = imc > 30;
    const wCorr = useCorrected ? abw : weight;
    const wTheo = useCorrected ? ibw : weight;

    const drugs = [
        { name: 'Morphine', dose: '1-6 mg/h', dil: '50 mg + 100 ml', conc: 0.5, w: 0 },
        { name: 'Fentanyl', dose: '0.7-2 mcg/kg/h', dil: '1.5 mg + 100 ml', conc: 15, w: wCorr },
        { name: 'Remifentanil', dose: '0.02-0.2 mcg/kg/min', dil: '10 mg + 100 ml', conc: 100, w: wTheo },
        { name: 'Midazolam', dose: '0.02-0.2 mg/kg/h', dil: '300 mg + 100 ml', conc: 3, w: wCorr },
        { name: 'Lorazepam', dose: '0.01-0.1 mg/kg/h', dil: '80 mg + 100 ml', conc: 0.8, w: wCorr },
        { name: 'Propofol', dose: '0.3-3 mg/kg/h', dil: '1000 mg (pure)', conc: 10, w: wCorr },
        { name: 'Dexmedetomidine', dose: '0.2-1.4 mcg/kg/h', dil: '400 mcg + 100 ml', conc: 4, w: wCorr },
        { name: 'Atracurium', dose: '5-20 mcg/kg/min', dil: '500 mg + 100 ml', conc: 5000, w: wTheo },
        { name: 'Vecuronium', dose: '0.8-1.4 mcg/kg/min', dil: '100 mg + 100 ml', conc: 1000, w: wTheo }
    ];

    let resultsHtml = `
        <div class="stat-box"><span class="stat-label">IMC:</span><strong>${imc.toFixed(1)} kg/m²</strong></div>
        <div class="stat-box"><span class="stat-label">IDEAL WEIGHT (IBW):</span><strong>${ibw.toFixed(1)} kg</strong></div>
        <table class="drug-table">
            <thead><tr><th>DRUG</th><th>DOSE</th><th>DILUTION</th><th>RATE (ml/h)</th></tr></thead>
            <tbody>`;

    drugs.forEach(d => {
        let low, high;
        const doseParts = d.dose.split(' ')[0].split('-').map(Number);
        if (d.w === 0) {
            low = doseParts[0] / d.conc;
            high = doseParts[1] / d.conc;
        } else if (d.dose.includes('min')) {
            low = (doseParts[0] * d.w * 60) / d.conc;
            high = (doseParts[1] * d.w * 60) / d.conc;
        } else {
            low = (doseParts[0] * d.w) / d.conc;
            high = (doseParts[1] * d.w) / d.conc;
        }
        resultsHtml += `<tr><td>${d.name}</td><td>${d.dose}</td><td>${d.dil}</td><td><strong>${low.toFixed(1)} - ${high.toFixed(1)}</strong></td></tr>`;
    });

    resultsHtml += `</tbody></table>`;
    document.getElementById('data-display').innerHTML = resultsHtml;
}

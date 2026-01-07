function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
window.onclick = function(e) { if (e.target.className === 'modal') { e.target.style.display = "none"; } }

function copyBiblio() {
    const text = document.getElementById('biblio-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Bibliografía copiada al portapapeles');
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function runAsrCalculation() {
    const sex = document.querySelector('input[name="sex"]:checked').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!height || !weight) {
        alert('ERROR: Ingrese altura y peso del paciente.');
        return;
    }

    const imc = weight / Math.pow(height / 100, 2);
    let ibw = (sex === 'male') ? 50 + 0.91 * (height - 152.4) : 45.5 + 0.91 * (height - 152.4);
    const abw = ibw + 0.4 * (weight - ibw);

    const isObese = imc > 30;
    const wCorr = isObese ? abw : weight;
    const wTheo = isObese ? ibw : weight;

    const drugs = [
        { n: 'Morfina', d: '1-6 mg/h', l: '50 mg + 100 ml', c: 0.5, w: 'none' },
        { n: 'Fentanilo', d: '0,7-2 mcg/kg/h', l: '1,5 mg + 100 ml', c: 15, w: 'corr' },
        { n: 'Remifentanilo', d: '0,02-0,2 mcg/kg/min', l: '10 mg + 100 ml', c: 100, w: 'theo' },
        { n: 'Midazolam', d: '0,02-0,2 mg/kg/h', l: '300 mg + 100 ml', c: 3, w: 'corr' },
        { n: 'Lorazepam', d: '0,01-0,1 mg/kg/h', l: '80 mg + 100 ml', c: 0.8, w: 'corr' },
        { n: 'Propofol', d: '0,3-3 mg/kg/h', l: '1000 mg sin diluir', c: 10, w: 'corr' },
        { n: 'Dexmedetomidina', d: '0,2-1,4 mcg/kg/h', l: '400 mcg + 100 ml', c: 4, w: 'actual' },
        { n: 'Atracurio', d: '5-20 mcg/kg/min', l: '500 mg + 100 ml', c: 5000, w: 'theo' },
        { n: 'Vecuronio', d: '0,8-1,4 mcg/kg/min', l: '100 mg + 100 ml', c: 1000, w: 'theo' }
    ];

    let html = `
        <div class="stat-container">
            <div class="stat-box"><span class="stat-label">PESO TEÓRICO (KG)</span><span class="stat-value">${ibw.toFixed(1)}</span></div>
            <div class="stat-box"><span class="stat-label">PESO CORREGIDO (KG)</span><span class="stat-value">${abw.toFixed(1)}</span></div>
            <div class="stat-box"><span class="stat-label">IMC (KG/M2)</span><span class="stat-value">${imc.toFixed(1)}</span></div>
        </div>
        <table class="drug-table">
            <thead><tr><th>Fármaco</th><th>Dosis</th><th>Dilución</th><th>Rango (ml/h)</th></tr></thead>
            <tbody>`;

    drugs.forEach(drug => {
        let low, high, calcWeight;
        const doseRange = drug.d.split(' ')[0].split('-').map(s => parseFloat(s.replace(',', '.')));
        
        switch(drug.w) {
            case 'corr': calcWeight = wCorr; break;
            case 'theo': calcWeight = wTheo; break;
            case 'actual': calcWeight = weight; break;
            default: calcWeight = 1; 
        }

        if (drug.w === 'none') {
            low = doseRange[0] / drug.c;
            high = doseRange[1] / drug.c;
        } else if (drug.d.includes('min')) {
            low = (doseRange[0] * calcWeight * 60) / drug.c;
            high = (doseRange[1] * calcWeight * 60) / drug.c;
        } else {
            low = (doseRange[0] * calcWeight) / drug.c;
            high = (doseRange[1] * calcWeight) / drug.c;
        }
        
        html += `<tr><td>${drug.n}</td><td>${drug.d}</td><td>${drug.l}</td><td><strong>${low.toFixed(1)} - ${high.toFixed(1)}</strong></td></tr>`;
    });

    html += `</tbody></table>`;
    document.getElementById('data-display').innerHTML = html;
}

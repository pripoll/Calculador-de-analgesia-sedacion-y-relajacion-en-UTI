function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }
window.onclick = function(e) { if (e.target.className === 'modal') { e.target.style.display = "none"; } }

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

    const useCorr = imc > 30;
    const wCorr = useCorr ? abw : weight;
    const wTheo = useCorr ? ibw : weight;

    const drugs = [
        { n: 'Morfina', d: '1-6 mg/h', l: '50 mg + 100 ml', c: 0.5, w: 0 },
        { n: 'Fentanilo', d: '0,7-2 mcg/kg/h', l: '1,5 mg + 100 ml', c: 15, w: wCorr },
        { n: 'Remifentanilo', d: '0,02-0,2 mcg/kg/min', l: '10 mg + 100 ml', c: 100, w: wTheo },
        { n: 'Midazolam', d: '0,02-0,2 mg/kg/h', l: '300 mg + 100 ml', c: 3, w: wCorr },
        { n: 'Lorazepam', d: '0,01-0,1 mg/kg/h', l: '80 mg + 100 ml', c: 0.8, w: wCorr },
        { n: 'Propofol', d: '0,3-3 mg/kg/h', l: '1000 mg sin diluir', c: 10, w: wCorr },
        { n: 'Dexmedetomidina', d: '0,2-1,4 mcg/kg/h', l: '400 mcg + 100 ml', c: 4, w: weight },
        { n: 'Atracurio', d: '5-20 mcg/kg/min', l: '500 mg + 100 ml', c: 5000, w: wTheo },
        { n: 'Vecuronio', d: '0,8-1,4 mcg/kg/min', l: '100 mg + 100 ml', c: 1000, w: wTheo }
    ];

    let html = `
        <div class="stat-container">
            <div class="stat-box"><span class="stat-label">PESO TEÓRICO</span><span class="stat-value">${ibw.toFixed(1)} kg</span></div>
            <div class="stat-box"><span class="stat-label">PESO CORREGIDO</span><span class="stat-value">${abw.toFixed(1)} kg</span></div>
            <div class="stat-box"><span class="stat-label">IMC</span><span class="stat-value">${imc.toFixed(1)} kg/m²</span></div>
        </div>
        <table class="drug-table">
            <thead><tr><th>FÁRMACO</th><th>DOSIS</th><th>DILUCIÓN</th><th>INFUSIÓN (ml/h)</th></tr></thead>
            <tbody>`;

    drugs.forEach(drug => {
        let l, h;
        const p = drug.d.split(' ')[0].split('-').map(s => parseFloat(s.replace(',', '.')));
        if (drug.w === 0) {
            l = p[0] / drug.c;
            h = p[1] / drug.c;
        } else if (drug.d.includes('min')) {
            l = (p[0] * drug.w * 60) / drug.c;
            h = (p[1] * drug.w * 60) / drug.c;
        } else {
            l = (p[0] * drug.w) / drug.c;
            h = (p[1] * drug.w) / drug.c;
        }
        html += `<tr><td>${drug.n}</td><td>${drug.d}</td><td>${drug.l}</td><td><strong>${l.toFixed(1)} - ${h.toFixed(1)}</strong></td></tr>`;
    });

    html += `</tbody></table>`;
    document.getElementById('data-display').innerHTML = html;
}

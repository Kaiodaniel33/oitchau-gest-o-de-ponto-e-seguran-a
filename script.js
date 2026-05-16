'use strict';

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAJY7pPpxurwbiIhjjDfsPh0NPyuO_vNi8",
    authDomain: "oitchauserv.firebaseapp.com",
    projectId: "oitchauserv",
    storageBucket: "oitchauserv.firebasestorage.app",
    messagingSenderId: "670263819451",
    appId: "1:670263819451:web:08addbf9f8c2b8d78dbd9e"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dbRef = database.ref('pontos');
const driversRef = database.ref('equipe');

// --- VARIÁVEIS GLOBAIS ---
let driverList = [];
let db = {}; 
let currentApprover = "";
let currentDateKey = "";
let selectedIndivCad = ""; 

// A lista padrão gigante foi ocultada para não poluir o código aqui.
// Como o Firebase já foi alimentado anteriormente, ele vai puxar do banco.
// Mas se precisar, o sistema cria um array vazio ou puxa do banco.
const defaultDriverList = [];

// --- SISTEMA DE LOGIN ---
function realizarLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');

    // Credenciais para a Expresso Nordeste
    if (user === 'admin' && pass === 'expresso') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        initApp(); // Inicia o carregamento dos dados apenas após o login
    } else {
        errorMsg.style.display = 'block';
    }
}

function sairSistema() {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// --- INICIALIZAÇÃO DO APP ---
function initApp() {
    const savedApprover = localStorage.getItem('approverName');
    if (savedApprover) {
        document.getElementById('approverName').value = savedApprover;
        currentApprover = savedApprover;
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datePicker').value = today;
    
    // CONEXÃO FIREBASE
    driversRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            driverList = data;
        } else {
            // Se o banco estiver vazio, usa a lista padrão e salva no banco.
            driverList = defaultDriverList;
            if(defaultDriverList.length > 0) driversRef.set(defaultDriverList);
        }
        sortDriverList();
        renderTable();
    });

    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        db = data || {};
        renderTable();
        updateStatus(true);
    }, (error) => {
        console.error(error);
        updateStatus(false);
    });

    loadDate();
}

function updateStatus(online) {
    const el = document.getElementById('connectionStatus');
    if (online) {
        el.innerHTML = '<i class="fas fa-check-circle"></i> Sincronizado ao Servidor';
        el.className = 'status-connection status-online';
    } else {
        el.innerHTML = '<i class="fas fa-times-circle"></i> Servidor Offline';
        el.className = 'status-connection status-offline';
    }
}

// --- LÓGICA PRINCIPAL ---
function saveConfig() {
    currentApprover = document.getElementById('approverName').value;
    localStorage.setItem('approverName', currentApprover);
}

function sortDriverList() {
    driverList.sort((a, b) => {
        if (a.b < b.b) return -1;
        if (a.b > b.b) return 1;
        return a.n.localeCompare(b.n);
    });
}

function loadDate() {
    currentDateKey = document.getElementById('datePicker').value;
    if (!currentDateKey) return;
    renderTable();
}

function renderTable() {
    const container = document.getElementById('tableContainer');
    if(!container) return;
    container.innerHTML = "";

    let countOK = 0;
    let countPending = 0;

    const groups = {};
    driverList.forEach(d => {
        if(!groups[d.b]) groups[d.b] = [];
        groups[d.b].push(d);
    });

    const dayRecords = db[currentDateKey] || {};
    const sortedBranches = Object.keys(groups).sort();

    for (const branch of sortedBranches) {
        const drivers = groups[branch];
        const block = document.createElement('div');
        block.className = 'branch-block';

        let html = `
            <div class="branch-head">
                <span class="branch-name"><i class="fas fa-map-marker-alt"></i> ${branch}</span>
                <button class="btn-branch-approve" onclick="approveBranch('${branch}')">
                    <i class="fas fa-check"></i> Aprovar Filial
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th width="10%">CAD</th>
                        <th width="25%">Nome</th>
                        <th width="15%">Status</th>
                        <th width="20%">Observação (Autorização)</th>
                        <th width="15%">Aprovador</th>
                        <th width="15%">Hora Ação</th>
                    </tr>
                </thead>
                <tbody>
        `;

        drivers.forEach(d => {
            const record = dayRecords[d.c]; 
            const status = record ? record.status : "Pendente";
            const obs = record ? record.obs : "";
            const approver = record ? record.approver : "-";
            const time = record ? record.time : "-";

            if (status === 'OK') countOK++;
            else countPending++;

            let badgeClass = status === 'OK' ? 'st-ok' : (status === 'Erro' ? 'st-erro' : 'st-pendente');
            let statusLabel = status === 'OK' ? 'Aprovado' : (status === 'Erro' ? 'Reprovado' : 'Pendente');

            html += `
                <tr>
                    <td><b>${d.c}</b></td>
                    <td>${d.n}</td>
                    <td>
                        <span class="status-badge ${badgeClass}" onclick="cycleStatus('${d.c}')">${statusLabel}</span>
                    </td>
                    <td>
                        <input type="text" class="obs-input" placeholder="Adicionar obs..." 
                        value="${obs}" onblur="saveObs('${d.c}', this.value)">
                    </td>
                    <td style="color:var(--brand); font-weight:600; font-size:12px;">${approver}</td>
                    <td style="font-size:12px; color:var(--text-muted);">${time}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        block.innerHTML = html;
        container.appendChild(block);
    }

    document.getElementById('count-ok').innerText = countOK;
    document.getElementById('count-pending').innerText = countPending;
    document.getElementById('count-total').innerText = driverList.length;
}

// --- FIREBASE ACTIONS ---
function cycleStatus(cad) {
    if (!currentApprover) { alert("Digite o nome de quem está aprovando no topo!"); return; }
    const currentRecord = (db[currentDateKey] && db[currentDateKey][cad]) ? db[currentDateKey][cad] : null;
    const currentStatus = currentRecord ? currentRecord.status : "Pendente";
    let next = "OK";
    
    if (currentStatus === "OK") next = "Erro";
    else if (currentStatus === "Erro") next = "Pendente";
    
    const path = `pontos/${currentDateKey}/${cad}`;
    if (next === "Pendente") database.ref(path).remove();
    else database.ref(path).set({ status: next, approver: currentApprover, time: new Date().toLocaleTimeString('pt-BR'), obs: currentRecord ? currentRecord.obs : "" });
}

function saveObs(cad, text) {
    const path = `pontos/${currentDateKey}/${cad}`;
    const currentRecord = (db[currentDateKey] && db[currentDateKey][cad]) ? db[currentDateKey][cad] : null;
    if (!currentRecord) database.ref(path).set({ status: "Pendente", approver: "-", time: "-", obs: text });
    else database.ref(path).update({ obs: text });
}

function approveBranch(branchName) {
    if (!currentApprover) { alert("Digite seu nome no topo!"); return; }
    if (!confirm(`Aprovar TODOS da filial ${branchName}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const updates = {};
    driverList.forEach(d => {
        if (d.b === branchName) {
            const currentObs = (db[currentDateKey] && db[currentDateKey][d.c]) ? db[currentDateKey][d.c].obs : "";
            updates[`pontos/${currentDateKey}/${d.c}`] = { status: "OK", approver: currentApprover, time: timeNow, obs: currentObs };
        }
    });
    database.ref().update(updates);
}

// --- AÇÕES EM MASSA (DIA) ---
function approveAllDaily() {
    if (!currentApprover) { alert("Digite seu nome no topo!"); return; }
    if (!confirm(`Aprovar TODOS para o dia ${currentDateKey}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const updates = {};
    driverList.forEach(d => {
        const currentObs = (db[currentDateKey] && db[currentDateKey][d.c]) ? db[currentDateKey][d.c].obs : "";
        updates[`pontos/${currentDateKey}/${d.c}`] = { status: "OK", approver: currentApprover, time: timeNow, obs: currentObs };
    });
    database.ref().update(updates);
}

function reproveAllDaily() {
    if (!currentApprover) { alert("Digite seu nome no topo!"); return; }
    if (!confirm(`REPROVAR TODOS para o dia ${currentDateKey}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const updates = {};
    driverList.forEach(d => {
        const currentObs = (db[currentDateKey] && db[currentDateKey][d.c]) ? db[currentDateKey][d.c].obs : "";
        updates[`pontos/${currentDateKey}/${d.c}`] = { status: "Erro", approver: currentApprover, time: timeNow, obs: currentObs };
    });
    database.ref().update(updates);
}

function cancelAllDaily() {
    if (!confirm(`ATENÇÃO: Isso vai LIMPAR (Desfazer) as aprovações de hoje (${currentDateKey}).\nTodos voltarão para PENDENTE.\n\nConfirmar?`)) return;
    database.ref(`pontos/${currentDateKey}`).remove();
}

// --- AÇÕES EM MASSA (PERÍODO) ---
function getPeriodLimits(dateStr) {
    const current = new Date(dateStr + "T12:00:00");
    const day = current.getDate();
    const month = current.getMonth(); 
    const year = current.getFullYear();
    let start, end;
    if (day >= 11) { start = new Date(year, month, 11); end = new Date(year, month + 1, 10); }
    else { start = new Date(year, month - 1, 11); end = new Date(year, month, 10); }
    return { start, end };
}

function approvePeriod() {
    if (!currentApprover) { alert("Digite seu nome no topo!"); return; }
    const limits = getPeriodLimits(currentDateKey);
    if (!confirm(`Aprovar TUDO de ${limits.start.toLocaleDateString('pt-BR')} até ${limits.end.toLocaleDateString('pt-BR')}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const updates = {};
    let loopDate = new Date(limits.start);
    while (loopDate <= limits.end) {
        const dateKey = loopDate.toISOString().split('T')[0];
        driverList.forEach(d => {
            const currentObs = (db[dateKey] && db[dateKey][d.c]) ? db[dateKey][d.c].obs : "";
            updates[`pontos/${dateKey}/${d.c}`] = { status: "OK", approver: currentApprover, time: timeNow, obs: currentObs };
        });
        loopDate.setDate(loopDate.getDate() + 1);
    }
    database.ref().update(updates);
    alert("Aprovando período em massa...");
}

function cancelPeriod() {
    if (!currentApprover) { alert("Digite seu nome no topo!"); return; }
    const limits = getPeriodLimits(currentDateKey);
    
    if (!confirm(`PERIGO: Você vai CANCELAR (Desfazer) as aprovações de TODOS no período:\nDe: ${limits.start.toLocaleDateString('pt-BR')}\nAté: ${limits.end.toLocaleDateString('pt-BR')}\n\nTodos voltarão para PENDENTE. Tem certeza?`)) return;
    
    const updates = {};
    let loopDate = new Date(limits.start);
    while (loopDate <= limits.end) {
        const dateKey = loopDate.toISOString().split('T')[0];
        driverList.forEach(d => {
            updates[`pontos/${dateKey}/${d.c}`] = null;
        });
        loopDate.setDate(loopDate.getDate() + 1);
    }
    database.ref().update(updates);
    alert("Cancelando período em massa... Todos voltando para Pendente.");
}

// --- GESTÃO DE EQUIPE ---
function openManageModal() {
    document.getElementById('manageModal').style.display = 'flex';
    renderBranchOptions('newBranch');
    renderManageList();
}
function closeManageModal() { document.getElementById('manageModal').style.display = 'none'; }

function renderBranchOptions(elemId) {
    const branches = [...new Set(driverList.map(d => d.b))].sort();
    const select = document.getElementById(elemId);
    select.innerHTML = '<option value="">Selecione a Filial...</option>';
    branches.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b; opt.innerText = b; select.appendChild(opt);
    });
}

function addDriver() {
    const cad = document.getElementById('newCad').value.trim();
    const branch = document.getElementById('newBranch').value;
    const name = document.getElementById('newName').value.trim();
    if (!cad || !branch || !name) { alert("Preencha todos os campos!"); return; }
    if (driverList.find(d => d.c === cad)) { alert("CAD já existe!"); return; }
    const newList = [...driverList, { b: branch, c: cad, n: name }];
    driversRef.set(newList);
    document.getElementById('newCad').value = ""; document.getElementById('newName').value = "";
    alert("Adicionado!");
}

function removeDriver(cad) {
    if (!confirm("Remover funcionário?")) return;
    const newList = driverList.filter(d => d.c !== cad);
    driversRef.set(newList);
}

function renderManageList() {
    const listContainer = document.getElementById('manageListContainer');
    listContainer.innerHTML = "";
    driverList.forEach(d => {
        const item = document.createElement('div');
        item.className = 'manage-item';
        item.innerHTML = `<span><b style="color:var(--brand)">${d.b}</b> - ${d.n} <small style="color:#888">(CAD: ${d.c})</small></span> <button class="btn-del" onclick="removeDriver('${d.c}')"><i class="fas fa-trash"></i></button>`;
        listContainer.appendChild(item);
    });
}

// --- BUSCA E AÇÃO INDIVIDUAL ---
function openIndividualModal() {
    document.getElementById('individualModal').style.display = 'flex';
    document.getElementById('indivSearchInput').value = "";
    document.getElementById('indivSearchResult').style.display = 'none';
    selectedIndivCad = "";
}
function closeIndividualModal() { document.getElementById('individualModal').style.display = 'none'; }

function searchDriver() {
    const term = document.getElementById('indivSearchInput').value.trim().toLowerCase();
    const resDiv = document.getElementById('indivSearchResult');
    
    if (!term) {
        resDiv.style.display = 'none';
        return;
    }

    const found = driverList.find(d => d.c === term || d.n.toLowerCase().includes(term));

    resDiv.style.display = 'block';
    if (found) {
        selectedIndivCad = found.c;
        resDiv.style.background = '#F0FDF4';
        resDiv.style.color = '#065F46';
        resDiv.style.borderColor = '#10B981';
        resDiv.innerHTML = `<i class="fas fa-check-circle"></i> <b>Encontrado:</b><br><span style="font-size: 16px; font-weight:bold;">${found.n}</span><br>Filial: ${found.b} | CAD: ${found.c}`;
    } else {
        selectedIndivCad = "";
        resDiv.style.background = '#FEE2E2';
        resDiv.style.color = '#991B1B';
        resDiv.style.borderColor = '#EF4444';
        resDiv.innerHTML = `<i class="fas fa-times-circle"></i> <b>Colaborador não encontrado.</b><br>Tente digitar o CAD exato.`;
    }
}

function applyIndividualAction(statusType) {
    const approver = document.getElementById('approverName').value;
    if(!approver) { alert("Preencha seu nome de Aprovador lá no topo (na tela principal)!"); return; }

    if (!selectedIndivCad) { alert("Por favor, BUSQUE e selecione um colaborador válido primeiro."); return; }

    const startVal = document.getElementById('indivStartDate').value;
    const endVal = document.getElementById('indivEndDate').value;

    if(!startVal || !endVal) { alert("Preencha as datas!"); return; }

    const start = new Date(startVal + "T12:00:00");
    const end = new Date(endVal + "T12:00:00");

    if(start > end) { alert("Data Inicial não pode ser maior que a Final!"); return; }

    let actionName = "";
    if(statusType === 'OK') actionName = "APROVAR";
    else if(statusType === 'Erro') actionName = "REPROVAR";
    else actionName = "CANCELAR / VOLTAR (Pendente)";

    if(!confirm(`Ação: ${actionName}\nConfirmar operação para este colaborador?`)) return;

    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const updates = {};
    let loopDate = new Date(start);

    while(loopDate <= end) {
        const dateKey = loopDate.toISOString().split('T')[0];
        const path = `pontos/${dateKey}/${selectedIndivCad}`;
        
        if(statusType === 'Pendente') {
            updates[path] = null;
        } else {
            const currentObs = (db[dateKey] && db[dateKey][selectedIndivCad]) ? db[dateKey][selectedIndivCad].obs : "";
            updates[path] = {
                status: statusType,
                approver: approver,
                time: timeNow,
                obs: currentObs
            };
        }
        loopDate.setDate(loopDate.getDate() + 1);
    }

    database.ref().update(updates)
        .then(() => {
            alert("Ação aplicada com Sucesso!");
            closeIndividualModal();
        })
        .catch((err) => {
            alert("Erro: " + err.message);
        });
}

// --- EXPORTAR EXCEL ---
function exportDay() {
    sortDriverList();
    let csv = "\ufeffFilial;CAD;Nome;Data Referencia;Status;Observacao;Aprovador;Hora Acao\n";
    const dayData = db[currentDateKey] || {};
    driverList.forEach(d => {
        const rec = dayData[d.c];
        const st = rec ? (rec.status === 'OK' ? 'Aprovado' : (rec.status === 'Erro' ? 'Reprovado' : 'Pendente')) : "Pendente";
        const obs = rec ? rec.obs : "";
        const app = rec ? rec.approver : "";
        const time = rec ? rec.time : "";
        csv += `${d.b};${d.c};${d.n};${currentDateKey};${st};${obs};${app};${time}\n`;
    });
    downloadCSV(csv, `ExpressoNordeste_PontoDia_${currentDateKey}.csv`);
}

function exportPeriodSheet() {
    sortDriverList();
    const limits = getPeriodLimits(currentDateKey);
    let header = "Filial;CAD;Nome";
    const dateArray = [];
    let curr = new Date(limits.start);
    while (curr <= limits.end) {
        dateArray.push(new Date(curr));
        const dayStr = curr.getDate().toString().padStart(2, '0');
        const monthStr = (curr.getMonth() + 1).toString().padStart(2, '0');
        header += `;${dayStr}/${monthStr}`;
        curr.setDate(curr.getDate() + 1);
    }
    header += "\n";

    let body = "";
    driverList.forEach(driver => {
        let row = `${driver.b};${driver.c};${driver.n}`;
        dateArray.forEach(d => {
            const dateKey = d.toISOString().split('T')[0];
            const dayData = db[dateKey] || {};
            const record = dayData[driver.c];
            const status = record ? (record.status === 'OK' ? 'Aprovado' : (record.status === 'Erro' ? 'Reprovado' : 'Pendente')) : 'Pendente';
            row += `;${status}`;
        });
        body += row + "\n";
    });

    const fileName = `ExpressoNordeste_Matriz_${limits.start.toLocaleDateString('pt-BR')}_a_${limits.end.toLocaleDateString('pt-BR')}.csv`;
    downloadCSV("\ufeff" + header + body, fileName);
}

function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

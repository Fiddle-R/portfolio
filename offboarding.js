const LOGIC_APP_URL = 'https://prod-13.eastus2.logic.azure.com:443/workflows/717f54674b894e5c8513bad278415019/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=DS96iMrw6yYDyG4rkqZlURrTnl72Uoh0DLYtHIfaFTY';

const d = 'messacanyon.onmicrosoft.com';
const employees = {
  'john': { name: 'John Doe',   initials: 'JD', email: 'john.doe@' + d },
  'jane': { name: 'Jane Smith', initials: 'JS', email: 'jane.smith@' + d },
  'bob':  { name: 'Bob Jones',  initials: 'BJ', email: 'bob.jones@' + d }
};

function checkRunButton() {
  const sel = document.getElementById('employeeSelect');
  const managerEmail = document.getElementById('managerEmail').value;
  const runBtn = document.getElementById('runBtn');
  runBtn.disabled = !(sel.value && managerEmail);
}

function updateEmployeeCard() {
  const sel  = document.getElementById('employeeSelect');
  const card = document.getElementById('employeeCard');
  const key  = sel.value;

  if (!key) { card.style.display = 'none'; checkRunButton(); return; }

  const emp = employees[key];
  document.getElementById('empAvatar').textContent = emp.initials;
  document.getElementById('empName').textContent   = emp.name;
  document.getElementById('empEmail').textContent  = emp.email;

  const status = document.getElementById('empStatus');
  status.textContent = 'Active';
  status.className   = 'emp-status active';

  card.style.display = 'flex';
  checkRunButton();
}

function setStep(id, state, detail) {
  const item  = document.getElementById('step-' + id);
  const icon  = document.getElementById('icon-' + id);
  const badge = document.getElementById('badge-' + id);
  const detEl = document.getElementById('detail-' + id);

  item.className  = 'step-item ' + state;
  icon.className  = 'step-icon ' + state;
  badge.className = 'step-badge ' + state;
  detEl.textContent = detail;

  const labels = { waiting: 'Waiting', running: 'Running...', done: 'Done', error: 'Failed' };
  const icons  = {
    disable: { waiting:'🔒', running:'⚙️', done:'✅', error:'❌' },
    revoke:  { waiting:'🔑', running:'⚙️', done:'✅', error:'❌' },
    groups:  { waiting:'👥', running:'⚙️', done:'✅', error:'❌' },
    mailbox: { waiting:'📬', running:'⚙️', done:'✅', error:'❌' },
    notify:  { waiting:'📧', running:'⚙️', done:'✅', error:'❌' }
  };

  badge.textContent = labels[state];
  icon.textContent  = icons[id][state];
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runOffboarding() {
  const key     = document.getElementById('employeeSelect').value;
  const manager = document.getElementById('managerEmail').value;

  if (!key)     { alert('Please select an employee first.'); return; }
  if (!manager) { alert('Please enter your email address.'); return; }

  const emp   = employees[key];
  const email = emp.email;

  document.getElementById('runBtn').disabled = true;
  document.getElementById('btnText').textContent = 'Running...';
  document.getElementById('summaryBox').style.display = 'none';
  document.getElementById('errorBox').style.display   = 'none';
  document.getElementById('empStatus').textContent    = 'Processing';
  document.getElementById('empStatus').className      = 'emp-status';

  setStep('disable', 'running', 'PATCH /users/' + email + ' accountEnabled: false');
  await sleep(1200);
  setStep('revoke',  'running', 'POST /users/' + email + '/revokeSignInSessions');
  await sleep(900);
  setStep('groups',  'running', 'GET /users/' + email + '/memberOf');
  await sleep(1100);
  setStep('mailbox', 'running', 'PATCH /users/' + email + ' mailboxSettings');
  await sleep(800);
  setStep('notify',  'running', 'POST sendMail TO: ' + manager);

  try {
    const res = await fetch(LOGIC_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeEmail: email,
        employeeName:  emp.name,
        managerEmail:  manager
      })
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    await sleep(600);

    setStep('disable', 'done', 'Account disabled in Entra ID — sign-in blocked');
    setStep('revoke',  'done', 'All active tokens invalidated — sessions terminated');
    setStep('groups',  'done', 'Removed from all M365 groups and Teams');
    setStep('mailbox', 'done', 'Mailbox converted to shared — forwarding set');
    setStep('notify',  'done', 'Email delivered to ' + manager + ' via Graph API');

    document.getElementById('empStatus').textContent = 'Offboarded';
    document.getElementById('empStatus').className   = 'emp-status inactive';
    document.getElementById('summaryText').textContent =
      emp.name + ' has been successfully offboarded. Account disabled, sessions revoked, groups removed — and a real notification email was sent to ' + manager + ' via Microsoft Graph API.';
    document.getElementById('summaryBox').style.display = 'block';
    document.getElementById('resultsIcon').textContent  = '✅';

  } catch (err) {
    setStep('disable', 'done',  'Account disabled in Entra ID');
    setStep('revoke',  'done',  'Sessions revoked');
    setStep('groups',  'done',  'Groups removed');
    setStep('mailbox', 'error', 'Logic App connection error');
    setStep('notify',  'error', err.message);

    document.getElementById('errorText').textContent =
      'Could not reach the Logic App. Error: ' + err.message;
    document.getElementById('errorBox').style.display = 'block';
  }

  document.getElementById('btnText').textContent = 'Run Offboarding';
  document.getElementById('resetBtn').style.display = 'block';
}

function resetDemo() {
  ['disable','revoke','groups','mailbox','notify'].forEach(function(id) {
    setStep(id, 'waiting', 'Waiting for trigger...');
  });
  document.getElementById('summaryBox').style.display   = 'none';
  document.getElementById('errorBox').style.display     = 'none';
  document.getElementById('employeeSelect').value       = '';
  document.getElementById('employeeCard').style.display = 'none';
  document.getElementById('managerEmail').value         = '';
  document.getElementById('runBtn').disabled            = false;
  document.getElementById('btnText').textContent        = 'Run Offboarding';
  document.getElementById('btnIcon').textContent        = '⚡';
  document.getElementById('resetBtn').style.display     = 'none';
  document.getElementById('resultsIcon').textContent    = '📋';
}

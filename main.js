const RESUME_REQUEST_URL = 'https://prod-41.eastus2.logic.azure.com:443/workflows/ed6718ccf44f4618a3de1cf1cc950451/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=HqPeDXoxRkl7Tuwa0jU49ZAoZ1brRpsNaRAhz1tYIEA';

function openResumeModal(e) {
  e.preventDefault();
  document.getElementById('resumeModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  document.getElementById('resumeModal').classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('modalForm').style.display = 'block';
    document.getElementById('modalSuccess').classList.remove('active');
    document.getElementById('reqName').value = '';
    document.getElementById('reqCompany').value = '';
    document.getElementById('reqEmail').value = '';
    document.getElementById('reqRole').value = '';
    document.getElementById('modalSubmitBtn').disabled = false;
    document.getElementById('modalSubmitBtn').textContent = 'Send Request';
  }, 300);
}

function closeOnOverlay(e) {
  if (e.target === document.getElementById('resumeModal')) closeResumeModal();
}

async function submitResumeRequest() {
  const name = document.getElementById('reqName').value.trim();
  const company = document.getElementById('reqCompany').value.trim();
  const email = document.getElementById('reqEmail').value.trim();
  const role = document.getElementById('reqRole').value.trim();

  if (!name || !company || !email || !role) {
    alert('Please fill in all fields.');
    return;
  }

  const btn = document.getElementById('modalSubmitBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Sending...';

  try {
    await fetch(RESUME_REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, email, role })
    });
    document.getElementById('modalForm').style.display = 'none';
    document.getElementById('modalSuccess').classList.add('active');
    setTimeout(closeResumeModal, 4000);
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Send Request';
    alert('Something went wrong. Please try again.');
  }
}

function handleEmail(e) {
  e.preventDefault();
  window.location.href = 'mai' + 'lto:fid' + 'dle2r@' + 'outlook.com';
}

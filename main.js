var RESUME_REQUEST_URL = 'https://prod-41.eastus2.logic.azure.com:443/workflows/ed6718ccf44f4618a3de1cf1cc950451/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=HqPeDXoxRkl7Tuwa0jU49ZAoZ1brRpsNaRAhz1tYIEA';

function openResumeModal(e) {
  e.preventDefault();
  document.getElementById('resumeModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeResumeModal() {
  document.getElementById('resumeModal').classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(function() {
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

async function submitResumeRequest() {
  var name = document.getElementById('reqName').value.trim();
  var company = document.getElementById('reqCompany').value.trim();
  var email = document.getElementById('reqEmail').value.trim();
  var role = document.getElementById('reqRole').value.trim();

  if (!name || !company || !email || !role) {
    alert('Please fill in all fields.');
    return;
  }

  var btn = document.getElementById('modalSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    await fetch(RESUME_REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, company: company, email: email, role: role })
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

// Wire up directly — no DOMContentLoaded needed since script is at bottom of page
var emailBtn = document.getElementById('emailBtn');
if (emailBtn) {
  emailBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'mai' + 'lto:fid' + 'dle2r@' + 'outlook.com';
  });
}

var resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', openResumeModal);
}

var modalCloseBtn = document.getElementById('modalCloseBtn');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeResumeModal);
}

var modalOverlay = document.getElementById('resumeModal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeResumeModal();
  });
}

var submitBtn = document.getElementById('modalSubmitBtn');
if (submitBtn) {
  submitBtn.addEventListener('click', submitResumeRequest);
}

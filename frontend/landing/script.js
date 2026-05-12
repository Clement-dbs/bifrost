function copyCmd() {
    navigator.clipboard.writeText('pip install bifrost').then(() => {
      const el = document.getElementById('heroCmd');
      el.classList.add('did-copy');
      setTimeout(() => el.classList.remove('did-copy'), 2000);
    });
  }

  // Waitlist submission
  function joinWaitlist(inputId, formId, successId) {
    const email = document.getElementById(inputId).value.trim();
    if (!email || !email.includes('@')) {
      document.getElementById(inputId).style.borderColor = '#EF4444';
      setTimeout(() => document.getElementById(inputId).style.borderColor = '', 1500);
      return;
    }

    // Here: replace with your actual endpoint (Mailchimp, ConvertKit, Formspree, etc.)
    // fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: JSON.stringify({email}), headers:{'Content-Type':'application/json'} })

    document.getElementById(formId).style.display = 'none';
    document.getElementById(successId).classList.add('show');

    // Store locally as fallback
    const list = JSON.parse(localStorage.getItem('bifrost_waitlist') || '[]');
    list.push({ email, date: new Date().toISOString() });
    localStorage.setItem('bifrost_waitlist', JSON.stringify(list));
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .step, .cta-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
'use strict';

const menuToggle = document.querySelector('[aria-controls="mobile-menu"]');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  mobileMenu.hidden = !mobileMenu.hidden;
  menuToggle.setAttribute('aria-expanded', String(!mobileMenu.hidden));
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.querySelectorAll('[data-project]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('#project-type').value = link.dataset.project;
  });
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter;
    });
  });
});

const viewer = document.querySelector('#image-viewer');
document.querySelectorAll('[data-gallery-image]').forEach(card => {
  card.addEventListener('click', () => {
    const source = card.querySelector('img');
    document.querySelector('#viewer-image').src = source.src;
    document.querySelector('#viewer-image').alt = source.alt;
    document.querySelector('#image-caption').textContent = card.querySelector('p').textContent.trim();
    viewer.showModal();
  });
});
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
});

const contactToggle = document.querySelector('#contact-toggle');
const quickContact = document.querySelector('#quick-contact');
contactToggle.addEventListener('click', () => {
  quickContact.hidden = !quickContact.hidden;
  contactToggle.setAttribute('aria-expanded', String(!quickContact.hidden));
  contactToggle.setAttribute('aria-label', quickContact.hidden ? 'Open contact options' : 'Close contact options');
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
  if (!quickContact.hidden) {
    quickContact.hidden = true;
    contactToggle.setAttribute('aria-expanded', 'false');
    contactToggle.setAttribute('aria-label', 'Open contact options');
    contactToggle.focus();
  }
});

// Static hosting has no mail service: prepare an explicit draft, never claim delivery.
const inquiry = document.querySelector('#project-inquiry');
inquiry.querySelector('[type="submit"]').disabled = false;
inquiry.addEventListener('submit', event => {
  event.preventDefault();
  if (!inquiry.reportValidity()) return;
  const data = new FormData(inquiry);
  if (data.get('_gotcha')) return;
  const value = key => String(data.get(key) || '').trim();
  const subject = `Project inquiry — ${value('project-type') || 'Roofing & decking'}`;
  const body = [
    `Name: ${value('name')}`, `Email: ${value('email')}`, `Phone: ${value('phone')}`,
    `Project type: ${value('project-type')}`, `Town / ZIP: ${value('town')}`, '', value('message')
  ].join('\r\n');
  const emailURL = `mailto:angelo@toptiersroofing.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const status = document.querySelector('#inquiry-status');
  status.replaceChildren(document.createTextNode('Your inquiry is not sent yet. Review the draft in your email app and press Send. If no draft opened, '));
  const retry = document.createElement('a');
  retry.href = emailURL;
  retry.textContent = 'open your email app';
  retry.style.textDecoration = 'underline';
  status.append(retry, document.createTextNode(' or call (609) 335-7723.'));
  window.location.href = emailURL;
});

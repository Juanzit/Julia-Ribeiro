/**
 * NO.VAZIO — JÚLIA RIBEIRO
 * Ensaio Visual & Arte Cinematográfica
 * Interações fotográficas em conformidade com as diretrizes de Modern Web Guidance.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. VISUALIZADOR FOTOGRÁFICO NATIVO (<dialog>)
  // --------------------------------------------------------------------------
  const dialog = document.getElementById('image-viewer');
  const viewerImg = document.getElementById('viewer-img');
  const photos = Array.from(document.querySelectorAll('.essay-photo[data-expandable]'));
  let currentIdx = 0;

  const openViewer = (index) => {
    if (index < 0 || index >= photos.length) return;
    currentIdx = index;
    const img = photos[currentIdx].querySelector('img');
    if (viewerImg && img) {
      viewerImg.src = img.src;
      viewerImg.alt = img.alt || '';
    }
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  };

  photos.forEach((photo, idx) => {
    photo.addEventListener('click', (e) => {
      e.preventDefault();
      openViewer(idx);
    });
    photo.setAttribute('tabindex', '0');
    photo.setAttribute('role', 'button');
    photo.setAttribute('aria-label', 'Ampliar fotografia');
    photo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openViewer(idx);
      }
    });
  });

  if (dialog) {
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const next = (currentIdx - 1 + photos.length) % photos.length;
        openViewer(next);
      } else if (e.key === 'ArrowRight') {
        const next = (currentIdx + 1) % photos.length;
        openViewer(next);
      }
    });

    // Fechar ao clicar na imagem ou no fundo
    dialog.addEventListener('click', () => {
      dialog.close();
    });

    // Fallback de light-dismiss para navegadores
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e, d) => {
        const r = d.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = outside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && outside(e, dialog)) {
          dialog.close();
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. MICROINTERAÇÃO DE CÓPIA DE E-MAIL
  // --------------------------------------------------------------------------
  const emailLink = document.querySelector('.copy-email-link');
  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailLink.getAttribute('data-email') || 'juliaszribeiro@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const prev = emailLink.textContent;
        emailLink.textContent = 'e-mail copiado';
        setTimeout(() => {
          emailLink.textContent = prev;
        }, 2200);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }
});

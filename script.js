/**
 * Python Listeler E-Kitap - Ana JavaScript
 * Sayfa geçişleri, quiz sistemi ve etkileşimler
 */

// Sayfa durumu
let currentPageIndex = 0;
let totalPages = 0;
let score = 0;

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    initBook();
    createParticles();
});

/**
 * Kitabı başlat
 */
function initBook() {
    const pages = document.querySelectorAll('.page');
    totalPages = pages.length;

    // Sayfa sayısını güncelle
    document.getElementById('totalPages').textContent = totalPages;

    // İlk sayfayı aktif yap
    showPage(0);

    // Klavye navigasyonu
    document.addEventListener('keydown', handleKeyPress);

    // Touch/swipe desteği
    initTouchNavigation();
}

/**
 * Belirli bir sayfayı göster
 */
function showPage(index) {
    const pages = document.querySelectorAll('.page');

    // Sınır kontrolü
    if (index < 0 || index >= totalPages) return;

    // Tüm sayfaları gizle
    pages.forEach((page, i) => {
        page.classList.remove('active', 'prev');

        if (i < index) {
            page.classList.add('prev');
        }
    });

    // Hedef sayfayı göster
    pages[index].classList.add('active');
    currentPageIndex = index;

    // UI güncelle
    updateNavigation();

    // Sayfa gösterildiğinde animasyonları tetikle
    triggerPageAnimations(pages[index]);
}

/**
 * Sonraki sayfa
 */
function nextPage() {
    if (currentPageIndex < totalPages - 1) {
        showPage(currentPageIndex + 1);
        playPageTurnSound();
    }
}

/**
 * Önceki sayfa
 */
function prevPage() {
    if (currentPageIndex > 0) {
        showPage(currentPageIndex - 1);
        playPageTurnSound();
    }
}

/**
 * Belirli bir sayfaya git
 */
function goToPage(index) {
    showPage(index);
}

/**
 * Navigasyon durumunu güncelle
 */
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentPageEl = document.getElementById('currentPage');

    // Buton durumları
    prevBtn.disabled = currentPageIndex === 0;
    nextBtn.disabled = currentPageIndex === totalPages - 1;

    // Sayfa numarası (kapak sayfası 0, diğerleri 1'den başlar)
    currentPageEl.textContent = currentPageIndex;
}

/**
 * Klavye tuşlarını işle
 */
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowRight':
        case ' ':
            nextPage();
            break;
        case 'ArrowLeft':
            prevPage();
            break;
        case 'Home':
            goToPage(0);
            break;
        case 'End':
            goToPage(totalPages - 1);
            break;
    }
}

/**
 * Dokunmatik navigasyon
 */
function initTouchNavigation() {
    const book = document.getElementById('book');
    let startX = 0;
    let startY = 0;

    book.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    book.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Yatay swipe kontrolü
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextPage();
            } else {
                prevPage();
            }
        }
    }, { passive: true });
}

/**
 * Sayfa animasyonlarını tetikle
 */
function triggerPageAnimations(page) {
    // Animasyonlu elementleri bul
    const animatedElements = page.querySelectorAll('.floor, .wagon, .feature-card, .method-item, .toc-item');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';

        setTimeout(() => {
            el.style.transition = 'all 0.4s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

/**
 * Partiküller oluştur (arka plan efekti)
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

/**
 * Quiz cevabını kontrol et
 */
function checkAnswer(button) {
    const question = button.closest('.quiz-question');
    const options = question.querySelectorAll('.quiz-option');
    const feedback = question.querySelector('.feedback');
    const isCorrect = button.dataset.correct === 'true';

    // Tüm butonları devre dışı bırak
    options.forEach(opt => {
        opt.disabled = true;
        if (opt.dataset.correct === 'true') {
            opt.classList.add('correct');
        }
    });

    // Seçilen cevabı işaretle
    if (isCorrect) {
        button.classList.add('correct');
        feedback.textContent = '✅ Doğru! Harika!';
        feedback.className = 'feedback show correct';
        score++;
    } else {
        button.classList.add('wrong');
        feedback.textContent = '❌ Yanlış. Doğru cevap yeşil işaretli.';
        feedback.className = 'feedback show wrong';
    }

    // Skoru güncelle
    document.getElementById('scoreValue').textContent = score;

    // Animasyon
    button.style.transform = 'scale(1.05)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

/**
 * Quizi sıfırla
 */
function resetQuiz() {
    score = 0;
    document.getElementById('scoreValue').textContent = 0;

    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(q => {
        const options = q.querySelectorAll('.quiz-option');
        const feedback = q.querySelector('.feedback');

        options.forEach(opt => {
            opt.disabled = false;
            opt.classList.remove('correct', 'wrong');
        });

        feedback.className = 'feedback';
        feedback.textContent = '';
    });
}

/**
 * Etkileşimli apartman katı hover efekti
 */
document.addEventListener('DOMContentLoaded', () => {
    const floors = document.querySelectorAll('.floor');
    floors.forEach(floor => {
        floor.addEventListener('mouseenter', () => {
            const floorNum = floor.dataset.floor;
            floor.style.transform = 'translateX(10px)';
            floor.querySelector('.floor-number').style.transform = 'scale(1.2)';
        });

        floor.addEventListener('mouseleave', () => {
            floor.style.transform = '';
            floor.querySelector('.floor-number').style.transform = '';
        });
    });
});

/**
 * Kod bloklarını vurgula ve kopyala butonu ekle
 */
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
        // Kopyala butonu ekle
        if (!pre.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.onclick = function () {
                const code = pre.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '✅';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                });
            };
            pre.style.position = 'relative';
            pre.style.paddingRight = '55px'; // Kopyala butonu için daha fazla yer aç
            pre.appendChild(copyBtn);
        }

        const block = pre.querySelector('code');
        if (!block) return;

        // Basit Python syntax highlighting
        let html = block.innerHTML;

        // Stringler
        html = html.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>');

        // Sayılar
        html = html.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

        // Yorumlar
        html = html.replace(/#.*/g, '<span class="comment">$&</span>');

        block.innerHTML = html;
    });
}

// Syntax highlighting için CSS ekle
const syntaxStyles = document.createElement('style');
syntaxStyles.textContent = `
    pre code .string { color: #98c379; }
    pre code .number { color: #d19a66; }
    pre code .comment { color: #5c6370; font-style: italic; }
    
    .copy-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(99, 102, 241, 0.2);
        border: 1px solid rgba(99, 102, 241, 0.4);
        color: var(--text-secondary, #94a3b8);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }
    
    .copy-btn:hover {
        background: rgba(99, 102, 241, 0.4);
        color: white;
        transform: scale(1.05);
    }
    
    .copy-btn.copied {
        background: rgba(34, 197, 94, 0.3);
        border-color: rgba(34, 197, 94, 0.5);
        color: #22c55e;
    }
`;
document.head.appendChild(syntaxStyles);

// Sayfa yüklendiğinde syntax highlighting uygula
document.addEventListener('DOMContentLoaded', highlightCode);


// Sayfa Çevirme Sesi (Daha Yumuşak ve Naif)
function playPageTurnSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    // 1 saniyelik bir tampon (buffer) oluştur
    const bufferSize = ctx.sampleRate * 1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Beyaz gürültü oluştur (Temel ses kaynağı)
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // 1. Filtre: Alt frekansları kes (Tok sesi engelle, "küt" sesini al)
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 800; // 800Hz altını kes

    // 2. Filtre: Üst frekansları yumuşat (Sert tıslama sesini al, "hışş" yerine "huşş" gibi olsun)
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3500; // 3500Hz üzerini kes (yumuşaklık katar)

    const gainNode = ctx.createGain();
    const now = ctx.currentTime;

    // Zarf (Sesin şekli) - Çok daha nazik bir geçiş
    gainNode.gain.setValueAtTime(0, now);

    // Yavaşça yüksel (Atak: 0.15 saniye)
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.15);

    // Çok yavaşça sönümlen (Bitiş: +0.6 saniye)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    // Bağlantılar: Gürültü -> Highpass -> Lowpass -> Gain -> Hoparlör
    noise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    noise.stop(now + 0.7);
}

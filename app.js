// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav__btn');
    const sections = document.querySelectorAll('.breed-section');
    const searchInput = document.getElementById('searchInput');
    
    // Handle navigation button clicks
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all buttons
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Smooth scroll to target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const breedCards = document.querySelectorAll('.breed-card');
            let hasResults = false;
            
            breedCards.forEach(card => {
                const breedTitle = card.querySelector('.breed-card__title').textContent.toLowerCase();
                const breedContent = card.textContent.toLowerCase();
                
                if (searchTerm === '' || breedTitle.includes(searchTerm) || breedContent.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
            
            // Show/hide sections based on visible cards
            sections.forEach(section => {
                const visibleCards = section.querySelectorAll('.breed-card[style*="display: block"], .breed-card:not([style*="display: none"])');
                const cardsInSection = section.querySelectorAll('.breed-card');
                let sectionHasVisible = false;
                
                cardsInSection.forEach(card => {
                    if (card.style.display !== 'none') {
                        sectionHasVisible = true;
                    }
                });
                
                if (searchTerm === '' || sectionHasVisible) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Show no results message if needed
            showNoResultsMessage(!hasResults && searchTerm !== '');
        });
    }
    
    // No results message
    function showNoResultsMessage(show) {
        let noResultsDiv = document.getElementById('noResults');
        
        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResults';
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="card">
                    <div class="card__body" style="text-align: center; padding: 40px;">
                        <h3>🔍 Ничего не найдено</h3>
                        <p>Попробуйте изменить поисковый запрос или просмотрите все породы</p>
                    </div>
                </div>
            `;
            
            const firstSection = document.querySelector('.breed-section');
            if (firstSection) {
                firstSection.parentNode.insertBefore(noResultsDiv, firstSection);
            }
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }
    
    // Update active navigation based on scroll position
    function updateActiveNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset + 150; // Offset for header
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active state
        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-target') === current) {
                button.classList.add('active');
            }
        });
    }
    
    // Throttled scroll listener for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavigation, 10);
        
        // Handle back to top button
        handleBackToTopButton();
    });
    
    // Initialize active state
    updateActiveNavigation();
    
    // Add fade-in animation for breed cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all breed cards
    const breedCards = document.querySelectorAll('.breed-card');
    breedCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        
        observer.observe(card);
    });
    
    // Add click tracking for cattery links
    const catteryLinks = document.querySelectorAll('.cattery-list a');
    catteryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            navigateToNextSection();
        } else if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            navigateToPreviousSection();
        } else if (e.key === 'Escape' && searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    });
    
    function navigateToNextSection() {
        const activeButton = document.querySelector('.nav__btn.active');
        const buttons = Array.from(navButtons);
        const currentIndex = buttons.indexOf(activeButton);
        
        if (currentIndex < buttons.length - 1) {
            buttons[currentIndex + 1].click();
        }
    }
    
    function navigateToPreviousSection() {
        const activeButton = document.querySelector('.nav__btn.active');
        const buttons = Array.from(navButtons);
        const currentIndex = buttons.indexOf(activeButton);
        
        if (currentIndex > 0) {
            buttons[currentIndex - 1].click();
        }
    }
    
    // Add back to top functionality
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Вернуться наверх');
    backToTopBtn.setAttribute('title', 'Вернуться наверх');
    
    document.body.appendChild(backToTopBtn);
    
    // Handle back to top button visibility and functionality
    function handleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add accessibility improvements
    function improveAccessibility() {
        // Add ARIA labels
        navButtons.forEach((button, index) => {
            button.setAttribute('aria-label', `Перейти к разделу ${button.textContent}`);
            button.setAttribute('role', 'tab');
        });
        
        sections.forEach((section, index) => {
            section.setAttribute('role', 'tabpanel');
            section.setAttribute('aria-labelledby', `nav-${index}`);
        });
        
        // Add skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Перейти к основному содержанию';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: 8px 12px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            font-weight: 500;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    improveAccessibility();
    
    // Add error handling for external links
    catteryLinks.forEach(link => {
        link.addEventListener('error', function() {
            this.style.color = '#999';
            this.style.textDecoration = 'line-through';
            this.title = 'Ссылка может быть недоступна';
        });
    });
    
    // Add loading state management for better UX
    function showLoadingState() {
        const cards = document.querySelectorAll('.breed-card');
        cards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
    }
    
    function hideLoadingState() {
        const cards = document.querySelectorAll('.breed-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }
    
    // Smooth reveal animation for cards
    function revealCards() {
        const cards = document.querySelectorAll('.breed-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Initialize reveal animation
    setTimeout(revealCards, 500);
    
    // Add print optimization
    function optimizeForPrint() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .header, .nav, .search-container, .footer, .back-to-top {
                    display: none !important;
                }
                .breed-card {
                    break-inside: avoid;
                    margin-bottom: 20px;
                    box-shadow: none;
                    border: 1px solid #ccc;
                }
                .breed-section {
                    break-before: page;
                }
                .breed-section:first-child {
                    break-before: auto;
                }
                a {
                    text-decoration: none;
                    color: #000 !important;
                }
                a:after {
                    content: " (" attr(href) ")";
                    font-size: 0.8em;
                    color: #666;
                    word-break: break-all;
                }
                .cattery-list li::before {
                    display: none;
                }
                .breed-card__title::before {
                    display: none;
                }
                .breed-info h4::before {
                    display: none;
                }
                .suitable-for::before {
                    display: none;
                }
            }
        `;
        document.head.appendChild(printStyles);
    }
    
    optimizeForPrint();
    
    // Add keyboard shortcuts info
    function addKeyboardShortcuts() {
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.className = 'keyboard-shortcuts';
        shortcutsInfo.innerHTML = `
            <div style="position: fixed; bottom: 80px; right: 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 12px; font-size: 12px; color: var(--color-text-secondary); display: none; z-index: 999;">
                <strong>Горячие клавиши:</strong><br>
                Ctrl + ↓/↑ - навигация по разделам<br>
                Esc - очистить поиск
            </div>
        `;
        document.body.appendChild(shortcutsInfo);
        
        // Show shortcuts on Ctrl key hold
        let ctrlPressed = false;
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Control' && !ctrlPressed) {
                ctrlPressed = true;
                shortcutsInfo.querySelector('div').style.display = 'block';
            }
        });
        
        document.addEventListener('keyup', function(e) {
            if (e.key === 'Control') {
                ctrlPressed = false;
                shortcutsInfo.querySelector('div').style.display = 'none';
            }
        });
    }
    
    addKeyboardShortcuts();
    
    // Performance optimization - lazy load content
    function optimizePerformance() {
        // Defer non-critical animations
        requestIdleCallback(() => {
            document.querySelectorAll('.breed-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.willChange = 'transform, box-shadow';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.willChange = 'auto';
                });
            });
        });
    }
    
    optimizePerformance();
    
    console.log('🐱 Породы кошек - приложение загружено успешно!');
    console.log('Доступные команды:');
    console.log('- Ctrl + ↓/↑ для навигации по разделам');
    console.log('- Esc для очистки поиска');
    console.log('- Поиск работает по названию породы и содержимому');
});
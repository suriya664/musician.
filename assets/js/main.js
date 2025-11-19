/**
 * Musician Website - Main JavaScript
 * jQuery and AJAX Functionality
 */

$(document).ready(function() {
    
    // Mobile Menu Toggle
    $('.mobile-menu-toggle').on('click', function() {
        $('.nav-menu').toggleClass('active');
        $(this).html($(this).html() === '☰' ? '✕' : '☰');
    });
    
    // Close mobile menu when clicking on a link
    $('.nav-menu a').on('click', function() {
        if ($(window).width() <= 768) {
            $('.nav-menu').removeClass('active');
            $('.mobile-menu-toggle').html('☰');
        }
    });
    
    // Smooth Scrolling
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });
    
    // Contact Form AJAX Submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        var form = $(this);
        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Show loading spinner
        $('.loader').show();
        
        // Simulate AJAX request (replace with actual endpoint)
        $.ajax({
            url: 'contact.php', // Replace with your actual endpoint
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                $('.loader').hide();
                if (response.success) {
                    showNotification('Message sent successfully!', 'success');
                    form[0].reset();
                } else {
                    showNotification('Error sending message. Please try again.', 'error');
                }
            },
            error: function() {
                $('.loader').hide();
                // For demo purposes, show success message
                showNotification('Message sent successfully! (Demo Mode)', 'success');
                form[0].reset();
            }
        });
    });
    
    // Newsletter Subscription
    $('#newsletterForm').on('submit', function(e) {
        e.preventDefault();
        
        var email = $('#newsletterEmail').val();
        
        if (email) {
            $.ajax({
                url: 'newsletter.php', // Replace with your actual endpoint
                type: 'POST',
                data: { email: email },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        showNotification('Successfully subscribed to newsletter!', 'success');
                        $('#newsletterEmail').val('');
                    } else {
                        showNotification('Error subscribing. Please try again.', 'error');
                    }
                },
                error: function() {
                    // For demo purposes, show success message
                    showNotification('Successfully subscribed! (Demo Mode)', 'success');
                    $('#newsletterEmail').val('');
                }
            });
        }
    });
    
    // Image Lazy Loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Gallery Lightbox (Simple Implementation)
    $('.gallery-item').on('click', function() {
        var imgSrc = $(this).find('img').attr('src');
        var imgAlt = $(this).find('img').attr('alt');
        
        // Create lightbox
        var lightbox = $('<div class="lightbox"><div class="lightbox-content"><span class="lightbox-close">&times;</span><img src="' + imgSrc + '" alt="' + imgAlt + '"></div></div>');
        $('body').append(lightbox);
        $('body').css('overflow', 'hidden');
        
        // Close lightbox
        $('.lightbox-close, .lightbox').on('click', function(e) {
            if (e.target === this) {
                $('.lightbox').remove();
                $('body').css('overflow', '');
            }
        });
    });
    
    // Video Modal
    $('.video-play-btn').on('click', function(e) {
        e.preventDefault();
        var videoUrl = $(this).data('video');
        var modal = $('<div class="video-modal"><div class="video-modal-content"><span class="video-modal-close">&times;</span><div class="video-container"><iframe src="' + videoUrl + '" frameborder="0" allowfullscreen></iframe></div></div></div>');
        $('body').append(modal);
        $('body').css('overflow', 'hidden');
        
        $('.video-modal-close, .video-modal').on('click', function(e) {
            if (e.target === this) {
                $('.video-modal').remove();
                $('body').css('overflow', '');
            }
        });
    });
    
    // Scroll to Top Button
    var scrollTopBtn = $('<button class="scroll-top-btn" title="Scroll to Top">↑</button>');
    $('body').append(scrollTopBtn);
    
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $('.scroll-top-btn').fadeIn();
        } else {
            $('.scroll-top-btn').fadeOut();
        }
    });
    
    $('.scroll-top-btn').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
    
    // Animate on Scroll
    function animateOnScroll() {
        $('.card, .album-card, .gallery-item, .event-card').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-in');
            }
        });
    }
    
    $(window).on('scroll', animateOnScroll);
    animateOnScroll();
    
    // Form Validation
    $('input[type="email"]').on('blur', function() {
        var email = $(this).val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            $(this).addClass('error');
            $(this).after('<span class="error-message">Please enter a valid email address</span>');
        } else {
            $(this).removeClass('error');
            $(this).next('.error-message').remove();
        }
    });
    
    // Loading Content with AJAX (for dynamic content)
    function loadContent(url, target) {
        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function() {
                $(target).html('<div class="loader"><div class="spinner"></div></div>');
            },
            success: function(data) {
                $(target).html(data);
            },
            error: function() {
                $(target).html('<p class="error">Error loading content. Please try again later.</p>');
            }
        });
    }
    
    // Notification System
    function showNotification(message, type) {
        var notification = $('<div class="notification notification-' + type + '">' + message + '</div>');
        $('body').append(notification);
        
        setTimeout(function() {
            notification.addClass('show');
        }, 100);
        
        setTimeout(function() {
            notification.removeClass('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Initialize tooltips if needed
    $('[data-tooltip]').on('mouseenter', function() {
        var tooltip = $('<div class="tooltip">' + $(this).data('tooltip') + '</div>');
        $('body').append(tooltip);
        
        var pos = $(this).offset();
        tooltip.css({
            top: pos.top - tooltip.outerHeight() - 10,
            left: pos.left + ($(this).outerWidth() / 2) - (tooltip.outerWidth() / 2)
        });
    }).on('mouseleave', function() {
        $('.tooltip').remove();
    });
    
    // Gallery Filter Functionality
    $('.filter-btn').on('click', function() {
        var filter = $(this).data('filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filter === 'all') {
            $('.gallery-item').fadeIn();
        } else {
            $('.gallery-item').each(function() {
                if ($(this).data('category') === filter) {
                    $(this).fadeIn();
                } else {
                    $(this).fadeOut();
                }
            });
        }
    });
    
});

// Add CSS for dynamic elements
var style = document.createElement('style');
style.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        line-height: 1;
    }
    
    .video-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    
    .video-modal-content {
        position: relative;
        width: 90%;
        max-width: 900px;
    }
    
    .video-modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        line-height: 1;
    }
    
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-red);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    }
    
    .scroll-top-btn:hover {
        background-color: var(--primary-black);
        transform: translateY(-3px);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: #333;
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification-success {
        background-color: #4CAF50;
    }
    
    .notification-error {
        background-color: #f44336;
    }
    
    .error {
        border-color: #f44336 !important;
    }
    
    .error-message {
        color: #f44336;
        font-size: 0.875rem;
        display: block;
        margin-top: 0.25rem;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .tooltip {
        position: absolute;
        background-color: #333;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 10002;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

    // FAQ Accordion Functionality
    $('.faq-question').on('click', function() {
        var $faqItem = $(this).closest('.faq-item');
        var $faqAnswer = $faqItem.find('.faq-answer');
        
        // Close all other FAQ items
        $('.faq-item').not($faqItem).removeClass('active');
        
        // Toggle current FAQ item
        $faqItem.toggleClass('active');
    });

    // Dark Mode Toggle Functionality
    function initDarkMode() {
        // Check for saved theme preference or default to light mode
        var darkMode = localStorage.getItem('darkMode') === 'true';
        
        if (darkMode) {
            $('body').addClass('dark-mode');
            updateToggleIcon(true);
        }
        
        // Toggle dark mode on button click
        $('#darkModeToggle').on('click', function() {
            $('body').toggleClass('dark-mode');
            var isDark = $('body').hasClass('dark-mode');
            localStorage.setItem('darkMode', isDark);
            updateToggleIcon(isDark);
        });
    }
    
    function updateToggleIcon(isDark) {
        var $icon = $('.toggle-icon');
        var $text = $('.toggle-text');
        
        if (isDark) {
            $icon.text('☀️');
            $text.text('Light Mode');
        } else {
            $icon.text('🌙');
            $text.text('Dark Mode');
        }
    }
    
    // Initialize dark mode on page load
    initDarkMode();


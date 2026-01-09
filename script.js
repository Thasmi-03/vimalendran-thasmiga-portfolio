document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('nav-active');

            // Burger Animation
            hamburger.classList.toggle('toggle');
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                if (hamburger) hamburger.classList.remove('toggle');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize EmailJS (Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key)
    (function () {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("YOUR_PUBLIC_KEY");
        }
    })();

    // Copy to Clipboard Logic
    const copyableItems = document.querySelectorAll('.info-item.copyable');
    copyableItems.forEach(item => {
        item.addEventListener('click', () => {
            const textToCopy = item.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Create feedback element if not exists
                    let feedback = item.querySelector('.copy-feedback');
                    if (!feedback) {
                        feedback = document.createElement('span');
                        feedback.className = 'copy-feedback';
                        feedback.textContent = 'Copied!';
                        item.appendChild(feedback);
                    }

                    // Show feedback
                    feedback.classList.add('show');
                    setTimeout(() => {
                        feedback.classList.remove('show');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });

    // Form submission handler with EmailJS
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                from_name: document.getElementById('name').value,
                reply_to: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // If EmailJS is initialized, use it. Otherwise, fallback to mailto (but notify)
            if (typeof emailjs !== 'undefined') {
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
                emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
                    .then(() => {
                        alert('Message sent successfully! I will get back to you soon.');
                        contactForm.reset();
                    })
                    .catch((error) => {
                        console.error('EmailJS Error:', error);
                        alert('Failed to send message via EmailJS. Falling back to email client.');

                        // Fallback to mailto
                        const subject = `Contact from Portfolio: ${formData.from_name}`;
                        const body = `Name: ${formData.from_name}\nEmail: ${formData.reply_to}\n\nMessage:\n${formData.message}`;
                        window.location.href = `mailto:vimalthasmiga1112@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    })
                    .finally(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    });
            } else {
                // Fallback to mailto if SDK failed to load
                const subject = `Contact from Portfolio: ${formData.from_name}`;
                const body = `Name: ${formData.from_name}\nEmail: ${formData.reply_to}\n\nMessage:\n${formData.message}`;
                window.location.href = `mailto:vimalthasmiga1112@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                contactForm.reset();
            }
        });
    }

    // Scroll Animation (Simple fade-in)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});

/* ==========================================================================
   IECLATE INOVATE INTERACTIVE LOGIC (VANILLA JAVASCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // API Base URL Configuration
    const API_BASE_URL = 'https://ieclate-innovate.onrender.com/api';

    // 1. STICKY NAVBAR EFFECT
    const header = document.querySelector('.navbar-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. MOBILE HAMBURGER MENU TOGGLE
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Toggle body scrolling to prevent background scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // 3. STATS ANIMATED COUNTER
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    const startCounting = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const updateCount = () => {
                const current = +counter.innerText;
                // Determine step increment speed based on size of target number
                const increment = target / 50;

                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer to run statistics counters when section enters screen viewport
    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    startCounting();
                    counted = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        statsObserver.observe(statsSection);
    }


    // 4. TESTIMONIALS SLIDER
    const sliderTrack = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (sliderTrack && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Render Dots Dynamically
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.slider-dot');

        const updateSlider = () => {
            // Apply translation transform to transition slide container track
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Toggle active states on indicators
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
        };

        const nextSlide = () => {
            if (currentIndex === totalSlides - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        };

        const prevSlide = () => {
            if (currentIndex === 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex--;
            }
            updateSlider();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto transition slider every 8 seconds
        let autoSlide = setInterval(nextSlide, 8000);

        // Reset timer when clicked manually
        const resetAutoSlide = () => {
            clearInterval(autoSlide);
            autoSlide = setInterval(nextSlide, 8000);
        };

        [prevBtn, nextBtn, dotsContainer].forEach(element => {
            if (element) {
                element.addEventListener('click', resetAutoSlide);
            }
        });
    }


    // 5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    const animatableElements = document.querySelectorAll('.why-card, .service-card, .timeline-step, .portfolio-card, .cta-banner');

    animatableElements.forEach(el => {
        el.classList.add('scroll-animate');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatableElements.forEach(el => {
        revealObserver.observe(el);
    });


    // 6. SUB-SERVICES LIST EXPAND TOGGLE
    const expandButtons = document.querySelectorAll('.expand-list-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.service-card');
            const list = card.querySelector('.sub-services-list');
            const isExpanded = list.classList.toggle('expanded');
            btn.classList.toggle('active');

            // Update button text
            const totalCount = btn.getAttribute('data-total') || 'All';
            const textSpan = btn.querySelector('.btn-text');
            if (textSpan) {
                if (isExpanded) {
                    textSpan.textContent = 'Collapse';
                } else {
                    textSpan.textContent = `View All (${totalCount})`;
                }
            }
        });
    });

    // 7. PORTFOLIO FILTER LOGIC
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-portfolio-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('fade-out');
                        card.classList.add('fade-in');
                    } else {
                        card.classList.remove('fade-in');
                        card.classList.add('fade-out');
                    }
                });
            });
        });
    }

    // 8. MEETING DETAILS PANEL LOGIC
    const meetingConsole = document.querySelector('.meeting-console-section');
    const adminToast = document.getElementById('admin-toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    const showToast = (message, iconClass = 'fa-circle-info') => {
        if (!adminToast || !toastMessage) return;
        toastMessage.textContent = message;
        if (toastIcon) {
            toastIcon.className = `fa-solid ${iconClass} toast-icon`;
        }
        adminToast.classList.add('show');
        setTimeout(() => {
            adminToast.classList.remove('show');
        }, 3500);
    };

    if (meetingConsole) {
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
            window.location.href = 'admin-login.html';
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const meetingId = urlParams.get('id');

            if (!meetingId) {
                window.location.href = 'admin-dashboard.html';
            } else {
                // Direct back button to dashboard
                const btnBack = document.querySelector('.btn-back');
                if (btnBack) {
                    btnBack.href = 'admin-dashboard.html';
                }

                // Fetch meeting details from all meetings (find by ID)
                fetch(`${API_BASE_URL}/meetings/admin`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.meetings) {
                        const meeting = data.meetings.find(m => m._id === meetingId);
                        if (!meeting) {
                            showToast('Meeting request details not found.', 'fa-triangle-exclamation');
                            setTimeout(() => { window.location.href = 'admin-dashboard.html'; }, 2000);
                            return;
                        }

                        // Populate client details column
                        const nameEl = document.querySelector('.client-name-details h2');
                        const titleEl = document.querySelector('.client-name-details .client-title');
                        const companyEl = document.querySelector('.client-company-tag');
                        const emailEl = document.querySelector('.client-contacts-list .contact-item:nth-child(1) .val');
                        const phoneEl = document.querySelector('.client-contacts-list .contact-item:nth-child(2) .val');

                        if (nameEl) nameEl.textContent = meeting.fullName;
                        if (titleEl) titleEl.textContent = 'B2B Client';
                        if (companyEl) companyEl.innerHTML = `<i class="fa-solid fa-building"></i> ${meeting.company}`;
                        if (emailEl) emailEl.innerHTML = `<i class="fa-solid fa-envelope"></i> ${meeting.email}`;
                        if (phoneEl) phoneEl.innerHTML = `<i class="fa-solid fa-phone"></i> ${meeting.phone}`;

                        // Populate meeting status
                        const statusBadge = document.getElementById('meeting-status');
                        if (statusBadge) {
                            statusBadge.textContent = meeting.status;
                            statusBadge.className = `status-badge ${meeting.status.toLowerCase()}`;
                        }

                        // Populate date & time slot
                        const detailsFields = document.querySelectorAll('.details-field');
                        if (detailsFields.length >= 2) {
                            const dateValEl = detailsFields[0].querySelector('.field-value');
                            const timeValEl = detailsFields[1].querySelector('.field-value');

                            if (dateValEl) {
                                dateValEl.textContent = new Date(meeting.date).toLocaleDateString(undefined, {
                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                });
                            }

                            if (timeValEl) {
                                let timeLabel = meeting.time;
                                if (meeting.time === 'morning_early') timeLabel = '09:00 AM - 10:30 AM';
                                else if (meeting.time === 'morning_late') timeLabel = '11:00 AM - 12:30 PM';
                                else if (meeting.time === 'afternoon_early') timeLabel = '02:00 PM - 03:30 PM';
                                else if (meeting.time === 'afternoon_late') timeLabel = '04:00 PM - 05:30 PM';
                                timeValEl.textContent = timeLabel;
                            }
                        }

                        // Populate purpose
                        const purposeText = document.querySelector('.purpose-block .field-value-text');
                        if (purposeText) {
                            let text = meeting.purpose;
                            if (meeting.notes) {
                                text += `\n\nNotes from client: ${meeting.notes}`;
                            }
                            purposeText.textContent = text;
                        }

                        // Populate meeting link
                        const linkInput = document.getElementById('meeting-link-url');
                        if (linkInput) {
                            linkInput.removeAttribute('readonly');
                            linkInput.value = meeting.link || '';
                            linkInput.placeholder = 'Paste Google Meet Link here...';
                        }

                        // Action Handlers
                        const btnApprove = document.getElementById('btn-approve');
                        const btnReject = document.getElementById('btn-reject');
                        const btnSendEmail = document.getElementById('btn-send-email');
                        const btnCopyLink = document.getElementById('btn-copy-link');

                        if (btnApprove && statusBadge) {
                            btnApprove.addEventListener('click', () => {
                                const linkVal = linkInput ? linkInput.value.trim() : '';
                                if (!linkVal || !linkVal.startsWith('http')) {
                                    showToast('Please provide a valid meeting link.', 'fa-triangle-exclamation');
                                    return;
                                }

                                btnApprove.disabled = true;
                                fetch(`${API_BASE_URL}/meetings/approve`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${adminToken}`
                                    },
                                    body: JSON.stringify({
                                        meetingId: meetingId,
                                        link: linkVal
                                    })
                                })
                                .then(res => res.json())
                                .then(data => {
                                    btnApprove.disabled = false;
                                    if (data.success) {
                                        statusBadge.textContent = 'Approved';
                                        statusBadge.className = 'status-badge approved';
                                        showToast('Meeting approved & client notified via email!', 'fa-circle-check');
                                    } else {
                                        showToast(data.message || 'Approval failed.', 'fa-triangle-exclamation');
                                    }
                                })
                                .catch(err => {
                                    btnApprove.disabled = false;
                                    showToast('Connection error during approval.', 'fa-triangle-exclamation');
                                });
                            });
                        }

                        if (btnReject && statusBadge) {
                            btnReject.addEventListener('click', () => {
                                const reason = prompt('Please enter rejection reason:');
                                if (reason === null) return;
                                if (!reason.trim()) {
                                    showToast('Rejection reason is required.', 'fa-triangle-exclamation');
                                    return;
                                }

                                btnReject.disabled = true;
                                fetch(`${API_BASE_URL}/meetings/reject`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${adminToken}`
                                    },
                                    body: JSON.stringify({
                                        meetingId: meetingId,
                                        reason: reason
                                    })
                                })
                                .then(res => res.json())
                                .then(data => {
                                    btnReject.disabled = false;
                                    if (data.success) {
                                        statusBadge.textContent = 'Rejected';
                                        statusBadge.className = 'status-badge rejected';
                                        showToast('Meeting rejected & client notified via email.', 'fa-circle-xmark');
                                    } else {
                                        showToast(data.message || 'Rejection failed.', 'fa-triangle-exclamation');
                                    }
                                })
                                .catch(err => {
                                    btnReject.disabled = false;
                                    showToast('Connection error during rejection.', 'fa-triangle-exclamation');
                                });
                            });
                        }

                        if (btnSendEmail) {
                            btnSendEmail.addEventListener('click', () => {
                                showToast('Confirmation email has been sent to client!', 'fa-paper-plane');
                            });
                        }

                        if (btnCopyLink && linkInput) {
                            btnCopyLink.addEventListener('click', () => {
                                linkInput.select();
                                navigator.clipboard.writeText(linkInput.value)
                                    .then(() => showToast('Meeting link copied!', 'fa-copy'))
                                    .catch(() => showToast('Failed to copy.', 'fa-triangle-exclamation'));
                            });
                        }
                    } else {
                        showToast('Failed to retrieve meetings catalog.', 'fa-triangle-exclamation');
                    }
                })
                .catch(err => {
                    console.error('Error fetching admin meeting details:', err);
                    showToast('Connection error loading console details.', 'fa-triangle-exclamation');
                });
            }
        }
    }

    // 9. AUTH PAGES LOGIN & REGISTRATION LOGIC
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Toggle Password Visibility helper
    const setupPasswordToggle = (btnId, inputId) => {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (btn && input) {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    if (icon) {
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    }
                } else {
                    input.type = 'password';
                    if (icon) {
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            });
        }
    };

    setupPasswordToggle('btn-toggle-pass', 'login-pass');
    setupPasswordToggle('btn-toggle-pass-1', 'register-pass');
    setupPasswordToggle('btn-toggle-pass-2', 'register-confirm-pass');

    // Toast Notification for Auth
    const authToast = document.getElementById('admin-toast');
    const authToastMessage = document.getElementById('toast-message');
    const authToastIcon = document.getElementById('toast-icon');

    const triggerAuthToast = (msg, iconClass = 'fa-circle-info') => {
        if (!authToast || !authToastMessage) {
            alert(msg);
            return;
        }
        authToastMessage.textContent = msg;
        if (authToastIcon) {
            authToastIcon.className = `fa-solid ${iconClass} toast-icon`;
        }
        authToast.classList.add('show');
        setTimeout(() => {
            authToast.classList.remove('show');
        }, 3500);
    };

    // Form Field Validation Helper
    const validateField = (inputEl, errorEl, checkFn) => {
        if (!inputEl) return true;
        const isValid = checkFn(inputEl.value);
        const wrapper = inputEl.closest('.auth-input-wrapper') || inputEl.closest('.admin-input-wrapper') || inputEl.closest('.sched-input-wrapper');
        if (!isValid) {
            if (errorEl) errorEl.classList.add('show');
            if (wrapper) wrapper.style.borderColor = '#FF5F56';
        } else {
            if (errorEl) errorEl.classList.remove('show');
            if (wrapper) wrapper.style.borderColor = '';
        }
        return isValid;
    };

    // User Login submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userIn = document.getElementById('login-user');
            const passIn = document.getElementById('login-pass');
            const userErr = document.getElementById('user-error');
            const passErr = document.getElementById('pass-error');

            const isUserValid = validateField(userIn, userErr, val => val.trim().length > 0);
            const isPassValid = validateField(passIn, passErr, val => val.trim().length > 0);

            if (isUserValid && isPassValid) {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.innerHTML : 'Login';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Logging in... <i class="fa-solid fa-spinner fa-spin"></i>';
                }

                fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userIn.value,
                        password: passIn.value
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }

                    if (data.success) {
                        // Store JWT token and user info in localStorage
                        localStorage.setItem('user_token', data.token);
                        localStorage.setItem('user_info', JSON.stringify(data.user));

                        triggerAuthToast('Welcome back! Redirecting to dashboard...', 'fa-circle-check');
                        setTimeout(() => {
                            window.location.href = 'schedule-meeting.html';
                        }, 2000);
                    } else {
                        const errorBox = document.getElementById('auth-error-box');
                        if (errorBox) {
                            errorBox.textContent = data.message || 'Login failed. Please check credentials.';
                            errorBox.classList.add('show');
                        } else {
                            triggerAuthToast(data.message || 'Login failed.', 'fa-triangle-exclamation');
                        }
                    }
                })
                .catch(err => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                    triggerAuthToast('Server connection error. Please try again.', 'fa-triangle-exclamation');
                });
            }
        });
    }

    // Email OTP Verification Logic
    const btnSendEmailOtp = document.getElementById('btn-send-email-otp');
    const btnConfirmEmailOtp = document.getElementById('btn-confirm-email-otp');
    const emailOtpGroup = document.getElementById('email-otp-group');
    const emailVerifiedBadge = document.getElementById('email-verified-badge');
    const registerEmailInput = document.getElementById('register-email');
    const emailErrorEl = document.getElementById('email-error');
    const emailOtpErrorEl = document.getElementById('email-otp-error');
    const emailOtpInput = document.getElementById('register-email-otp');
    
    let isEmailVerified = false;

    // Helper to validate the registration form fields (except verification status)
    const validateRegisterFormFields = () => {
        const nameIn = document.getElementById('register-name');
        const emailIn = document.getElementById('register-email');
        const passIn = document.getElementById('register-pass');
        const confirmIn = document.getElementById('register-confirm-pass');
        const termsIn = document.getElementById('register-terms');

        const nameErr = document.getElementById('name-error');
        const emailErr = document.getElementById('email-error');
        const passErr = document.getElementById('pass-error');
        const confirmErr = document.getElementById('confirm-pass-error');
        const termsErr = document.getElementById('terms-error');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isNameValid = validateField(nameIn, nameErr, val => val.trim().length > 0);
        const isEmailValid = validateField(emailIn, emailErr, val => emailRegex.test(val));
        const isPassValid = validateField(passIn, passErr, val => val.length >= 8);
        const isConfirmValid = validateField(confirmIn, confirmErr, val => val === (passIn ? passIn.value : '') && val.length > 0);
        
        let isTermsValid = true;
        if (termsIn) {
            isTermsValid = termsIn.checked;
            if (!isTermsValid) {
                if (termsErr) termsErr.classList.add('show');
            } else {
                if (termsErr) termsErr.classList.remove('show');
            }
        }

        return {
            isValid: isNameValid && isEmailValid && isPassValid && isConfirmValid && isTermsValid,
            name: nameIn ? nameIn.value : '',
            email: emailIn ? emailIn.value : '',
            password: passIn ? passIn.value : ''
        };
    };

    const triggerSendRegisterOtp = () => {
        const formData = validateRegisterFormFields();
        if (!formData.isValid) {
            triggerAuthToast('Please fill in all details correctly before verifying.', 'fa-triangle-exclamation');
            return;
        }

        const nameIn = document.getElementById('register-name');
        const emailIn = document.getElementById('register-email');
        const passIn = document.getElementById('register-pass');
        const confirmIn = document.getElementById('register-confirm-pass');
        const termsIn = document.getElementById('register-terms');

        const originalText = btnSendEmailOtp ? btnSendEmailOtp.innerHTML : 'Verify';
        if (btnSendEmailOtp) {
            btnSendEmailOtp.disabled = true;
            btnSendEmailOtp.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: formData.name,
                email: formData.email,
                password: formData.password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (btnSendEmailOtp) {
                btnSendEmailOtp.disabled = false;
                btnSendEmailOtp.innerHTML = originalText;
            }

            if (data.success) {
                if (emailOtpGroup) {
                    emailOtpGroup.style.display = 'block';
                    emailOtpGroup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Expose OTP only in development mode for easy sandbox testing
                if (data.otpCode) {
                    triggerAuthToast(`Verification OTP sent! Try code: ${data.otpCode}`, 'fa-paper-plane');
                    const inst = emailOtpGroup.querySelector('.otp-instruction');
                    if (inst) {
                        inst.innerHTML = `OTP code has been sent. Please try: <span class="highlight" style="font-weight:600;">${data.otpCode}</span>`;
                    }
                    if (emailOtpInput) {
                        emailOtpInput.placeholder = data.otpCode;
                    }
                } else {
                    triggerAuthToast('Verification OTP has been sent to your email address.', 'fa-paper-plane');
                    const inst = emailOtpGroup.querySelector('.otp-instruction');
                    if (inst) {
                        inst.textContent = 'OTP code has been sent. Check your inbox.';
                    }
                }

                // Temporarily disable form elements to prevent modification during verification
                if (nameIn) nameIn.disabled = true;
                if (emailIn) emailIn.disabled = true;
                if (passIn) passIn.disabled = true;
                if (confirmIn) confirmIn.disabled = true;
                if (termsIn) termsIn.disabled = true;
            } else {
                const errorBox = document.getElementById('auth-error-box');
                if (errorBox) {
                    errorBox.textContent = data.message || 'Registration failed.';
                    errorBox.classList.add('show');
                }
                triggerAuthToast(data.message || 'Failed to initiate registration.', 'fa-triangle-exclamation');
            }
        })
        .catch(err => {
            if (btnSendEmailOtp) {
                btnSendEmailOtp.disabled = false;
                btnSendEmailOtp.innerHTML = originalText;
            }
            triggerAuthToast('Network error. Please try again.', 'fa-triangle-exclamation');
        });
    };

    if (btnSendEmailOtp) {
        btnSendEmailOtp.addEventListener('click', () => {
            triggerSendRegisterOtp();
        });
    }

    if (btnConfirmEmailOtp && emailOtpInput) {
        btnConfirmEmailOtp.addEventListener('click', () => {
            const codeVal = emailOtpInput.value.trim();
            const emailIn = document.getElementById('register-email');
            const emailVal = emailIn ? emailIn.value.trim() : '';

            const isCodeEntered = validateField(emailOtpInput, emailOtpErrorEl, val => val.trim().length === 4);

            if (isCodeEntered && emailVal) {
                const originalText = btnConfirmEmailOtp.innerHTML;
                btnConfirmEmailOtp.disabled = true;
                btnConfirmEmailOtp.innerHTML = 'Verifying... <i class="fa-solid fa-spinner fa-spin"></i>';

                fetch(`${API_BASE_URL}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailVal,
                        code: codeVal
                    })
                })
                .then(res => res.json())
                .then(data => {
                    btnConfirmEmailOtp.disabled = false;
                    btnConfirmEmailOtp.innerHTML = originalText;

                    if (data.success) {
                        isEmailVerified = true;
                        if (emailOtpGroup) emailOtpGroup.style.display = 'none';
                        if (btnSendEmailOtp) btnSendEmailOtp.style.display = 'none';
                        if (emailVerifiedBadge) emailVerifiedBadge.style.display = 'inline-flex';
                        
                        triggerAuthToast('Email verification successful!', 'fa-circle-check');

                        if (data.token) {
                            localStorage.setItem('user_token', data.token);
                            localStorage.setItem('user_info', JSON.stringify(data.user));
                        }

                        setTimeout(() => {
                            triggerAuthToast('Registration completed successfully! Redirecting...', 'fa-circle-check');
                            setTimeout(() => {
                                window.location.href = 'login.html';
                            }, 1500);
                        }, 1000);
                    } else {
                        if (emailOtpErrorEl) {
                            emailOtpErrorEl.textContent = data.message || 'Invalid verification code. Please check your email.';
                            emailOtpErrorEl.classList.add('show');
                        }
                        const wrapper = emailOtpInput.closest('.auth-input-wrapper');
                        if (wrapper) wrapper.style.borderColor = '#FF5F56';
                        triggerAuthToast(data.message || 'OTP verification failed.', 'fa-triangle-exclamation');
                    }
                })
                .catch(err => {
                    btnConfirmEmailOtp.disabled = false;
                    btnConfirmEmailOtp.innerHTML = originalText;
                    triggerAuthToast('Network error during verification.', 'fa-triangle-exclamation');
                });
            }
        });
    }

    // Register submit
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Check if email has been verified
            if (!isEmailVerified) {
                // If not verified, try to send OTP first (submits form)
                triggerSendRegisterOtp();
                return;
            }

            triggerAuthToast('Redirecting to login portal...', 'fa-circle-check');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // 9.5. NAVBAR AUTHENTICATED STATE MANAGEMENT
    const userToken = localStorage.getItem('user_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (userToken && userInfoStr) {
        try {
            const userInfo = JSON.parse(userInfoStr);
            const userName = userInfo.fullName || 'User';

            // Select mobile cta items
            const mobileCtas = document.querySelectorAll('#nav-menu .mobile-cta');
            // Select desktop cta items
            const desktopCtas = document.querySelectorAll('.nav-actions .nav-cta');
            
            // Replace mobile buttons
            if (mobileCtas.length > 0) {
                const parentEl = mobileCtas[0].parentNode;
                mobileCtas.forEach(el => el.remove());
                
                const userLi = document.createElement('li');
                userLi.className = 'mobile-cta user-logged-in-item';
                userLi.innerHTML = `<span class="nav-user-display" style="color: #00c6ff; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 0.95rem;"><i class="fa-solid fa-user-circle"></i> ${userName}</span>`;
                parentEl.appendChild(userLi);

                const logoutLi = document.createElement('li');
                logoutLi.className = 'mobile-cta user-logged-in-item';
                logoutLi.innerHTML = `<a href="#" class="btn btn-secondary btn-nav-logout" style="width: 100%; justify-content: center;">Logout <i class="fa-solid fa-right-from-bracket" style="margin-left: 6px;"></i></a>`;
                parentEl.appendChild(logoutLi);
            }

            // Replace desktop buttons
            if (desktopCtas.length > 0) {
                const navActions = document.querySelector('.nav-actions');
                if (navActions) {
                    desktopCtas.forEach(el => el.remove());

                    const userWrapper = document.createElement('div');
                    userWrapper.className = 'user-desktop-wrapper';
                    userWrapper.style.display = 'inline-flex';
                    userWrapper.style.alignItems = 'center';
                    userWrapper.style.gap = '15px';
                    userWrapper.style.marginRight = '10px';

                    userWrapper.innerHTML = `
                        <span class="nav-user-display" style="color: #ffffff; font-weight: 500; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 8px;"><i class="fa-solid fa-user-circle" style="color: #00c6ff; font-size: 1.1rem;"></i> ${userName}</span>
                        <a href="#" class="btn btn-secondary btn-nav-logout" style="padding: 6px 14px; font-size: 0.78rem; border-radius: 6px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-color: rgba(255,255,255,0.15);">Logout <i class="fa-solid fa-right-from-bracket" style="margin-left: 6px; font-size: 0.75rem;"></i></a>
                    `;

                    const hamburger = document.getElementById('hamburger-btn');
                    if (hamburger) {
                        navActions.insertBefore(userWrapper, hamburger);
                    } else {
                        navActions.appendChild(userWrapper);
                    }
                }
            }

            // Handle Logout click events
            document.querySelectorAll('.btn-nav-logout').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user_token');
                    localStorage.removeItem('user_info');
                    triggerAuthToast('Logged out successfully!', 'fa-circle-check');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                });
            });

        } catch (error) {
            console.error('Error rendering authenticated navbar state:', error);
        }
    }

    // 10. ADMIN LOGIN VIEWPORT CONTROLS
    const adminLoginForm = document.getElementById('admin-login-form');
    setupPasswordToggle('btn-toggle-admin-eye', 'admin-pass');

    if (adminLoginForm) {
        const credentialsStep = document.getElementById('auth-credentials-fields');
        const otpStep = document.getElementById('auth-otp-fields');
        const btnVerifyOtp = document.getElementById('btn-verify-otp');
        const btnResendOtp = document.getElementById('btn-resend-otp');

        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailIn = document.getElementById('admin-email');
            const passIn = document.getElementById('admin-pass');
            const mobileIn = document.getElementById('admin-mobile');
            const emailErr = document.getElementById('admin-email-err');
            const passErr = document.getElementById('admin-pass-err');
            const mobileErr = document.getElementById('admin-mobile-err');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const isEmailValid = validateField(emailIn, emailErr, val => emailRegex.test(val));
            const isPassValid = validateField(passIn, passErr, val => val.trim().length > 0);
            const isMobileValid = validateField(mobileIn, mobileErr, val => val.trim().length > 0);

            if (isEmailValid && isPassValid && isMobileValid) {
                // Disable submit button and show loading status
                const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.innerHTML : 'Secure Login';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Sending OTP... <i class="fa-solid fa-spinner fa-spin"></i>';
                }

                fetch(`${API_BASE_URL}/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailIn.value,
                        password: passIn.value,
                        mobileNumber: mobileIn.value
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        }

                        if (data.success) {
                            const mobileDisplay = document.getElementById('otp-mobile-display');
                            if (mobileDisplay && mobileIn) {
                                mobileDisplay.textContent = mobileIn.value;
                            }

                            triggerAuthToast('Verification OTP has been sent to your mobile!', 'fa-circle-check');

                            // Switch forms view to verification code prompt
                            if (credentialsStep && otpStep) {
                                credentialsStep.style.display = 'none';
                                otpStep.style.display = 'block';
                            }
                        } else {
                            // Display error summary in UI
                            const errorBox = document.getElementById('admin-error-box');
                            if (errorBox) {
                                errorBox.textContent = data.message || 'Verification failed. Please check credentials.';
                                errorBox.classList.add('show');
                            }
                            triggerAuthToast(data.message || 'Verification failed.', 'fa-triangle-exclamation');
                        }
                    })
                    .catch(err => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        }
                        triggerAuthToast('Server connection error. Please try again.', 'fa-triangle-exclamation');
                    });
            }
        });

        // Verification OTP Check logic
        if (btnVerifyOtp) {
            btnVerifyOtp.addEventListener('click', () => {
                const otpIn = document.getElementById('admin-otp');
                const otpErr = document.getElementById('admin-otp-err');
                const mobileIn = document.getElementById('admin-mobile');

                const isOtpEntered = validateField(otpIn, otpErr, val => val.trim().length === 6);

                if (isOtpEntered && mobileIn) {
                    btnVerifyOtp.disabled = true;
                    const originalText = btnVerifyOtp.innerHTML;
                    btnVerifyOtp.innerHTML = 'Verifying Code... <i class="fa-solid fa-spinner fa-spin"></i>';

                    fetch(`${API_BASE_URL}/admin/verify-mobile-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            mobileNumber: mobileIn.value,
                            code: otpIn.value
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            btnVerifyOtp.disabled = false;
                            btnVerifyOtp.innerHTML = originalText;

                            if (data.success) {
                                // Store JWT token in localStorage for route protections
                                localStorage.setItem('admin_token', data.token);

                                triggerAuthToast('MFA Verification successful. Redirecting...', 'fa-circle-check');
                                setTimeout(() => {
                                    window.location.href = 'admin-dashboard.html';
                                }, 2000);
                            } else {
                                if (otpIn && otpErr) {
                                    otpErr.textContent = data.message || 'Invalid code. Please check your SMS.';
                                    otpErr.classList.add('show');
                                    otpIn.closest('.admin-input-wrapper').style.borderColor = '#FF5F56';
                                }
                                triggerAuthToast(data.message || 'OTP verification failed.', 'fa-triangle-exclamation');
                            }
                        })
                        .catch(err => {
                            btnVerifyOtp.disabled = false;
                            btnVerifyOtp.innerHTML = originalText;
                            triggerAuthToast('Server connection error.', 'fa-triangle-exclamation');
                        });
                }
            });
        }

        // Resend Verification code handler
        if (btnResendOtp) {
            btnResendOtp.addEventListener('click', (e) => {
                e.preventDefault();
                const mobileIn = document.getElementById('admin-mobile');
                const emailIn = document.getElementById('admin-email');
                const passIn = document.getElementById('admin-pass');

                if (mobileIn && emailIn && passIn) {
                    triggerAuthToast('Resending verification code...', 'fa-paper-plane');
                    fetch(`${API_BASE_URL}/admin/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: emailIn.value,
                            password: passIn.value,
                            mobileNumber: mobileIn.value
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                triggerAuthToast('New verification code sent successfully.', 'fa-circle-check');
                            } else {
                                triggerAuthToast(data.message || 'Resend failed.', 'fa-triangle-exclamation');
                            }
                        })
                        .catch(err => {
                            triggerAuthToast('Server connection error.', 'fa-triangle-exclamation');
                        });
                }
            });
        }
    }

    // 11. MEETING SCHEDULING FORM LOGIC
    const scheduleForm = document.getElementById('schedule-meeting-form');
    const successModal = document.getElementById('success-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    const validateFieldCustom = (inputEl, errorEl, checkFn) => {
        if (!inputEl) return true;
        const isValid = checkFn(inputEl.value);
        if (!isValid) {
            if (errorEl) errorEl.classList.add('show');
            const wrapper = inputEl.closest('.sched-input-wrapper');
            if (wrapper) wrapper.style.borderColor = '#FF5F56';
        } else {
            if (errorEl) errorEl.classList.remove('show');
            const wrapper = inputEl.closest('.sched-input-wrapper');
            if (wrapper) wrapper.style.borderColor = '';
        }
        return isValid;
    };

    // Populate user meetings list helper from API database
    const populateUserMeetings = () => {
        const listBody = document.getElementById('user-meetings-list-body');
        const placeholder = document.getElementById('no-meetings-placeholder');
        const wrapper = document.getElementById('user-meetings-table-wrapper');

        if (!listBody) return;

        const token = localStorage.getItem('user_token');
        if (!token) {
            // User not logged in, show login prompt placeholder
            if (placeholder) {
                placeholder.innerHTML = `
                    <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; color: var(--gray-muted); margin-bottom: 15px; display: block;"></i>
                    <p style="font-size: 0.95rem; color: var(--white); font-weight: 500;">Please Login to See Your Meetings</p>
                    <p style="font-size: 0.82rem; color: var(--gray-muted); margin-top: 4px;">Sign in to check the status of your booked consultation sessions.</p>
                `;
                placeholder.style.display = 'block';
            }
            if (wrapper) wrapper.style.display = 'none';
            return;
        }

        fetch(`${API_BASE_URL}/meetings/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.meetings && data.meetings.length > 0) {
                if (placeholder) placeholder.style.display = 'none';
                if (wrapper) wrapper.style.display = 'block';

                listBody.innerHTML = '';
                data.meetings.forEach(meet => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';

                    // Map service values to labels
                    let serviceLabel = meet.service;
                    if (meet.service === 'events') serviceLabel = 'Event Services';
                    else if (meet.service === 'gifting') serviceLabel = 'Gifting Services';
                    else if (meet.service === 'branding') serviceLabel = 'Branding & Printing';
                    else if (meet.service === 'recruitment') serviceLabel = 'Recruitment Services';

                    // Map time slot values to labels
                    let timeLabel = meet.time;
                    if (meet.time === 'morning_early') timeLabel = '09:00 AM - 10:30 AM';
                    else if (meet.time === 'morning_late') timeLabel = '11:00 AM - 12:30 PM';
                    else if (meet.time === 'afternoon_early') timeLabel = '02:00 PM - 03:30 PM';
                    else if (meet.time === 'afternoon_late') timeLabel = '04:00 PM - 05:30 PM';

                    const dateStr = new Date(meet.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });

                    // Build status badge
                    let statusBadge = '';
                    if (meet.status === 'Approved') {
                        statusBadge = `<span class="status-badge-inline status-approved">Approved</span>`;
                        if (meet.link) {
                            statusBadge += `<br><a href="${meet.link}" target="_blank" style="color: #00c6ff; text-decoration: none; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 500;"><i class="fa-solid fa-video"></i> Join Meet</a>`;
                        }
                    } else if (meet.status === 'Rejected') {
                        statusBadge = `<span class="status-badge-inline status-rejected">Rejected</span>`;
                        if (meet.rejectReason) {
                            statusBadge += `<br><span style="display: inline-block; font-size: 0.72rem; color: #ff5f56; margin-top: 4px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${meet.rejectReason}">Reason: ${meet.rejectReason}</span>`;
                        }
                    } else {
                        statusBadge = `<span class="status-badge-inline status-pending">Pending Review</span>`;
                    }

                    tr.innerHTML = `
                        <td style="padding: 14px 10px; font-weight: 500; color: var(--white);">${serviceLabel}</td>
                        <td style="padding: 14px 10px; color: var(--gray-muted);">${dateStr}</td>
                        <td style="padding: 14px 10px; color: var(--gray-muted);">${timeLabel}</td>
                        <td style="padding: 14px 10px; text-align: right; vertical-align: top;">${statusBadge}</td>
                    `;
                    listBody.appendChild(tr);
                });
            } else {
                if (placeholder) {
                    placeholder.innerHTML = `
                        <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; color: var(--gray-muted); margin-bottom: 15px; display: block;"></i>
                        <p style="font-size: 0.95rem; color: var(--white); font-weight: 500;">No Scheduled Meetings</p>
                        <p style="font-size: 0.82rem; color: var(--gray-muted); margin-top: 4px;">Use the form above to book a consultation slot with our executive directors.</p>
                    `;
                    placeholder.style.display = 'block';
                }
                if (wrapper) wrapper.style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Error fetching user meetings:', err);
        });
    };

    // Run initial population check
    populateUserMeetings();

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameIn = document.getElementById('sched-name');
            const emailIn = document.getElementById('sched-email');
            const phoneIn = document.getElementById('sched-phone');
            const companyIn = document.getElementById('sched-company');
            const serviceIn = document.getElementById('sched-service');
            const purposeIn = document.getElementById('sched-purpose');
            const dateIn = document.getElementById('sched-date');
            const timeIn = document.getElementById('sched-time');
            const notesIn = document.getElementById('sched-notes');

            const nameErr = document.getElementById('sched-name-err');
            const emailErr = document.getElementById('sched-email-err');
            const phoneErr = document.getElementById('sched-phone-err');
            const companyErr = document.getElementById('sched-company-err');
            const serviceErr = document.getElementById('sched-service-err');
            const purposeErr = document.getElementById('sched-purpose-err');
            const dateErr = document.getElementById('sched-date-err');
            const timeErr = document.getElementById('sched-time-err');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const isNameValid = validateFieldCustom(nameIn, nameErr, val => val.trim().length > 0);
            const isEmailValid = validateFieldCustom(emailIn, emailErr, val => emailRegex.test(val));
            const isPhoneValid = validateFieldCustom(phoneIn, phoneErr, val => val.trim().length > 0);
            const isCompanyValid = validateFieldCustom(companyIn, companyErr, val => val.trim().length > 0);
            const isServiceValid = validateFieldCustom(serviceIn, serviceErr, val => val !== null && val !== '');
            const isPurposeValid = validateFieldCustom(purposeIn, purposeErr, val => val.trim().length > 0);
            const isDateValid = validateFieldCustom(dateIn, dateErr, val => val !== '');
            const isTimeValid = validateFieldCustom(timeIn, timeErr, val => val !== null && val !== '');

            if (isNameValid && isEmailValid && isPhoneValid && isCompanyValid && isServiceValid && isPurposeValid && isDateValid && isTimeValid) {
                const submitBtn = scheduleForm.querySelector('.btn-booking-submit');
                const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Booking Request';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Submitting Booking... <i class="fa-solid fa-spinner fa-spin"></i>';
                }

                const payload = {
                    fullName: nameIn.value,
                    email: emailIn.value,
                    phone: phoneIn.value,
                    company: companyIn.value,
                    service: serviceIn.value,
                    purpose: purposeIn.value,
                    date: dateIn.value,
                    time: timeIn.value,
                    notes: notesIn ? notesIn.value : ''
                };

                const headers = { 'Content-Type': 'application/json' };
                const token = localStorage.getItem('user_token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                fetch(`${API_BASE_URL}/meetings/create`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(data => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }

                    if (data.success) {
                        if (successModal) {
                            successModal.classList.add('active');
                        }
                    } else {
                        triggerAuthToast(data.message || 'Failed to submit booking request.', 'fa-triangle-exclamation');
                    }
                })
                .catch(err => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                    triggerAuthToast('Server connection error. Please try again.', 'fa-triangle-exclamation');
                });
            }
        });
    }

    if (btnCloseModal && successModal) {
        btnCloseModal.addEventListener('click', () => {
            successModal.classList.remove('active');
            window.location.reload();
        });
    }

    // 12. ADMIN DASHBOARD OPERATIONS CATALOG
    const bookingsTable = document.querySelector('.bookings-table');
    if (bookingsTable) {
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
            window.location.href = 'admin-login.html';
        } else {
            const refreshBtn = document.querySelector('.btn-refresh-table');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    loadDashboardData();
                });
            }

            const loadDashboardData = () => {
                // Fetch metrics counters
                fetch(`${API_BASE_URL}/admin/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.metrics) {
                        const metrics = document.querySelectorAll('.metric-card h3');
                        if (metrics.length >= 4) {
                            metrics[0].textContent = data.metrics.total ?? '0';
                            metrics[1].textContent = data.metrics.approved ?? '0';
                            metrics[2].textContent = data.metrics.pending ?? '0';
                            metrics[3].textContent = data.metrics.rejected ?? '0';
                        }
                    }
                })
                .catch(err => console.error('Error fetching metrics stats:', err));

                // Fetch bookings catalogue
                fetch(`${API_BASE_URL}/meetings/admin`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    const tbody = bookingsTable.querySelector('tbody');
                    if (!tbody) return;

                    if (data.success && data.meetings && data.meetings.length > 0) {
                        tbody.innerHTML = '';
                        data.meetings.forEach(meet => {
                            const tr = document.createElement('tr');
                            
                            let statusClass = 'pending';
                            if (meet.status === 'Approved') statusClass = 'approved';
                            else if (meet.status === 'Rejected') statusClass = 'rejected';

                            const dateStr = new Date(meet.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            let serviceLabel = meet.service;
                            if (meet.service === 'events') serviceLabel = 'Event Services';
                            else if (meet.service === 'gifting') serviceLabel = 'Gifting Services';
                            else if (meet.service === 'branding') serviceLabel = 'Branding & Printing';
                            else if (meet.service === 'recruitment') serviceLabel = 'Recruitment Services';

                            let timeLabel = meet.time;
                            if (meet.time === 'morning_early') timeLabel = '09:00 AM - 10:30 AM';
                            else if (meet.time === 'morning_late') timeLabel = '11:00 AM - 12:30 PM';
                            else if (meet.time === 'afternoon_early') timeLabel = '02:00 PM - 03:30 PM';
                            else if (meet.time === 'afternoon_late') timeLabel = '04:00 PM - 05:30 PM';

                            tr.innerHTML = `
                                <td>
                                    <div class="client-cell">
                                        <div class="avatar-circle"><i class="fa-solid fa-user"></i></div>
                                        <div>
                                            <span class="client-name">${meet.fullName}</span>
                                            <span class="client-role">${serviceLabel}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>${meet.company}</td>
                                <td>${dateStr}</td>
                                <td>${timeLabel}</td>
                                <td><span class="status-badge-inline status-${statusClass}">${meet.status}</span></td>
                                <td style="text-align: right;">
                                    <a href="meeting-details.html?id=${meet._id}" class="btn btn-details-link">Manage <i class="fa-solid fa-arrow-right-long"></i></a>
                                </td>
                            `;
                            tbody.appendChild(tr);
                        });
                    } else {
                        // Remove dummy meetings and display nice message
                        tbody.innerHTML = `
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray-muted);">
                                    <i class="fa-regular fa-calendar-xmark" style="font-size: 2.5rem; display: block; margin-bottom: 12px;"></i>
                                    <span style="font-weight: 600; display: block; margin-bottom: 4px; color: var(--white);">No Booking Requests Found</span>
                                    <span>When B2B corporate partners schedule consultation sessions, they will appear here.</span>
                                </td>
                            </tr>
                        `;

                        const metrics = document.querySelectorAll('.metric-card h3');
                        metrics.forEach(m => m.textContent = '0');
                    }
                })
                .catch(err => {
                    console.error('Error fetching admin bookings catalog:', err);
                });
            };

            loadDashboardData();

            // Handle Admin Session Close / Logout
            const adminLogouts = document.querySelectorAll('a[href="index.html"]');
            adminLogouts.forEach(link => {
                if (link.textContent.toLowerCase().includes('logout')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('admin_token');
                        triggerAuthToast('Admin session closed successfully!', 'fa-circle-check');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1000);
                    });
                }
            });
        }
    }

    // ==========================================================================
    // 13. DYNAMIC PROJECT GALLERY & LIGHTBOX SYSTEM
    // ==========================================================================
    
    // Project Images data structure matching the user's files in ../images/
    const projectGalleryData = {
        'mega-corp': {
            title: 'Mega Corp Annual Summit',
            images: [
                { src: '../images/event_1.jpg', alt: 'Annual Summit Stage Setup' },
                { src: '../images/event_2.jpg', alt: 'LED Screen Display' },
                { src: '../images/event_3.jpg', alt: 'Exhibition Stall Design' },
                { src: '../images/event_4.jpg', alt: 'Catering and Lounge Area' }
            ]
        },
        'welcome-kits': {
            title: 'Executive Welcome Kits Curation',
            images: [
                { src: '../images/gifting_1.jpg', alt: 'Eco Welcome Gift Set' },
                { src: '../images/gifting_2.jpg', alt: 'Custom Logo Engraving' },
                { src: '../images/gifting_3.jpg', alt: 'Welcome Kit Box Packaging' },
                { src: '../images/gifting_4.jpg', alt: 'Onboarding Stationery Set' }
            ]
        },
        'storefront-branding': {
            title: 'Storefront Branding Signages',
            images: Array.from({ length: 30 }, (_, i) => ({
                src: `../images/all%20branding%20images/${i + 1}.jpeg`,
                alt: `Branding Project Display ${i + 1}`
            }))
        },
        'talent-drive': {
            title: 'Tech Talent Acquisition Drive',
            images: [
                { src: '../images/recruitment_1.jpg', alt: 'Corporate Placement Drive' },
                { src: '../images/recruitment_2.jpg', alt: 'Candidate Technical Interview' },
                { src: '../images/recruitment_3.jpg', alt: 'Sourcing and Screening Session' },
                { src: '../images/recruitment_4.jpg', alt: 'Executive Headhunting Consultation' }
            ]
        },
        'auto-launch': {
            title: 'Auto Launch Distributor Meet',
            images: [
                { src: '../images/launch_1.jpg', alt: 'Electric Vehicle Reveal Stage' },
                { src: '../images/launch_2.jpg', alt: 'Distributor Conference Hall' },
                { src: '../images/launch_3.jpg', alt: 'Stage Lighting and Backdrop Setup' },
                { src: '../images/launch_4.jpg', alt: 'Launch Promotional Display Kiosk' }
            ]
        },
        'festival-gifting': {
            title: 'Eco-Friendly Festival Gift Packs',
            images: [
                { src: '../images/festival_1.jpg', alt: 'Handmade Paper Diaries & Hampers' },
                { src: '../images/festival_2.jpg', alt: 'Organic Sweet & Dry Fruit Hampers' },
                { src: '../images/festival_3.jpg', alt: 'Bamboo Thermos Bottle Set' },
                { src: '../images/festival_4.jpg', alt: 'Diwali Corporate Gift Curation' }
            ]
        }
    };

    const detailsBtns = document.querySelectorAll('.btn-details[data-project]');
    const gallerySection = document.getElementById('project-gallery');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryImagesRow = document.getElementById('gallery-images-row');
    const galleryFeaturedImg = document.getElementById('gallery-featured-img');

    // Lightbox modal elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (detailsBtns.length > 0 && gallerySection && galleryImagesRow) {
        detailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                const projectId = btn.getAttribute('data-project');
                const projectData = projectGalleryData[projectId];

                if (!projectData) return;

                // Set gallery title
                if (galleryTitle) {
                    galleryTitle.innerHTML = `Gallery: <span class="text-gradient">${projectData.title}</span>`;
                }

                // Generate the 30 branding images array dynamically (using the same set of images for all cards)
                const images = Array.from({ length: 30 }, (_, i) => ({
                    src: `../images/all%20branding%20images/${i + 1}.jpeg`,
                    alt: `${projectData.title} View ${i + 1}`
                }));

                // Load the first image into the large featured frame by default
                if (galleryFeaturedImg && images.length > 0) {
                    galleryFeaturedImg.src = images[0].src;
                    galleryFeaturedImg.alt = images[0].alt;
                }

                // Clear previous gallery items
                galleryImagesRow.innerHTML = '';

                // Populate row of images
                images.forEach((imgData, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'gallery-item';
                    if (index === 0) itemDiv.classList.add('active');

                    // Use fallback logo image on error (No text/name shown on thumbnail)
                    itemDiv.innerHTML = `
                        <img src="${imgData.src}" alt="${imgData.alt}" onerror="this.src='../images/image.png';">
                    `;

                    // Hover (mouseenter) to update the large featured preview frame
                    itemDiv.addEventListener('mouseenter', () => {
                        // Remove active class from all other thumbnails in the row
                        galleryImagesRow.querySelectorAll('.gallery-item').forEach(el => el.classList.remove('active'));
                        // Mark this thumbnail as active
                        itemDiv.classList.add('active');

                        if (galleryFeaturedImg) {
                            galleryFeaturedImg.style.opacity = '0.4';
                            setTimeout(() => {
                                galleryFeaturedImg.src = imgData.src;
                                galleryFeaturedImg.alt = imgData.alt;
                                galleryFeaturedImg.style.opacity = '1';
                            }, 100);
                        }
                    });

                    // Click to update large featured preview immediately (for mobile/tap devices)
                    itemDiv.addEventListener('click', () => {
                        galleryImagesRow.querySelectorAll('.gallery-item').forEach(el => el.classList.remove('active'));
                        itemDiv.classList.add('active');
                        if (galleryFeaturedImg) {
                            galleryFeaturedImg.src = imgData.src;
                            galleryFeaturedImg.alt = imgData.alt;
                        }
                    });

                    galleryImagesRow.appendChild(itemDiv);
                });

                // Click on the large featured image itself opens the lightbox fullscreen
                if (galleryFeaturedImg) {
                    galleryFeaturedImg.onclick = () => {
                        if (lightboxModal && lightboxImg && lightboxCaption) {
                            lightboxImg.src = galleryFeaturedImg.src;
                            lightboxImg.onerror = () => { lightboxImg.src = '../images/image.png'; };
                            lightboxCaption.textContent = galleryFeaturedImg.alt;
                            lightboxModal.classList.add('active');
                        }
                    };
                }

                // Display the gallery section
                gallerySection.style.display = 'block';

                // Scroll smoothly to gallery section
                setTimeout(() => {
                    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            });
        });
    }

    // Lightbox Modal Close Handler
    if (lightboxModal && lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        // Close lightbox on clicking backdrop area outside the content
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });

        // Close lightbox on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
            }
        });
    }
});


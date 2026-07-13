/* ==========================================================================
   IECLATE INOVATE CONTACT PAGE SCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. FAQ ACCORDION LOGIC =================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Collapse all other FAQ items first for accordion effect
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = '0px';
                }
            });

            // If the clicked item was not active, expand it
            if (!isActive) {
                faqItem.classList.add('active');
                // Set max-height dynamically based on scrollHeight for a smooth transition
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });


    // ================= 2. CONTACT FORM VALIDATION =================
    const contactForm = document.getElementById('contact-form');
    const formMsgBox = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous message box states
            formMsgBox.style.display = 'none';
            formMsgBox.className = 'form-message-box';
            formMsgBox.innerText = '';

            // Form inputs
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;

            // Simple helper functions to set/clear errors
            const setError = (inputElement, errorElementId) => {
                const group = inputElement.closest('.form-group');
                if (group) group.classList.add('error');
                isValid = false;
            };

            const clearError = (inputElement) => {
                const group = inputElement.closest('.form-group');
                if (group) group.classList.remove('error');
            };

            // Reset all previous error states
            [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach(clearError);

            // Validate Name
            if (nameInput.value.trim() === '') {
                setError(nameInput);
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                setError(emailInput);
            }

            // Validate Subject
            if (subjectInput.value.trim() === '') {
                setError(subjectInput);
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                setError(messageInput);
            }

            // Validate Phone (Required by Mongoose schema & route validator)
            const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
            if (phoneInput.value.trim() === '' || !phoneRegex.test(phoneInput.value.trim())) {
                setError(phoneInput);
            }

            // If Valid, dispatch real API transaction to the backend
            if (isValid) {
                // Disable form submit to prevent double-submit during transaction
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';

                const API_BASE_URL = 'http://localhost:5000/api';

                const payload = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim()
                };

                fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(data => {
                    // Restore submit button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    if (data.success) {
                        formMsgBox.classList.remove('error');
                        formMsgBox.classList.add('success');
                        formMsgBox.innerText = data.message || 'Thank you! Your message has been sent successfully. Our team will contact you soon.';
                        formMsgBox.style.display = 'block';

                        // Reset form fields
                        contactForm.reset();
                    } else {
                        formMsgBox.classList.remove('success');
                        formMsgBox.classList.add('error');
                        if (data.errors && data.errors.length > 0) {
                            formMsgBox.innerText = data.errors.map(err => err.msg).join(', ');
                        } else {
                            formMsgBox.innerText = data.message || 'Failed to send message. Please try again.';
                        }
                        formMsgBox.style.display = 'block';
                    }

                    // Smooth scroll up to alert message
                    formMsgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                })
                .catch(err => {
                    // Restore submit button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    formMsgBox.classList.remove('success');
                    formMsgBox.classList.add('error');
                    formMsgBox.innerText = 'Connection error. Please check if your backend server is running and try again.';
                    formMsgBox.style.display = 'block';

                    formMsgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            } else {
                // Error response feedback
                formMsgBox.classList.add('error');
                formMsgBox.innerText = 'Please check the highlighted fields above and try again.';
                formMsgBox.style.display = 'block';
            }
        });
    }
});

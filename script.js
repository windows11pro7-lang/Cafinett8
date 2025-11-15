// اطلاعات تماس - این قسمت را با اطلاعات خودتان جایگزین کنید
const telegramUsername = 'Cafinett8'; // آیدی تلگرام بدون @
const whatsappNumber = '09224044842'; // شماره واتس‌اپ با کد کشور (98 برای ایران)

// تنظیم لینک‌ها
document.getElementById('telegram-link').href = `https://t.me/${telegramUsername}`;
document.getElementById('whatsapp-link').href = `https://wa.me/${whatsappNumber}`;

// (اختیاری) افزودن اثر کلیک برای دکمه‌ها
document.querySelectorAll('.contact-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

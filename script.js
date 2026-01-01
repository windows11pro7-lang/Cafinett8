// ذخیره تاریخچه در localStorage
let printHistory = JSON.parse(localStorage.getItem('kafinetHistory')) || [];

// تنظیمات
let settings = JSON.parse(localStorage.getItem('kafinetSettings')) || {
    defaultPrintCost: 5000,
    shopName: "کافی نت شهر",
    contactNumber: "09224044842"
};

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadHistory();
    setCurrentDate();
    
    // تنظیم تاریخ امروز به صورت پیش‌فرض
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('violationDate').value = today;
});

// پیش نمایش سند
function previewDocument() {
    // اعتبارسنجی فرم
    if (!validateForm()) {
        alert('لطفاً تمام فیلدهای ضروری را پر کنید');
        return;
    }
    
    // جمع‌آوری داده‌ها
    const formData = getFormData();
    
    // نمایش در بخش پیش نمایش
    document.getElementById('printDocType').textContent = formData.documentType;
    document.getElementById('printPlate').textContent = formData.plateNumber;
    document.getElementById('printAmount').textContent = numberWithCommas(formData.amount) + ' تومان';
    document.getElementById('printDate').textContent = formatDate(formData.violationDate);
    document.getElementById('printCode').textContent = formData.trackingCode;
    document.getElementById('printLocation').textContent = formData.violationLocation || '-';
    document.getElementById('printDesc').textContent = formData.description || '-';
    document.getElementById('printCostValue').textContent = numberWithCommas(formData.printCost);
    
    // محاسبه جمع کل
    const total = parseInt(formData.amount) + parseInt(formData.printCost);
    document.getElementById('printTotal').textContent = numberWithCommas(total) + ' تومان';
    
    // تاریخ چاپ امروز
    document.getElementById('printCurrentDate').textContent = getCurrentDate();
    
    // اسکرول به بخش پیش نمایش
    document.getElementById('print-section').scrollIntoView({ behavior: 'smooth' });
}

// چاپ سند
function printDocument() {
    window.print();
}

// ذخیره و چاپ
function saveAndPrint() {
    if (!validateForm()) {
        alert('لطفاً تمام فیلدهای ضروری را پر کنید');
        return;
    }
    
    const formData = getFormData();
    
    // اضافه کردن به تاریخچه
    const historyItem = {
        id: Date.now(),
        ...formData,
        printDate: new Date().toISOString()
    };
    
    printHistory.unshift(historyItem);
    localStorage.setItem('kafinetHistory', JSON.stringify(printHistory));
    
    // آپدیت تاریخچه نمایش
    loadHistory();
    
    // پر کردن پیش نمایش
    previewDocument();
    
    // چاپ خودکار
    setTimeout(() => {
        printDocument();
    }, 500);
    
    alert('سند با موفقیت ذخیره و چاپ شد!');
}

// ذخیره در تاریخچه
function saveToHistory() {
    const formData = getFormData();
    
    const historyItem = {
        id: Date.now(),
        ...formData,
        printDate: new Date().toISOString()
    };
    
    printHistory.unshift(historyItem);
    localStorage.setItem('kafinetHistory', JSON.stringify(printHistory));
    loadHistory();
    
    alert('سند در تاریخچه ذخیره شد!');
}

// بارگذاری تاریخچه
function loadHistory() {
    const tbody = document.getElementById('historyTable');
    tbody.innerHTML = '';
    
    printHistory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.documentType}</td>
            <td>${item.plateNumber}</td>
            <td>${numberWithCommas(item.amount)} تومان</td>
            <td>${formatDate(item.printDate)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewHistoryItem(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteHistoryItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// مشاهده آیتم تاریخچه
function viewHistoryItem(id) {
    const item = printHistory.find(item => item.id === id);
    if (item) {
        // پر کردن فرم با داده‌های ذخیره شده
        document.getElementById('documentType').value = item.documentType;
        document.getElementById('plateNumber').value = item.plateNumber;
        document.getElementById('amount').value = item.amount;
        document.getElementById('violationDate').value = item.violationDate.split('T')[0];
        document.getElementById('trackingCode').value = item.trackingCode;
        document.getElementById('violationLocation').value = item.violationLocation || '';
        document.getElementById('description').value = item.description || '';
        document.getElementById('printCost').value = item.printCost;
        
        // پیش نمایش
        previewDocument();
        
        alert('داده‌ها در فرم بارگذاری شدند. می‌توانید ویرایش کرده و مجدداً چاپ کنید.');
    }
}

// حذف از تاریخچه
function deleteHistoryItem(id) {
    if (confirm('آیا از حذف این رکورد مطمئنید؟')) {
        printHistory = printHistory.filter(item => item.id !== id);
        localStorage.setItem('kafinetHistory', JSON.stringify(printHistory));
        loadHistory();
    }
}

// پاک کردن فرم
function clearForm() {
    if (confirm('آیا می‌خواهید فرم را پاک کنید؟')) {
        document.querySelectorAll('#form-section input, #form-section textarea, #form-section select')
            .forEach(element => {
                if (element.id !== 'printCost') {
                    element.value = '';
                }
            });
        document.getElementById('printCost').value = settings.defaultPrintCost;
        
        // تنظیم تاریخ امروز
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('violationDate').value = today;
    }
}

// بارگذاری تنظیمات
function loadSettings() {
    document.getElementById('defaultPrintCost').value = settings.defaultPrintCost;
    document.getElementById('shopName').value = settings.shopName;
    document.getElementById('contactNumber').value = settings.contactNumber;
    
    // اعمال در فرم
    document.getElementById('printCost').value = settings.defaultPrintCost;
}

// ذخیره تنظیمات
function saveSettings() {
    settings.defaultPrintCost = document.getElementById('defaultPrintCost').value;
    settings.shopName = document.getElementById('shopName').value;
    settings.contactNumber = document.getElementById('contactNumber').value;
    
    localStorage.setItem('kafinetSettings', JSON.stringify(settings));
    
    // آپدیت نمایش
    document.querySelector('.phone-number').textContent = settings.contactNumber;
    document.querySelector('.address').textContent = settings.shopName;
    document.getElementById('printCost').value = settings.defaultPrintCost;
    
    alert('تنظیمات با موفقیت ذخیره شد!');
}

// توابع کمکی
function getFormData() {
    return {
        documentType: document.getElementById('documentType').value,
        plateNumber: document.getElementById('plateNumber').value,
        amount: document.getElementById('amount').value,
        violationDate: document.getElementById('violationDate').value,
        trackingCode: document.getElementById('trackingCode').value,
        violationLocation: document.getElementById('violationLocation').value,
        description: document.getElementById('description').value,
        printCost: document.getElementById('printCost').value || settings.defaultPrintCost
    };
}

function validateForm() {
    const required = ['documentType', 'plateNumber', 'amount', 'violationDate', 'trackingCode'];
    for (let field of required) {
        const value = document.getElementById(field).value.trim();
        if (!value) return false;
    }
    return true;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const persianDate = date.toLocaleDateString('fa-IR');
    return persianDate;
}

function getCurrentDate() {
    return new Date().toLocaleDateString('fa-IR');
}

function setCurrentDate() {
    document.getElementById('printCurrentDate').textContent = getCurrentDate();
}

// Config Loader - Tải cấu hình từ file JSON và áp dụng vào website
// Sử dụng file này để tự động load thông tin từ wedding-config.json

let weddingConfig = null;

// Load cấu hình từ file JSON
async function loadWeddingConfig() {
    try {
        const response = await fetch('./wedding-config.json');
        weddingConfig = await response.json();
        
        // Áp dụng cấu hình vào website
        applyCoupleInfo();
        applyWeddingDate();
        applyHeroSlider();
        applyGalleryImages();
        applyWeddingEvents();
        applySEOSettings();
        applyMusicSettings();
        applyMapSettings();
        applyBankingInfo();
        
        // Khởi tạo lại FancyBox nếu có
        if (typeof $.fancybox !== 'undefined') {
            $('.fancybox').fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
        
        console.log('✅ Đã load cấu hình thành công từ wedding-config.json');
    } catch (error) {
        console.error('❌ Lỗi khi load cấu hình:', error);
        console.log('📝 Sử dụng cấu hình mặc định từ HTML');
    }
}

// Áp dụng thông tin cô dâu chú rể
function applyCoupleInfo() {
    if (!weddingConfig?.coupleInfo) return;
    
    const { bride, groom } = weddingConfig.coupleInfo;
    
    // Cập nhật thông tin cô dâu - Format mới (Bootstrap layout)
    const brideSection = document.querySelector('.bride-section');
    if (brideSection) {
        // Cập nhật ảnh cô dâu với hỗ trợ 2 ảnh riêng biệt
        updateCoupleImages(brideSection, bride, 'bride');
        
        // Cập nhật tên cô dâu
        const brideNameElement = brideSection.querySelector('h4');
        if (brideNameElement) {
            brideNameElement.textContent = bride.name;
        }
        
        // Cập nhật mô tả cô dâu
        const brideDescElement = brideSection.querySelector('p.text-secondary');
        if (brideDescElement && bride.description) {
            brideDescElement.innerHTML = bride.description;
        }
        
        // Cập nhật Facebook link cô dâu
        const brideFacebookLink = brideSection.querySelector('.bride-facebook-link');
        if (brideFacebookLink) {
            if (bride.facebook && bride.facebook !== '#' && bride.facebook.trim()) {
                brideFacebookLink.href = bride.facebook;
                brideFacebookLink.style.display = 'inline-flex';
                // Thêm event listener để xử lý click với mobile support
                brideFacebookLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    openFacebookProfile(bride.facebook, 'Cô dâu');
                });
                console.log('✅ Updated bride Facebook link:', bride.facebook);
            } else {
                brideFacebookLink.style.display = 'none';
                console.log('⚠️ Bride Facebook link hidden (no valid URL)');
            }
        } else {
            console.log('❌ Bride Facebook link element not found');
        }
    }
    
    // Cập nhật thông tin chú rể - Format mới (Bootstrap layout)
    const groomSection = document.querySelector('.groom-section');
    if (groomSection) {
        // Cập nhật ảnh chú rể với hỗ trợ 2 ảnh riêng biệt
        updateCoupleImages(groomSection, groom, 'groom');
        
        // Cập nhật tên chú rể
        const groomNameElement = groomSection.querySelector('h4');
        if (groomNameElement) {
            groomNameElement.textContent = groom.name;
        }
        
        // Cập nhật mô tả chú rể
        const groomDescElement = groomSection.querySelector('p.text-secondary');
        if (groomDescElement && groom.description) {
            groomDescElement.innerHTML = groom.description;
        }
        
        // Cập nhật Facebook link chú rể
        const groomFacebookLink = groomSection.querySelector('.groom-facebook-link');
        if (groomFacebookLink) {
            if (groom.facebook && groom.facebook !== '#' && groom.facebook.trim()) {
                groomFacebookLink.href = groom.facebook;
                groomFacebookLink.style.display = 'inline-flex';
                // Thêm event listener để xử lý click với mobile support
                groomFacebookLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    openFacebookProfile(groom.facebook, 'Chú rể');
                });
                console.log('✅ Updated groom Facebook link:', groom.facebook);
            } else {
                groomFacebookLink.style.display = 'none';
                console.log('⚠️ Groom Facebook link hidden (no valid URL)');
            }
        } else {
            console.log('❌ Groom Facebook link element not found');
        }
    }
    

    
    // Cập nhật tên trong hero section
    const brideNameElement = document.querySelector('.bride-name');
    const groomNameElement = document.querySelector('.groom-name');
    if (brideNameElement) brideNameElement.textContent = bride.name;
    if (groomNameElement) groomNameElement.textContent = groom.name;
}

// Áp dụng thông tin ngày cưới
function applyWeddingDate() {
    if (!weddingConfig?.weddingDate) return;
    
    const { datetime, displayDate, invitationText } = weddingConfig.weddingDate;
    
    // Cập nhật ngày hiển thị
    const dateElement = document.querySelector('.wedding-date');
    if (dateElement) dateElement.textContent = displayDate;
    const footerDate = document.querySelector('.footer-date');
    if (footerDate) footerDate.textContent = displayDate;
    
    // Cập nhật lời mời
    const invitationElement = document.querySelector('.invitation-text');
    if (invitationElement) invitationElement.textContent = invitationText;
    
    // Cập nhật tên cô dâu chú rể trong hero
    if (weddingConfig.coupleInfo) {
        const brideNameElement = document.querySelector('.bride-name');
        const groomNameElement = document.querySelector('.groom-name');
        
        if (brideNameElement && weddingConfig.coupleInfo.bride.name) {
            brideNameElement.textContent = weddingConfig.coupleInfo.bride.name;
        }
        
        if (groomNameElement && weddingConfig.coupleInfo.groom.name) {
            groomNameElement.textContent = weddingConfig.coupleInfo.groom.name;
        }
    }
    
    // Cập nhật countdown với ngày mới
    if (datetime) {
        updateCountdownDate(datetime);
    }
}

// Áp dụng ảnh hero slider
function applyHeroSlider() {
    if (!weddingConfig?.heroSlider) return;
    
    // Apply desktop hero slider
    if (weddingConfig.heroSlider.desktop?.images) {
        const desktopSlider = document.querySelector('.hero-slider-desktop');
        if (desktopSlider) {
            applyHeroSliderToElement(desktopSlider, weddingConfig.heroSlider.desktop.images, 'desktop');
        }
    }
    
    // Apply mobile hero slider
    if (weddingConfig.heroSlider.mobile?.images) {
        const mobileSlider = document.querySelector('.hero-slider-mobile');
        if (mobileSlider) {
            applyHeroSliderToElement(mobileSlider, weddingConfig.heroSlider.mobile.images, 'mobile');
        }
    }
    
    // Fallback cho format cũ (nếu vẫn sử dụng heroSlider.images)
    if (weddingConfig.heroSlider.images) {
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            applyHeroSliderToElement(heroSlider, weddingConfig.heroSlider.images, 'legacy');
        }
    }
    
    // Cập nhật indicators (chỉ cần 1 bộ indicators cho cả desktop và mobile)
    const indicators = document.querySelector('.hero-indicators');
    if (indicators) {
        const images = weddingConfig.heroSlider.desktop?.images || 
                      weddingConfig.heroSlider.mobile?.images || 
                      weddingConfig.heroSlider.images || [];
        
        indicators.innerHTML = '';
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('onclick', `currentHeroSlide(${index + 1})`);
            indicators.appendChild(dot);
        });
    }
    
    // Reinitialize slider
    if (typeof initHeroSlider === 'function') {
        // Reset slider variables cho cả desktop và mobile
        currentHeroIndex = 0;
        const activeSlider = window.innerWidth <= 768 ? 
                            document.querySelector('.hero-slider-mobile') : 
                            document.querySelector('.hero-slider-desktop');
        
        if (activeSlider) {
            const newHeroSlides = activeSlider.querySelectorAll('.hero-slide');
            const newHeroDots = document.querySelectorAll('.hero-dot');
            
            // Update global variables
            window.heroSlides = newHeroSlides;
            window.heroDots = newHeroDots;
        }
    }
}

// Helper function để apply hero slider cho element cụ thể
function applyHeroSliderToElement(sliderElement, images, type) {
    if (!sliderElement || !images) return;
    
    // Xóa slides cũ
    sliderElement.innerHTML = '';
    
    // Tạo slides mới từ config
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        
        const background = document.createElement('div');
        background.className = 'hero-background';
        background.style.backgroundImage = `url('${image.url}')`;
        
        slide.appendChild(background);
        sliderElement.appendChild(slide);
    });
    
    console.log(`✅ Applied ${type} hero slider with ${images.length} images`);
}

// Áp dụng ảnh gallery
function applyGalleryImages() {
    if (!weddingConfig?.galleryImages?.images) return;
    
    const galleryGrid = document.querySelector('#gallery .gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = weddingConfig.galleryImages.images.map(image => {
        // Chỉ dùng bản thu nhỏ với ảnh Unsplash
        const thumb = image.thumb || (image.url.includes('unsplash.com') ? image.url.replace('w=2070', 'w=800') : image.url);
        return `
            <div class="gallery-item">
                <a class="fancybox" rel="group" href="${image.url}">
                    <div class="img-wrap">
                        <div class="overlay">
                            <i class="fa fa-search"></i>
                        </div>
                        <img src="${thumb}" alt="${image.alt || ''}" loading="lazy" onerror="this.closest('.gallery-item').remove()"/>
                    </div>
                </a>
            </div>`;
    }).join('');
}

// Áp dụng thông tin sự kiện cưới
function applyWeddingEvents() {
    if (!weddingConfig?.weddingEvents) return;
    
    // Áp dụng format mới (Bootstrap events section)
    const eventsSection = document.querySelector('.events-content');
    if (eventsSection && weddingConfig.weddingEvents.day1 && weddingConfig.weddingEvents.day2) {
        const leftCol = eventsSection.querySelector('.leftcol');
        const rightCol = eventsSection.querySelector('.rightcol');
        
        if (leftCol && weddingConfig.weddingEvents.day1) {
            updateNewEventColumn(leftCol, weddingConfig.weddingEvents.day1);
        }
        
        if (rightCol && weddingConfig.weddingEvents.day2) {
            updateNewEventColumn(rightCol, weddingConfig.weddingEvents.day2);
        }
    }
    

}

// Helper function để cập nhật event column mới (Bootstrap format)
function updateNewEventColumn(column, dayData) {
    if (!column || !dayData) return;
    
    // Cập nhật ngày trong các wp cards
    const dateElements = column.querySelectorAll('p strong');
    if (dateElements.length > 0) {
        dateElements[0].innerHTML = `${dayData.date}<br>${dayData.lunarDate}`;
    }
    
    // Cập nhật events
    const eventCards = column.querySelectorAll('.wp3, .wp4, .wp5, .wp6');
    dayData.events.forEach((event, index) => {
        if (eventCards[index]) {
            const titleElement = eventCards[index].querySelector('h5');
            const descElement = eventCards[index].querySelector('p strong');
            
            if (titleElement) {
                titleElement.innerHTML = `${event.title} <span class="time">${event.time}</span>`;
            }
            
            if (descElement && descElement !== dateElements[0]) {
                descElement.textContent = event.description;
            }
        }
    });
}



// Áp dụng cài đặt SEO
function applySEOSettings() {
    if (!weddingConfig?.seoSettings) return;
    
    const { title, description, ogImage } = weddingConfig.seoSettings;
    
    // Cập nhật title
    if (title) {
        document.title = title;
        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogTitleMeta) ogTitleMeta.setAttribute('content', title);
    }
    
    // Cập nhật description
    if (description) {
        const descMeta = document.querySelector('meta[name="description"]');
        const ogDescMeta = document.querySelector('meta[property="og:description"]');
        if (descMeta) descMeta.setAttribute('content', description);
        if (ogDescMeta) ogDescMeta.setAttribute('content', description);
    }
    
    // Cập nhật OG image
    if (ogImage) {
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (ogImageMeta) ogImageMeta.setAttribute('content', ogImage);
    }
}

// Áp dụng cài đặt nhạc
function applyMusicSettings() {
    if (!weddingConfig?.musicSettings) return;
    
    const { musicFile, volume, startTime } = weddingConfig.musicSettings;
    const musicElement = document.getElementById('weddingMusic');
    
    if (musicElement) {
        if (musicFile && musicElement.querySelector('source')) {
            const source = musicElement.querySelector('source');
            const newSrc = new URL(musicFile, location.href).href;
            // Chỉ load lại khi đổi file, tránh làm gián đoạn nhạc đang phát
            if (source.src !== newSrc) {
                source.src = newSrc;
                musicElement.load();
            }
        }
        if (volume !== undefined) {
            musicElement.volume = volume;
        }
        if (startTime !== undefined) {
            musicElement.dataset.start = startTime;
        }
    }
}

// Cập nhật countdown với ngày mới
function updateCountdownDate(newDateTime) {
    if (typeof initCountdown === 'function') {
        initCountdown(newDateTime);
    }
}

// Load cấu hình khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo tất cả script khác đã load
    setTimeout(loadWeddingConfig, 100);
});

// Áp dụng cài đặt bản đồ
function applyMapSettings() {
    if (!weddingConfig?.mapSettings) return;
    
    const { brideFamily, groomFamily } = weddingConfig.mapSettings;
    
    // Cập nhật bản đồ nhà gái
    if (brideFamily) {
        const brideMapTitle = document.querySelector('.map-item:first-child h4');
        const brideMapAddress = document.querySelector('.map-item:first-child .map-address');
        const brideMapIframe = document.getElementById('brideMap');
        
        if (brideMapTitle) brideMapTitle.innerHTML = `🏠 ${brideFamily.title}`;
        if (brideMapAddress) brideMapAddress.textContent = brideFamily.address;
        if (brideMapIframe) brideMapIframe.src = brideFamily.embedUrl;
    }
    
    // Cập nhật bản đồ nhà trai
    if (groomFamily) {
        const groomMapTitle = document.querySelector('.map-item:last-child h4');
        const groomMapAddress = document.querySelector('.map-item:last-child .map-address');
        const groomMapIframe = document.getElementById('groomMap');
        
        if (groomMapTitle) groomMapTitle.innerHTML = `🏠 ${groomFamily.title}`;
        if (groomMapAddress) groomMapAddress.textContent = groomFamily.address;
        if (groomMapIframe) groomMapIframe.src = groomFamily.embedUrl;
    }
}

// Export functions để có thể sử dụng từ bên ngoài
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadWeddingConfig,
        applyCoupleInfo,
        applyWeddingDate,
        applyHeroSlider,
        applyGalleryImages,
        applyWeddingEvents,
        applyMapSettings,
        applyBankingInfo
    };
}

// Áp dụng thông tin banking
function applyBankingInfo() {
    if (!weddingConfig?.bankingInfo) return;
    
    const { title, description, bride, groom } = weddingConfig.bankingInfo;
    
    // Cập nhật title và description
    const titleElement = document.querySelector('.banking-section .section-title');
    const descElement = document.querySelector('.banking-description');
    
    if (titleElement) titleElement.textContent = title;
    if (descElement) descElement.textContent = description;
    
    // Cập nhật thông tin cô dâu
    if (bride) {
        const brideCard = document.querySelector('.bride-banking');
        if (brideCard) {
            const nameElement = brideCard.querySelector('.person-name');
            const bankNameElement = brideCard.querySelector('.bank-name');
            const accountNumberElement = brideCard.querySelector('.account-number');
            const accountNameElement = brideCard.querySelector('.account-name');
            const qrImageElement = brideCard.querySelector('.qr-image');
            
            if (nameElement) nameElement.textContent = bride.name;
            if (bankNameElement) bankNameElement.textContent = bride.bankName;
            if (accountNumberElement) accountNumberElement.textContent = bride.accountNumber;
            if (accountNameElement) accountNameElement.textContent = bride.accountName;
            if (qrImageElement) {
                qrImageElement.src = bride.qrCode;
                qrImageElement.alt = `QR Code ${bride.name}`;
            }
        }
    }
    
    // Cập nhật thông tin chú rể
    if (groom) {
        const groomCard = document.querySelector('.groom-banking');
        if (groomCard) {
            const nameElement = groomCard.querySelector('.person-name');
            const bankNameElement = groomCard.querySelector('.bank-name');
            const accountNumberElement = groomCard.querySelector('.account-number');
            const accountNameElement = groomCard.querySelector('.account-name');
            const qrImageElement = groomCard.querySelector('.qr-image');
            
            if (nameElement) nameElement.textContent = groom.name;
            if (bankNameElement) bankNameElement.textContent = groom.bankName;
            if (accountNumberElement) accountNumberElement.textContent = groom.accountNumber;
            if (accountNameElement) accountNameElement.textContent = groom.accountName;
            if (qrImageElement) {
                qrImageElement.src = groom.qrCode;
                qrImageElement.alt = `QR Code ${groom.name}`;
            }
        }
    }
}

// Helper function để cập nhật ảnh couple với hỗ trợ 2 ảnh riêng biệt
function updateCoupleImages(section, personData, personType) {
    if (!section || !personData) return;
    
    const isMobile = window.innerWidth <= 768;
    const images = personData.images;
    const mainImg = section.querySelector('.couple-photo-main');
    const subImg = section.querySelector('.couple-photo-sub');
    
    // Ảnh chính (lớn) và ảnh phụ (nhỏ, đặt chồng lên góc)
    let mainSrc = personData.image;
    let subSrc = personData.image;
    if (images && images.desktop && images.mobile) {
        const imageConfig = isMobile ? images.mobile : images.desktop;
        mainSrc = imageConfig.left || mainSrc;
        subSrc = imageConfig.right || mainSrc;
    }
    
    if (mainImg && mainSrc) {
        mainImg.src = mainSrc;
        mainImg.alt = personData.title;
    }
    if (subImg && subSrc) {
        subImg.src = subSrc;
        subImg.alt = personData.title;
    }
}

// Function để mở Facebook profile
function openFacebookProfile(facebookUrl, personName) {
    // Mở trực tiếp Facebook link trong tab mới
    window.open(facebookUrl, '_blank');
}

 
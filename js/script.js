const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const quoteForm = document.querySelector("#contact-form");
const phoneInput = document.querySelector("#phone-number");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#current-year");

const setText = (selector, value) => {
  if (value === undefined || value === null) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const setHtml = (selector, value) => {
  if (value === undefined || value === null) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.innerHTML = value;
  });
};

const setAttributeByConfig = (selector, attribute, value) => {
  const element = document.querySelector(selector);
  if (element && value !== undefined && value !== null) {
    element.setAttribute(attribute, value);
  }
};

const applyTheme = (theme) => {
  if (!theme) return;

  const root = document.documentElement;
  if (theme.colorScheme) {
    root.style.colorScheme = theme.colorScheme;
  }

  const palette = theme.colors || {};
  Object.entries(palette).forEach(([name, value]) => {
    root.style.setProperty(`--${name}`, value);
  });
  setAttributeByConfig('meta[data-config="metaThemeColor"]', 'content', palette.green);
};

const applyImages = (images) => {
  if (!images) return;

  const heroImage = document.querySelector('[data-config="heroImage"]');
  if (heroImage && images.hero) {
    if (images.hero.src) heroImage.src = images.hero.src;
    if (images.hero.srcset) heroImage.srcset = images.hero.srcset;
    if (images.hero.sizes) heroImage.sizes = images.hero.sizes;
    if (images.hero.alt) heroImage.alt = images.hero.alt;
  }

  const aboutImage = document.querySelector('[data-config="aboutImage"]');
  if (aboutImage && images.about) {
    if (images.about.src) aboutImage.src = images.about.src;
    if (images.about.srcset) aboutImage.srcset = images.about.srcset;
    if (images.about.sizes) aboutImage.sizes = images.about.sizes;
    if (images.about.alt) aboutImage.alt = images.about.alt;
  }

  (images.work || []).forEach((image, index) => {
    const element = document.querySelector(`[data-config="workImage-${index}"]`);
    if (!element) return;
    if (image.src) element.src = image.src;
    if (image.srcset) element.srcset = image.srcset;
    if (image.sizes) element.sizes = image.sizes;
    if (image.alt) element.alt = image.alt;
  });

  (images.beforeAfter || []).forEach((pair, index) => {
    ['before', 'after'].forEach((side) => {
      const image = pair[side];
      const element = document.querySelector(`[data-config="beforeAfter-${side}-${index}"]`);
      if (!element || !image) return;
      if (image.src) element.src = image.src;
      if (image.srcset) element.srcset = image.srcset;
      if (image.sizes) element.sizes = image.sizes;
      if (image.alt) element.alt = image.alt;
    });
  });
};

const applyMap = (mapConfig) => {
  if (!mapConfig) return;
  document.querySelectorAll('[data-config="serviceMap"]').forEach((mapFrame) => {
    if (mapConfig.title) mapFrame.title = mapConfig.title;
    if (mapConfig.src) mapFrame.src = mapConfig.src;
  });
};

const whatsappHrefFromNumber = (number) => {
  if (!number) return '#';
  const digits = String(number).replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '#';
};

const applyQuoteFormOptions = (quoteConfig) => {
  const select = document.querySelector('[data-config="serviceSelect"]');
  if (!select || !quoteConfig) return;

  const options = quoteConfig.services || [];
  const defaultOption = quoteConfig.defaultOption || 'Select a service';
  select.innerHTML = `<option value="" disabled selected>${defaultOption}</option>`;

  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);
  });
};

const applySlogans = (slogans) => {
  if (!slogans) return;

  const entries = {
    imageCaption: '[data-config="imageCaption"]',
    aboutTagline: '[data-config="aboutTagline"]',
    mapTag: '[data-config="areaMapTag"]',
    footerTagline: '[data-config="footerTagline"]',
    businessTagline: '[data-config="heroProofBody"]'
  };

  Object.entries(entries).forEach(([key, selector]) => {
    const value = slogans[key];
    if (value !== undefined && value !== null) {
      const element = document.querySelector(selector);
      if (element) element.textContent = value;
    }
  });
};

const applyConfig = (config) => {
  if (!config) {
    return;
  }

  const business = config.business || {};
  const seo = config.seo || {};
  const hero = config.hero || {};
  const about = config.about || {};
  const area = config.area || {};
  const work = config.work || {};
  const reviews = config.reviews || {};
  const quote = config.quote || {};
  const contact = config.contact || {};
  const homeCta = config.homeCta || {};
  const servicesPage = config.servicesPage || {};
  const footer = config.footer || {};
  const privacy = config.privacy || {};
  const pageType = document.documentElement.dataset.page || 'home';

  applyTheme(config.theme);
  applyImages(config.images);
  applyMap(config.map);
  applyQuoteFormOptions(config.quote);
  applySlogans(config.slogans);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: business.name,
    telephone: business.phone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.streetAddress,
      addressLocality: business.locality,
      postalCode: business.postcode,
      addressCountry: business.country
    },
    areaServed: business.areaServed
  };
  setText('[data-config="structuredData"]', JSON.stringify(structuredData));

  const pageSeo = pageType === 'privacy'
    ? privacy
    : pageType === 'not-found'
      ? { title: seo.notFoundTitle, description: seo.notFoundDescription }
      : (seo.pages && seo.pages[pageType]) || seo;
  if (pageSeo.title) document.title = pageSeo.title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && pageSeo.description) metaDescription.setAttribute('content', pageSeo.description);

  if (pageType === 'privacy') {
    setText('[data-config="privacyHeading"]', privacy.heading || 'Privacy policy');
    setText('[data-config="privacyLastUpdated"]', privacy.lastUpdated || '');
    setText('[data-config="privacyIntro"]', privacy.intro || '');
    setText('[data-config="privacyInformationCollected"]', privacy.informationCollected || '');
    setText('[data-config="privacyPurpose"]', privacy.purpose || '');
    setText('[data-config="privacyLawfulBasis"]', privacy.lawfulBasis || '');
    setText('[data-config="privacySharing"]', privacy.sharing || '');
    setText('[data-config="privacyInternationalTransfers"]', privacy.internationalTransfers || '');
    setText('[data-config="privacyRetention"]', privacy.retention || '');
    setText('[data-config="privacySecurity"]', privacy.security || '');
    setText('[data-config="privacyRights"]', privacy.rights || '');
    setText('[data-config="privacyCookies"]', privacy.cookies || '');
    setText('[data-config="privacyComplaints"]', privacy.complaints || '');
    setText('[data-config="privacyContactEmail"]', business.email || '');
    setAttributeByConfig('[data-config="privacyContactEmail"]', 'href', business.email ? `mailto:${business.email}` : '#');
    setText('[data-config="privacyContactAddress"]', [business.streetAddress, business.locality, business.postcode].filter(Boolean).join(', '));
  }

  if (pageType === 'not-found') {
    setText('[data-config="notFoundMessage"]', seo.notFoundDescription || 'The page may have moved.');
  }

  if (config.notice) {
    setHtml('[data-config="noticeText"]', config.notice.text.replace('·', '<span>·</span>'));
    setText('[data-config="noticeLink"]', config.notice.linkText);
  }

  setText('[data-config="brandName"]', business.brandName || business.name || '');
  setText('[data-config="brandTagline"]', business.brandTagline || '');
  setText('[data-config="brandInitial"]', business.brandInitial || '');
  setAttributeByConfig('[data-config="brandHomeLabel"]', 'aria-label', `${business.name || 'Business'} home`);

  document.querySelectorAll('[data-config-attr="href:phoneHref"]').forEach((element) => {
    element.href = business.phone ? `tel:${business.phone}` : 'contact.html';
  });
  document.querySelectorAll('[data-config-attr="href:whatsappHref"]').forEach((element) => {
    element.href = whatsappHrefFromNumber(business.whatsapp);
  });
  setAttributeByConfig('[data-config-attr="href:emailHref"]', 'href', business.email ? `mailto:${business.email}` : 'contact.html');
  setAttributeByConfig('[data-config="facebookLink"]', 'href', business.facebookUrl || '#');
  setAttributeByConfig('[data-config="instagramLink"]', 'href', business.instagramUrl || '#');

  setHtml('[data-config="navPhone"]', `<span aria-hidden="true">☎</span> ${business.phoneDisplay || business.phone || 'Contact us'}`);
  setHtml('[data-config="heroTitle"]', hero.title || '');
  setText('[data-config="heroEyebrow"]', hero.eyebrow || '');
  setText('[data-config="heroLede"]', hero.lede || '');
  setHtml('[data-config="heroPrimaryButton"]', `${hero.primaryButton || 'Contact us'} <span aria-hidden="true">↗</span>`);
  setHtml('[data-config="heroSecondaryButton"]', `${hero.secondaryButton || 'Get in touch'} <span aria-hidden="true">↗</span>`);
  setText('[data-config="heroProofTitle"]', hero.proofTitle || '');
  setText('[data-config="heroProofBody"]', hero.proofBody || '');
  setText('[data-config="heroImageBadge"]', hero.imageBadge || business.brandInitial || '');
  setText('[data-config="heroImageNoteTitle"]', hero.imageNoteTitle || '');
  setText('[data-config="heroImageNoteBody"]', hero.imageNoteBody || '');

  const servicesSection = config.servicesSection || {};
  setText('[data-config="servicesEyebrow"]', servicesSection.eyebrow || '');
  setHtml('[data-config="servicesHeading"]', servicesSection.heading || '');
  setText('[data-config="servicesIntro"]', servicesSection.intro || '');
  setText('[data-config="servicesPageEyebrow"]', servicesPage.eyebrow || '');
  setHtml('[data-config="servicesPageHeading"]', servicesPage.heading || '');
  setText('[data-config="servicesPageIntro"]', servicesPage.intro || '');

  (config.trustStrip || []).forEach((item, index) => {
    const element = document.querySelector(`[data-config="trustStrip-${index}"]`);
    if (element) {
      element.innerHTML = `<span aria-hidden="true">✳</span> ${item}`;
    }
  });

  (config.trustBadges || []).forEach((item, index) => {
    const element = document.querySelector(`[data-config="trustBadge-${index}"]`);
    if (element) {
      element.innerHTML = `<span aria-hidden="true">✓</span> ${item}`;
    }
  });

  (config.services || []).forEach((service, index) => {
    const titleElement = document.querySelector(`[data-config="service-title-${index}"]`);
    const descElement = document.querySelector(`[data-config="service-description-${index}"]`);
    if (titleElement) titleElement.textContent = service.title || '';
    if (descElement) descElement.textContent = service.description || '';
  });

  setText('[data-config="aboutEyebrow"]', about.eyebrow || '');
  setHtml('[data-config="aboutHeading"]', about.heading || '');
  setText('[data-config="aboutIntro"]', about.intro || '');
  setText('[data-config="aboutSupporting"]', about.supporting || '');
  setText(
    '[data-config="aboutOwnerLine"]',
    [about.ownerName, about.ownerRole].filter(Boolean).join(' · '),
  );
  setHtml('[data-config="aboutCta"]', `${about.cta || 'Tell us what you need'} <span aria-hidden="true">↗</span>`);
  setText('[data-config="aboutTagline"]', about.tagline || 'BUILT ON TRUST, NOT SHORTCUTS.');
  setHtml('[data-config="aboutExperienceYears"]', `${about.experienceYears || '15'}<span>${about.experienceSuffix || '+'}</span>`);
  setHtml('[data-config="aboutExperienceLabel"]', (about.experienceLabel || 'YEARS<br>ON THE TOOLS').replace('\n', '<br>'));
  setText('[data-config="aboutStoryHeading"]', about.storyHeading || '');
  setText('[data-config="aboutStory"]', about.story || '');
  setText('[data-config="aboutQualificationsHeading"]', about.qualificationsHeading || '');
  (about.qualifications || []).forEach((item, index) => {
    const element = document.querySelector(`[data-config="aboutQualification-${index}"]`);
    if (element) element.textContent = item;
  });
  setText('[data-config="aboutHowWeWorkHeading"]', about.howWeWorkHeading || '');
  (about.howWeWork || []).forEach((item, index) => {
    const title = document.querySelector(`[data-config="howWeWork-title-${index}"]`);
    const description = document.querySelector(`[data-config="howWeWork-description-${index}"]`);
    if (title) title.textContent = item.title || '';
    if (description) description.textContent = item.description || '';
  });

  setText('[data-config="areaEyebrow"]', area.eyebrow || 'Close by, ready to help');
  setHtml('[data-config="areaHeading"]', area.heading || '');
  setText('[data-config="areaDescription"]', area.description || '');
  setHtml('[data-config="areaCta"]', `${area.cta || 'Check your postcode'} <span aria-hidden="true">↗</span>`);
  (area.list || []).forEach((item, index) => {
    const element = document.querySelector(`[data-config="area-item-${index}"]`);
    if (element) element.textContent = item;
  });
  setText('[data-config="areaMapTag"]', area.mapTag || 'LOCAL TEAM, LOCAL KNOW-HOW');

  setText('[data-config="workEyebrow"]', work.eyebrow || 'A few jobs, done right');
  setHtml('[data-config="workHeading"]', work.heading || 'The work speaks<br><em>for itself.</em>');
  setText('[data-config="workIntro"]', work.intro || '');
  (config.beforeAfter || []).forEach((item, index) => {
    const category = document.querySelector(`[data-config="beforeAfter-category-${index}"]`);
    const title = document.querySelector(`[data-config="beforeAfter-title-${index}"]`);
    if (category) category.textContent = item.category || '';
    if (title) title.textContent = item.title || '';
  });

  setText('[data-config="reviewsEyebrow"]', reviews.eyebrow || 'Kind words from the neighbourhood');
  setHtml('[data-config="reviewsHeading"]', reviews.heading || 'Good people.<br><em>Good work.</em>');
  setText('[data-config="reviewsRating"]', reviews.rating || '5.0');
  setText('[data-config="reviewsRatingLabel"]', reviews.ratingLabel || '');
  setText('[data-config="reviewsGoogleSummary"]', reviews.googleSummary || '');
  (reviews.items || []).forEach((item, index) => {
    const quoteElement = document.querySelector(`[data-config="review-quote-${index}"]`);
    const initialsElement = document.querySelector(`[data-config="review-initials-${index}"]`);
    const nameElement = document.querySelector(`[data-config="review-name-${index}"]`);
    const locationElement = document.querySelector(`[data-config="review-location-${index}"]`);
    if (quoteElement) quoteElement.textContent = `“${item.quote || ''}”`;
    if (initialsElement) initialsElement.textContent = item.initials || '';
    if (nameElement) nameElement.textContent = item.name || '';
    if (locationElement) locationElement.textContent = item.location || '';
  });

  setText('[data-config="homeCtaEyebrow"]', homeCta.eyebrow || '');
  setHtml('[data-config="homeCtaHeading"]', homeCta.heading || '');
  setText('[data-config="homeCtaDescription"]', homeCta.description || '');
  setHtml('[data-config="homeCtaPrimaryButton"]', `${homeCta.primaryButton || 'Call now'} <span aria-hidden="true">↗</span>`);
  setHtml('[data-config="homeCtaSecondaryButton"]', `${homeCta.secondaryButton || 'Request a free quote'} <span aria-hidden="true">↗</span>`);

  setText('[data-config="quoteEyebrow"]', quote.eyebrow || contact.eyebrow || "Let's get it sorted");
  setHtml('[data-config="quoteHeading"]', quote.heading || contact.heading || "Tell us what's<br><em>going on.</em>");
  setText('[data-config="quoteDescription"]', quote.description || contact.description || '');
  setHtml('[data-config="quotePhone"]', `<span aria-hidden="true">☎</span> ${business.phoneDisplay || business.phone || 'Contact us'}`);
  setHtml(
    '[data-config="contactPhoneButton"]',
    `<span aria-hidden="true">☎</span> Call ${business.phoneDisplay || business.phone || 'us'}`,
  );
  setText(
    '[data-config="contactWhatsappButton"]',
    `WhatsApp ${business.whatsappDisplay || ''}`.trim(),
  );
  setText('[data-config="quoteSmallPrint"]', quote.smallPrint || 'Available 24 hours, every day');
  setText('[data-config="formNote"]', quote.formNote || "No obligation. We'll use your details to respond to your enquiry.");
  setText('[data-config="contactHoursHeading"]', contact.hoursHeading || 'Opening hours');
  (contact.hours || []).forEach((item, index) => {
    const element = document.querySelector(`[data-config="contactHour-${index}"]`);
    if (element) element.textContent = item;
  });
  setText('[data-config="contactFaqHeading"]', contact.faqHeading || 'Quick answers');
  (contact.faq || []).forEach((item, index) => {
    const question = document.querySelector(`[data-config="faq-question-${index}"]`);
    const answer = document.querySelector(`[data-config="faq-answer-${index}"]`);
    if (question) question.textContent = item.question || '';
    if (answer) answer.textContent = item.answer || '';
  });

  setHtml('[data-config="footerTagline"]', footer.tagline || '');
  setText('[data-config="footerGetInTouch"]', footer.getInTouchHeading || 'Get in touch');
  setHtml('[data-config="footerPhone"]', business.phoneDisplay || business.phone || 'Contact us');
  setHtml('[data-config="footerEmail"]', business.email || '');
  setText('[data-config="footerAddressLineOne"]', footer.addressLineOne || business.streetAddress || '');
  setText('[data-config="footerAddressLineTwo"]', footer.addressLineTwo || [business.locality, business.postcode].filter(Boolean).join(', '));
  setText('[data-config="footerAvailabilityHeading"]', footer.availableHeading || 'Here when you need us');
  setHtml('[data-config="footerAvailability"]', footer.availability || '');
  setText('[data-config="footerCopyright"]', footer.copyright || business.name || 'Business Name');
  setText('[data-config="footerLocation"]', footer.locationText || '');

  const quoteFormElement = document.querySelector('[data-config="quoteForm"]');
  if (quoteFormElement) {
    quoteFormElement.dataset.endpointConfigured = String(Boolean(quote.formAction));
    if (quote.formAction) quoteFormElement.action = quote.formAction;
  }
  setHtml('[data-config="quoteSubmitButton"]', `${quote.submitButton || 'Send enquiry'} <span aria-hidden="true">↗</span>`);
};

const initialiseConfig = async () => {
  try {
    const response = await fetch('./site.config.json');
    if (!response.ok) {
      throw new Error('Config file not found');
    }
    const config = await response.json();
    applyConfig(config);
  } catch {
    // Skip config hydration silently and keep the default content in the HTML.
  }
};

if (year) {
  year.textContent = new Date().getFullYear();
}

initialiseConfig();

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (phoneInput && quoteForm && formStatus) {
  phoneInput.addEventListener("input", () => {
    phoneInput.setCustomValidity("");
    formStatus.textContent = "";
  });

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      phoneInput.setCustomValidity("Enter a valid phone number with 10 to 15 digits.");
      phoneInput.reportValidity();
      return;
    }

    phoneInput.setCustomValidity("");
    const formData = new FormData(quoteForm);

    if (quoteForm.dataset.endpointConfigured !== "true") {
      formStatus.textContent = "This demo form isn't connected yet. Please call us to request a quote.";
      return;
    }

    try {
      const response = await fetch(quoteForm.action, {
        method: quoteForm.method,
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}.`);
      }

      formStatus.textContent = `Thanks, ${formData.get("name")}. Your request has been sent. We'll be in touch soon.`;
      quoteForm.reset();
    } catch {
      formStatus.textContent = "We couldn't send your request. Please try again or call us directly.";
    }
  });
}

'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

// const openModal = function (e) {
//   e.preventDefault();
//   modal.classList.remove('hidden');
//   overlay.classList.remove('hidden');
// };

// const closeModal = function () {
//   modal.classList.add('hidden');
//   overlay.classList.add('hidden');
// };

// btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// btnCloseModal.addEventListener('click', closeModal);
// overlay.addEventListener('click', closeModal);

// document.addEventListener('keydown', function (e) {
//   if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
//     closeModal();
//   }
// });

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

// tabsContainer.addEventListener('click', function (e) {
//   const clicked = e.target.closest('.operations__tab');

//   // Guard clause
//   if (!clicked) return;

//   // Remove active classes
//   tabs.forEach(t => t.classList.remove('operations__tab--active'));
//   tabsContent.forEach(c => c.classList.remove('operations__content--active'));

//   // Activate tab
//   clicked.classList.add('operations__tab--active');

//   // Activate content area
//   document
//     .querySelector(`.operations__content--${clicked.dataset.tab}`)
//     .classList.add('operations__content--active');
// });

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      console.log(this);
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// Geolocation and Mandir API
// Note for the onseers, there is an easier method by using Geocoding. However, because it isn't free, I am forced to use the more tedious method.

const generateMap = function (coords, view) {
  const map = L.map('map').setView(coords, view);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([31.60041, -84.05456], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Albany-GA.aspx">Albany, GA</a>'
    );

  L.marker([42.71594, -73.8049], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Albany.aspx">Albany, NY</a>'
    );
  L.marker([40.61872, -75.2793], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Allentown.aspx">Allentown. PA</a>'
    );
  L.marker([33.88559, -84.16256], { icon: goldenMandirIcon }) // FANCIFY
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Atlanta.aspx">Atlanta, GA</a>'
    );
  L.marker([39.4556087, -74.5342814], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/AtlanticCity.aspx">Atlantic City, NJ</a>'
    );

  L.marker([33.5606974, -82.1026004], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Augusta.aspx">Augusta, GA</a>'
    );
  L.marker([30.4087667, -97.6953691], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Austin.aspx">Austin, TX</a>'
    );
  L.marker([30.0635504, -94.191154], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Beaumont.aspx">Beaumont, TX</a>'
    );
  L.marker([33.5851964, -86.6961347], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Birmingham.aspx">Birmingham, AL</a>'
    );
  L.marker([40.5017453, -88.9069711], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Bloomington.aspx">Bloomington, IL</a>'
    );
  L.marker([42.627913, -71.3507143], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Boston.aspx">Boston, MA</a>'
    );
  L.marker([51.0991621, -113.9856698], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Calgary.aspx">Calgary, CA</a>'
    );
  L.marker([34.506201, -84.9547612], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Calhoun.aspx">Calhoun, GA</a>'
    );
  L.marker([43.4087174, -80.3508144], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Cambridge.aspx">Cambridge, CA</a>'
    );
  L.marker([35.16586, -80.7131917], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Charlotte.aspx">Charlotte, NC</a>'
    );
  L.marker([34.9842246, -85.2070548], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Chattanooga.aspx">Chattanooga, GA</a>'
    );
  L.marker([39.9141023, -74.9637071], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/CherryHill.aspx">Cherry Hill, NJ</a>'
    );
  L.marker([41.9428685, -88.2097683], { icon: goldenMandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Chicago.aspx">Chicago, IL</a>'
    ); // Fancify
  L.marker([39.2763294, -84.4444805], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Cincinnati.aspx">Cincinnati, OH</a>'
    );
  L.marker([29.498275, -95.1289054], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/ClearLake.aspx">Clear Lake, TX</a>'
    );
  L.marker([41.2275365, -81.7925956], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Cleveland.aspx">Cleveland, OH</a>'
    );
  L.marker([40.8464154, -74.1582055], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Clifton.aspx">Clifton, NJ</a>'
    );
  L.marker([34.0211881, -81.0927878], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Columbia-SC.aspx">Columbia, SC</a>'
    );
  L.marker([35.6087422, -87.0234863], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Columbia.aspx">Columbia, TN</a>'
    );
  L.marker([39.9772624, -82.8583424], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Columbus.aspx">Columbus, OH</a>'
    );
  L.marker([27.8062196, -97.4752253], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/CorpusChristi.aspx">Corpus Christi, TX</a>'
    );
  L.marker([42.1896584, -88.3124897], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/CrystalLake.aspx">Crystal Lake, IL</a>'
    );
  L.marker([32.8705734, -97.0030667], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Dallas.aspx">Dallas, TX</a>'
    );
  L.marker([39.8300572, -84.1167566], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Dayton.aspx">Dayton, OH</a>'
    );
  L.marker([39.6730597, -75.6182998], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Delaware.aspx">Delaware</a>'
    );
  L.marker([42.2833661, -83.4863917], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Detriot.aspx">Detriot, MI</a>'
    );
  L.marker([31.2799126, -85.4535537], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Dothan.aspx">Dothan, AL</a>'
    );

  L.marker([40.0320165, -75.761516], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Delaware.aspx">Downingtown, PA</a>'
    );

  L.marker([40.503905, -74.3830201], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Edison.aspx">Edison, NJ</a>'
    );
  L.marker([37.9605302, -87.4004397], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Evansville.aspx">Evansville, IN</a>'
    );
  L.marker([42.1155654, -71.2378229], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/FallRiver.aspx">Fall River, MA</a>'
    );
  L.marker([36.8534292, -119.750365], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Fresno.aspx">Fresno, CA</a>'
    );
  L.marker([36.0751008, -79.9909284], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Greensboro.aspx">Greensboro, NC</a>'
    );
  L.marker([34.8432674, -82.325249], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Greenville.aspx">Greenville, SC</a>'
    );
  L.marker([40.2372461, -76.8333367], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Harrisburg.aspx">Harrisburg, PA</a>'
    );
  L.marker([41.720308, -72.7214819], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Hartford.aspx">Hartford, CT</a>'
    );
  L.marker([29.6070552, -95.5814093], { icon: goldenMandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Houston.aspx">Houston, TX</a>'
    );
  L.marker([34.7367473, -86.8083149], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Huntsville.aspx">Huntsville, AL</a>'
    );
  L.marker([39.608893, -86.1116009], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Indianapolis.aspx">Indianapolis, IN</a>'
    );
  L.marker([32.2915885, -90.2773251], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Jackson.aspx">Jackson, MS</a>'
    );
  L.marker([30.3515244, -81.5736993], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Jacksonville.aspx">Jacksonville, FL</a>'
    );
  L.marker([40.7687948, -74.04643], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/JerseyCity.aspx">Jersey City, NJ</a>'
    );
  L.marker([39.0115567, -94.765351], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/kansasCity.aspx">Kansas City, KS</a>'
    );
  L.marker([36.0090352, -83.7781295], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Knoxville.aspx">Knoxville, TN</a>'
    );
  L.marker([40.2912671, -75.3181706], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Lansdale.aspx">Lansdale, PA</a>'
    );
  L.marker([34.7775833, -92.2076761], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/LittleRock.aspx">Little Rock, AR</a>'
    );
  L.marker([40.7639153, -73.4125333], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/LongIsland.aspx">Long Island, NY</a>'
    );
  L.marker([38.3964376, -85.5931825], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Louisville.aspx">Louisville, KY</a>'
    );
  L.marker([33.9760887, -117.698643], { icon: goldenMandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/LosAngeles.aspx">Los Angeles, CA</a>'
    );
  L.marker([33.586213, -101.9257188], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Lubbock.aspx">Lubbock, TX</a>'
    );
  L.marker([28.1404398, -80.6342082], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Melbourne.aspx">Melbourne, FL</a>'
    );
  L.marker([35.0750424, -89.9054987], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Memphis.aspx">Memphis, TN</a>'
    );
  L.marker([26.5118124, -80.0636703], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Miami.aspx">Miami, FL</a>'
    );
  L.marker([43.0845798, -88.2262841], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Milwaukee.aspx">Milwaukee, WI</a>'
    );
  L.marker([45.0732244, -93.3125893], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Minneapolis.aspx">Minneapolis, MN</a>'
    );
  L.marker([36.1930012, -86.6073243], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Nashville.aspx">Nashville, TN</a>'
    );
  L.marker([41.2381531, -73.0208088], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/NewHaven.aspx">New Haven, CT</a>'
    );
  L.marker([29.9567185, -90.3268771], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/NewOrleans.aspx">New Orleans, LA</a>'
    );
  L.marker([40.754458, -73.8219936], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/NewYork.aspx">New York, NY</a>'
    );
  L.marker([38.907524, -77.4773154], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/NorthernVirginia.aspx">Northern Virginia, VA</a>'
    );
  L.marker([35.5064912, -97.6022167], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Oklahoma.aspx">Oklahoma</a>'
    );
  L.marker([33.5309907, -80.8404433], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Orangeburg.aspx">Orangeburg, SC</a>'
    );
  L.marker([28.472988, -81.4009798], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Orlando.aspx">Orlando, FL</a>'
    );
  L.marker([40.847245, -74.4313938], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Parsippany.aspx">Parsippany, NJ</a>'
    );
  L.marker([32.4792535, -83.7457757], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Perry.aspx">Perry, GA</a>'
    );

  L.marker([40.1620557, -74.8719989], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Philadelphia.aspx">Philadelphia, PA</a>'
    );
  L.marker([33.4908619, -112.1162413], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Phoenix.aspx">Phoenix, AZ</a>'
    );
  L.marker([40.5280462, -74.4354243], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Piscataway.aspx">Piscataway, NJ</a>'
    );
  L.marker([40.4881285, -80.1173483], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Pittsburgh.aspx">Pittsburgh, PA</a>'
    );
  L.marker([45.4368509, -122.7961968], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Portland.aspx">Portland, OR</a>'
    );
  L.marker([35.8391473, -78.8105807], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Raleigh.aspx">Raleigh, NC</a>'
    );
  L.marker([37.4277312, -77.4407437], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Richmond.aspx">Richmond, VA</a>'
    );
  L.marker([37.3197655, -80.0346724], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Roanoke.aspx">Roanoke, VA</a>'
    );
  L.marker([40.2534279, -74.579656], { icon: goldenMandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Robbinsville.aspx">Robbinsville, NJ</a>'
    ); // FANCIFY
  L.marker([38.5674912, -121.2983868], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Sacramento.aspx">Sacramento, CA</a>'
    );
  L.marker([29.5913306, -98.5874956], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/SanAntonio.aspx">San Antonio, TX</a>'
    );
  L.marker([37.724496, -122.4263954], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/SanFrancisco.aspx">San Francisco, CA</a>'
    );
  L.marker([37.4489246, -121.9207216], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/SanJose.aspx">San Jose, CA</a>'
    );
  L.marker([32.0008949, -81.281644], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Savannah.aspx">Savannah, GA</a>'
    );
  L.marker([43.7654333, -79.2945884], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Scarborough.aspx">Scarborough, CA</a>'
    );
  L.marker([41.439116, -75.6633337], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Scranton.aspx">Scranton, PA</a>'
    );
  L.marker([47.6865158, -122.1356288], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Seattle.aspx">Seattle, WA</a>'
    );
  L.marker([42.1155654, -71.2378229], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/SouthBoston.aspx">South Boston, MA</a>'
    );
  L.marker([42.0569544, -72.651162], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Springfield.aspx">Springfield, MA</a>'
    );
  L.marker([38.7569882, -90.4240417], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/St.Louis.aspx">St.Louis, MO</a>'
    );
  L.marker([42.6145776, -83.0348858], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/SterlingHeights.aspx">Sterling Heights, MI</a>'
    );
  L.marker([43.126662, -76.1262841], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Syracuse.aspx">Syracuse, NY</a>'
    );
  L.marker([28.0552907, -82.3351013], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Tampa.aspx">Tampa, FL</a>'
    );
  L.marker([43.7385505, -79.6280107], { icon: goldenMandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Toronto.aspx">Toronto, CA</a>'
    );
  L.marker([32.241383, -110.9798175], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Tucson.aspx">Tucson, AZ</a>'
    );
  L.marker([37.0161381, -76.4439004], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/VirginiaBeach.aspx">Virginia Beach, VA</a>'
    );
  L.marker([40.2438091, -75.1422378], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Warrington.aspx">Warrington, PA</a>'
    );
  L.marker([39.0566326, -76.9180121], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/WashingtonDC.aspx">Washington DC</a>'
    );
  L.marker([42.2832426, -71.6485534], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Westborough.aspx">Westborough, MA</a>'
    );
  L.marker([40.9291712, -73.8735445], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Westchester.aspx">Westchester, NY</a>'
    );
  L.marker([42.2850023, -83.0567424], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Windsor.aspx">Windsor, CA</a>'
    );
  L.marker([49.6941161, -97.1366124], { icon: mandirIcon })
    .addTo(map)
    .bindPopup(
      '<a href="https://www.baps.org/Global-Network/North-America/Winnipeg.aspx">Winnipeg, CA</a>'
    );
};

const mandirIcon = L.icon({
  iconUrl: 'Pictures/blueMarker.png',

  iconSize: [38, 60],
  shadowSize: [50, 64],
  iconAnchor: [22, 55],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

const goldenMandirIcon = L.icon({
  iconUrl: 'Pictures/goldenMarker.png',

  iconSize: [38, 60],
  shadowSize: [50, 64],
  iconAnchor: [22, 55],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];
      generateMap(coords, 10);
    },
    () => {
      generateMap([39.095963, -98.701172], 4);
    }
  );
}

//Clock

const darshanText = function (minuteTime) {
  if (minuteTime > 540 && minuteTime < 615) {
    document.getElementById('darshan1').style.color = 'white';
  }
  if (minuteTime > 615 && minuteTime < 675) {
    document.getElementById('darshan2').style.color = '#ffcc00';
  }
  if (minuteTime > 675 && minuteTime < 720) {
    document.getElementById('darshan2').style.color = 'white';
  }
  if (minuteTime < 960 && minuteTime > 675) {
    document.getElementById('darshan3').style.color = '#ffcc00';
  }
  if (minuteTime > 960 && minuteTime < 1070) {
    document.getElementById('darshan3').style.color = 'white';
  }
  if (minuteTime > 1070 || minuteTime < 540) {
    document.getElementById('darshan1').style.color = '#ffcc00';
  }
};

const artiText = function (minuteTime) {
  if (minuteTime > 450 && minuteTime < 675) {
    document.getElementById('Rajbhog').style.color = '#ffcc00';
  }
  if (minuteTime > 675 && minuteTime < 1140) {
    document.getElementById('Sandhya').style.color = '#ffcc00';
  }
  if (minuteTime > 1140 && minuteTime < 1230) {
    document.getElementById('darshan2').style.color = '#ffcc00';
  }
  if (minuteTime > 1230 || minuteTime < 450) {
    document.getElementById('Shangar').style.color = '#ffcc00';
  }
};

const abhishekText = function (minuteTime, day) {
  console.log(day);
  if (day === 0) {
    document.getElementById('label2').style.color = 'white';
    if (minuteTime > 540 && minuteTime < 615) {
      document.getElementById('abhishek4').style.color = 'white';
    }
    if (minuteTime > 615 && minuteTime < 690) {
      document.getElementById('abhishek5').style.color = '#ffcc00';
    }
    if (minuteTime > 690 && minuteTime < 750) {
      document.getElementById('abhishek5').style.color = 'white';
    }
    if (minuteTime > 750 && minuteTime < 900) {
      document.getElementById('abhishek6').style.color = '#ffcc00';
    }
    if (minuteTime > 900 && minuteTime < 1065) {
      document.getElementById('abhishek6').style.color = 'white';
    }
    if (minuteTime > 1065 || minuteTime < 540) {
      document.getElementById('abhishek4').style.color = '#ffcc00';
    }
  } else {
    document.getElementById('label1').style.color = 'white';
    if (minuteTime > 540 && minuteTime < 615) {
      document.getElementById('abhishek1').style.color = 'white';
    }
    if (minuteTime > 615 && minuteTime < 675) {
      document.getElementById('abhishek2').style.color = '#ffcc00';
    }
    if (minuteTime > 675 && minuteTime < 720) {
      document.getElementById('abhishek2').style.color = 'white';
    }
    if (minuteTime < 960 && minuteTime > 675) {
      document.getElementById('abhishek3').style.color = '#ffcc00';
    }
    if (minuteTime > 960 && minuteTime < 1070) {
      document.getElementById('abhishek3').style.color = 'white';
    }
    if (minuteTime > 1070 || minuteTime < 540) {
      document.getElementById('abhishek1').style.color = '#ffcc00';
    }
  }
};

let clock = () => {
  let date = new Date();
  let day = date.getDay();
  console.log(day);
  let hrs = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  let minuteTime = hrs * 60 + mins;
  let period = 'AM';
  if (hrs == 0) {
    hrs = 12;
  } else if (hrs >= 12) {
    hrs = hrs - 12;
    period = 'PM';
  }
  hrs = hrs < 10 ? '0' + hrs : hrs;
  mins = mins < 10 ? '0' + mins : mins;
  secs = secs < 10 ? '0' + secs : secs;

  let time = `${hrs}:${mins}:${secs}:${period}`;
  document.getElementById('clock').innerText = time;
  setTimeout(clock, 1000);

  darshanText(minuteTime);
  artiText(minuteTime);
  abhishekText(minuteTime, day);
};
clock();
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

/*
///////////////////////////////////////
// Selecting, Creating, and Deleting Elements

// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

  
///////////////////////////////////////
// Styles, Attributes and Classes
  
// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use
logo.clasName = 'jonas';


///////////////////////////////////////
// Types of Events and Event Handlers
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };


///////////////////////////////////////
// Event Propagation in Practice
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});


///////////////////////////////////////
// DOM Traversing
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});

///////////////////////////////////////
// Sticky navigation
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function () {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);


///////////////////////////////////////
// Lifecycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
*/

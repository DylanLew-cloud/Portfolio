const card = document.querySelector('.profile-card');
const video = document.querySelector('.gradient-video');
const clipStart = 1.5;
let homeActive = false;
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = [...document.querySelectorAll('.carousel-slide')];
const carouselDots = [...document.querySelectorAll('.carousel-dots button')];
const siteNav = document.querySelector('.site-nav');
const navItems = [...document.querySelectorAll('.nav-item')];
const navSelectionPill = document.querySelector('.nav-selection-pill');
const brandLink = document.querySelector('.brand');
const worksNavButton = document.querySelector('[data-nav="works"]');
const aboutNavButton = document.querySelector('[data-nav="about"]');
const freeCreativeNavButton = document.querySelector('[data-nav="free-creative"]');
const aiCodingNavButton = document.querySelector('[data-nav="ai-coding"]');
const aiWorkflowButtons = [...document.querySelectorAll('[data-ai-workflow]')];
const aiWorkflowCards = [...document.querySelectorAll('.ai-workflow-card')];
const aiSkillCards = [...document.querySelectorAll('[data-ai-skill]')];
const aiSkillDetails = [...document.querySelectorAll('.ai-skill-detail')];
const aboutTabs = [...document.querySelectorAll('[data-about-tab]')];
const aboutPanels = [...document.querySelectorAll('[data-about-panel]')];
const projectInfo = document.querySelector('#project-info');
const projectMedia = document.querySelector('#project-media');
const projectBackButton = document.querySelector('#project-back');
const projectMenuToggle = document.querySelector('#project-menu-toggle');
const projectMenuWrap = document.querySelector('.project-menu-wrap');
const projectSwitcher = document.querySelector('#project-switcher');
const projectLightbox = document.querySelector('#project-lightbox');
const projectLightboxMedia = document.querySelector('#project-lightbox-media');
const freeCreativeGallery = document.querySelector('#free-creative-gallery');
const freeCreativeBackdrop = document.querySelector('.free-creative-backdrop');
const worksMore = document.querySelector('.works-more');
const worksMoreLetters = worksMore ? [...worksMore.querySelectorAll('span')] : [];
const logoPage = document.querySelector('.logo-page');
const logoModel = document.querySelector('#logo-model');
let redrawLogoModel = () => {};
let activeCarouselIndex = 2;
let carouselTimer;
let carouselPhysicalIndex = carouselSlides.length + activeCarouselIndex;
let pendingCarouselReset = false;

if (worksMore && worksMoreLetters.length) {
  const worksMoreStartedAt = performance.now();
  const animateWorksMore = (now) => {
    const elapsed = now - worksMoreStartedAt;
    const brightnessPulse = (Math.sin(elapsed / 760) + 1) / 2;
    worksMore.style.opacity = String(.58 + brightnessPulse * .42);
    worksMoreLetters.forEach((letter, index) => {
      const hop = Math.max(0, Math.sin(elapsed / 340 - index * .78));
      letter.style.transform = `translateY(${-hop * 3.4}px)`;
    });
    window.requestAnimationFrame(animateWorksMore);
  };
  window.requestAnimationFrame(animateWorksMore);
}

if (carouselTrack && carouselSlides.length) {
  const cloneSet = () => carouselSlides.map((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });
  carouselTrack.prepend(...cloneSet());
  carouselTrack.append(...cloneSet());
}

window.requestAnimationFrame(() => {
  window.setTimeout(() => card.classList.add('is-ready'), 30);
  positionNavSelection();
});

function positionNavSelection() {
  const selectedItem = document.querySelector('.nav-item--active');
  if (!siteNav || !navSelectionPill || !selectedItem) return;
  const navBounds = siteNav.getBoundingClientRect();
  const itemBounds = selectedItem.getBoundingClientRect();
  navSelectionPill.style.setProperty('--nav-pill-x', `${itemBounds.left - navBounds.left}px`);
  navSelectionPill.style.setProperty('--nav-pill-width', `${itemBounds.width}px`);
  navSelectionPill.classList.add('is-visible');
}

function selectNavItem(item) {
  if (!item) return;
  navItems.forEach((navItem) => navItem.classList.toggle('nav-item--active', navItem === item));
  window.requestAnimationFrame(positionNavSelection);
}

function clearNavSelection() {
  navItems.forEach((navItem) => navItem.classList.remove('nav-item--active'));
  navSelectionPill?.classList.remove('is-visible');
}

function resetGradient() {
  if (video.readyState >= 1) video.currentTime = clipStart;
}

function playGradient() {
  video.play().catch(() => {});
}

function pauseGradient() {
  if (homeActive) return;
  video.pause();
  resetGradient();
}

card.addEventListener('mouseenter', playGradient);
card.addEventListener('mouseleave', pauseGradient);
card.addEventListener('focus', playGradient);
card.addEventListener('blur', pauseGradient);
card.addEventListener('click', () => {
  if (homeActive) return;
  homeActive = true;
  document.body.classList.add('home-active');
  window.requestAnimationFrame(positionNavSelection);
  startAmbientWordMotion();
  video.loop = true;
  resetGradient();
  video.play().catch(() => {});
  window.setTimeout(() => focusCarouselSlide(2, false), 40);
  startCarousel();
});

function setAboutTab(tabName) {
  aboutTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.aboutTab === tabName));
  aboutPanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.aboutPanel === tabName));
  document.body.classList.toggle('about-intro-active', tabName === 'intro');
}

function openAboutPage() {
  document.body.classList.remove('project-active', 'free-creative-active', 'ai-coding-active', 'logo-active');
  logoPage?.setAttribute('aria-hidden', 'true');
  document.body.classList.add('home-active', 'about-active');
  stopAmbientWordMotion();
  selectNavItem(aboutNavButton);
  setAboutTab('intro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openWorksPage() {
  document.body.classList.remove('about-active', 'about-intro-active', 'project-active', 'free-creative-active', 'ai-coding-active', 'logo-active');
  logoPage?.setAttribute('aria-hidden', 'true');
  startAmbientWordMotion();
  selectNavItem(worksNavButton);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openLogoPage() {
  document.body.classList.remove('about-active', 'about-intro-active', 'project-active', 'free-creative-active', 'ai-coding-active');
  document.body.classList.add('home-active', 'logo-active');
  logoPage?.setAttribute('aria-hidden', 'false');
  stopAmbientWordMotion();
  clearNavSelection();
  setProjectMenuOpen(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.requestAnimationFrame(() => redrawLogoModel());
}

const makeProjectMedia = (slug, files) => files.map((file) => ({
  src: `./assets/media/projects/${slug}/${file}`,
  type: file.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
}));

const freeCreativeArtworks = [
  { file: 'art-05.png', cn: '一纸情长·王献之', en: 'A Love Spanning Pages · Wang Xianzhi', column: 1, row: 1, align: 'start', offset: '-.5rem' },
  { file: 'art-03.png', cn: 'Spotlight Font 小灯体', en: 'Spotlight Font', column: 3, row: 1, align: 'center', offset: '2.2rem' },
  { file: 'art-11.png', cn: '天鹅壶', en: 'Swan Kettle', column: 5, row: 1, align: 'end', offset: '1rem' },
  { file: 'art-19.png', cn: '视觉研学·第五期主视觉', en: 'Visual Study: Issue Five Key Visual', column: 2, row: 2, align: 'start', offset: '-1.8rem' },
  { file: 'art-07.png', cn: '和 Awen 老师的默契挑战', en: 'Chemistry Challenge with Awen', column: 4, row: 2, align: 'end', offset: '1rem' },
  { file: 'art-20.png', cn: '视觉研学一周年特别活动', en: 'Visual Study: First Anniversary', column: 1, row: 3, align: 'center', offset: '1.5rem' },
  { file: 'art-08.png', cn: '和 Chardwick 的默契挑战', en: 'Chemistry Challenge with Chardwick', column: 3, row: 3, align: 'start', offset: '-1.6rem' },
  { file: 'art-14.jpg', cn: '少拍马屁，一蹄子蹬死你', en: 'Stop Kissing Up, or Get Kicked', column: 5, row: 3, align: 'end', offset: '2rem' },
  { file: 'art-12.png', cn: '字型版色', en: 'Type, Layout & Color', column: 2, row: 4, align: 'end', offset: '.8rem' },
  { file: 'art-18.png', cn: '益智玩具·路标视觉语言', en: 'Educational Toys: Wayfinding Visual Language', column: 4, row: 4, align: 'center', offset: '-1.7rem' },
  { file: 'art-15.png', cn: '灵感废纸', en: 'Inspiration Scrap Paper', column: 1, row: 5, align: 'start', offset: '-.9rem' },
  { file: 'art-04.png', cn: 'TOD 文档整理术', en: 'TOD: The Art of Document Organization', column: 3, row: 5, align: 'center', offset: '1.8rem' },
  { file: 'art-22.png', cn: '贪嗔痴', en: 'Greed, Anger & Delusion', column: 5, row: 5, align: 'end', offset: '-1rem', featured: true },
  { file: 'art-09.png', cn: '四维形意动线', en: 'Four-Dimensional Form-Meaning Motion Lines', column: 2, row: 6, align: 'start', offset: '1.1rem' },
  { file: 'art-13.png', cn: '它看起来没有很软', en: 'It Doesn’t Look Very Soft', column: 4, row: 6, align: 'end', offset: '-1.3rem' },
  { file: 'art-24.png', cn: '高温糖浆乐队', en: 'High-Temperature Syrup Band', column: 1, row: 7, align: 'center', offset: '.4rem' },
  { file: 'art-17.png', cn: '瑞典工业设计网格', en: 'Swedish Industrial Design Grid', column: 3, row: 7, align: 'start', offset: '1.6rem' },
  { file: 'art-25.png', cn: '黄河入海口·新世界之门', en: 'Yellow River Estuary: Gateway to a New World', column: 5, row: 7, align: 'end', offset: '-1.4rem' },
  { file: 'art-01.png', cn: 'BOOM！', en: 'BOOM!', column: 2, row: 8, align: 'end', offset: '-.6rem' },
  { file: 'art-10.png', cn: '回头是岸', en: 'Turn Back to the Shore', column: 4, row: 8, align: 'center', offset: '1.5rem' },
  { file: 'art-16.png', cn: '王中王', en: 'King of Kings', column: 1, row: 9, align: 'start', offset: '1.1rem' },
  { file: 'art-21.png', cn: '计算视觉', en: 'Computational Vision', column: 3, row: 9, align: 'center', offset: '-1.2rem' },
  { file: 'art-23.jpg', cn: '零件', en: 'Components', column: 5, row: 9, align: 'end', offset: '.7rem' },
  { file: 'art-02.png', cn: 'Little Doll', en: 'Little Doll', column: 2, row: 10, align: 'start', offset: '-.8rem' },
];

function renderFreeCreativeGallery() {
  if (!freeCreativeGallery) return;
  const fragment = document.createDocumentFragment();
  freeCreativeArtworks.forEach((artwork, index) => {
    const card = document.createElement('article');
    card.className = `free-art-card${artwork.featured ? ' is-featured' : ''}`;
    card.dataset.artwork = artwork.file;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `查看 ${artwork.cn}`);
    card.style.gridColumn = artwork.column;
    card.style.gridRow = artwork.row;
    card.style.justifySelf = artwork.align;
    card.style.setProperty('--free-offset', artwork.offset);
    const image = document.createElement('img');
    image.src = `./assets/media/free-creative/${artwork.file}`;
    image.alt = artwork.cn;
    image.loading = index < 5 ? 'eager' : 'lazy';
    const info = document.createElement('div');
    info.className = 'free-art-card-info';
    const nameCn = document.createElement('strong');
    nameCn.textContent = artwork.cn;
    const nameEn = document.createElement('span');
    nameEn.textContent = artwork.en;
    info.append(nameCn, nameEn);
    card.append(image, info);
    fragment.appendChild(card);
  });
  freeCreativeGallery.replaceChildren(fragment);
}

function prepareFreeCreativeBackdrop() {
  if (!freeCreativeBackdrop || freeCreativeBackdrop.dataset.splitReady) return;
  let wordIndex = 0;
  [...freeCreativeBackdrop.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const words = node.textContent.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      const piece = document.createElement('span');
      piece.style.setProperty('--backdrop-word', wordIndex++);
      piece.textContent = `${index ? ' ' : ''}${word}`;
      fragment.appendChild(piece);
    });
    node.replaceWith(fragment);
  });
  freeCreativeBackdrop.dataset.splitReady = 'true';
}

function openFreeCreativePage() {
  document.body.classList.remove('about-active', 'about-intro-active', 'project-active', 'ai-coding-active', 'logo-active');
  logoPage?.setAttribute('aria-hidden', 'true');
  document.body.classList.add('home-active', 'free-creative-active');
  stopAmbientWordMotion();
  selectNavItem(freeCreativeNavButton);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setAiWorkflow(workflow) {
  aiWorkflowButtons.forEach((button) => {
    const selected = button.dataset.aiWorkflow === workflow;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  aiWorkflowCards.forEach((card) => {
    const selected = card.id === `ai-workflow-${workflow}`;
    card.hidden = !selected;
    card.classList.toggle('is-active', selected);
  });
}

function setAiSkill(skill) {
  aiSkillCards.forEach((card) => {
    const selected = card.dataset.aiSkill === skill;
    card.classList.toggle('is-active', selected);
    card.setAttribute('aria-expanded', String(selected));
  });
  aiSkillDetails.forEach((detail) => {
    const selected = detail.id === `ai-skill-${skill}`;
    detail.hidden = !selected;
    detail.classList.toggle('is-active', selected);
  });
}

function openAiCodingPage() {
  document.body.classList.remove('about-active', 'about-intro-active', 'project-active', 'free-creative-active', 'logo-active');
  logoPage?.setAttribute('aria-hidden', 'true');
  document.body.classList.add('home-active', 'ai-coding-active');
  stopAmbientWordMotion();
  selectNavItem(aiCodingNavButton);
  setAiWorkflow('vibe');
  setAiSkill('reference');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const projectData = {
  'ai-sleep-music': {
    category: '视听交互 / UI', client: 'HUAWEI运动健康', title: 'AI助眠音乐体验空间-音乐可视化创新设计（demo）',
    intro: ['这是一款面向成年睡眠困扰人群的 AI 睡眠陪伴产品，重点服务主动熬夜的年轻用户、压力渐显的职场人，以及睡眠时长不足的 35—44 岁人群。产品打通手机、穿戴设备等多端信息，综合睡眠、压力与日常状态，让 AI 像“懂我情绪”的伙伴一样给出可解释的个性化陪伴。', '围绕助眠、小憩、舒压、唤醒四个场景，AI 实时生成适配当下状态的音乐、自然声景与动态视觉，并结合定时唤醒、低亮息屏形成完整闭环。它不止检测睡眠，更通过跨设备数据与创新内容，帮助用户真正放松、入睡并恢复精力。'],
    credits: [['年份', '2026'], ['项目经理', 'CAI YANGWU'], ['艺术指导', 'CAI YANGWU、LI GUANGYAO'], ['前端开发', 'LIU DEZHENG'], ['视觉设计', 'LIU DEZHENG']],
    media: makeProjectMedia('ai-sleep-music', ['1.png', '2.mp4', '3.png', '4.png', '5.png', '6.png'])
  },
  'post-turing-test': {
    category: '装置/人机交互', client: '无（学术研究）', title: 'Post-Turing Test\n（后图灵测试）',
    intro: ['图灵测试曾以“人”作为参照，追问机器能否在语言交流中表现出近似于人的智能。《后图灵测试》则将这一关系倒置。当“机器性”成为判断标准，而“人性”作为被反向检测出的残留出现时，人将如何表演机器？', '相较于人类学研究的漫长历史，我们对于“机器性”的想象仍然有限。作品系统性收集835条主流AI模型关于人机区别、机器特征与machine-likeness的回答，并经编码、聚类与蒸馏，提炼为装置中的判断维度与代理系统，从而开启一场反向检测。', '在装置中，参与者提交自身的机器性声明，并接受代理系统的持续追问。其语言、声音、表情、姿态等多模态信息，将被转化为综合评分，成为检测依据。', '作品进一步探讨，在这一倒置的权力关系下，个体如何通过具身表演呈现自身对于机器的想象，以及这一过程中可能显现的控制、失权与自我规训。'],
    credits: [['年份', '2026'], ['算法 / 开发', 'LI ZHE'], ['三维美术', 'ZHANG WENJIA'], ['计算视觉', 'LIU DEZHENG'], ['装置设计', 'LI ZHE、LIU DEZHENG']],
    media: [{ src: './assets/media/projects/post-turing-test/0.mp4', type: 'video' }, ...makeProjectMedia('post-turing-test', ['1.jpg', '2.webp', '3.jpg', '4.png', '5.jpg', '6.png', '7.png'])]
  },
  'a-nest-media-house': {
    category: '标识 / 视觉识别系统', client: '国家体育中心（鸟巢）', title: '鸟巢科技艺术中心标识设计',
    intro: ['4月27日，鸟巢科技艺术中心正式对外开放，启幕大展「可能世界档案：2026国际科技艺术展」同步亮相。', '鸟巢科技艺术中心以科技艺术破题，构建“硬件+平台+内容生产”三合一体系，最终将鸟巢“蝶变”为世界艺术的中心，成为“文化+科技+体育”的综合体。', '会议决定，“鸟巢科技艺术中心”英文名定为 A Nest Media House，强调媒体属性与增量价值。其中，“Nest”寓意孕育、孵化，对应英文缩写重新诠释——', 'A: Art（艺术）\nN: Nurture（孕育）\nE: Education（教育）\nS: Science（科学）\nT: Technology（技术）。', '建议综合以上概念，重新设计动态 logo；展览开幕口号“让科技被感知，让未来被看见”可以作为有效 slogan。'],
    credits: [['年份', '2026'], ['艺术指导', 'YU ZHEN'], ['平面设计', 'LIU DEZHENG']], media: [...makeProjectMedia('a-nest-media-house', ['1.jpg', '2.mp4']), { src: './assets/media/projects/a-nest-media-house/4.png' }, ...makeProjectMedia('a-nest-media-house', ['3.png'])]
  },
  'guomei-film': {
    category: '标识 / 视觉识别系统', client: '中国美术学院影视传媒有限公司', title: '国美影业品牌形象设计',
    intro: ['标志设计源自于对电影本身的思考。电影的构成元素有很多：声音、色彩、构图……再三考量后选择了一种极具视觉张力，模糊感性与理性之间界限的切入点——蒙太奇。', '在现代电影学理论当中，蒙太奇具有着不可撼动的重要地位，也曾在不同艺术流派的对抗中饱受争议，但不可否认的是，蒙太奇的诞生使得电影的叙述在时间空间的运用上取得极大的自由。标识通过两个长方形的并列、交织，形成负形空间，按照斐波那契数列黄金分割比例构建，这种图形的处理方式与蒙太奇的本质有异曲同工之处。'],
    credits: [['年份', '2024'], ['艺术指导', 'LIU DEZHENG'], ['平面设计', 'LIU DEZHENG']], media: makeProjectMedia('guomei-film', ['1.webp', '2.webp', '2-5.mp4', '3.png', '4.webp'])
  },
  'new-shudi': {
    category: '文化活动视觉 / 周边', client: '小红书', title: '小红书杭州新职场搬迁仪式主视觉设计',
    intro: ['一年前的三月，小红书在杭州落下第一颗种子；一年后的春天，种子长成了大树。REDhood 17&18F，正式启航！', '小红书杭州新职场在2026年3月正式启用，视觉设计以“春季”为主题，将动植物进行图形设计并排列组合，营造春意盎然，万物始发的视觉氛围。'],
    credits: [['年份', '2026'], ['艺术指导', 'ZHUDI'], ['平面设计', 'LIU DEZHENG']], media: makeProjectMedia('new-shudi', ['1.png', '2.webp', '3 .png', '4 .png', '5.png']).map((item, index) => ({ ...item, whiteBackground: index >= 3 }))
  },
  'four-dimensional-motion': {
    category: '数字艺术 / 动作捕捉', client: '无（学术研究）', title: '四维形意动线',
    intro: ['动作传达的历史可以追溯到新史时期，并伴随人类认知和科技的进步其媒介逐渐从二维图像上升到三维空间，传达效率也随之提升，但始终存在传达效率的缺陷。', '该设计将动作传达带入四维时空的观念，来探究动作空间信息精准传达的全新高度和内部所蕴含的动作情感，即“形意”。动作素材以太极拳为例，运用动态捕捉技术、交互式编程和三维软件来搭建虚拟四维时空，以此生成四维“形意”人体轨迹，并运用视觉传达的设计逻辑探寻四维时空和“形意”轨迹所身处不同语境的可能性。'],
  credits: [['年份', '2023'], ['算法 / 开发', 'LIU DEZHENG'], ['三维美术', 'LIU DEZHENG'], ['平面设计', 'LIU DEZHENG、FANG CHUHUI']], media: [{ src: './assets/media/projects/four-dimensional-motion/0.mp4', type: 'video' }, ...makeProjectMedia('four-dimensional-motion', ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.png'])]
  },
  xianwa: {
    category: '标识 / 视觉识别系统 / 包装', client: '掀瓦', title: '掀瓦品牌形象设计',
    intro: ['掀瓦是一家位于江西景德镇的陶瓷艺术工作室。品牌起源于三秦大地的雕塑技艺，扎根于瓷都的生态沃土，追求手作陶瓷的自然美。', '形象设计取“瓦”之核心意象，以瓦的掀扣呼应制陶塑形过程。手工摹写的品牌字保留了质朴感。色彩体系源于独家高温窑变釉色，轻盈柔和，彰显器物的有机感。在贴花瓷盛行的市场中，掀瓦品牌从自然属性出发，视“缺陷”为人性印记，不过度雕琢，于标准化时代留存传统质料的自然美。'],
    credits: [['年份', '2025'], ['艺术指导', 'LIU DEZHENG'], ['创意指导', 'LIU XINYU'], ['平面设计', 'LIU DEZHENG、LIU XINYU']], media: makeProjectMedia('xianwa', ['1.jpg', '2.webp', '3.jpg', '4.jpg', '5.jpg', '7.jpg', '6.jpg', '8.jpg', '9.jpg'])
  },
  'siming-youth-week': {
    category: '文化活动视觉 / 周边', client: '四明山国家森林公园', title: '四明山青年创客周活动形象设计',
    intro: ['本次青创活动立足四明山片区乡村振兴战略，依托片区闲置空间资源活化利用需求，整合政企校社多方资源，打造青年创新创业赋能平台，构建“资源活化-创意孵化-在地实践-成果转化”全链条创新生态，推动四明山文旅业态升级。', '视觉设计以四明山“青山碧水”的地貌特征为切入点，结合其天然“氧吧”的美誉，打造气候宜人环境下青年创新的现代视觉语言。来自浙江大学、中国美术学院招募的20支青创团队集体亮相，团队成员以简短有力的口号传达创新理念。'],
    credits: [['年份', '2025'], ['艺术指导', 'LIU DEZHENG、ZHANG CHAOHUAI'], ['平面设计', 'LIU DEZHENG、ZHANG CHAOHUAI']], media: makeProjectMedia('siming-youth-week', ['1.webp', '6.jpg', '2.webp', '3.jpg', '4.webp', '5.webp', '7.jpg', '8.jpg'])
  },
  redcomedy: {
    category: '营销活动视觉 / AIGC', client: '小红书', title: 'REDcomedy喜剧社区视觉设计',
    intro: ['REDcomedy小红书喜剧社区是小红书官方组织的喜剧聚集地，旨在汇聚全书最有趣的创作者与内容，为创作者提供扶持，为用户持续输送快乐。', '视觉设计使用到了AIGC辅助创作，将“笑脸”作为核心视觉意象，营造轻松喜庆的视觉氛围，将聊天气泡的视觉中心放在活动logo上方，来契合业务方对“社区发声，欢乐无限”的功能定位。项目于春节CNY期间上线。'],
    credits: [['年份', '2026'], ['艺术指导', 'HUI ER'], ['平面设计', 'LIU DEZHENG']], media: makeProjectMedia('redcomedy', ['1.jpg', '2.jpg', '3.jpg', '4.png'])
  },
  'xixi-wetland': {
    category: '公共信息', client: '西溪国家湿地公园', title: '西溪国家湿地公园导视系统设计',
    intro: ['应2023杭州亚运会建设需要，对西溪国家湿地公园导视系统进行翻新升级。', '导视系统设计秉持“自然与人文共生”的理念，使用天然木石材质融入湿地肌理；利用色彩编码指引清晰动线；多语种无障碍识别与模块化设计提升普适性与实用性。'],
    credits: [['年份', '2023'], ['艺术指导', 'YUAN YOUMIN、FANG HONGZHANG、WANGZHEHAO'], ['平面设计', 'LIU DEZHENG、CHEN NUO、WANG XINFU、WANG YIQI、HU CHENRUI、MA XIAOPENG']], media: makeProjectMedia('xixi-wetland', ['1.jpg', '2.jpg', '3.png', '4.webp', '5.png'])
  },
  hana: {
    category: '标识 / 视觉识别系统', client: 'HANA', title: 'HANA花艺体验空间品牌形象设计',
    intro: ['每一朵花都是自然写给孩子的诗歌。HANA取自日语“花”的发音，寓意将日本传统花道中“尊重生命、感知季节”的哲学融入儿童教育，通过花艺创作唤醒孩子对自然的敬畏之心，在指尖绽放的缤纷中培养审美力、专注力与创造力。', '客户希望品牌形象与产品、受众保持高度的适配，所以选择了雪花片益智积木来作为核心视觉符号。雪花片本身具备“创造力”、“童趣”的产品属性，且玩法与插花具有一定的相似性，同时围绕着客户针对多龄段儿童开发的课程进行延展。'],
    credits: [['年份', '2025'], ['艺术指导', 'LIU DEZHENG'], ['平面设计', 'LIU DEZHENG']], media: makeProjectMedia('hana', ['1.webp', '2.jpg', '3.jpg', '4.png'])
  }
};

function escapeProjectText(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function setProjectMenuOpen(isOpen) {
  projectMenuWrap?.classList.toggle('is-open', isOpen);
  projectMenuToggle?.setAttribute('aria-expanded', String(isOpen));
}

function closeProjectLightbox() {
  if (!projectLightbox) return;
  projectLightbox.classList.remove('is-open');
  projectLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-media-preview');
  window.setTimeout(() => {
    if (!projectLightbox.classList.contains('is-open') && projectLightboxMedia) projectLightboxMedia.replaceChildren();
  }, 260);
}

function openProjectLightbox(media) {
  if (!projectLightbox || !projectLightboxMedia) return;
  const preview = media.cloneNode(true);
  if (preview.tagName === 'VIDEO') {
    preview.controls = true;
    preview.muted = true;
    preview.loop = true;
    preview.play().catch(() => {});
  }
  projectLightboxMedia.replaceChildren(preview);
  projectLightbox.classList.add('is-open');
  projectLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-media-preview');
}

function renderProjectSwitcher() {
  if (!projectSwitcher) return;
  projectSwitcher.innerHTML = Object.entries(projectData).map(([projectId, project]) => `<button type="button" role="menuitem" data-project-choice="${projectId}">${escapeProjectText(project.title).replace(/\n/g, ' ')}</button>`).join('');
}

function renderProject(project) {
  if (!projectInfo || !projectMedia) return;
  const infoItems = [['类别', project.category], ['客户', project.client], ['项目名称', project.title]];
  projectInfo.innerHTML = `<h1>Information</h1><dl class="project-meta">${infoItems.map(([label, value]) => `<div><dt>${escapeProjectText(label)}</dt><dd>${escapeProjectText(value).replace(/\n/g, '<br />')}</dd></div>`).join('')}</dl><div class="project-description">${project.intro.map((paragraph) => `<p>${escapeProjectText(paragraph)}</p>`).join('')}</div><dl class="project-meta">${project.credits.map(([label, value]) => `<div><dt>${escapeProjectText(label)}</dt><dd>${escapeProjectText(value)}</dd></div>`).join('')}</dl>`;
  projectMedia.innerHTML = `<h2>Related Images</h2><div class="project-media-list">${project.media.map((item, index) => `<div class="project-media-item${item.whiteBackground ? ' is-white-background' : ''}">${item.type === 'video' ? `<video src="${item.src}" autoplay muted loop playsinline aria-label="项目视频"></video>` : `<img src="${item.src}" alt="项目相关图片 ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}" />`}</div>`).join('')}</div>`;
  projectMedia.querySelectorAll('img, video').forEach((media) => {
    const reveal = () => window.requestAnimationFrame(() => media.classList.add('is-loaded'));
    const isImage = media instanceof HTMLImageElement;
    const isReady = isImage ? media.complete && media.naturalWidth > 0 : media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
    if (isReady) {
      reveal();
      return;
    }
    media.addEventListener(isImage ? 'load' : 'loadeddata', reveal, { once: true });
    media.addEventListener('error', reveal, { once: true });
  });
}

function openProject(projectId) {
  const project = projectData[projectId];
  if (!project) return;
  document.body.classList.remove('about-active', 'about-intro-active', 'free-creative-active', 'ai-coding-active', 'logo-active');
  logoPage?.setAttribute('aria-hidden', 'true');
  document.body.classList.add('home-active', 'project-active');
  stopAmbientWordMotion();
  selectNavItem(worksNavButton);
  setProjectMenuOpen(false);
  renderProject(project);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

renderProjectSwitcher();
renderFreeCreativeGallery();
prepareFreeCreativeBackdrop();
projectBackButton?.addEventListener('click', openWorksPage);
projectMenuToggle?.addEventListener('click', () => setProjectMenuOpen(!projectMenuWrap?.classList.contains('is-open')));
projectSwitcher?.addEventListener('click', (event) => {
  const projectChoice = event.target.closest('[data-project-choice]');
  if (projectChoice) openProject(projectChoice.dataset.projectChoice);
});
projectMedia?.addEventListener('click', (event) => {
  const media = event.target.closest('img, video');
  if (media) openProjectLightbox(media);
});
freeCreativeGallery?.addEventListener('click', (event) => {
  const card = event.target.closest('.free-art-card');
  const media = card?.querySelector('img');
  if (media) openProjectLightbox(media);
});
freeCreativeGallery?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.free-art-card');
  const media = card?.querySelector('img');
  if (media) { event.preventDefault(); openProjectLightbox(media); }
});
projectLightbox?.addEventListener('click', closeProjectLightbox);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeProjectLightbox();
});
document.addEventListener('pointerdown', (event) => {
  if (projectMenuWrap && !projectMenuWrap.contains(event.target)) setProjectMenuOpen(false);
});

aboutNavButton?.addEventListener('click', openAboutPage);
worksNavButton?.addEventListener('click', openWorksPage);
freeCreativeNavButton?.addEventListener('click', openFreeCreativePage);
aiCodingNavButton?.addEventListener('click', openAiCodingPage);
aiWorkflowButtons.forEach((button) => {
  button.addEventListener('click', () => setAiWorkflow(button.dataset.aiWorkflow));
  button.addEventListener('pointermove', (event) => {
    const bounds = button.getBoundingClientRect();
    button.style.setProperty('--ai-glow-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    button.style.setProperty('--ai-glow-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  });
});
aiSkillCards.forEach((card) => card.addEventListener('click', () => setAiSkill(card.dataset.aiSkill)));
brandLink?.addEventListener('click', (event) => { event.preventDefault(); openLogoPage(); });
document.querySelectorAll('.work-card[data-project]').forEach((card) => {
  card.addEventListener('click', () => openProject(card.dataset.project));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(card.dataset.project); }
  });
});
navItems.filter((item) => !['works', 'about', 'free-creative'].includes(item.dataset.nav)).forEach((item) => item.addEventListener('click', () => selectNavItem(item)));
aboutTabs.forEach((tab) => tab.addEventListener('click', () => setAboutTab(tab.dataset.aboutTab)));
window.addEventListener('resize', positionNavSelection);
window.addEventListener('load', positionNavSelection);
document.fonts?.ready.then(positionNavSelection).catch(() => {});

function focusCarouselSlide(index, smooth = true) {
  const target = carouselSlides[index];
  if (!target || !carouselTrack) return;
  scrollCarouselTo(target, smooth);
  carouselPhysicalIndex = carouselSlides.length + index;
  pendingCarouselReset = false;
  activeCarouselIndex = index;
  carouselDots.forEach((dot, dotIndex) => dot.classList.toggle('is-current', dotIndex === index));
}

function scrollCarouselTo(target, smooth) {
  const offset = target.offsetLeft - (carouselTrack.clientWidth - target.clientWidth) / 2;
  carouselTrack.scrollTo({ left: offset, behavior: smooth ? 'smooth' : 'auto' });
}

function startCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    const nextIndex = (activeCarouselIndex + 1) % carouselSlides.length;
    const nextPhysicalSlide = carouselTrack.children[carouselPhysicalIndex + 1];
    scrollCarouselTo(nextPhysicalSlide, true);
    carouselPhysicalIndex += 1;
    activeCarouselIndex = nextIndex;
    carouselDots.forEach((dot, dotIndex) => dot.classList.toggle('is-current', dotIndex === nextIndex));

    if (carouselPhysicalIndex === carouselSlides.length * 2) {
      pendingCarouselReset = true;
      window.setTimeout(resetCarouselLoop, 1100);
    }
  }, 4600);
}

function resetCarouselLoop() {
  if (!pendingCarouselReset) return;
  scrollCarouselTo(carouselTrack.children[carouselSlides.length], false);
  carouselPhysicalIndex = carouselSlides.length;
  pendingCarouselReset = false;
}

carouselTrack?.addEventListener('scrollend', resetCarouselLoop);
carouselTrack?.addEventListener('click', (event) => {
  const slide = event.target.closest('.carousel-slide[data-project]');
  if (slide) openProject(slide.dataset.project);
});
carouselDots.forEach((dot, index) => dot.addEventListener('click', () => focusCarouselSlide(index, false)));

let spotlightTargetX = 0;
let spotlightTargetY = 0;
let spotlightCurrentX = 0;
let spotlightCurrentY = 0;
let spotlightFrame;

function updateSpotlightPosition() {
  spotlightCurrentX += (spotlightTargetX - spotlightCurrentX) * .1;
  spotlightCurrentY += (spotlightTargetY - spotlightCurrentY) * .1;
  siteNav?.style.setProperty('--spotlight-x', `${spotlightCurrentX}px`);
  siteNav?.style.setProperty('--spotlight-y', `${spotlightCurrentY}px`);

  if (Math.abs(spotlightTargetX - spotlightCurrentX) > .25 || Math.abs(spotlightTargetY - spotlightCurrentY) > .25) {
    spotlightFrame = requestAnimationFrame(updateSpotlightPosition);
  } else {
    spotlightFrame = undefined;
  }
}

siteNav?.addEventListener('pointermove', (event) => {
  const bounds = siteNav.getBoundingClientRect();
  spotlightTargetX = event.clientX - bounds.left;
  spotlightTargetY = event.clientY - bounds.top;
  if (!spotlightFrame) spotlightFrame = requestAnimationFrame(updateSpotlightPosition);
});
siteNav?.addEventListener('pointerenter', (event) => {
  const bounds = siteNav.getBoundingClientRect();
  spotlightTargetX = spotlightCurrentX = event.clientX - bounds.left;
  spotlightTargetY = spotlightCurrentY = event.clientY - bounds.top;
  siteNav.style.setProperty('--spotlight-x', `${spotlightCurrentX}px`);
  siteNav.style.setProperty('--spotlight-y', `${spotlightCurrentY}px`);
  siteNav.style.setProperty('--spot-blue-x', `${Math.round((Math.random() - .28) * 70)}px`);
  siteNav.style.setProperty('--spot-blue-y', `${Math.round((Math.random() - .55) * 32)}px`);
  siteNav.style.setProperty('--spot-yellow-x', `${Math.round((Math.random() - .72) * 90)}px`);
  siteNav.style.setProperty('--spot-yellow-y', `${Math.round((Math.random() - .35) * 42)}px`);
  siteNav.classList.add('is-spotlit');
});
siteNav?.addEventListener('pointerleave', () => siteNav.classList.remove('is-spotlit'));
card.addEventListener('pointermove', (event) => {
  const bounds = card.getBoundingClientRect();
  const positionX = ((event.clientX - bounds.left) / bounds.width) * 100;
  const positionY = ((event.clientY - bounds.top) / bounds.height) * 100;
  card.style.setProperty('--specular-x', `${positionX}%`);
  card.style.setProperty('--specular-y', `${positionY}%`);
  card.style.setProperty('--tilt-x', `${(50 - positionY) * .14}deg`);
  card.style.setProperty('--tilt-y', `${(positionX - 50) * .14}deg`);
});
card.addEventListener('mouseleave', () => {
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
});
video.addEventListener('loadedmetadata', resetGradient);
video.addEventListener('ended', () => {
  resetGradient();
  if (card.matches(':hover, :focus-visible')) playGradient();
});

const textLines = document.querySelectorAll('.word-wall p');
const wordWall = document.querySelector('.word-wall');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

textLines.forEach((line) => {
  const characters = [...line.textContent];
  line.textContent = '';
  const fragment = document.createDocumentFragment();

  characters.forEach((character) => {
    const span = document.createElement('span');
    span.className = 'proximity-char';
    span.textContent = character === ' ' ? '\u00a0' : character;
    fragment.appendChild(span);
  });

  line.appendChild(fragment);
});

const proximityChars = [...document.querySelectorAll('.proximity-char')];
const logoWordWall = document.querySelector('#logo-word-wall');
const logoWordLines = logoWordWall?.querySelectorAll('p') || [];
let logoProximityFrame;
const logoProximityRadius = 270;
const proximityRadius = 250;
let pointerFrame;
let proximityEnabled = false;
let latestPointerPosition;
let proximityIdleTimer;
let ambientWordTimer;
let ambientWordIndexes = [];
const ambientWeights = proximityChars.map(() => 900);

proximityChars.forEach((character, index) => {
  character.style.setProperty('--reveal-delay', `${index * 12}ms`);
});

logoWordLines.forEach((line) => {
  const characters = [...line.textContent];
  line.textContent = '';
  const fragment = document.createDocumentFragment();
  characters.forEach((character) => {
    const span = document.createElement('span');
    span.className = 'logo-proximity-char';
    span.textContent = character === ' ' ? '\u00a0' : character;
    fragment.appendChild(span);
  });
  line.appendChild(fragment);
});

const logoProximityChars = [...document.querySelectorAll('.logo-proximity-char')];

function updateLogoVariableProximity(pointerX, pointerY) {
  logoProximityFrame = undefined;
  logoProximityChars.forEach((character) => {
    const bounds = character.getBoundingClientRect();
    const distance = Math.hypot(pointerX - (bounds.left + bounds.width / 2), pointerY - (bounds.top + bounds.height / 2));
    const strength = Math.max(0, 1 - distance / logoProximityRadius) ** 1.45;
    const weight = Math.round(900 - strength * 500);
    character.style.fontWeight = weight;
    character.style.fontVariationSettings = `"wght" ${weight}`;
  });
}

function updateVariableProximity(pointerX, pointerY) {
  pointerFrame = undefined;
  latestPointerPosition = { x: pointerX, y: pointerY };

  proximityChars.forEach((character, index) => {
    const bounds = character.getBoundingClientRect();
    const distance = Math.hypot(
      pointerX - (bounds.left + bounds.width / 2),
      pointerY - (bounds.top + bounds.height / 2)
    );
    const strength = Math.max(0, 1 - distance / proximityRadius) ** 1.45;
    const weight = Math.round(ambientWeights[index] - strength * (ambientWeights[index] - 400));
    character.style.fontWeight = weight;
    character.style.fontVariationSettings = `"wght" ${weight}`;
  });
}

function applyAmbientWordWeights() {
  if (latestPointerPosition) {
    updateVariableProximity(latestPointerPosition.x, latestPointerPosition.y);
    return;
  }

  proximityChars.forEach((character, index) => {
    const weight = ambientWeights[index];
    character.style.fontWeight = weight;
    character.style.fontVariationSettings = `"wght" ${weight}`;
  });
}

function refreshAmbientWordWeights() {
  ambientWordIndexes.forEach((index) => { ambientWeights[index] = 900; });
  const nextIndexes = new Set();
  const waveCount = 5;

  for (let wave = 0; wave < waveCount; wave += 1) {
    const center = Math.floor(Math.random() * proximityChars.length);
    const radius = 4 + Math.floor(Math.random() * 4);
    for (let offset = -radius; offset <= radius; offset += 1) {
      const index = center + offset;
      if (index < 0 || index >= proximityChars.length) continue;
      const progress = Math.abs(offset) / radius;
      ambientWeights[index] = Math.round(570 + progress * 300 + Math.random() * 24);
      nextIndexes.add(index);
    }
  }

  ambientWordIndexes = [...nextIndexes];
  applyAmbientWordWeights();
}

function startAmbientWordMotion() {
  if (prefersReducedMotion.matches || ambientWordTimer) return;
  const playAmbientWordMotion = () => {
    if (!homeActive || document.body.classList.contains('about-active')) {
      ambientWordTimer = undefined;
      return;
    }
    if (proximityEnabled) refreshAmbientWordWeights();
    ambientWordTimer = window.setTimeout(playAmbientWordMotion, 1750);
  };
  ambientWordTimer = window.setTimeout(playAmbientWordMotion, 700);
}

function stopAmbientWordMotion() {
  if (ambientWordTimer) window.clearTimeout(ambientWordTimer);
  ambientWordTimer = undefined;
  ambientWordIndexes.forEach((index) => { ambientWeights[index] = 900; });
  ambientWordIndexes = [];
  applyAmbientWordWeights();
}

async function enableLogoModelRotation() {
  if (!logoModel) return;
  const gl = logoModel.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return;

  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uMvp;
    uniform mat4 uRotation;
    varying vec3 vNormal;
    void main() {
      vNormal = mat3(uRotation) * aNormal;
      gl_Position = uMvp * vec4(aPosition, 1.0);
    }
  `;
  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vNormal;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightA = normalize(vec3(-0.45, 0.82, 0.7));
      vec3 lightB = normalize(vec3(0.74, 0.1, -0.55));
      float diffuse = max(dot(normal, lightA), 0.0) * 0.86 + max(dot(normal, lightB), 0.0) * 0.28;
      float rim = pow(1.0 - max(normal.z, 0.0), 2.4) * 0.14;
      vec3 blackMaterial = vec3(0.008, 0.012, 0.018) + diffuse * vec3(0.16, 0.19, 0.22) + rim * vec3(0.08, 0.11, 0.15);
      gl_FragColor = vec4(blackMaterial, 1.0);
    }
  `;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const contactVertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec2 aUv;
    uniform mat4 uMvp;
    varying vec2 vUv;
    void main() {
      vUv = aUv;
      gl_Position = uMvp * vec4(aPosition, 1.0);
    }
  `;
  const contactFragmentShaderSource = `
    precision mediump float;
    uniform sampler2D uContactTexture;
    varying vec2 vUv;
    void main() {
      vec4 contact = texture2D(uContactTexture, vUv);
      gl_FragColor = vec4(contact.rgb, contact.a * 0.5);
    }
  `;
  const contactProgram = gl.createProgram();
  gl.attachShader(contactProgram, compile(gl.VERTEX_SHADER, contactVertexShaderSource));
  gl.attachShader(contactProgram, compile(gl.FRAGMENT_SHADER, contactFragmentShaderSource));
  gl.linkProgram(contactProgram);
  const contactProgramReady = gl.getProgramParameter(contactProgram, gl.LINK_STATUS);

  const multiply = (a, b) => {
    const output = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        output[column * 4 + row] = a[row] * b[column * 4] + a[4 + row] * b[column * 4 + 1] + a[8 + row] * b[column * 4 + 2] + a[12 + row] * b[column * 4 + 3];
      }
    }
    return output;
  };
  const rotationX = (radians) => {
    const c = Math.cos(radians); const s = Math.sin(radians);
    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  };
  const rotationY = (radians) => {
    const c = Math.cos(radians); const s = Math.sin(radians);
    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  };
  const translation = (x, y, z) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
  const projection = (aspect) => {
    const f = 1 / Math.tan((38 * Math.PI) / 360);
    const near = .1; const far = 100;
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]);
  };

  try {
    const response = window.__personalLogoOBJ ? null : await fetch('./assets/models/personal-logo-web.obj');
    if (response && !response.ok) return;
    const source = window.__personalLogoOBJ || await response.text();
    const positions = [];
    const triangles = [];
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    for (const line of source.split(/\r?\n/)) {
      if (line.startsWith('v ')) {
        const point = line.trim().split(/\s+/).slice(1, 4).map(Number);
        positions.push(point);
        for (let axis = 0; axis < 3; axis += 1) { min[axis] = Math.min(min[axis], point[axis]); max[axis] = Math.max(max[axis], point[axis]); }
      } else if (line.startsWith('f ')) {
        triangles.push(...line.trim().split(/\s+/).slice(1, 4).map((value) => Number(value) - 1));
      }
    }
    const extent = Math.max(...max.map((value, axis) => value - min[axis]));
    const centre = min.map((value, axis) => (value + max[axis]) / 2);
    const normalizedBounds = {
      min: min.map((value, axis) => ((value - centre[axis]) / extent) * 2.42),
      max: max.map((value, axis) => ((value - centre[axis]) / extent) * 2.42),
    };
    const meshPositions = new Float32Array(positions.length * 3);
    positions.forEach((point, index) => {
      meshPositions[index * 3] = ((point[0] - centre[0]) / extent) * 2.42;
      meshPositions[index * 3 + 1] = ((point[1] - centre[1]) / extent) * 2.42 - .04;
      meshPositions[index * 3 + 2] = ((point[2] - centre[2]) / extent) * 2.42;
    });
    const normals = new Float32Array(meshPositions.length);
    triangles.forEach((_, offset) => {
      if (offset % 3) return;
      const ia = triangles[offset] * 3; const ib = triangles[offset + 1] * 3; const ic = triangles[offset + 2] * 3;
      const ab = [meshPositions[ib] - meshPositions[ia], meshPositions[ib + 1] - meshPositions[ia + 1], meshPositions[ib + 2] - meshPositions[ia + 2]];
      const ac = [meshPositions[ic] - meshPositions[ia], meshPositions[ic + 1] - meshPositions[ia + 1], meshPositions[ic + 2] - meshPositions[ia + 2]];
      const cross = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
      [ia, ib, ic].forEach((index) => { normals[index] += cross[0]; normals[index + 1] += cross[1]; normals[index + 2] += cross[2]; });
    });
    for (let index = 0; index < normals.length; index += 3) {
      const length = Math.hypot(normals[index], normals[index + 1], normals[index + 2]) || 1;
      normals[index] /= length; normals[index + 1] /= length; normals[index + 2] /= length;
    }

    const supportsUintIndexes = Boolean(gl.getExtension('OES_element_index_uint'));
    if (positions.length > 65535 && !supportsUintIndexes) return;
    const indexData = positions.length > 65535 ? new Uint32Array(triangles) : new Uint16Array(triangles);
    const indexType = positions.length > 65535 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    const positionBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); gl.bufferData(gl.ARRAY_BUFFER, meshPositions, gl.STATIC_DRAW);
    const normalBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer); gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
    const toMeshPoint = (x, y, z) => [((x - centre[0]) / extent) * 2.42, ((y - centre[1]) / extent) * 2.42 - .04, ((z - centre[2]) / extent) * 2.42];
    const contactPlaneY = 4.96;
    const contactPlane = [
      ...toMeshPoint(107, contactPlaneY, -345),
      ...toMeshPoint(182, contactPlaneY, -345),
      ...toMeshPoint(182, contactPlaneY, -312),
      ...toMeshPoint(107, contactPlaneY, -312),
    ];
    const contactPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, contactPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(contactPlane), gl.STATIC_DRAW);
    const contactUvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, contactUvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);
    const contactPositionAttribute = contactProgramReady ? gl.getAttribLocation(contactProgram, 'aPosition') : -1;
    const contactUvAttribute = contactProgramReady ? gl.getAttribLocation(contactProgram, 'aUv') : -1;
    const contactMvpUniform = contactProgramReady ? gl.getUniformLocation(contactProgram, 'uMvp') : null;
    const contactTextureUniform = contactProgramReady ? gl.getUniformLocation(contactProgram, 'uContactTexture') : null;
    let contactTextureReady = false;
    let contactTexture;
    const positionAttribute = gl.getAttribLocation(program, 'aPosition');
    const normalAttribute = gl.getAttribLocation(program, 'aNormal');
    const mvpUniform = gl.getUniformLocation(program, 'uMvp');
    const rotationUniform = gl.getUniformLocation(program, 'uRotation');
    let rotateXValue = -.19; let rotateYValue = .47; let modelDistance = 4.35; let modelOffsetX = 0; let modelOffsetY = 0;
    let canvasWidth = 0; let canvasHeight = 0;

    const render = () => {
      const rect = logoModel.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * Math.min(window.devicePixelRatio || 1, 2)));
      const height = Math.max(1, Math.round(rect.height * Math.min(window.devicePixelRatio || 1, 2)));
      if (width !== canvasWidth || height !== canvasHeight) { logoModel.width = width; logoModel.height = height; canvasWidth = width; canvasHeight = height; }
      gl.viewport(0, 0, canvasWidth, canvasHeight);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const rotation = multiply(rotationY(rotateYValue), rotationX(rotateXValue));
      const mvp = multiply(projection(canvasWidth / canvasHeight), multiply(translation(modelOffsetX, modelOffsetY, -modelDistance), rotation));
      gl.useProgram(program); gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); gl.enableVertexAttribArray(positionAttribute); gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer); gl.enableVertexAttribArray(normalAttribute); gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.uniformMatrix4fv(mvpUniform, false, mvp); gl.uniformMatrix4fv(rotationUniform, false, rotation);
      gl.drawElements(gl.TRIANGLES, triangles.length, indexType, 0);
      if (contactTextureReady && contactProgramReady) {
        gl.useProgram(contactProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, contactPositionBuffer); gl.enableVertexAttribArray(contactPositionAttribute); gl.vertexAttribPointer(contactPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, contactUvBuffer); gl.enableVertexAttribArray(contactUvAttribute); gl.vertexAttribPointer(contactUvAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(contactMvpUniform, false, mvp);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, contactTexture); gl.uniform1i(contactTextureUniform, 0);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.depthMask(true); gl.disable(gl.BLEND);
      }
    };

    if (contactProgramReady) {
      const contactImage = new Image();
      contactImage.onload = () => {
        contactTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, contactTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, contactImage);
        contactTextureReady = true;
        render();
      };
      contactImage.src = './assets/media/contact-info.png';
    }

    let dragging = false; let pointerMoved = false; let startX = 0; let startY = 0; let startRotateX = rotateXValue; let startRotateY = rotateYValue;
    let focused = false; let savedRotateX = rotateXValue; let savedRotateY = rotateYValue; let focusAnimation;
    const focusRotationX = .52; const focusRotationY = .72; const focusOffsetX = .19; const focusOffsetY = .19;
    const getSafeFocusDistance = () => {
      const rect = logoModel.getBoundingClientRect();
      const aspect = rect.width && rect.height ? rect.width / rect.height : 1.36;
      const tangent = Math.tan((38 * Math.PI) / 360);
      const margin = .94;
      const cosX = Math.cos(focusRotationX); const sinX = Math.sin(focusRotationX);
      const cosY = Math.cos(focusRotationY); const sinY = Math.sin(focusRotationY);
      let requiredDistance = 0;
      for (const x of [normalizedBounds.min[0], normalizedBounds.max[0]]) {
        for (const y of [normalizedBounds.min[1], normalizedBounds.max[1]]) {
          for (const z of [normalizedBounds.min[2], normalizedBounds.max[2]]) {
            const rotatedY = cosX * y - sinX * z;
            const rotatedZ = sinX * y + cosX * z;
            const rotatedX = cosY * x + sinY * rotatedZ;
            const depth = -sinY * x + cosY * rotatedZ;
            requiredDistance = Math.max(requiredDistance, depth + Math.abs(rotatedX + focusOffsetX) / (margin * tangent * aspect), depth + Math.abs(rotatedY + focusOffsetY) / (margin * tangent));
          }
        }
      }
      return requiredDistance;
    };
    const animateTo = (targetX, targetY, targetDistance, targetOffsetX, targetOffsetY) => {
      focusAnimation = { startedAt: performance.now(), duration: 820, fromX: rotateXValue, fromY: rotateYValue, fromDistance: modelDistance, fromOffsetX: modelOffsetX, fromOffsetY: modelOffsetY, targetX, targetY, targetDistance, targetOffsetX, targetOffsetY };
    };
    const closestEquivalentAngle = (current, target) => current + Math.atan2(Math.sin(target - current), Math.cos(target - current));
    const toggleFocus = () => {
      if (focused) {
        focused = false;
        logoPage?.classList.remove('is-model-focused');
        animateTo(savedRotateX, savedRotateY, 4.35, 0, 0);
      } else {
        savedRotateX = rotateXValue;
        savedRotateY = rotateYValue;
        focused = true;
        logoPage?.classList.add('is-model-focused');
        animateTo(closestEquivalentAngle(rotateXValue, focusRotationX), closestEquivalentAngle(rotateYValue, focusRotationY), getSafeFocusDistance(), focusOffsetX, focusOffsetY);
      }
    };
    logoModel.addEventListener('pointerdown', (event) => {
      dragging = true; pointerMoved = false; startX = event.clientX; startY = event.clientY; startRotateX = rotateXValue; startRotateY = rotateYValue; logoModel.setPointerCapture(event.pointerId);
    });
    logoModel.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const deltaX = event.clientX - startX; const deltaY = event.clientY - startY;
      if (Math.hypot(deltaX, deltaY) > 6) pointerMoved = true;
      if (focused || !pointerMoved) return;
      focusAnimation = undefined;
      rotateYValue = startRotateY + deltaX * .008; rotateXValue = startRotateX + deltaY * .006; render();
    });
    const stopDragging = (event) => {
      const shouldToggleFocus = dragging && !pointerMoved;
      dragging = false;
      if (logoModel.hasPointerCapture(event.pointerId)) logoModel.releasePointerCapture(event.pointerId);
      if (shouldToggleFocus) toggleFocus();
    };
    logoModel.addEventListener('pointerup', stopDragging);
    logoModel.addEventListener('pointercancel', (event) => { dragging = false; if (logoModel.hasPointerCapture(event.pointerId)) logoModel.releasePointerCapture(event.pointerId); });
    redrawLogoModel = render;
    new ResizeObserver(render).observe(logoModel);
    let previousFrameTime = performance.now();
    const idleRotation = (frameTime) => {
      const delta = Math.min((frameTime - previousFrameTime) / 1000, .08);
      previousFrameTime = frameTime;
      if (focusAnimation) {
        const progress = Math.min((frameTime - focusAnimation.startedAt) / focusAnimation.duration, 1);
        const eased = progress * progress * (3 - 2 * progress);
        rotateXValue = focusAnimation.fromX + (focusAnimation.targetX - focusAnimation.fromX) * eased;
        rotateYValue = focusAnimation.fromY + (focusAnimation.targetY - focusAnimation.fromY) * eased;
        modelDistance = focusAnimation.fromDistance + (focusAnimation.targetDistance - focusAnimation.fromDistance) * eased;
        modelOffsetX = focusAnimation.fromOffsetX + (focusAnimation.targetOffsetX - focusAnimation.fromOffsetX) * eased;
        modelOffsetY = focusAnimation.fromOffsetY + (focusAnimation.targetOffsetY - focusAnimation.fromOffsetY) * eased;
        if (progress === 1) focusAnimation = undefined;
        if (document.body.classList.contains('logo-active')) render();
      } else if (document.body.classList.contains('logo-active') && !dragging && !focused) {
        rotateYValue += delta * .075;
        render();
      }
      window.requestAnimationFrame(idleRotation);
    };
    window.requestAnimationFrame(idleRotation);
    render();
  } catch (error) {
    logoModel.setAttribute('aria-label', 'Logo 模型暂时无法加载');
  }
}

enableLogoModelRotation();

if (!prefersReducedMotion.matches) {
  window.addEventListener('pointermove', (event) => {
    if (document.body.classList.contains('logo-active') && logoProximityChars.length) {
      if (logoProximityFrame) cancelAnimationFrame(logoProximityFrame);
      logoProximityFrame = requestAnimationFrame(() => updateLogoVariableProximity(event.clientX, event.clientY));
    }
    if (!proximityEnabled) return;
    wordWall.classList.add('is-proximity-active');
    window.clearTimeout(proximityIdleTimer);
    proximityIdleTimer = window.setTimeout(() => wordWall.classList.remove('is-proximity-active'), 160);
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => updateVariableProximity(event.clientX, event.clientY));
  });
}

function revealWordWall() {
  wordWall.classList.add('is-prepared');

  if (prefersReducedMotion.matches) {
    wordWall.classList.add('is-revealed');
    return;
  }

  window.setTimeout(() => {
    wordWall.classList.add('is-revealing');
    const finalRevealDelay = (proximityChars.length - 1) * 12 + 700;

    window.setTimeout(() => {
      wordWall.classList.remove('is-revealing');
      wordWall.classList.add('is-revealed');
      proximityEnabled = true;
      if (homeActive) {
        if (ambientWordTimer) window.clearTimeout(ambientWordTimer);
        ambientWordTimer = undefined;
        refreshAmbientWordWeights();
        startAmbientWordMotion();
      }
    }, finalRevealDelay);
  }, 300);
}

revealWordWall();

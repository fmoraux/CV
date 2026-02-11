// # ==========================================================================
// # =====    File           : main.css                                   =====
// # =====    Author         : Flavie MORAUX (moraux.flavie@gmail.com)    =====
// # =====    Created        : 01/05/2025                                 =====
// # =====    Description    : CV web interactif                     	  =====
// # =====    Version        : 1.0.0                                      =====
// # =====    Licencs        : Tous droits réservés                       =====
// # ========================================================================== 

/**
 * Helpers de création d'élement
 * @param {String} tag 
 * @param {String} className 
 * @param {String} text 
 * @returns Element
 */
function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  if (text) el.textContent = text;
  return el;
}

/**
 * Helpers de création de ProgressBar
 * @param {Number} level 
 * @param {Number} maxBars 
 * @returns ProgressBar
 */
function createProgressBar(level, maxBars = 5) {
  const bar = document.createElement('div');
  bar.classList.add('progress-bar');
  const filled = Math.round(Math.min(level, 100) / (100 / maxBars));
  for (let i = 0; i < maxBars; i++) {
    const span = document.createElement('span');
    if (i < filled) span.classList.add('filled');
    bar.appendChild(span);
  }
  return bar;
}

/**
 * Helpers de création de liste
 * @param {String} containerId 
 * @param {JSON} data 
 * @param {*} renderItem 
 * @returns 
 */
function renderListSection(containerId, data, renderItem) {
  const container = document.getElementById(containerId);
  if (!Array.isArray(data)) return console.error(`${containerId} doit être un tableau`);
  container.innerHTML = '';
  data.forEach((item, index) => {
    if (typeof item !== 'object') return console.warn(`Entrée invalide à l'index ${index}`);
    const el = renderItem(item);
    container.appendChild(el);
  });
}

/**
 * Affichage des informations
 * @param {JSON} data 
 */
function renderInformations(data) {
  if (!data || typeof data !== 'object') return console.error("Données infos invalides");

  const mapping = [
    { id: "informations-picture", value: data.picture, type: "image" },
    { id: "informations-name-title", value: data.name, type: "text" },
    { id: "informations-name", value: data.name, type: "text" },
    { id: "informations-title", value: data.title, type: "text" },
    { id: "informations-presentation", value: data.presentation, type: "text" },
    { id: "informations-telephone", value: data.telephone, type: "text" },
    { id: "informations-email", value: data.email, type: "email" },
    { id: "informations-city", value: data.city, type: "text"},
    { id: "informations-birth", value: data.birth, type: "text"},
    { id: "informations-nationality", value: data.nationality, type: "text"},
    { id: "informations-languages", value: data.languages, type: "text"},
    { id: "informations-github", value: data.github, type: "href"}
  ];

  mapping.forEach(({ id, value, type }) => {
    const el = document.getElementById(id);
    if (!el) return console.warn(`Élément manquant : ${id}`);  

    if(value == null || value === '') {
      console.warn(`Configuration manquante : ${id}`);  
      if (type !== "image") el.parentNode.remove();
      return;
    }
    
    switch (type) {
      case "email":
      case "href":
        el.innerText = value || '';
        if (value) {
          const prefix = type === "email" ? "mailto:" : "https://";
          el.setAttribute("href", prefix + value);
        } else {
          el.removeAttribute("href");
        }
        break;
    
      case "image":
        el.src = value;
        break;
    
      default:
        el.innerText = value || '';
        break;
    }
  });
}

/**
 * Affichage des formations
 * @param {JSON} data 
 */
function renderFormations(data) {
  renderListSection('formations-container', data, ({ year = '', university = '', degree = '' }) => {
    const section = createElement('div', 'formation-item');
    section.appendChild(createElement('h3', null, `${year} - ${university}`));
    section.appendChild(createElement('p', null, degree));
    return section;
  });
}

/**
 * Affichage des experiences
 * @param {JSON} data 
 */
function renderExperience(data) {
  renderListSection('experience-container', data, ({ title = '', company = '', period = '', responsibilities = [] }) => {
    const section = createElement('div', 'experience-item');

    const sectionTitle = createElement('div', 'experience-title');
    sectionTitle.appendChild(createElement('div', "experience-name", `${title} | ${company}`));
    sectionTitle.appendChild(createElement('div', null, period));
    section.appendChild(sectionTitle);

    const ul = document.createElement('ul');
    (responsibilities.length ? responsibilities : ["Aucune responsabilité renseignée."])
      .forEach(text => ul.appendChild(createElement('li', null, text)));

    section.appendChild(ul);
    return section;
  });
}

/**
 * Affichage des compétences
 * @param {JSON} data 
 */
function renderSkills(data) {
  renderListSection('skills-container', data, ({ name = '', level = 0, details =  [] }) => {
    const skill = createElement('div', 'skill');
    skill.appendChild(createElement('div', 'skill-name', name));

    // Affiche le détails s'il y en a un sinon le level général
    const skillDetails = createElement('div', 'skill-details');
    if(details && Array.isArray(details) && details.length > 0){    
      details.forEach(detail => {
        const skillDetail = createElement('div', 'skill-detail');
        skillDetail.appendChild(createProgressBar( detail.level));
        skillDetail.appendChild(createElement('div', null, detail.name));
        skillDetails.appendChild(skillDetail);
      });
      
    } else if (level !== 0){
      skillDetails.appendChild(createProgressBar(level));
    }
    skill.appendChild(skillDetails);

    return skill;
  });
}

// Fonction principale
function main() {
  fetch('config/config.json')
    .then(res => res.json())
    .then(data => {
      renderInformations(data.informations);
      renderFormations(data.formations);
      renderExperience(data.experiences);
      renderSkills(data.competences);
    });
}

main();

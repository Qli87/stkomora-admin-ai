/**
 * Route paths – single source of truth for navigation.
 */
export const routes = {
  login: '/login',
  home: '/pocetna',
  membersList: '/spisakClanova',
  licensesList: '/licence',
  companiesList: '/ordinacije',
  employeesList: '/zaposleni',
  consultantsList: '/saradnici',
  certificatesList: '/sertifikati',
  // addMember: '/dodajClana',
  // editMember: '/izmjeniClana',
  news: '/vijesti',
  // newsForCategory: '/vijestiKategorije',
  // editNovelty: '/izmijeniVijest',
  // addNovelty: '/dodajVijest',
  // parliamentPG: '/clanoviSkupstinePg',
  // parliamentNk: '/clanoviSkupstineNk',
  // parliamentCt: '/clanoviSkupstineCt',
  // parliamentSouth: '/clanoviSkupstineJug',
  // parliamentNorth: '/clanoviSkupstineSjever',
  advertisments: '/oglasi',
  // advertismentAdd: '/dodajOglas',
  // advertismentEdit: '/izmjeniOglas',
  // about: '/onama',
  financesList: '/finansije',
  congress: '/kongres',
  // bodiesOfChember: '/organi_komore',
  // freeInfo: '/pristup_informacijama',
  // addForm: '/dodaj_o_komori',
};

export const getEditMemberPath = (id) => `${routes.editMember}/${id}`;

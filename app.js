const userContainer =document.querySelector('#user-info');
console.log(userContainer);

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const getNewUser = () => {
    const newUserButton = document.querySelector('#newUser');
    newUserButton.addEventListener('click',() => {
        window.localStorage.removeItem('userId');
        startApp();
    })
}

const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId'); 
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);
  return  user;
};

const loadUser = (user) => {
    console.log(user);
    const card = document.querySelector("#user-info");

    const html = `<h2>${user.fullName}</h2>
                    <img class = 'avatar' src = ${user.avatar}>
                    <p>${user.bio}</p>`;

    card.innerHTML = html;
}
const postNotes = async (id, note) => {
    const res = axios.post(`${API}/users/${id}/notes`);
}

const getNotes = async (id) => {
    const notes = (await axios.get(`${API}/users/${id}/notes`)).data;
    const noteCard = document.querySelector('#notes');
    noteCard.innerHTML = ``;
    
    if(notes) {
        console.log(notes);
        let html = `<h2> Notes (${notes.length}) </h2>`;
        html = html + notes.map( note => {
            return `<div class = 'note'> 
                    <p>${note.text}</p>
                    <button>X</button>
                    </div>`
        }).join('');
        noteCard.innerHTML = html;

    }
    
}

const startApp = async() => {
    const user = await fetchUser();
    loadUser(user);
    getNotes(user.id);
}

startApp();
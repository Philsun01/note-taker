const userContainer =document.querySelector('#user-info');
const noteForm = document.querySelector('form');

const API = 'https://acme-users-api-rev.herokuapp.com/api';


noteForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const text = document.querySelector("input")
    console.log(text.value)

    const note = {
        text: text.value
    }
    
   postNotes(window.localStorage.userId,note);
})

const getNewUser = () => {
    const newUserButton = document.querySelector('#newUser');
    newUserButton.addEventListener('click',() => {
        window.localStorage.removeItem('userId');
        console.log(window.localStorage);
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
    const res = await axios.post(`${API}/users/${id}/notes`, note);
    const created = res.data;
    console.log(created);
}

const getNotes = async (id) => {
    const notes = (await axios.get(`${API}/users/${id}/notes`)).data;
    const noteCard = document.querySelector('#notes');
    noteCard.innerHTML = ``;
    
    if(notes) {
        console.log(notes);
        
        let html = notes.map( note => {
            return `<li> 
                    <p>${note.text}</p>
                    <button>Delete Note</button>
                    </li>`
        }).join('');
        html = `<h2> Notes (${notes.length}) </h2>` + `<ul>${html}</ul>`;

        noteCard.innerHTML = html;

    }
    
}

const startApp = async() => {
    const user = await fetchUser();
    loadUser(user);
    getNotes(user.id);
    getNewUser();
}

startApp();
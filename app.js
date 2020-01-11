const userContainer =document.querySelector('#user-info');
console.log(userContainer);

const API = 'https://acme-users-api-rev.herokuapp.com/api';

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
    const card = document.querySelector("#user-info");
    console.log(card);
    console.log(user.fullName);
    console.log(user.bio);

    const html = `<h2>${user.fullName}</h2>
                    <img class = 'avatar' src = "chewbacca.jpeg">
                    <p>${user.bio}</p>`;

    card.innerHTML = html;
}

const startApp = async() => {
    const user = await fetchUser();
    
    loadUser(user);
}

startApp();
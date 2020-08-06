// importScripts('login-singin.js')
// database() {
const firebaseConfig = {
  apiKey: "AIzaSyDNnzrEKojHgRjR-44IVm_3EN4aAyFy8k8",
  authDomain: "instagramdb-26939.firebaseapp.com",
  databaseURL: "https://instagramdb-26939.firebaseio.com",
  projectId: "instagramdb-26939",
  storageBucket: "instagramdb-26939.appspot.com",
  messagingSenderId: "370402613400",
  appId: "1:370402613400:web:f91f79319e4e5ca5e4d8ed",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const fireDB = firebase.firestore(firebaseApp);
// fireDB
//   .collection("cities")
//   .doc("LA")
//   .get()
//   .then((doc) => {
//     // res.forEach((doc) => {
//       console.log(doc.data());
//     // });
//   })
//   .catch((e) => {
//     console.log(e);
//   });
// Add a new document in collection "cities"
// fireDB.collection("cities").doc("LA").set({
//     name: "Los Angeles",
//     state: "CA",
//     country: "USA"
// })
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });
fireDB
  .collection("users")
  .doc("UPa4FragFhaIWkjfR8l0RKynanh1")
  .get()
  .then(function (doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch(function (error) {
    console.log("Error getting document:", error);
  });
const Database = {
  createNewUser: (user, name) => {
    console.log(user.additionalUserInfo.isNewUser);
    if (user.additionalUserInfo.isNewUser) {
      fireDB
        .collection("users")
        .doc(user.user.uid)
        .set({
          name: name,
        })
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  },
  actualData: {},
  getCurrentUserData: (id) => {
    console.log(id);
    fireDB
      .collection("users")
      .doc(id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          Database.actualData = doc.data();
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  },
  auth: {
    signInWithEmail: (name, email, pass) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((result) => {
          console.log(result);
          setTimeout(() => {
            Database.createNewUser(result, name);
          }, 1000);
          firebase.auth().signOut();
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          optopus.alert("danger", errorMessage);
        });
    },
    signInWithGoogle: () => {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      provider.addScope(
        "https://www.googleapis.com/auth/cloud-platform.read-only"
      );

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var userName = result.user.displayName;
          //   console.log(result.user.uid);
          setTimeout(() => {
            Database.createNewUser(result, userName);
          }, 2000);
          Database.getCurrentUserData(result.user.uid);
          //   console.log(user);
          //   console.log(result.additionalUserInfo.isNewUser);
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    },
    logIn: (email, password) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          console.log(res);
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(errorMessage);
          optopus.alert("danger", errorMessage);
        });
    },
    signOut: () => {
      firebase.auth().signOut();
    },
    signInStatus: () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          //   view.injectHTML.home();
        //   console.log();
        Database.getCurrentUserData(user.uid);
        view.injectHTML.home();
        setTimeout(() =>{

            view.injectHTML.updatePost();
        }, 1000)

          //   optopus.currentUser = false;
        } else {
          // console.log(user);
          view.injectHTML.logIn();
          //   optopus.currentUser = true;
        }
      });
    },
  },
};

const optopus = {
  currentUser: "true",
  alert: (type, msg) => {
    view.viewAlert(type, msg);
  },
  signIn: {
    email: (name, email, pass) => {
      Database.auth.signInWithEmail(name, email, pass);
    },
    google: (e) => {
      e.preventDefault();
      Database.auth.signInWithGoogle();
      //   Database.auth.getCurrentUser();
    },
  },
  logIn: (email, pass) => {
    Database.auth.logIn(email, pass);
  },
  signOut: () => {
    Database.auth.signOut();
  },
  signInStatus: () => {
    Database.auth.signInStatus();
  },
};

const view = {
  viewCurrentUser: optopus.currentUser,
  addTagToDomWithAtributes: (element, attributes) => {
    return Object.keys(attributes).reduce((addedAttr, key) => {
      addedAttr.setAttribute(key, attributes[key]);
      return addedAttr;
    }, element);
  },
  viewAlert: (type, massage, time = 3000) => {
    const alert = document.getElementById("alert");
    const activeAlert = view.addTagToDomWithAtributes(
      document.createElement("div"),
      {
        class: `alert alert-${type} text-center`,
        role: "alert",
      }
    );
    activeAlert.innerHTML = massage;
    alert.appendChild(activeAlert);
    setTimeout(() => {
      activeAlert.remove();
    }, time);
  },
  viewSignIn: {
    google: (event) => {
      optopus.signIn.google(event);
    },
    email: (e) => {
      e.preventDefault();
      const name = document.getElementById("inputNameRegister").value;
      const email = document.getElementById("inputEmailRegister").value;
      const pass = document.getElementById("inputPassRegister").value;
      const expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (expr.test(email)) {
        if (!email.trim() || !name.trim() || !pass.trim()) {
          console.log(name, email, pass);
          view.viewAlert("danger", "Los campos son requeridos");
        } else {
          console.log(name, email, pass);
          optopus.signIn.email(name, email, pass);
        }
      } else {
        view.viewAlert("danger", "Email vacio o no valido");
      }
    },
  },
  viewLogIn: (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogIn").value;
    const pass = document.getElementById("passwordLogIn").value;
    console.log(email, pass);
    optopus.logIn(email, pass);
  },
  viewSignOut: () => {
    optopus.signOut();
  },
  observer: () => {
    optopus.signInStatus();
  },
  injectHTML: {
    signInWithEmail: () => {
      // console.log("form ");
      const body = document.getElementById("body");
      body.innerHTML = ` 
        <div class="container border mt-3" style="width: 400px; height: auto;">
        <div id="img" class="text-center">
          <img
            src="/imgenes/ig.png"
            class="rounded"
            style="width: 8rem;"
            alt="..."
          />
        </div>
        <form id="login" class="col-11 ml-3">
          <div class="form-group">
            <label for="inputEmailRegister">Nombre</label>
            <input
              value=""
              type="name"
              class="form-control"
              id="inputNameRegister"
              aria-describedby="emailHelp"
              placeholder="introduce tu nombre"
            />
          </div>
          <div class="form-group">
            <label for="inputEmailRegister">Email</label>
            <input
              value=""
              type="email"
              class="form-control"
              id="inputEmailRegister"
              aria-describedby="emailHelp"
              placeholder="introduce un correo"
            />
          </div>
          <div class="form-group">
            <label for="inputPassRegister">Contraseña</label>
            <input
              value=""
              type="password"
              class="form-control"
              id="inputPassRegister"
              placeholder="Crea una contraseña"
            />
          </div>
          <div class="d-flex justify-content-center">
            <button
              onclick="view.viewSignIn.email(event)"
              class="btn btn-outline-primary"
            >
              Registrarse
            </button>
          </div>
          <p class="text-center">or</p>
          <div class="d-flex justify-content-center" onclick="view.injectHTML.logIn()">
            <a
              href="#"
              class="stretched-link text-blue"
              style="position: relative;"
            >
              Tienes Una cuenta?
            </a>
          </div>
          <br />
        </form>
      </div>
       `;
    },
    logIn: () => {
      // console.log("form log");
      const body = document.getElementById("body");
      body.innerHTML = `
          <div class="container border mt-3" style="width: 400px; height: auto;">
          <div id="img" class="text-center">
            <img
              src="/imgenes/ig.png"
              class="rounded"
              style="width: 8rem;"
              alt="..."
            />
          </div>
          <form id="login" class="col-11 ml-3">
            <div class="form-group">
              <label for="emailLogIn">Usuario</label>
              <input
                type="email"
                class="form-control"
                id="emailLogIn"
                aria-describedby="emailHelp"
                placeholder="introduce tu correo"
              />
              <small id="emailHelp" class="form-text text-muted"
                >We'll never share your email with anyone else.</small
              >
            </div>
            <div class="form-group">
              <label for="passwordLogIn">Contraseña</label>
              <input
                type="password"
                class="form-control"
                id="passwordLogIn"
                placeholder="introduce tu cotrasena"
              />
            </div>
            <div class="d-flex justify-content-center">
              <button class="btn btn-primary" onclick="view.viewLogIn(event)">
                Iniciar session
              </button>
            </div>
            <br />
            <p class="text-center">or</p>
            <div class="d-flex justify-content-center">
              <button onclick="view.viewSignIn.google(event)" class="btn btn-outline-ligth">
                <!-- <div id="img" class="text-center"> -->
                <img
                  src="/imgenes/google.jpg"
                  class="rounded"
                  style="width: 2rem;"
                  alt="..."
                  id="Goggle"
                />
              </button>
              <button class="btn btn-ligth" onclick="view.injectHTML.signInWithEmail()">
                <img
                  src="/imgenes/email.png"
                  class="rounded"
                  style="width: 2rem;"
                  alt="..."
                  id="email"
                />
              </button>
            </div>
            <br />
          </form>
        </div>
        `;
    },
    home: () => {
      const body = document.getElementById("body");
      body.innerHTML = `
      <div class="container-fluid">
        <!-- Just an image -->
        <nav class="navbar navbar-light bg-light">
        <div class = 'd-flex justify-content-center'>
        <a class="navbar-brand " href="#">
            <img
            src="/imgenes/ig.png"
            width="35"
            height="35"
            class='mx-auto'
            alt=""
            loading="lazy"
            />
        </a>
        </div>
        <div class="row">
          <div class="btn-group dropleft mr-3">
            <button type="button" class="btn btn-outline-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Nuevo post
            </button>
            <div class=" dropdown-menu text-center" style="width: 20rem;">
    
                <div class="border mt-2 mb-2 ml-2"">
                  <h3 class="h3">Escoja una imagen</h3><hr>
                  <input type="file" class="form-control-file ml-2 mb-3" id="exampleFormControlFile1">
                </div>
                <button class=" btn btn-outline-primary ">post</button>
              
            </div>
          </div><hr>

          <div class="btn-group  ">
            <button class="btn  dropdown" type="image" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div class="text-center ">
                <img src="C:\Users\Jonas_CM\Desktop\courses\ITLA\JS\instagram\imgenes\email.png"
                 class="rounded" alt="..." style="width: 30px;" focusable='false'>
              </div>
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">Perfil</a>
              <a class="dropdown-item" href="#">Salir</a>
            </div>
          </div>
        </div>
        </nav>
        <div class="row col-sm-12 ">
        <!-- -->
        <div
          id='post'
          class="container col-sm-5   border  mt-2 mb-3 mr-0"
          >post

        </div>
        <div
          id="online"
          class="container  col-sm-3   border ml-5 mt-2 mb-3"
          >online
        </div>
        </div>
    </div>
      `;
    },
    updatePost: () => {
      const post = document.getElementById("post");
    //   if (Database.actualData.name) {
        const name = Database.actualData.name
        post.innerHTML = `
            <div class="card bg-light mb-3 mt-3" >
            <div class="card-header">${name}</div>
            <div class="card-body">
            <!-- <h5 class="card-title">Light card title</h5> -->
            <div class="text-center">
                
                <img src="/imgenes/ig.png" class="img-fluid" alt="Responsive image">
            </div>

              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
          </div>
          <div class="container">
    <div class="row" style="padding-top: 240px;">
        <a href="#" class="btn btn-large btn-primary" rel="popover"
        data-html='true
            data-content="<form><input type="text"/></form>"
            data-placement="top" data-original-title="Fill in form">Open form</a>
    </div>
</div>
            `;
    //   }
    },
  },
};

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
const fireStorage = firebase.storage();
const storageRef = firebaseApp.auth();

const Database = {
  createNewUser: async function (result, name) {
    if (result.additionalUserInfo.isNewUser) {
      fireDB
        .collection("users")
        .doc(result.user.uid)
        .set({
          name: name,
          // url:''
        })
        .then(async function (result) {
          // view.deleteProfileImg()
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else {
      console.log("old user");
    }
  },
  actualData: {
    posts: [],
  },
  getCurrentUserData: async function (id, url) {
    const dataRef = fireDB.collection("users").doc(id).get();
    // console.log(dataRef)
    await dataRef
      .then((doc) => {
        // console.log(doc);
        if (doc.exists) {
          Database.actualData = {
            ...Database.actualData,
            ...doc.data(),
            id,
            // url: url,
          };
          optopus.HTML.home();
          const ListPost = Database.getPosts(false);
          ListPost.then((posts) => {
            optopus.HTML.posts(posts);
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return;
  },
  auth: {
    signInWithEmail: (name, email, pass) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((result) => {
          // console.log(result);
          Database.createNewUser(result, name);
          // view.deleteProfileImg()

          // Database.auth.signInStatus()
          firebase.auth().signOut();
          setTimeout(() => {
            Database.actualData = {
              posts: []}
          }, 500);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          optopus.alert("danger", errorMessage);
        });
    },
    signInWithGoogle: async function () {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      provider.addScope(
        "https://www.googleapis.com/auth/cloud-platform.read-only"
      );
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var userName = result.user.displayName;
          Database.createNewUser(result, userName);
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
      Database.actualData = { posts: [] };
    },
    signInStatus: () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // console.log(user)
          // Database.createNewUser(user.uid, user.displayName)
          setTimeout(() => {
            Database.getCurrentUserData(user.uid, user.photoURL);
            // optopus.HTML.home();
            // optopus.HTML.posts();
          }, 1000);
          setTimeout(() => {}, 1000);
        } else {
          optopus.HTML.logIn();
        }
      });
    },
  },
  newPostImg: (file, descript) => {
    const ID = function () {
      return "_" + Math.random().toString(36).substr(2, 9);
    };
    // console.log(descript);
    const id = ID();
    // console.log(date);
    const ref = fireStorage.ref();
    const metadata = {
      customMetadata: {
        owner: Database.actualData.name,
        ownerId: Database.actualData.id,
        id: id,
        feedMsg: descript,
      },
    };
    ref
      .child(
        `image/${Database.actualData.id}/` +
          id +
          new Date().getDate() +
          (new Date().getMonth() + 1) +
          new Date().getFullYear()
      )
      .put(file, metadata)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        view.injectHTML.profile();
      });
  },
  getPosts: async function () {
    if (Database.actualData.id) {
      // console.log(Database.actualData.id);
      Database.actualData.posts = [];
      const storageRef = fireStorage.ref();
      const folder = storageRef.child("image");
      const post = [];
      await folder
        .listAll()
        .then((res) => {
          res.prefixes.forEach(async function (folderRef) {
            const img = fireStorage.ref();
            var folderRef = img.child(folderRef.fullPath);
            folderRef.listAll().then(async function (res) {
              res.items.forEach(async function (itemRef) {
                const forestRef = storageRef.child(itemRef.fullPath);
                let urlInfo = [];
                await forestRef
                  .getMetadata()
                  .then((metadata) => {
                    // console.log(metadata.customMetadata);
                    urlInfo.push(metadata.customMetadata);
                  })
                  .catch(function (error) {
                    // Uh-oh, an error occurred!
                    console.log(error);
                  });
                await itemRef.getDownloadURL().then((url) => {
                  urlInfo.push(url);
                  post.unshift({
                    metadata: urlInfo[0],
                    url: urlInfo[1],
                    comments: [],
                  });
                  urlInfo = [];
                });
              });
            });
          });
        })
        .catch(function (error) {
          console.log(error);
          // Uh-oh, an error occurred!
        });
      return post;
    } else {
      console.log("null");
      setTimeout(() => {
        Database.getPosts(path);
      }, 1000);
    }
  },
  getProfilePost: (path) => {
    const storageRef = fireStorage.ref();
    // Create a reference under which you want to list
    var listRef = storageRef.child("image/" + path);
    var post = [];
    // Find all the prefixes and items.
    listRef
      .listAll()
      .then(function (res) {
        res.items.forEach((itemRef) => {
          const forestRef = storageRef.child(itemRef.fullPath);
          let urlInfo = [];
          forestRef
            .getMetadata()
            .then((metadata) => {
              // console.log(metadata.customMetadata);
              urlInfo.push(metadata.customMetadata);
            })
            .catch(function (error) {
              // Uh-oh, an error occurred!
              console.log(error);
            });
          itemRef.getDownloadURL().then((url) => {
            urlInfo.push(url);
            Database.actualData.posts.unshift({
              metadata: urlInfo[0],
              url: urlInfo[1],
              comments: [],
            });
            post.unshift({
              metadata: urlInfo[0],
              url: urlInfo[1],
              comments: [],
            });
            urlInfo = [];
          });
        });
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });
    return post;
    // console.log(post)
  },
  newComment: (id, ownerId, comment, name) => {
    const userRef = fireDB.collection("users").doc(ownerId);
    const comments = [];
    userRef
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().comments) {
          comments.push(...doc.data().comments);
          console.log("Document data:", comments);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!", doc.data());
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    setTimeout(() => {
      // console.log(comments);
      // Set the "capital" field of the city 'DC'
      return userRef
        .update({
          comments: [...comments, { id: id, name: name, comment: comment }],
        })
        .then(function () {
          console.log("Document successfully updated!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }, 1000);
  },
  loadComments: async function () {
    // console.log(id);
    fireDB
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    const userRef = fireDB.collection("users");
    let comments = [];
    await userRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          if (doc.exists && doc.data().comments) {
            comments.push(...doc.data().comments);
            // return comments// console.log("Document data:", comments);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such comment!", doc.data());
          }
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    return comments;
  },
  changePassword: (newPassword) => {
    var user = firebase.auth().currentUser;
    // var newPassword = getASecureRandomPassword();

    user
      .updatePassword(newPassword)
      .then(function () {
        console.log("changed");
        // Update successful.
      })
      .catch(function (error) {
        // An error happened.
      });
  },
};

const optopus = {
  currentUser: () => {
    return Database.actualData;
  },
  alert: (type, msg) => {
    view.viewAlert(type, msg);
  },
  signIn: {
    email: (name, email, pass) => {
      Database.auth.signInWithEmail(name, email, pass);
    },
    google: () => {
      let a = Database.auth.signInWithGoogle();
      console.log(a);
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
  getPosts: (path) => {
    console.log(path);
    // console.log(Database.getPosts(path));
    return Database.getPosts(path);
  },
  HTML: {
    posts: (data) => {
      view.updatePost(data);
    },
    logIn: () => {
      view.injectHTML.logIn();
    },
    home: () => {
      view.injectHTML.home();
    },
  },
  newPost: (file, descipt) => {
    Database.newPostImg(file, descipt);
  },
  newComment: (id, ownerId, comment, name) => {
    Database.newComment(id, ownerId, comment, name);
  },
  loadComments: () => {
    Database.loadComments();
  },
  changePassword: (value) => {
    Database.changePassword(value);
  },
};

const view = {
  viewCurrentDataUser: optopus.currentUser,
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
    google: (e) => {
      e.preventDefault();
      optopus.signIn.google();
    },
    email: (e) => {
      e.preventDefault();
      const name = document.getElementById("inputNameRegister").value;
      const email = document.getElementById("inputEmailRegister").value;
      const pass = document.getElementById("inputPassRegister").value;
      const expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (expr.test(email)) {
        if (!email.trim() || !name.trim() || !pass.trim()) {
          // console.log(name, email, pass);
          view.viewAlert("danger", "Los campos son requeridos");
        } else {
          // console.log(name, email, pass);
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
    // console.log(email, pass);
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
                autocomplete="off" 
                spellcheck="false"
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
      const data = view.viewCurrentDataUser();
      // console.log(data)
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
        
       
          <div class="btn-group  ">
            <button class="btn btn-light  dropdown mr-3 my-1" type="image" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <div class="text-center ">
                <img src="${data.url ? data.url : '/imgenes/dperfil.jpg'}"
                 class="rounded" alt="..." style="width: 25px;" focusable='false'>
              </div>
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <button class="dropdown-item" onclick =" view.injectHTML.profile()"  >Perfil</button>
              <button class="dropdown-item" onclick='view.viewSignOut()'>Salir</button>
            </div>
          </div>
        </div>
        </nav>
        <div class="row col-sm-12 ">
        <!-- -->
        <div
          id='post'
          class="container col-sm-5   border  mt-2 mb-3 mr-11"
          >post

        </div>
        
        </div>
      `;
    },
    profile: async function () {
      const data = view.viewCurrentDataUser();
      const storageRef = fireStorage.ref();
      // Create a reference under which you want to list
      var listRef = storageRef.child("image/" + data.id);
      var post = [];
      // Find all the prefixes and items.

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
      <div class="btn-group  mr-3">
 
        <div class="btn-group  ">
          <button class="btn btn-light  dropdown mr-3 my-1" type="image" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div class="text-center ">
              <img src="${data.url ? data.url : '/imgenes/dperfil.jpg'} "
              id="profileImgB"
               class="rounded" alt="..." style="width: 25px;" focusable='false'>
            </div>
          </button>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <button class="dropdown-item" onclick =" view.observer()"  >Home</button>
            <button class="dropdown-item" onclick='view.viewSignOut()'>Salir</button>
          </div>
        </div>
      </div>
      </nav>
      <div class="row col-sm-12 ">
        <div class="container col-sm-10">
          <div class="row">
            <div class="col-sm-4">
              <div class="text-center my-2">
                <img
                  src="${data.url ? data.url : '/imgenes/dperfil.jpg'}"
                  class="rounded-circle"
                  alt="..."
                  style="width: 200px;"
                  focusable="false"
                  id="profileImgA"
                />
              </div>
            </div>
            <div class="col">
              <p class="h4 my-5">${data.name}</p>
              <!-- Button trigger modal -->
              <div class="text-center">
                <button
                type="button"
                class="btn btn-outline-secondary"
                data-toggle="modal"
                data-target="#ModalPassWord"
              >
                cambiar contraseña
              </button>
    
              <!-- Modal -->
              <div
                class="modal fade"
                id="ModalPassWord"
                tabindex="-1"
                aria-labelledby="modalLabelPassword"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="modalLabelPassword">
                        Cambiar contrasena
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <div class="container col-sm-8">
                        
                      <div class="form-group" id="spamP">
                      <label for="formControlInputNewPassword">Nueva contraseña</label>
                      <input 
                      type="password" 
                      class="check-seguridad form-control"
                       id="formControlInputNewPassword"
                        placeholder="password"
                        
                        maxlength="16"
              
                        >
                    </div><div class="form-group" id="spamP2">
                      <label for="formControlInputNewPassword2">Nueva contraseña</label>
                      <input 
                        type="password" 
                        class="check-seguridad form-control"
                        id="formControlInputNewPassword2"
                        placeholder="password"
                        onChange="view.activeBtn(event)"
                        maxlength="16"
                      >
                  </div>
                        
                      </div>
                    </div>
                    <div class="modal-footer" id="divSendPass">
                      <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                      <button onclick="view.changePassword()" data-dismiss="modal" type="button" class="btn btn-primary  " id="btnSendPass" disabled>
                        cambiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                <!-- ??? -->
                <button
                type="button"
                class="btn btn-outline-secondary"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                cambiar foto de perfil
              </button>
    
              <!-- Modal -->
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Cambiar Foto de perfil
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <div class="custom-file">
                        <input type="file" class="custom-file-input" id="inputGroupFileProfile" aria-describedby="inputGroupFileAddon01">
                        <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        data-dismiss="modal"
                        onclick="view.deleteProfileImg()"
                      >
                        eliminar
                      </button>
                      <button 
                        onclick="view.updateProfileImg()" 
                        data-dismiss="modal" type="button" class="btn btn-outline-primary">
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- new post -->
              <button
              type="button"
              class="btn btn-outline-secondary my-2"
              data-toggle="modal"
              data-target="#newpost"
            >
              nuevo post 
            </button>
  
            <!-- Modal -->
            <div
              class="modal fade"
              id="newpost"
              tabindex="-1"
              aria-labelledby="modalLabelPost"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelPost">
                      Nueva Publicacion
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class=" container-flex  mr-2">
                      <h3 class="h3">Escoja una imagen</h3><hr>
                      <div class="container-fluid my-3 "  >
          
                        <img src="/imgenes/email.png" id="imgUpload" alt="Upload" class="rounded mx-auto d-block" style="max-height: 200px;">
                      </div>
                      <div class="input-group mb-3 mr-3">
                        <div class="input-group-prepend ml-2">
                            <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
                        </div>
                        <div class="custom-file">
                            <input type="file" accept="image/*" onchange="view.viewUploadImg('imgUpload','photo')" class="custom-file-input" id="photo" aria-describedby="inputGroupFileAddon01">
                            <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                        </div>
                      </div>
                      <div class="input-group mb-3">
                          <input id="descript" autocomplete="off" spellcheck="false" value='' type="text" class="form-control ml-2" placeholder=" Escriba una descripcion" aria-label="Escriba una descripcion" aria-describedby="button-addon2">
                          
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <div class="input-group-append">
                      <button class="btn btn-outline-primary" data-dismiss="modal" type="button" onclick='view.viewNewPost()'>Post</button>
                  </div>
                  </div>
                </div>
              </div>
            </div>
              
              </div>
            </div>
          </div>
          <br />
          <div class="row card border">
            <div class="card-body" >
            <div class="row" id="postProfile">
              
            </div>
            </div>
          </div>
        </div>
      </div>

      `;

      await listRef
        .listAll()
        .then(function (res) {
          res.items.forEach((itemRef) => {
            const forestRef = storageRef.child(itemRef.fullPath);
            let urlInfo = [];
            forestRef
              .getMetadata()
              .then((metadata) => {
                // console.log(metadata.customMetadata);
                urlInfo.push(metadata.customMetadata);
              })
              .catch(function (error) {
                // Uh-oh, an error occurred!
                console.log(error);
              });
            itemRef.getDownloadURL().then((url) => {
              urlInfo.push(url);
              const post = {
                metadata: urlInfo[0],
                url: urlInfo[1],
                comments: [],
              };
              let modal = `#${post.metadata.id}`;
              // console.log(modal);
              const body = document.getElementById("postProfile");
              body.innerHTML += `
            <div class="card bg-light  border mb-3 mt-3 mr-2 ml-2" style="max-width: 15rem;max-heigth: 15rem">
            <div class="card-header">${post.metadata.owner}
      
            </div>
            <div class="card-body">
              <div class="text-center">
                <img class="img-fluid" alt="Responsive image" src="${post.url}">
              </div>
            </div>
            <p class="card-text ml-1">${
              post.metadata.feedMsg ? post.metadata.feedMsg : ""
            }</p>
            <div class="p-3  bg-white text-dark" style="max-height: 5rem; overflow: auto;" id="${
              post.metadata.id
            }">
            </div>
                  <div class="input-group ml-1 mr-1 mb-1">
                    <input type="text"
                    autocomplete="off"
                     spellcheck="false"
                     class="form-control" 
                    placeholder="Escribe un comentario" value=""
                     id="${post.metadata.id}"
                    name="${data.name}">
                    <div class="input-group-append ">
                      <button class="btn btn-outline-secondary mr-2"
                       type="button" onclick="view.viewNewCommet(event)"
                       name="${post.metadata.ownerId}"
                       id="${post.metadata.id}">Comentar</button>
                    </div>
                  </div>
                  
                  <button type="button" onclick="view.delete('${
                    post.metadata.id
                  }')" class="btn btn-outline-danger">eliminar</button>

            </div>
          
            `;

              urlInfo = [];
              const ListCommment = Database.loadComments();
              ListCommment.then((comment) => {
                // console.log(comment);
                comment.forEach((item) => {
                  let selector = `#${item.id}`;
                  // console.log(selector);
                  let boxComments = document.querySelectorAll(selector)[0];
                  // console.log(boxComments)
                  if (boxComments) {
                    
                    boxComments.innerHTML += `
                  <p id="c"><strong>${item.name}: </strong>${item.comment}
                  `;
                  }
                });
              });
            });
          });
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
        });

      },
  },
  delete: (id) => {
    // console.log(id);
    const data = view.viewCurrentDataUser();
    const storageRef = fireStorage.ref();
    // Create a reference under which you want to list
    let listRef = storageRef.child("image/" + data.id);
    // console.log(listRef);
    // Find all the prefixes and items.
    listRef
      .listAll()
      .then(function (res) {
        // console.log(res);
        res.items.forEach(function (itemRef) {
          // Create a reference to the file whose metadata we want to retrieve
          // console.log(itemRef);
          let forestRef = storageRef.child(itemRef.fullPath);

          // Get metadata properties
          forestRef
            .getMetadata()
            .then(function (metadata) {
              if (id === metadata.customMetadata.id) {
                // Create a reference to the file to delete
                var desertRef = storageRef.child(itemRef.fullPath);

                // Delete the file
                desertRef
                  .delete()
                  .then(function () {
                    view.injectHTML.profile();
                  })
                  .catch(function (error) {
                    // Uh-oh, an error occurred!
                  });
              } else {
                console.log(metadata.customMetadata.id);
              }
              // Metadata now contains the metadata for 'images/forest.jpg'
            })
            .catch(function (error) {
              // Uh-oh, an error occurred!
            });
        });
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
      });
  },

  viewUploadImg: (id, id2) => {
    // console.log(id);
    const imagenPrevisualizacion = document.getElementById(id);
    const file = document.getElementById(id2).files[0];
    // console.log(file);
    const objectURL = URL.createObjectURL(file);
    // Y a la fuente de la imagen le ponemos el objectURL
    imagenPrevisualizacion.src = objectURL;
  },

  updateProfileImg: () => {
    const file = document.getElementById("inputGroupFileProfile").files[0];
    const imagenPrevisualizacion = document.getElementById("profileImgA");
    const imagenPrevisualizacionb = document.getElementById("profileImgB");

    if (file != null) {
      // console.log(file);
      const objectURL = URL.createObjectURL(file);
      imagenPrevisualizacion.src = objectURL;
      imagenPrevisualizacionb.src = objectURL;

      const ref = fireStorage.ref();
      const metadata = {
        customMetadata: {
          owner: Database.actualData.name,
          ownerId: Database.actualData.id,
        },
      };
      ref
        .child(`image/${Database.actualData.id}/profile/` + "profile")
        .put(file, metadata)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          // console.log(url);
          // Database.actualData.url = url 
          fireDB
            .collection("users")
            .doc(Database.actualData.id)
            .update({
              url: url,
            })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        });
      // Add a new document in collection "cities"
    } else {
      view.viewAlert(
        "danger",
        "El nuevo post fallo: Ninguna Imagen selecionada"
      );
    }
  },
  deleteProfileImg: () => {
    const ref = fireStorage.ref();
    ref
      .child("image/dperfil.jpg")
      .getDownloadURL()
      .then(function (url) {
        const imagenPrevisualizacion = document.getElementById("profileImgA");
        const imagenPrevisualizacionb = document.getElementById("profileImgB");
        imagenPrevisualizacion.src = url;
        imagenPrevisualizacionb.src = url;
        fireDB
          .collection("users")
          .doc(Database.actualData.id)
          .update({
            url: url,
          })
          .then(function () {
            console.log("Document successfully written!");
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      })
      .catch(function (error) {
        // Handle any errors
      });
  },
  viewNewPost: () => {
    const file = document.getElementById("photo").files[0];
    const descript = document.getElementById("descript").value;
    // console.log(descript);
    if (file != null) {
      optopus.newPost(file, descript);
    } else {
      view.viewAlert(
        "danger",
        "El nuevo post fallo: Ninguna Imagen selecionada"
      );
    }
  },
  activeBtn: (e) => {
    const pass = document.getElementById("formControlInputNewPassword").value;
    const pass2 = document.getElementById("formControlInputNewPassword2").value;

    const spam = document.getElementById("spamP");
    const spam2 = document.getElementById("spamP2");
    if (pass != pass2) {
      spam.innerHTML += `<span  style="color:red" id="remove"> Contasenas no coinciden</span>`;
      spam2.innerHTML += `<span  style="color:red" id="remove2"> Contasenas no coinciden</span>`;
      const btn = document.getElementById("btnSendPass");
      btn.setAttribute("disabled", "");
      setTimeout(() => {
        document.getElementById("remove").remove();
        document.getElementById("remove2").remove();
      }, 2000);
    } else {
      document.getElementById("btnSendPass").removeAttribute("disabled");
    }
    // console.log(pass2,pass)
  },
  changePassword: () => {
    const pass = document.getElementById("formControlInputNewPassword");
    const pass2 = document.getElementById("formControlInputNewPassword2");
    setTimeout(()=> {

      const btn = document.getElementById("btnSendPass").setAttribute("disabled", "");
    },1000)
    console.log(pass, pass2);
    optopus.changePassword(pass2.value);
    pass.value = "";
    pass2.value = "";
    view.viewAlert("success", "Exito al cambiar la contrasena");
   
  },
  viewLoadHome: () => {
    view.injectHTML.home();
    const ListPosts = optopus.getPosts(false);
    ListPosts.then((posts) => {
      view.injectHTML.updatePost(posts);
    });
    //   console.log('k')
  },

  viewNewCommet: (e) => {
    e.preventDefault();
    const id = e.target.id;
    // console.log(id)
    let selector = `#${id}`;
    // console.log(a)
    const input = document.querySelectorAll(selector);
    // console.log(input)
    const newComment = input[1].value;
    const ownerId = e.target.name;
    const name = Database.actualData.name;
    const boxComments = input[0];
    // console.log(boxComments);
    console.log(id, newComment, ownerId, name);
    // let c = document.getElementById(id+"c");
  //  console.log(boxComments)
    
      boxComments.innerHTML += `<p id="${id}+c"><strong>${Database.actualData.name}: </strong>${newComment}</p>`;
  
    // optopus.newComment(id, ownerId, newComment, name);
    input[1].value = "";
  },
  updatePost: (data) => {
    // const data = view.viewCurrentDataUser();
    let divPost = document.getElementById("post");
    if (data.length && divPost) {
      divPost.innerHTML = "";
      // const data = view.viewCurrentDataUser();
      const posts = data;
      // console.log(posts);
      posts.forEach((post, index) => {
        // console.log(post);
        const id = post.metadata.id,
          ownerId = post.metadata.ownerId;
        // console.log(id, ownerId);
        divPost.innerHTML += `
        <div class="card bg-light  border mb-3 mt-3">
        <div class="card-header">${post.metadata.owner}
  
        </div>
        <div class="card-body">
          <div class="text-center">
            <img class="img-fluid" alt="Responsive image" src="${post.url}">
          </div>
        </div>
        <p class="card-text ml-1">${
          post.metadata.feedMsg ? post.metadata.feedMsg : ""
        }</p>
        <div class="p-3  bg-white text-dark" style="max-height: 5rem; overflow: auto; " id="${
          post.metadata.id
        }">
        </div>
              <div class="input-group ml-1 mr-1 mb-1">
                <input type="text" class="form-control" 
                placeholder="Escribe un comentario" value=""
                 id="${id}"
                 autocomplete="off"
                  spellcheck="false"
                name="${data.name}">
                <div class="input-group-append ">
                  <button class="btn btn-outline-secondary mr-2"
                   type="button" onclick="view.viewNewCommet(event)"
                   name="${ownerId}"
                   id="${id}">Comentar</button>
                </div>
              </div>
        </div>
      
        `;
      });
      const ListCommment = Database.loadComments();
      ListCommment.then((comment) => {
        // console.log(comment);
        comment.forEach((item) => {
          let selector = `#${item.id}`;
          // console.log(selector);
          let boxComments = document.querySelectorAll(selector)[0];
          // console.log(boxComments)
          boxComments.innerHTML += `
        <p id="c"><strong>${item.name}: </strong>${item.comment}
        `;
        });
      });
    } else {
      setTimeout(() => {
        view.updatePost(data);
        console.log("cargando...");
      }, 2000);
      // console.log("cargando...");
    }
  },
};

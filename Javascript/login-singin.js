function formRegister() {
  console.log('form ')

  const formLogin = document.getElementById("body");
  formLogin.innerHTML = ` 
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
        value= "" 
        type="password"
        class="form-control"
        id="inputPassRegister"
        placeholder="Crea una contraseña"
      />
    </div>
    <div class="d-flex justify-content-center">
      <button onclick="" class="btn btn-primary">
        Comfirmar
      </button>
    </div>
    <p class="text-center">or</p>
    <div class="d-flex justify-content-center">
      <a href="#" onclick="formLogIn()" class="stretched-link">Ya tienes una cuenta?</a>
    </div>
    <br/>
    </form>
  </div>

 `
}
function formLogIn() {
  console.log('form log')
  const formLogin = document.getElementById("body");
  formLogin.innerHTML = `
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
        <button class="btn btn-primary" onclick="view.logIn(event)">
          Iniciar session
        </button>
      </div>
      <br />
      <p class="text-center">or</p>
      <div class="d-flex justify-content-center">
        <button onclick="view.viewSignIn.google(event)" class="btn btn-ligth">
          <!-- <div id="img" class="text-center"> -->
          <img
            src="/imgenes/google.jpg"
            class="rounded"
            style="width: 2rem;"
            alt="..."
            id="Goggle"
          />
        </button>
        <button class="btn btn-ligth" onclick="formRegister()">
          <img
            src="/imgenes/email.png"
            class="rounded"
            style="width: 2rem;"
            alt="..."
            id="Facebook"
          />
        </button>
      </div>
      <br />
    </form>
  </div>
  `;
}

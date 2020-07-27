function formRegister() {
  const formLogin = document.getElementById("login");
  formLogin.innerHTML = ` 
        <div class="form-group">
            <label for="inputName">nombre</label>
            <input
            type="name"
            class="form-control"
            id="inputName"
            aria-describedby="emailHelp"
            placeholder="introduce tu nombre"
        />
        </div>
          <div class="form-group">
            <label for="inputEmail1">Email</label>
            <input
              type="email"
              class="form-control"
              id="inputEmail1"
              aria-describedby="emailHelp"
              placeholder="introduce un correo"
            />
          </div>
          <div class="form-group">
            <label for="inputPassword1">Contraseña</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword1"
              placeholder="Crea una contraseña"
            />
          </div>
          <div class="d-flex justify-content-center">
            <button onclick="Register()" class="btn btn-primary">
              Comfirmar
            </button>
          </div>
          <p class="text-center">or</p>
          <div class="d-flex justify-content-center">
            <button onclick="formLogIn()" class="btn btn-primary">
              Iniciar Session
            </button>
          </div>
          <br/>
  `;
}function formLogIn() {
  const formLogin = document.getElementById("login");
  formLogin.innerHTML = `
        <div class="form-group">
        <label for="exampleInputEmail1">Usuario</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="introduce tu correo"
        />
        <small id="emailHelp" class="form-text text-muted"
          >We'll never share your email with anyone else.</small
        >
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Contraseña</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="introduce tu cotrasena"
        />
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary">
          Iniciar session
        </button>
      </div>
      <br />
      <p class="text-center">or</p>
      <div class="d-flex justify-content-center">
        <button onclick="formRegister()" class="btn btn-primary">
          Registrarse
        </button>
      </div>
      <br />
  `;
}

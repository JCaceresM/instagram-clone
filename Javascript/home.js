function home(params) {
  const body = document.getElementById("body");
  body.innerHTML = `
            <div class="container">
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
            <button class="btn btn-outline-danger  left" onclick='view.viewSignOut()'> Log out</button>
            </nav>
            <div class="row col">
            <div class="container col col-xs-disabled border ml-3 mt-2 mb-3" >
                <div style="width: 200px;"></div>
                <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
            <div class="container col-6   border ml-3 mt-2 mb-3" >
                <img class="img-fluid" src="/imgenes/967423a0bfc9bf04722542f75fb99a06.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
            <div class="container  col  border ml-3 mt-2 mb-3" >
                <div style="width:100px"></div>
                <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </div>
        </div>
    `;
}

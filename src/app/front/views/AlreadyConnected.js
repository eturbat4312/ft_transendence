import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("AlreadyConnected");
    }

    async getHtml() {
        return `
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6 centered">
            <div class="card my-5 bg-dark">
                <div class="card-body">
                    <div class="d-flex flex-column align-items-center">
                        <p class="text-light">You are already connected from another window or browser.</p>
                    </div> 
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }
}
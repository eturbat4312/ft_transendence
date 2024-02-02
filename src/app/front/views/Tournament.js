import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tournament");
    }

    async getHtml() {
        return `
        <div id="tournament">
            <div class="container">
               <div class="row">
                  <div class="col">
                     <h1 class="text-center">Tournament</h1>
                     <p class="text-center">Lorem
                        ipsum dolor sit amet, consectetur adipiscing elit. Donec
                        aliquet, tortor sed accumsan bibendum, erat ligula
                        aliquet magna, vitae ornare odio metus a mi. Morbi ac
                        orci et nisl hendrerit mollis. Suspendisse ut massa
                        nec nisi aliquam ultricies. Duis sit amet commodo
                        tortor. Proin quis neque lacinia, aliquet massa
                        eget
                        </p>
                  </div>
               </div>
            </div>
         </div>
        `;
    }
}
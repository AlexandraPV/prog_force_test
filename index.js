class Root {
    constructor() {
        this.json_path = "./users.json";
        this.json_winners_path = "./winners.json";
        this.user_table_body = document.getElementById('user_table');
        this.winners_output = document.getElementById('winners_output');
        this.arr_winners_id = [];
        this.btn_new_winner = document.getElementById('js_new_winner');


    }


    readTextFile(file, callback) {
        var file_req = new XMLHttpRequest();
        file_req.overrideMimeType("application/json");
        file_req.open("GET", file, true);
        file_req.onreadystatechange = function () {
            if (file_req.readyState === 4 && file_req.status === 200) {
                callback(file_req.responseText);
            }
        };
        file_req.send(null);
    }

    init() {
        let self = this;
        let data_output = null;
        this.readTextFile(this.json_path, function (arr) {
            data_output = JSON.parse(arr);
            self.render_data(data_output);
            self.render_winners(data_output);
            self.add_new_winner(data_output);
        });
    }

    render_data(data) {
        let btn_edit = document.createElement("button");
        let btn_delete = document.createElement("button");
        btn_edit.classList.add("btn", "btn-info");
        btn_delete.classList.add("btn", "btn-danger");
        btn_edit.innerText = "✓";
        btn_delete.innerText = "х";
        let td_btn = document.createElement("td");
        td_btn.classList.add("btn_td");
        td_btn.appendChild(btn_edit);
        td_btn.appendChild(btn_delete);

        for (let index in data) {
            let tr = document.createElement("tr");
            for (let key in data[index]) {
                if (key === "id") {
                    continue;
                }
                let td = document.createElement("td");

                td.innerHTML = data[index][key];
                tr.appendChild(td);
            }
            let td_btn_copy = td_btn.cloneNode(true);

            tr.appendChild(td_btn_copy);
            this.user_table_body.appendChild(tr);
        }
    }

    render_winners(data) {
        let self = this;
        let data_output = null;
        let winners_string = '';
        this.readTextFile(this.json_winners_path, function (arr) {
            data_output = JSON.parse(arr);
            for (let i = 0; i < data_output.length; i++) {
                this.arr_winners_id.push(data_output[i]["id"]);
            }
            for (let index in data) {
                for (let i = 0; i < this.arr_winners_id.length; i++) {

                    if (data[index]["id"] === this.arr_winners_id[i]) {
                        winners_string += `${data[index]["name"]} ${data[index]["surname"]}   `
                    }

                }
            }
            self.winners_output.value = winners_string;
        });


    }

    random_Number(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    add_new_winner(data) {
        let self = this;
        let winner_id = 0;
        let no_find_win = true;
        this.btn_new_winner.addEventListener("click", function () {
            while(no_find_win){
               winner_id = this.random_Number(data[0]["id"], data[data.length - 1]["id"]);
               no_find_win = self.arr_winners_id.includes(winner_id);
            }

        });

    }

    add_new_user() {

    }

    delete_new_user() {

    }

    edit_new_user() {

    }

    validation_form() {

    }


}

const App = new Root();
App.init();



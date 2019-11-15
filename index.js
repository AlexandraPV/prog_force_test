class Root {
    constructor() {
        this.json_path = "./users.json";
        this.user_table_body = document.getElementById('user_table');
        this.winners_output = document.getElementById('winners_output');
        this.arr_winners_id = [];
        this.btn_new_winner = document.getElementById('js_new_winner');
        this.form = document.getElementById("form_user");
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
        this.readTextFile(this.json_path, function (arr) {
            window.localStorage.setItem('users', arr);
        });
        let users_obj = JSON.parse(window.localStorage.getItem('users'));
        this.render_data(users_obj);
        this.add_new_winner(users_obj);
        window.localStorage.setItem('winners', JSON.stringify([]));
        this.add_new_user(users_obj);
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

    render_winners(data, arr_winners_id) {
        let winners_string = '';
        let data_output = window.localStorage.getItem("winners");
        if (data_output) {
            console.log(data_output);
            for (let index in data) {
                for (let i = 0; i < arr_winners_id.length; i++) {

                    if (data[index]["id"] === arr_winners_id[i]) {
                        winners_string += `${data[index]["name"]} ${data[index]["surname"]}   `
                    }

                }
            }
            this.winners_output.value = winners_string;

        }
    }

    random_Number(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    add_new_winner(data) {
        let self = this;
        let winner_id = 0;

        let winner_obj = {};
        let winners_from_Local = [];

        if (self.arr_winners_id.length === 3) {
            alert("max count of winners 3");
            return;
        }
        this.btn_new_winner.addEventListener("click", function () {
            let no_find_win = true;

            while (no_find_win) {
                winner_id = self.random_Number(data[0]["id"], data[data.length - 1]["id"]);
                no_find_win = self.arr_winners_id.includes(winner_id);

            }

            if (self.arr_winners_id.length === 3) {
                alert("max count of winners 3");
                return;
            }
            console.log(self.arr_winners_id);

            self.arr_winners_id.push(winner_id);
            winner_obj['id'] = winner_id;
            winners_from_Local = JSON.parse(window.localStorage.getItem('winners'));
            winners_from_Local.push(winner_obj);
            window.localStorage.setItem('winners', JSON.stringify(winners_from_Local));
            self.render_winners(data, self.arr_winners_id);
        });

    }

    add_new_user(users) {
        let obj = {};
        let self = this;
        this.form.addEventListener('submit', function (event) {
            event.preventDefault();
            let last_id_user = users[users.length - 1].id;
            let formData = new FormData(this);
            obj['id'] = last_id_user + 1;
            for (let elem of formData.entries()) {
                obj[elem[0]] = elem[1];
            }
            users.push(obj);
            window.localStorage.setItem('users', users);
            console.log(users);
            self.render_data(users);
            self.form.reset();

        })
    }

    delete_user() {

    }

    edit_new_user() {

    }

    validation_form() {

    }


}

const App = new Root();
App.init();



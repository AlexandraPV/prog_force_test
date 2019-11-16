class Root {
    constructor() {
        this.json_path = "./users.json";
        this.user_table_body = document.getElementById('user_table');
        this.winners_output = document.getElementById('winners_output');
        this.arr_winners_id = [];
        this.btn_new_winner = document.getElementById('js_new_winner');
        this.form = document.getElementById("form_user");
        this.index_edit_user = null;
        this.index_edit_user_tr = null;
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
        this.readTextFile(this.json_path, function (arr) {  // Data for first initial page
            window.localStorage.setItem('users', arr);
        });
        let users_obj = JSON.parse(window.localStorage.getItem('users'));
        this.render_data(users_obj);
        this.add_new_winner();
        window.localStorage.setItem('winners', JSON.stringify([]));
        this.add_new_user(users_obj);
        this.save_edit_user();
    }

    render_data(data) {
        let btn_edit = document.createElement("button");
        let btn_delete = document.createElement("button");
        btn_edit.classList.add("btn", "btn-info", "js_btn-info");
        btn_delete.classList.add("btn", "btn-danger", "js_btn-danger");
        btn_edit.innerText = "✓";
        btn_delete.innerText = "х";
        let td_btn = document.createElement("td");
        td_btn.classList.add("btn_td");
        td_btn.appendChild(btn_edit);
        td_btn.appendChild(btn_delete);
        let self = this;
        for (let index in data) {

            let user_id = 0;
            let tr = document.createElement("tr");
            for (let key in data[index]) {

                let td = document.createElement("td");
                if (key === "id") {
                    user_id = data[index][key];
                    continue;
                }
                td.innerHTML = data[index][key];
                tr.appendChild(td);
            }
            let td_btn_copy = td_btn.cloneNode(true);
            (function () {
                td_btn_copy.querySelector('.js_btn-danger').addEventListener('click', self.delete_user)
            })();
            this.edit_user(td_btn_copy.querySelector('.js_btn-info'));
            td_btn_copy.dataset.id = user_id;

            tr.appendChild(td_btn_copy);
            this.user_table_body.appendChild(tr);

        }
    }

    render_winners(data, arr_winners_id) {
        let winners_string = '';
        let data_output = window.localStorage.getItem("winners");
        if (data_output) {

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

    add_new_winner() {
        let self = this;
        let winner_id = 0;

        let winner_obj = {};
        let winners_from_Local = [];


        this.btn_new_winner.addEventListener("click", function () {
            let no_find_win = true;
            let data = JSON.parse(window.localStorage.getItem('users'));
            while (no_find_win) {
                winner_id = self.random_Number(data[0]["id"], data[data.length - 1]["id"]);
                no_find_win = self.arr_winners_id.includes(winner_id);

            }

            if (self.arr_winners_id.length === 3) {
                alert("max count of winners 3");
                return;
            }

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

        let btn_edit = document.createElement("button");
        let btn_delete = document.createElement("button");
        btn_edit.classList.add("btn", "btn-info", "js_btn-info");
        btn_delete.classList.add("btn", "btn-danger", "js_btn-danger");
        btn_edit.innerText = "✓";
        btn_delete.innerText = "х";
        let td_btn = document.createElement("td");
        td_btn.classList.add("btn_td");
        td_btn.appendChild(btn_edit);
        td_btn.appendChild(btn_delete);

        this.form.addEventListener('submit', function (event) {
                event.preventDefault();
                if (self.validation_form()) {

                    let last_id_user = users[users.length - 1].id;
                    let formData = new FormData(this);

                    obj['id'] = last_id_user + 1;
                    for (let elem of formData.entries()) {
                        obj[elem[0]] = elem[1];
                    }
                    users.push(obj);
                    window.localStorage.setItem('users', JSON.stringify(users));

                    let user_id = 0;
                    let tr = document.createElement("tr");
                    for (let key in obj) {
                        let td = document.createElement("td");
                        if (key === "id") {
                            user_id = obj[key];
                            continue;
                        }
                        td.innerHTML = obj[key];
                        tr.appendChild(td);
                    }
                    let td_btn_copy = td_btn.cloneNode(true);
                    (function () {
                        td_btn_copy.querySelector('.js_btn-danger').addEventListener('click', self.delete_user)
                    })();
                    self.edit_user(td_btn_copy.querySelector('.js_btn-info'));
                    td_btn_copy.dataset.id = user_id;

                    tr.appendChild(td_btn_copy);
                    self.user_table_body.appendChild(tr);
                    this.reset();

                }
            }
        );
    }

    delete_user() {
        let users_obj = JSON.parse(window.localStorage.getItem('users'));
        let user_id = this.closest(".btn_td").dataset.id;
        for (let index in users_obj) {

            if (users_obj[index]["id"] == user_id) {
                users_obj.splice(index, 1);
            }
        }
        this.closest("tr").remove();
        window.localStorage.setItem('users', JSON.stringify(users_obj));

    }


    edit_user(elem) {
        let self = this;
        let input_name = document.getElementById("name");
        let input_surname = document.getElementById("surname");
        let input_email = document.getElementById("email");
        let input_phone = document.getElementById("phone");
        let input_date = document.getElementById("date");
        let edit_btn = document.querySelector('.edit_btn');
        let save_btn = document.querySelector('.save_btn');


        elem.addEventListener("click", function () {
            self.index_edit_user_tr = this;
            let users_obj = JSON.parse(window.localStorage.getItem('users'));
            let user_id = this.closest(".btn_td").dataset.id;
            for (let index in users_obj) {
                if (users_obj[index]["id"] == user_id) {
                    self.index_edit_user = index;
                    input_name.value = users_obj[index]["name"];
                    input_surname.value = users_obj[index]["surname"];
                    input_email.value = users_obj[index]["email"];
                    input_phone.value = users_obj[index]["phone"];
                    input_date.value = users_obj[index]["date"];
                    save_btn.classList.add("display_none");
                    edit_btn.classList.remove("display_none");
                }
            }

        }, false);
    }

    save_edit_user() {
        let edit_btn = document.querySelector('.edit_btn');

        let self = this;
        let save_btn = document.querySelector('.save_btn');
        edit_btn.addEventListener('click', function (event) {
                let users_obj = JSON.parse(window.localStorage.getItem('users'));

                event.preventDefault();
                if (self.validation_form()) {
                    let formData = new FormData(self.form);
                    for (let elem_edit of formData.entries()) {
                        users_obj[self.index_edit_user][elem_edit[0]] = elem_edit[1];
                    }
                    window.localStorage.setItem('users', JSON.stringify(users_obj));
                    let change_elem = self.index_edit_user_tr.closest(".btn_td").closest("tr");
                    let arr_td_change = change_elem.querySelectorAll("td");
                    arr_td_change[0].innerHTML = users_obj[self.index_edit_user]["name"];
                    arr_td_change[1].innerHTML = users_obj[self.index_edit_user]["surname"];
                    arr_td_change[2].innerHTML = users_obj[self.index_edit_user]["email"];
                    arr_td_change[3].innerHTML = users_obj[self.index_edit_user]["phone"];
                    arr_td_change[4].innerHTML = users_obj[self.index_edit_user]["date"];
                    self.form.reset();
                    save_btn.classList.remove("display_none");
                    edit_btn.classList.add("display_none");
                }
            },
            true);

    }

    validation_form() {
        let obj = {};
        let formData = new FormData(this.form);
        for (let elem of formData.entries()) {
            obj[elem[0]] = elem[1];
        }
        var re_name = new RegExp(/^[A-za-z]{2,15}$/);
        var re_surname = new RegExp(/^[A-za-z]{2,20}$/);
        var re_email = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var re_phone = new RegExp("\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}$");
        var re_date = new RegExp(/\\d{2}.\\d{2}.\\d{4}$/);
        if (!re_name.test(obj.name)) {
            document.querySelector('.js_name_group').innerText = "Enter correct Name (2-15 symbols)";
            document.querySelector('.js_name_group').classList.remove('display_none');
            return false;
        }
        if (re_name.test(obj.name)) {
            document.querySelector('.js_name_group').classList.add('display_none');
        }

        if (!re_surname.test(obj.surname)) {
            document.querySelector('.js_surname_group').innerText = "Enter correct Surname (2-20 symbols)";
            document.querySelector('.js_surname_group').classList.remove('display_none');
            return false;
        }

        if (re_surname.test(obj.surname)) {
            document.querySelector('.js_surname_group').classList.add('display_none');
        }

        if (!re_email.test(obj.email)) {
            document.querySelector('.js_email_group').innerText = "Enter correct Email";
            document.querySelector('.js_email_group').classList.remove('display_none');
            return false;
        }

        if (re_email.test(obj.email)) {
            document.querySelector('.js_email_group').classList.add('display_none');
        }

        if (obj.phone.length > 0 && !re_phone.test(obj.phone)) {
            document.querySelector('.js_phone_group').innerText = "Enter correct Phone (format (xxx)xxx-xx-xx ) or enter nothing";
            document.querySelector('.js_phone_group').classList.remove('display_none');
            return false;
        }

        if (obj.phone.length <= 0 || re_phone.test(obj.phone)) {
            document.querySelector('.js_phone_group').classList.add('display_none');
        }

        return true;
    }


}

const App = new Root();
App.init();



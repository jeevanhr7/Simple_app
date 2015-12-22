/**
 * Created by Jeevan on 12/10/2015.
 */
var userlistData = [];
var update_id = 0;
$(document).ready(function () {

    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#btnAddUser').on('click', adduser);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteuser);
    $('#userList table tbody').on('click', 'td a.linkupdateuser', changeUserInfo);
    $('#btnCancelUpdateUser').on('click', togglePanels);
    $('#updateUser input').on('change', function () {
        $(this).addClass('updated')
    });
    $('#btnUpdateUser').on('click', updateUser);
    populateData();
})
function populateData() {
    var tablecontent = '';
    $.getJSON('/users/userlist', function (data) {
        userlistData = data;

        $.each(data, function () {
            tablecontent += '<tr>';
            tablecontent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tablecontent += '<td>' + this.email + '</td>';
            tablecontent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a>/<a href="#" class="linkupdateuser" rel="' + this._id + '">Update</a></td>';
            tablecontent += '</tr>'
        });
        $('#userList table tbody').html(tablecontent);
    });
};

function showUserInfo(event) {
    event.preventDefault();

    var thisusername = $(this).attr('rel');
    console.log(thisusername);

    var arrayPosition = userlistData.map(function (arrayItem) {
        return arrayItem.username;
    }).indexOf(thisusername);
    console.log(arrayPosition);

    var userdata = userlistData[arrayPosition];
    $('#username').text(userdata.fullname);
    $('#usermail').text(userdata.email);
    $('#age').text(userdata.age);
    $('#location').text(userdata.location);
    $('#gender').text(userdata.gender);

};

function adduser(event) {
    var ercount = 0;
    event.preventDefault();
    $('#adduser input').each(function (index, val) {
        if ($(this).val() === '') {
            ercount++;
        }
    });
    if (ercount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            "username": $('#ausername').val(),
            "email": $('#aemail').val(),
            "fullname": $('#afullname').val(),
            "age": $('#aage').val(),
            "location": $('#alocation').val(),
            "gender": $('#agender').val()
        }

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.msg === '') {
                // Clear the form inputs
                $('#adduser fieldset input').val('');
                console.log(newUser.fullname);
                // Update the table
                populateData();

            }
            else {
                alert('Error: ' + response.msg);
            }
        });


    }

    else {
        alert('please fill all the Data');
        return false;
    }
}
function deleteuser(event) {
    event.preventDefault();
    var id = $(this).attr('rel');
    console.log(id);
    var conf = confirm('are you Want to delete the User');
    if (conf === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + id

        }).done(function (response) {
            if (response.msg === "") {
                alert('user hae Been Deleted');
                populateData();
            }
            else {
                alert(response.msg);
            }


        })
    }
    else {
        return false;
    }

}


function changeUserInfo(event) {
    if ($('#addUserPanel').is(":visible")) {
        togglePanels();
    }
    event.preventDefault();
    var _id = $(this).attr('rel');

    var confirmation = confirm('Are You Want to Update the User');
    var userpos = userlistData.map(function (arrayitem) {
        return arrayitem._id;
    }).indexOf(_id);


    var updateduser = userlistData[userpos];
    console.log(updateduser.username);

    $('#upusername').val(updateduser.username);
    $('#upemail').val(updateduser.email);
    $('#upfullname').val(updateduser.fullname);
    $('#upage').val(updateduser.age);
    $('#uplocation').val(updateduser.location);
    $('#upgender').val(updateduser.gender);

    update_id = updateduser._id;
    console.log('to Be Update' + update_id);


};


function updateUser(event) {
    event.preventDefault();
    var confirmation = confirm('are You Want to update');
    if (confirmation === true) {
        // Parsing the to the Above div to get the User Id
        var _id = update_id;
        console.log('id is' + _id);
        var fieldstobeupdate = $('#updateUser input.updated');
        console.log(fieldstobeupdate);
        var updateFields = {};
        $(fieldstobeupdate).each(function () {
            var key = $(this).attr('placeholder').replace(" ", "").toLowerCase();
            var value = $(this).val();
            updateFields[key] = value;
        })
        $.ajax({
            type: 'PUT',
            url: 'users/updateuser/' + _id,
            dataType: 'JSON',
            data: updateFields
        }).done(function (response) {
            if (response.msg === "") {
                alert('updated Success');
                populateData();
            }
            else {
                alert('error' + response.msg)
            }
        });


    }
    else {
        return false;
    }
};

function togglePanels() {
    $('#addUserPanel').toggle();
    $('#updateUserPanel').toggle();
};
/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayEmails();


function displayEmails() {
    httpGet('/api/emails')
        .then(response => response.json())
        .then((response) => {
            var allEmails = response.emails;
            // Empty the anchor

            var allEmailsAnchor = document.getElementById('all-emails-anchor');
            allEmailsAnchor.innerHTML = '';

            // Append emails to anchor
            allEmails.forEach((email) => {
                allEmailsAnchor.innerHTML += getEmailDisplayEle(email);
            });
        });
};


function getEmailDisplayEle(email) {
    return `<div class="email-display-ele">
        <div class="normal-view">
            <div>To: ${email.to}</div>
            <div>Cc: ${email.cc}</div>
            <div>Ccn: ${email.ccn}</div>
            <div>Subject: ${email.subject}</div>
            <div>Body: ${email.body}</div>
            <div>Cron: ${email.job.cron ?? ""}</div>
            <div>Status: ${email.job.status ?? ""}</div>
            
            <button class="edit-email-btn" data-email-id="${email.id}">Edit</button>
            <button class="delete-email-btn" data-email-id="${email.id}">Delete</button>
        </div>
        
        <div class="edit-view">
            <div>To: <input class="to-edit-input" value="${email.to}"></div>
            <div>Cc: <input class="cc-edit-input" value="${email.cc}"></div>
            <div>Ccn: <input class="ccn-edit-input" value="${email.ccn}"></div>
            <div>Subject: <input class="subject-edit-input" value="${email.subject}"></div>
            <div>Body: <input class="body-edit-input" value="${email.body}"></div>
            <div>Cron: <input class="cron-edit-input" value="${email.job.cron ?? ""}"></div>
            <div>Status: <input class="cron-edit-input" value="${email.job.status ?? ""}" disabled></div>
            
            <button class="submit-edit-btn" data-email-id="${email.id}" data-email-job-id="${email.job.id}">Submit</button>
            <button class="cancel-edit-btn" data-email-id="${email.id}">Cancel</button>
        </div>
    </div>`;
}


/******************************************************************************
 *                        Add, Edit, and Delete Emails
 ******************************************************************************/

document.addEventListener('click', function (event) {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#add-email-btn')) addEmail();
    if (ele.matches('#clear-email-btn')) clearForm();
    else if (ele.matches('.edit-email-btn')) showEditView(ele.parentNode.parentNode);
    else if (ele.matches('.cancel-edit-btn')) cancelEdit(ele.parentNode.parentNode);
    else if (ele.matches('.submit-edit-btn')) submitEdit(ele);
    else if (ele.matches('.delete-email-btn')) deleteEmail(ele);
}, false)


function addEmail() {
    var toInput = document.getElementById('to-input');
    var ccInput = document.getElementById('cc-input');
    var ccnInput = document.getElementById('ccn-input');
    var subjectInput = document.getElementById('subject-input');
    var bodyInput = document.getElementById('body-input');
    var cronInput = document.getElementById('cron-input');

    var data = {
        email: {
            to: toInput.value.split(','),
            cc: ccInput.value.split(','),
            ccn: ccnInput.value.split(','),
            subject: subjectInput.value,
            body: bodyInput.value,
            job: {
                cron: cronInput.value
            }
        },
    };
    httpPost('/api/emails', data)
        .then(() => displayEmails())
        .then(() => clearForm());
}

function clearForm() {
    document.getElementById('to-input').value = "";
    document.getElementById('cc-input').value = "";
    document.getElementById('ccn-input').value = "";
    document.getElementById('subject-input').value = "";
    document.getElementById('body-input').value = "";
    document.getElementById('cron-input').value = "";
}

function showEditView(emailEle) {
    var normalView = emailEle.getElementsByClassName('normal-view')[0];
    var editView = emailEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit(emailEle) {
    var normalView = emailEle.getElementsByClassName('normal-view')[0];
    var editView = emailEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit(ele) {
    var emailEle = ele.parentNode.parentNode;
    var id = ele.getAttribute('data-email-id');
    var jobId = ele.getAttribute('data-email-job-id');
    var toInput = emailEle.getElementsByClassName('to-edit-input')[0];
    var ccInput = emailEle.getElementsByClassName('cc-edit-input')[0];
    var ccnInput = emailEle.getElementsByClassName('ccn-edit-input')[0];
    var subjectInput = emailEle.getElementsByClassName('subject-edit-input')[0];
    var bodyInput = emailEle.getElementsByClassName('body-edit-input')[0];
    var cronInput = emailEle.getElementsByClassName('cron-edit-input')[0];

    var data = {
        email: {
            id: id,
            to: toInput.value.split(','),
            cc: ccInput.value.split(','),
            ccn: ccnInput.value.split(','),
            subject: subjectInput.value,
            body: bodyInput.value,
            job: {
                cron: cronInput.value,
                id: jobId.value
            }
        },
    };
    httpPut('/api/emails', data)
        .then(() => displayEmails())
}


function deleteEmail(ele) {
    var id = ele.getAttribute('data-email-id');
    httpDelete('/api/emails/' + id)
        .then(() => displayEmails())
}


function httpGet(path) {
    return fetch(path, getOptions('GET'))
}


function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}


function httpDelete(path) {
    return fetch(path, getOptions('DELETE'));
}


function getOptions(verb, data) {
    var options = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    if (data) options.body = JSON.stringify(data);

    return options;
}


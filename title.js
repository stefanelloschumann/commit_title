var content = document.getElementById('content')

var commit = document.createElement('p');
var branch = document.createElement('p');

for (var i = 0; i < content.children.length; i++) {
    if (content.children[i].tagName === 'H2') {
        if (content.children[i].textContent.includes('Melhoria')) {
            branch.textContent = 'Branch: kanbancorrecoes/feat/#' + content.children[i].textContent.substring(10)
            commit.textContent = 'Commit: Kanbancorrecoes - #' + content.children[i].textContent.substring(10)
        } else if (content.children[i].textContent.includes('Defeito')) {
            branch.textContent = 'Branch: kanbancorrecoes/hotfix/#' + content.children[i].textContent.substring(9)
            commit.textContent = 'Commit: Kanbancorrecoes - #' +  + content.children[i].textContent.substring(9)
        }
        content.insertBefore(commit, content.children[i])
        content.insertBefore(branch, content.children[i])
    }
}